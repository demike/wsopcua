
import {ClientSession} from './client_session';
import {EventEmitter} from 'eventemitter3';
import {assert} from '../assert';
import {coerceNodeId} from '../nodeid/nodeid';
import {VariableIds} from '../constants';
import {StatusCodes} from '../constants';
import {ServerState} from '../generated/ServerState';

var serverStatus_State_Id = coerceNodeId(VariableIds.Server_ServerStatus_State);



export class ClientSessionKeepAliveManager extends EventEmitter {

    protected timerId;
    protected session;
    protected pingTimeout : number;
    protected lastKnownState : any;
    protected checkInterval: number;

constructor ( session : ClientSession) {
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
public ping_server(callback) {
    callback = callback || function () { };
    var the_session = this.session;
    if (!the_session) {
        return callback();
    }

    var now = Date.now();

    var timeSinceLastServerContact = now - the_session.lastResponseReceivedTime;
    if (timeSinceLastServerContact < this.pingTimeout) {
        // no need to send a ping yet
        //xx console.log("Skipping ",timeSinceLastServerContact,self.session.timeout);
        return callback();
    }
    //xx console.log("readVariableValue ",timeSinceLastServerContact,self.session.timeout);

    // Server_ServerStatus_State
    the_session.readVariableValue(serverStatus_State_Id, (err, dataValue) => {
        if (err) {
            console.log(" warning : ClientSessionKeepAliveManager#ping_server ", err.message);
            this.stop();

            /**
             * @event failure
             * raised when the server is not responding or is responding with en error to
             * the keep alive read Variable value transaction
             */
            this.emit("failure");

        } else {
            if (dataValue.statusCode === StatusCodes.Good) {
                var newState = ServerState[dataValue.value.value];
                //istanbul ignore next
                if (newState !== this.lastKnownState) {
                    console.log(" Server State = ", newState.toString());
                }
                this.lastKnownState = newState;
            }

            this.emit("keepalive",this.lastKnownState);
        }
        callback();
    });
};


public start() {
    
    assert(!this.timerId);
    assert(this.session.timeout > 100);

    this.pingTimeout   =  this.session.timeout * 2/3;
    this.checkInterval =  this.pingTimeout  / 3;
    this.timerId = setInterval(this.ping_server.bind(this),this.checkInterval);
};

public stop() : void {
    if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = 0;
    }
};
}