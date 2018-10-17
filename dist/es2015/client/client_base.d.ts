import { EventEmitter } from 'eventemitter3';
import { SecurityPolicy } from '../secure-channel/security_policy';
import { MessageSecurityMode } from '../secure-channel';
import { ObjectRegistry } from '../object-registry/objectRegistry';
import * as endpoints_service from "../service-endpoints";
import { ClientSecureChannelLayer } from '../secure-channel/client_secure_channel_layer';
import { OPCUASecureObject } from '../common/secure_object';
import { ClientSession } from './client_session';
import { EndpointDescription } from '../service-endpoints';
import { IGetEndpointsRequest } from '../generated/GetEndpointsRequest';
export interface ErrorCallback {
    (err?: Error): void;
}
export interface ResponseCallback<T> {
    (err?: Error | null, response?: T): void;
}
export interface ConnectionStrategy {
    maxRetry?: number;
    initialDelay?: number;
    maxDelay?: number;
    randomisationFactor?: number;
}
export interface OPCUAClientOptions {
    defaultSecureTokenLifeTime?: number;
    serverCertificate?: any;
    connectionStrategy?: ConnectionStrategy;
    securityMode?: MessageSecurityMode;
    securityPolicy?: SecurityPolicy;
    requestedSessionTimeout?: number;
    applicationName?: string;
    endpoint_must_exist?: boolean;
    keepSessionAlive?: boolean;
    certificateFile?: string;
    privateKeyFile?: string;
    clientName?: string;
}
export interface IFindServersOptions {
    endpointUrl?: string;
    localeIds?: string[];
    serverUris?: string[];
}
/**
 * @class OPCUAClientBase
 * @extends EventEmitter
 * @param options
 * @param options.defaultSecureTokenLifeTime {Number} default secure token lifetime in ms
 * @param [options.securityMode=MessageSecurityMode.None] {MessageSecurityMode} the default security mode.
 * @param [options.securityPolicy =SecurityPolicy.NONE] {SecurityPolicy} the security mode.
 * @param [options.serverCertificate=null] {Certificate} the server certificate.
 * @param [options.certificateFile="certificates/client_selfsigned_cert_1024.pem"] {String} client certificate pem file.
 * @param [options.privateKeyFile="certificates/client_key_1024.pem"] {String} client private key pem file.
 * @param [options.connectionStrategy] {Object}
 * @param [options.keepSessionAlive=false]{Boolean}
 * @constructor
 */
export declare class OPCUAClientBase extends EventEmitter {
    endpoint: any;
    secureObject: OPCUASecureObject;
    /**
     * @property securityMode
     * @type MessageSecurityMode
     */
    securityMode: MessageSecurityMode;
    /**
     *
     */
    securityPolicy: SecurityPolicy;
    /**
     *
     */
    serverCertificate: Uint8Array | null;
    protected protocolVersion: number;
    protected options: OPCUAClientOptions;
    protected registry: ObjectRegistry;
    protected _sessions: ClientSession[];
    protected defaultSecureTokenLifetime: number;
    protected _endpointUrl: string;
    protected connectionStrategy: ConnectionStrategy;
    /**
 * true if session shall periodically probe the server to keep the session alive and prevent timeout
 * @property keepSessionAlive
 * @type {boolean}
 */
    protected keepSessionAlive: boolean;
    protected _byteRead: number;
    protected _byteWritten: number;
    protected _transactionsPerformed: number;
    protected _timedOutRequestCount: number;
    protected _secureChannel: ClientSecureChannelLayer;
    protected _server_endpoints: EndpointDescription[];
    protected _isReconnecting: boolean;
    /**
     * total number of bytes read by the client
     * @property bytesRead
     * @type {Number}
     */
    readonly bytesRead: number;
    /**
     * total number of bytes written by the client
     * @property bytesWritten
     * @type {Number}
     */
    readonly bytesWritten: number;
    /**
     * total number of transactions performed by the client
     * @property transactionsPerformed
     * @type {Number}
     */
    readonly transactionsPerformed: number;
    readonly timedOutRequestCount: number;
    /**
     * is true when the client has already requested the server end points.
     * @property knowsServerEndpoint
     * @type boolean
     */
    readonly knowsServerEndpoint: boolean;
    /**
     * @property isReconnecting
     * @type {Boolean} true if the client is trying to reconnect to the server after a connection break.
     */
    readonly isReconnecting: boolean;
    /**
     * true if the connection strategy is set to automatically try to reconnect in case of failure
     * @property reconnectOnFailure
     * @type {Boolean}
     */
    readonly reconnectOnFailure: boolean;
    readonly secureChannel: ClientSecureChannelLayer;
    readonly endpointUrl: string;
    constructor(options?: OPCUAClientOptions);
    closeSession(arg0: any, arg1: any, arg2: any): any;
    /**
  *
  * connect the OPC-UA client to a server end point.
  * @param options
  * @param callback
  */
    connect(endpointUrl: string, callback: ErrorCallback): void;
    disconnect(callback: ErrorCallback): void;
    performMessageTransaction(request: any, callback: ResponseCallback<any>): void;
    /**
* @method findServers
* @param options
* @param [options.endpointUrl]
* @param [options.localeIds] Array
* @param [options.serverUris] Array
* @param callback
*/
    findServers(options: IFindServersOptions, callback: ResponseCallback<endpoints_service.ApplicationDescription[]>): void;
    protected _close_pending_sessions(callback: any): void;
    /**
* @method getEndpoints
* @async
* @async
*
* @param [options]
* @param [options.endpointUrl] {String} the network address that the Client used to access the Discovery Endpoint .
* @param [options.localeIds} {Array<LocaleId>}  List of locales to use.
* @param [options.profileUris} {Array<String>}  List of transport profiles that the returned Endpoints shall support.
* @param callback {Function}
* @param callback.err {Error|null}
* @param callback.serverEndpoints {Array<EndpointDescription>} the array of endpoint descriptions
*
*/
    getEndpoints(options: IGetEndpointsRequest, callback?: any): void;
    protected _on_connection_reestablished(callback: any): void;
    protected _addSession(session: any): void;
    protected _removeSession(session: any): void;
    /**
*
* return the endpoint information matching the specified url , security mode and security policy.
* @method findEndpoint
* @return {EndPoint}
*/
    findEndpoint(endpointUrl: any, securityMode: any, securityPolicy: any): endpoints_service.EndpointDescription;
    toString(): void;
    protected _destroy_secure_channel(): void;
    private static __findEndpoint;
    protected _cancel_reconnection(callback: Function): any;
    protected _recreate_secure_channel(callback: Function): any;
    protected _internal_create_secure_channel(callback: Function): void;
    private static _install_secure_channel_event_handlers;
    getClientNonce(): Uint8Array;
    getPrivateKey(): any;
    getCertificate(): any;
    getCertificateChain(): any;
    /**
     *
     * return the endpoint information matching  security mode and security policy.
     * @method findEndpoint
     * @return {EndPoint}
     */
    findEndpointForSecurity(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy): endpoints_service.EndpointDescription;
}
