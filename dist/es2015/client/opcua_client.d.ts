import { SignatureData } from "../service-secure-channel";
import { ClientSession } from './client_session';
import { OPCUAClientBase, OPCUAClientOptions } from './client_base';
import { UserIdentityToken } from "../generated/UserIdentityToken";
export interface UserIdentityInfo {
    userName?: string;
    password?: string;
}
/**
 * @class OPCUAClient
 * @extends OPCUAClientBase
 * @param options
 * @param [options.securityMode=MessageSecurityMode.None] {MessageSecurityMode} the default security mode.
 * @param [options.securityPolicy =SecurityPolicy.NONE] {SecurityPolicy} the security mode.
 * @param [options.requestedSessionTimeout= 60000]            {Number} the requested session time out in CreateSession
 * @param [options.applicationName="NodeOPCUA-Client"]        {string} the client application name
 * @param [options.endpoint_must_exist=true] {Boolean} set to false if the client should accept server endpoint mismatch
 * @param [options.keepSessionAlive=false]{Boolean}
 * @param [options.certificateFile="certificates/client_selfsigned_cert_1024.pem"] {String} client certificate pem file.
 * @param [options.privateKeyFile="certificates/client_key_1024.pem"] {String} client private key pem file.
 * @param [options.clientName=""] {String} a client name string that will be used to generate session names.
 * @constructor
 */
export declare class OPCUAClient extends OPCUAClientBase {
    protected _clientNonce: any;
    protected _userIdentityInfo: UserIdentityInfo;
    protected _serverUri: string;
    private ___sessionName_counter;
    applicationName: any;
    requestedSessionTimeout: any;
    endpoint_must_exist: boolean;
    clientName: string;
    readonly clientNonce: any;
    constructor(options: OPCUAClientOptions);
    protected _nextSessionName(): string;
    protected _getApplicationUri(): Promise<string>;
    protected __resolveEndPoint(): boolean;
    protected _createSession(callback: any): any;
    protected __createSession_step2(session: ClientSession, callback: any): Promise<void>;
    computeClientSignature(channel: any, serverCertificate: any, serverNonce: any): SignatureData;
    createUserIdentityToken(session: ClientSession, userIdentityToken: UserIdentityToken | UserIdentityInfo, callback: any): any;
    protected _activateSession(session: ClientSession, callback: any): any;
    /**
     * transfer session to this client
     * @method reactivateSession
     * @param session
     * @param callback
     * @return {*}
     */
    reactivateSession(session: ClientSession, callback: any): any;
    /**
     * create and activate a new session
     * @async
     * @method createSession
     *
     * @param [userIdentityInfo {Object} ] optional
     * @param [userIdentityInfo.userName {String} ]
     * @param [userIdentityInfo.password {String} ]
     *
     * @param callback {Function}
     * @param callback.err     {Error|null}   - the Error if the async method has failed
     * @param callback.session {ClientSession} - the created session object.
     *
     *
     * @example :
     *     // create a anonymous session
     *     client.createSession(function(err,session) {
     *       if (err) {} else {}
     *     });
     *
     * @example :
     *     // create a session with a userName and password
     *     client.createSession({userName: "JoeDoe", password:"secret"}, function(err,session) {
     *       if (err) {} else {}
     *     });
     *
     */
    createSession(userIdentityInfo: UserIdentityInfo, callback: (err: Error, session?: ClientSession) => void): void;
    /**
     * @method changeSessionIdentity
     * @param session
     * @param userIdentityInfo
     * @param callback
     * @async
     */
    changeSessionIdentity(session: any, userIdentityInfo: any, callback: any): void;
    protected _closeSession: (session: ClientSession, deleteSubscriptions: boolean, callback: any) => any;
    /**
     *
     * @method closeSession
     * @async
     * @param session  {ClientSession} - the created client session
     * @param deleteSubscriptions  {Boolean} - whether to delete subscriptions or not
     * @param callback {Function} - the callback
     * @param callback.err {Error|null}   - the Error if the async method has failed
     */
    closeSession(session: ClientSession, deleteSubscriptions: boolean, callback: Function): void;
    protected _ask_for_subscription_republish(session: ClientSession, callback: Function): void;
    protected _on_connection_reestablished(callback: Function): void;
    toString(): void;
    /**
     * @method withSession
     * @param inner_func {function}
     * @param inner_func.session {ClientSession}
     * @param inner_func.callback {function}
     * @param callback {function}
     */
    withSession(endpointUrl: any, inner_func: any, callback: any): void;
    /**
     * @method connect
     * @param endpointUrl {string}
     * @async
     * @return {Promise}
     */
    /**
     * @method disconnect
     * disconnect client from server
     * @return {Promise}
     * @async
     */
    /**
     * @method createSession
     * @param [userIdentityInfo {Object} ] optional
     * @param [userIdentityInfo.userName {String} ]
     * @param [userIdentityInfo.password {String} ]
     * @return {Promise}
     * @async
     *
     * @example
     *     // create a anonymous session
     *     const session = await client.createSession();
     *
     * @example
     *     // create a session with a userName and password
     *     const userIdentityInfo  = { userName: "JoeDoe", password:"secret"};
     *     const session = client.createSession(userIdentityInfo);
     *
     */
    /**
     * @method changeSessionIdentity
     * @param session
     * @param userIdentityInfo
     * @return {Promise}
     * @async
     */
    /**
     * @method closeSession
     * @param session {ClientSession}
     * @param deleteSubscriptions  {Boolean} - whether to delete
     * @return {Promise}
     * @async
     * @example
     *    const session  = await client.createSession();
     *    await client.closeSession(session);
     */
    withSubscription(endpointUrl: any, subscriptionParameters: any, innerFunc: any, callback: any): void;
}
