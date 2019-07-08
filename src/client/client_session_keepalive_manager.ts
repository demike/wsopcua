
import {ClientSession} from './client_session';
import {EventEmitter} from '../eventemitter';
import {assert} from '../assert';
import {coerceNodeId} from '../nodeid/nodeid';
// import {VariableIds} from '../constants';
import {StatusCodes} from '../constants';
import {ServerState} from '../generated/ServerState';
import { debugLog } from '../common/debug';

const serverStatus_State_Id = coerceNodeId( /*VariableIds.Server_ServerStatus_State*/ 2259);

export interface ClientSessionKeepAliveManagerEvents {
    'failure': () => void;
    'keepalive': (lastKnownState: ServerState) => void;
}

export class ClientSessionKeepAliveManager extends EventEmitter<ClientSessionKeepAliveManagerEvents> {

    protected timerId: number;
    protected session: ClientSession;
    protected pingTimeout: number;
    protected lastKnownState: ServerState;
    protected checkInterval: number;

constructor ( session: ClientSession) {
    super();
    this.session = session;
    this.timerId = 0;
}

/**
 * @method ping_server
 *
 * when a session is opened on a server, the client shall send request on a regular basis otherwise the server
 * session object might time out.
 * start_ping make sure that ping_server is called on a regular basis to prevent session to timeout.
 *
 * @param callback
 */
public ping_server(callback: () => void) {
    callback = callback || function () { };
    const the_session = this.session;
    if (!the_session) {
        return callback();
    }

    const now = Date.now();

    const timeSinceLastServerContact = now - the_session.lastResponseReceivedTime;
    if (timeSinceLastServerContact < this.pingTimeout) {
        // no need to send a ping yet
        // xx console.log("Skipping ",timeSinceLastServerContact,self.session.timeout);
        return callback();
    }

    if (the_session.isReconnecting) {
        debugLog('ClientSessionKeepAliveManager#ping_server skipped because client is reconnecting');
        return callback();
    }
    debugLog('ClientSessionKeepAliveManager#ping_server ', timeSinceLastServerContact, this.session.timeout);

    // Server_ServerStatus_State
    the_session.readVariableValue(serverStatus_State_Id, (err, dataValue) => {
        if (err) {
            console.log(' warning : ClientSessionKeepAliveManager#ping_server ', err.message);
            this.stop();

            /**
             * @event failure
             * raised when the server is not responding or is responding with en error to
             * the keep alive read Variable value transaction
             */
            this.emit('failure');

        } else {
            if (!dataValue.statusCode || dataValue.statusCode === StatusCodes.Good) {
                const newState = dataValue.value.value;//ServerState[dataValue.value.value];
                // istanbul ignore next
                if (newState !== this.lastKnownState) {
                    console.log(' Server State = ', newState.toString());
                }
                this.lastKnownState = newState;
            }

            this.emit('keepalive', this.lastKnownState);
        }
        callback();
    });
}


public start() {

    assert(!this.timerId);
    assert(this.session.timeout > 100);

    this.pingTimeout   =  this.session.timeout * 2 / 3;
    this.checkInterval =  this.pingTimeout  / 3;
    this.timerId = window.setInterval(this.ping_server.bind(this), this.checkInterval);
}

public stop(): void {
    if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = 0;
    }
}
}
