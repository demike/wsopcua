import { ClientSession } from './client_session';
import { EventEmitter } from 'eventemitter3';
export declare class ClientSessionKeepAliveManager extends EventEmitter {
    protected timerId: any;
    protected session: any;
    protected pingTimeout: number;
    protected lastKnownState: any;
    protected checkInterval: number;
    constructor(session: ClientSession);
    /**
     * @method ping_server
     *
     * when a session is opened on a server, the client shall send request on a regular basis otherwise the server
     * session object might time out.
     * start_ping make sure that ping_server is called on a regular basis to prevent session to timeout.
     *
     * @param callback
     */
    ping_server(callback: any): any;
    start(): void;
    stop(): void;
}
