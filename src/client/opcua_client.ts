"use strict";
/**
 * @module opcua.client
 */


import {assert} from '../assert';
 
var crypto : Crypto = window.crypto || (<any>window).msCrypto; // for IE 11
import async_map from "async-es/map";
import async_series from "async-es/series";
//**nomsgcrypt** var exploreCertificate = require("node-opcua-crypto").crypto_explore_certificate.exploreCertificate;

import {StatusCodes} from '../constants';
import * as session_service from '../service-session';
import {ClientSubscription} from './ClientSubscription';

var AnonymousIdentityToken = session_service.AnonymousIdentityToken;
var CreateSessionRequest = session_service.CreateSessionRequest;
var CreateSessionResponse = session_service.CreateSessionResponse;
var ActivateSessionRequest = session_service.ActivateSessionRequest;
var ActivateSessionResponse = session_service.ActivateSessionResponse;
var CloseSessionRequest = session_service.CloseSessionRequest;

import * as endpoints_service from "../service-endpoints";
var ApplicationDescription = endpoints_service.ApplicationDescription;
var ApplicationType = endpoints_service.ApplicationType;
var EndpointDescription = endpoints_service.EndpointDescription;

import {MessageSecurityMode, SignatureData} from "../service-secure-channel";
import {SecurityPolicy,getCryptoFactory,fromURI} from '../secure-channel/security_policy';
import { LocalizedText } from "../generated/LocalizedText";

//**nomsgcrypt** var crypto_utils = require("node-opcua-crypto").crypto_utils;
var UserNameIdentityToken = session_service.UserNameIdentityToken;

import {computeSignature} from '../secure-channel';

import {UserIdentityTokenType} from '../service-endpoints';

import {ClientSession} from './client_session';

import * as utils from '../utils';
import {doDebug,debugLog} from '../common/debug';

import {OPCUAClientBase,OPCUAClientOptions} from './client_base';
import {isNullOrUndefined} from '../utils';

import {makeApplicationUrn} from "../common/applicationurn";
import { UserIdentityToken } from "../generated/UserIdentityToken";
import { stringToUint8Array } from "../basic-types/DataStream";

export interface UserIdentityInfo {
    userName?: string,
    password?: string
}

function validateServerNonce(serverNonce) {
    return (serverNonce && serverNonce.length < 32) ? false : true;
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
export class OPCUAClient extends OPCUAClientBase {
   
    protected _clientNonce: any;
    protected _userIdentityInfo: UserIdentityInfo;
    protected _serverUri: string;
    private ___sessionName_counter: any;
    applicationName: any;
    requestedSessionTimeout: any;
    endpoint_must_exist: boolean;
    clientName : string;

    get clientNonce() {
        return this._clientNonce;
    }
constructor(options : OPCUAClientOptions) {
    super(options);
    options = options || {};

    // @property endpoint_must_exist {Boolean}
    // if set to true , create Session will only accept connection from server which endpoint_url has been reported
    // by GetEndpointsRequest.
    // By default, the client is strict.
    this.endpoint_must_exist = (isNullOrUndefined(options.endpoint_must_exist)) ? true : !!options.endpoint_must_exist;
    this.requestedSessionTimeout = options.requestedSessionTimeout || 60000; // 1 minute
    this.applicationName = options.applicationName || "NodeOPCUA-Client";
    this.clientName = options.clientName || "Session";

}


protected _nextSessionName() {
    if (!this.___sessionName_counter) {
        this.___sessionName_counter = 0;
    }
    this.___sessionName_counter += 1;
    return this.clientName + this.___sessionName_counter;
};

protected _getApplicationUri() : Promise<string> {

    // get applicationURI from certificate

/**nomsgcrypt**
    var certificate = this.getCertificate();
    var applicationUri;
    if (certificate) {
        var e = exploreCertificate(certificate);
        applicationUri = e.tbsCertificate.extensions.subjectAltName.uniformResourceIdentifier[0];
    } else {
        var hostname = require("node-opcua-hostname").get_fully_qualified_domain_name();
        applicationUri = makeApplicationUrn(hostname, this.applicationName);
    }
    return applicationUri;
*/
    return  makeApplicationUrn(window.location.hostname, this.applicationName);

};


protected __resolveEndPoint() {

    this.securityPolicy = this.securityPolicy || SecurityPolicy.None;

    var endpoint = this.findEndpoint(this._secureChannel.endpointUrl, this.securityMode, this.securityPolicy);
    this.endpoint = endpoint;


    // this is explained here : see OPCUA Part 4 Version 1.02 $5.4.1 page 12:
    //   A  Client  shall verify the  HostName  specified in the  Server Certificate  is the same as the  HostName
    //   contained in the  endpointUrl  provided in the  EndpointDescription. If there is a difference  then  the
    //   Client  shall report the difference and may close the  SecureChannel.

    if (!this.endpoint) {
        if (this.endpoint_must_exist) {
            debugLog("OPCUAClient#endpoint_must_exist = true and endpoint with url ", this._secureChannel.endpointUrl, " cannot be found");
            return false;
        } else {
            // fallback :
            // our strategy is to take the first server_end_point that match the security settings
            // ( is this really OK ?)
            // this will permit us to access a OPCUA Server using it's IP address instead of its hostname

            endpoint = this.findEndpointForSecurity(this.securityMode, this.securityPolicy);
            if (!endpoint) {
                return false;
            }
            this.endpoint = endpoint;
        }
    }
    return true;
};

protected _createSession(callback) {
    assert(typeof callback === "function");
    assert(this._secureChannel);
    if (!this.__resolveEndPoint() || !this.endpoint) {
        console.log(this._server_endpoints.map(function (endpoint){
           return endpoint.endpointUrl + " " + endpoint.securityMode.toString() + " " + endpoint.securityPolicyUri;
        }));
        return callback(new Error(" End point must exist " + this._secureChannel.endpointUrl));
    }
    this._serverUri = this.endpoint.server.applicationUri;
    this._endpointUrl = this._secureChannel.endpointUrl;

    var session = new ClientSession(this);
    this.__createSession_step2(session, callback);
};

protected async __createSession_step2(session : ClientSession, callback) {

    assert(typeof callback === "function");
    assert(this._secureChannel);
    assert(this._serverUri, " must have a valid server URI");
    assert(this._endpointUrl, " must have a valid server endpointUrl");
    assert(this.endpoint);


    let applicationUri = await this._getApplicationUri();

    var applicationDescription = new ApplicationDescription({
        applicationUri: applicationUri,
        productUri: "OPCUA-Client",
        applicationName: new LocalizedText({text: this.applicationName}),
        applicationType: ApplicationType.Client,
        gatewayServerUri: undefined,
        discoveryProfileUri: undefined,
        discoveryUrls: []
    });

    // note : do not confuse CreateSessionRequest.clientNonce with OpenSecureChannelRequest.clientNonce
    //        which are two different nonce, with different size (although they share the same name )
    this._clientNonce = crypto.getRandomValues(new Uint8Array(32));//randomBytes(32);

    var request = new CreateSessionRequest({
        clientDescription: applicationDescription,
        serverUri: this._serverUri,
        endpointUrl: this.endpointUrl,
        sessionName: this._nextSessionName(),
        clientNonce: this._clientNonce,
        clientCertificate: this.getCertificate(),
        requestedSessionTimeout: this.requestedSessionTimeout,
        maxResponseMessageSize: 800000
    });

    // a client Nonce must be provided if security mode is set
    assert(this._secureChannel.securityMode === MessageSecurityMode.None || request.clientNonce !== null);

    this.performMessageTransaction(request , (err, response : session_service.CreateSessionResponse) => {

        if (!err) {
            //xx console.log("xxxxx response",response.toString());
            //xx console.log("xxxxx response",response.responseHeader.serviceResult);
            if (response.responseHeader.serviceResult === StatusCodes.BadTooManySessions) {
                err = new Error("Too Many Sessions : " + response.responseHeader.serviceResult.toString());

            } else if (response.responseHeader.serviceResult === StatusCodes.Good) {

                assert(response instanceof CreateSessionResponse);

                // istanbul ignore next
                if (!validateServerNonce(response.serverNonce)) {
                    return callback(new Error("invalid server Nonce"));
                }

                // todo: verify SignedSoftwareCertificates and  response.serverSignature

                session = session || new ClientSession(this);
                session.name = request.sessionName;
                session.sessionId = response.sessionId;
                session.authenticationToken = response.authenticationToken;
                session.timeout = response.revisedSessionTimeout;
                session.serverNonce = response.serverNonce;
                session.serverCertificate = response.serverCertificate;
                session.serverSignature = response.serverSignature;

                debugLog("revised session timeout = " + session.timeout);

                this._server_endpoints = response.serverEndpoints;
//                session.serverEndpoints = response.serverEndpoints;

            } else {
                err = new Error("Error " + response.responseHeader.serviceResult.name + " " + response.responseHeader.serviceResult.description);
            }
        }
        if (err) {
            callback(err);
        } else {
            callback(null, session);
        }
    });

};

public computeClientSignature(channel, serverCertificate, serverNonce) : SignatureData{
    return computeSignature(serverCertificate, serverNonce, this.getPrivateKey(), channel.messageBuilder.securityPolicy);
};


public createUserIdentityToken(session : ClientSession, userIdentityToken : UserIdentityToken|UserIdentityInfo, callback) {
    assert('function' === typeof callback);


    if (isAnonymous(this._userIdentityInfo)) {

        try {
            userIdentityToken = createAnonymousIdentityToken(session);
            return callback(null, userIdentityToken);
        }
        catch (err) {
            return callback(err);
        }

    } else if (isUserNamePassword(this._userIdentityInfo)) {

        var userName = this._userIdentityInfo.userName;
        var password = this._userIdentityInfo.password;

        try {
            userIdentityToken = createUserNameIdentityToken(session, userName, password);
            return callback(null, userIdentityToken);
        }
        catch (err) {
            //xx console.log(err.stack);
            return callback(err);
        }
    } else {
        console.log(" userIdentityToken = ", userIdentityToken);
        return callback(new Error("CLIENT: Invalid userIdentityToken"));
    }
};


// see OPCUA Part 4 - $7.35
protected _activateSession(session : ClientSession, callback) {

    assert(typeof callback === "function");
   

    // istanbul ignore next
    if (!this._secureChannel) {
        return callback(new Error(" No secure channel"));
    }

    var serverCertificate = session.serverCertificate;
    // If the securityPolicyUri is NONE and none of the UserTokenPolicies requires encryption,
    // the Client shall ignore the ApplicationInstanceCertificate (serverCertificate)
    assert(serverCertificate === null || serverCertificate instanceof Uint8Array );

    var serverNonce = session.serverNonce;
    assert(!serverNonce || serverNonce instanceof Uint8Array);

    // make sure session is attached to this client
    var _old_client = session.client;
    session.client = this;

    this.createUserIdentityToken(session, this._userIdentityInfo, (err, userIdentityToken) => {

        if (err) {
            session.client = _old_client;
            return callback(err);
        }

        // TODO. fill the ActivateSessionRequest
        // see 5.6.3.2 Parameters OPC Unified Architecture, Part 4 30 Release 1.02
        var request = new ActivateSessionRequest({

            // This is a signature generated with the private key associated with the
            // clientCertificate. The SignatureAlgorithm shall be the AsymmetricSignatureAlgorithm
            // specified in the SecurityPolicy for the Endpoint. The SignatureData type is defined in 7.30.

            clientSignature: this.computeClientSignature(this._secureChannel, serverCertificate, serverNonce),

            // These are the SoftwareCertificates which have been issued to the Client application. The productUri contained
            // in the SoftwareCertificates shall match the productUri in the ApplicationDescription passed by the Client in
            // the CreateSession requests. Certificates without matching productUri should be ignored.  Servers may reject
            // connections from Clients if they are not satisfied with the SoftwareCertificates provided by the Client.
            // This parameter only needs to be specified in the first ActivateSession request after CreateSession.
            // It shall always be omitted if the maxRequestMessageSize returned from the Server in the CreateSession
            // response is less than one megabyte. The SignedSoftwareCertificate type is defined in 7.31.

            clientSoftwareCertificates: [],

            // List of locale ids in priority order for localized strings. The first LocaleId in the list has the highest
            // priority. If the Server returns a localized string to the Client, the Server shall return the translation
            // with the highest priority that it can. If it does not have a translation for any of the locales identified
            // in this list, then it shall return the string value that it has and include the locale id with the string.
            // See Part 3 for more detail on locale ids. If the Client fails to specify at least one locale id, the Server
            // shall use any that it has.
            // This parameter only needs to be specified during the first call to ActivateSession during a single
            // application Session. If it is not specified the Server shall keep using the current localeIds for the Session.
            localeIds: [],

            // The credentials of the user associated with the Client application. The Server uses these credentials to
            // determine whether the Client should be allowed to activate a Session and what resources the Client has access
            // to during this Session. The UserIdentityToken is an extensible parameter type defined in 7.35.
            // The EndpointDescription specifies what UserIdentityTokens the Server shall accept.
            userIdentityToken: userIdentityToken,

            // If the Client specified a user   identity token that supports digital signatures,
            // then it shall create a signature and pass it as this parameter. Otherwise the parameter is omitted.
            // The SignatureAlgorithm depends on the identity token type.
            userTokenSignature: new SignatureData({
                algorithm: null,
                signature: null
            })

        });

        session.performMessageTransaction(request, function (err, response) {

            if (!err && response.responseHeader.serviceResult === StatusCodes.Good) {

                assert(response instanceof ActivateSessionResponse);

                session.serverNonce = response.serverNonce;

                if (!validateServerNonce(session.serverNonce)) {
                    return callback(new Error("Invalid server Nonce"));
                }
                return callback(null, session);

            } else {

                err = err || new Error(response.responseHeader.serviceResult.toString());
                session.client = _old_client;
                return callback(err, null);
            }
        });

    });

};


/**
 * transfer session to this client
 * @method reactivateSession
 * @param session
 * @param callback
 * @return {*}
 */
public reactivateSession(session : ClientSession, callback) {


    assert(typeof callback === "function");
    assert(this._secureChannel, " client must be connected first");

    // istanbul ignore next
    if (!this.__resolveEndPoint() || !this.endpoint) {
        return callback(new Error(" End point must exist " + this._secureChannel.endpointUrl));
    }

    assert(session.client.endpointUrl === this.endpointUrl, "cannot reactivateSession on a different endpoint");
    let old_client : OPCUAClientBase = session.client;

    debugLog("OPCUAClient#reactivateSession");

    this._activateSession(session, (err) => {
        if (!err) {

            if (old_client !== this) {
                // remove session from old client:
                (<any>old_client)._removeSession(session); //cast to any as access of protected member to other instance should be possible
                assert((<any>old_client)._sessions.indexOf(session) < 0/*!_.contains( (<any>old_client)._sessions, session*/);

                this._addSession(session);
                
                assert(this._sessions.indexOf(session) >= 0 /*_.contains(this._sessions, session)*/);
            }

        } else {

            // istanbul ignore next
            if (doDebug) {
                console.log("reactivateSession has failed !", err);
            }
        }
        callback(err);
    });
};
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
public createSession(userIdentityInfo : UserIdentityInfo, callback : (err : Error,session? : ClientSession) => void) {

    if ('function' === typeof userIdentityInfo) {
        (<any>callback) = userIdentityInfo;
        userIdentityInfo = {};
    }

    this._userIdentityInfo = userIdentityInfo;

    assert('function' === typeof callback);

    this._createSession( (err, session) =>{
        if (err) {
            callback(err);
        } else {

            this._addSession(session);

            this._activateSession(session, function (err) {
                callback(err, session);
            });
        }
    });
};


/**
 * @method changeSessionIdentity
 * @param session
 * @param userIdentityInfo
 * @param callback
 * @async
 */
public changeSessionIdentity(session: ClientSession, userIdentityInfo: UserIdentityInfo, callback) {

    assert('function' === typeof callback);

    var old_userIdentity = this._userIdentityInfo;
    this._userIdentityInfo = userIdentityInfo;

    this._activateSession(session, function (err) {
        callback(err);
    });


};


protected _closeSession = function (session : ClientSession, deleteSubscriptions : boolean, callback) {

    assert('function' === typeof callback);
    //assert(_.isBoolean(deleteSubscriptions));

    // istanbul ignore next
    if (!this._secureChannel) {
        return callback(new Error("no channel"));
    }
    assert(this._secureChannel);

    var request = new CloseSessionRequest({
        deleteSubscriptions: deleteSubscriptions
    });

    if (!this._secureChannel.isValid()) {
        return callback();
    }
    session.performMessageTransaction(request, function (err, response) {

        if (err) {
            //xx console.log("xxx received : ", err, response);
            //xx self._secureChannel.close(function () {
            //xx     callback(err, null);
            //xx });
            callback(err, null);
        } else {
            callback(err, response);
        }
    });
};

/**
 *
 * @method closeSession
 * @async
 * @param session  {ClientSession} - the created client session
 * @param deleteSubscriptions  {Boolean} - whether to delete subscriptions or not
 * @param callback {Function} - the callback
 * @param callback.err {Error|null}   - the Error if the async method has failed
 */
public closeSession(session : ClientSession, deleteSubscriptions : boolean, callback : Function) {

   
    //assert(_.isBoolean(deleteSubscriptions));
    assert('function' === typeof callback);
    assert(session);
    assert(session.client === this, "session must be attached to self");
    session.closed = true;
    //todo : send close session on secure channel
    this._closeSession(session, deleteSubscriptions,  (err) => {

        session.emitCloseEvent();

        this._removeSession(session);
        assert(this._sessions.indexOf(session) < 0);
        assert(session.closed, "session must indicate it is closed");

        callback(err);
    });
};

protected _ask_for_subscription_republish(session : ClientSession, callback : Function) {

    debugLog("_ask_for_subscription_republish ");
    //xx assert(session.getPublishEngine().nbPendingPublishRequests === 0, "at this time, publish request queue shall still be empty");
    session.getPublishEngine().republish((err) =>{
        debugLog("_ask_for_subscription_republish done");
        // xx assert(session.getPublishEngine().nbPendingPublishRequests === 0);
        session.resumePublishEngine();
        callback(err);
    });
};

protected _on_connection_reestablished(callback : Function) {

    assert('function' === typeof callback);

    // call base class implementation first
    super._on_connection_reestablished((err) => {

        //
        // a new secure channel has be created, we need to reactivate the session,
        // and reestablish the subscription and restart the publish engine.
        //
        //
        // see OPC UA part 4 ( version 1.03 ) figure 34 page 106
        // 6.5 Reestablishing subscription....
        //
        //
        //
        //                      +---------------------+
        //                      | CreateSecureChannel |
        //                      | CreateSession       |
        //                      | ActivateSession     |
        //                      +---------------------+
        //                                |
        //                                |
        //                                v
        //                      +---------------------+
        //                      | CreateSubscription  |<-------------------------------------------------------------+
        //                      +---------------------+                                                              |
        //                                |                                                                         (1)
        //                                |
        //                                v
        //                      +---------------------+
        //     (2)------------->| StartPublishEngine  |
        //                      +---------------------+
        //                                |
        //                                V
        //                      +---------------------+
        //             +------->| Monitor Connection  |
        //             |        +---------------------+
        //             |                    |
        //             |                    v
        //             |          Good    /   \
        //             +-----------------/ SR? \______Broken_____+
        //                               \     /                 |
        //                                \   /                  |
        //                                                       |
        //                                                       v
        //                                                 +---------------------+
        //                                                 |                     |
        //                                                 | CreateSecureChannel |<-----+
        //                                                 |                     |      |
        //                                                 +---------------------+      |
        //                                                         |                    |
        //                                                         v                    |
        //                                                       /   \                  |
        //                                                      / SR? \______Bad________+
        //                                                      \     /
        //                                                       \   /
        //                                                         |
        //                                                         |Good
        //                                                         v
        //                                                 +---------------------+
        //                                                 |                     |
        //                                                 | ActivateSession     |
        //                                                 |                     |
        //                                                 +---------------------+
        //                                                         |
        //                                                         v                    +-------------------+       +----------------------+
        //                                                       /   \                  | CreateSession     |       |                      |
        //                                                      / SR? \______Bad_______>| ActivateSession   |-----> | TransferSubscription |
        //                                                      \     /                 |                   |       |                      |       (1)
        //                                                       \   /                  +-------------------+       +----------------------+        ^
        //                                                         | Good                                                      |                    |
        //                                                         v   (for each subscription)                                   |                    |
        //                                                 +--------------------+                                            /   \                  |
        //                                                 |                    |                                     OK    / OK? \______Bad________+
        //                                                 | RePublish          |<----------------------------------------- \     /
        //                                             +-->|                    |                                            \   /
        //                                             |   +--------------------+
        //                                             |           |
        //                                             |           v
        //                                             | GOOD    /   \
        //                                             +------  / SR? \______Bad SubscriptionInvalidId______>(1)
        // (2)                                                  \     /
        //  ^                                                    \   /
        //  |                                                      |
        //  |                                                      |
        //  |                             BadMessageNotAvailable   |
        //  +------------------------------------------------------+
        //


        debugLog(" Starting Session reactivation");
        // repair session
        var sessions = this._sessions;
        async_map(sessions, function (session, next) {

            debugLog("OPCUAClient#_on_connection_reestablished TRYING TO REACTIVATE SESSION");
            this._activateSession(session, function (err) {
                //
                // Note: current limitation :
                //  - The reconnection doesn't work if connection break is cause by a server that crashes and restarts yet.
                //
                debugLog("ActivateSession : ", err ? err.message : "");
                if (err) {
                    if (session.hasBeenClosed()) {
                        debugLog("Aborting reactivation of old session because user requested session to be closed");
                        return callback(new Error("reconnection cancelled due to session termination"));
                    }

                    //   if failed => recreate a new Channel and transfer the subscription
                    var new_session = null;
                    async_series([
                        (callback) => {

                            debugLog("Activating old session has failed ! => Creating a new session ....");

                            session.getPublishEngine().suspend(true);

                            // create new session, based on old session,
                            // so we can reuse subscriptions data
                            this.__createSession_step2(session, function (err, _new_session) {
                                debugLog(" Creating a new session (based on old session data).... Done");
                                if (!err) {
                                    new_session = _new_session;
                                    assert(session === _new_session, "session should be recycled");
                                }
                                callback(err);
                            });
                        },
                        (callback) => {
                            debugLog(" activating a new session ....");
                            this._activateSession(new_session, function (err) {
                                debugLog(" activating a new session .... Done");
                                ///xx self._addSession(new_session);
                                callback(err);
                            });
                        },
                        (callback) =>{

                            // get the old subscriptions id from the old session
                            var subscriptionsIds = session.getPublishEngine().getSubscriptionIds();

                            debugLog("  session subscriptionCount = ", new_session.getPublishEngine().subscriptionCount);
                            if (subscriptionsIds.length === 0) {
                                debugLog(" No subscriptions => skipping transfer subscriptions");
                                return callback(); // no need to transfer subscriptions
                            }
                            debugLog(" asking server to transfer subscriptions = [", subscriptionsIds.join(", "), "]");
                            // Transfer subscriptions
                            var options = {
                                subscriptionIds: subscriptionsIds,
                                sendInitialValues: false
                            };

                            assert(new_session.getPublishEngine().nbPendingPublishRequests === 0, "we should not be publishing here");
                            new_session.transferSubscriptions(options, function (err, results) {
                                if (err) {
                                    return callback(err);
                                }
                                debugLog("Transfer subscriptions  done", results.toString());
                                debugLog("  new session subscriptionCount = ", new_session.getPublishEngine().subscriptionCount);
                                callback();
                            });
                        },
                        (callback) =>{
                            assert(new_session.getPublishEngine().nbPendingPublishRequests === 0, "we should not be publishing here");
                            //      call Republish
                            return this._ask_for_subscription_republish(new_session, callback);
                        },
                        (callback) => { //start_publishing_as_normal
                            new_session.getPublishEngine().suspend(false);
                            callback();
                        }
                    ], next);

                } else {
                    //      call Republish
                    return this._ask_for_subscription_republish(session, next);
                }
            });

        }, function (err, results) {
            return callback(err);
        });

    });

};


public toString() {
    super.toString();
    console.log("  requestedSessionTimeout....... ", this.requestedSessionTimeout);
    console.log("  endpointUrl................... ", this.endpointUrl);
    console.log("  serverUri..................... ", this._serverUri);
};

/**
 * @method withSession
 * @param inner_func {function}
 * @param inner_func.session {ClientSession}
 * @param inner_func.callback {function}
 * @param callback {function}
 */
public withSession(endpointUrl, inner_func, callback) {

    assert('function' === typeof inner_func, "expecting inner function");
    assert('function' === typeof callback, "expecting callback function");

    

    var the_session;
    var the_error;
    var need_disconnect = false;
    async_series([

        // step 1 : connect to
        (callback) => {
            this.connect(endpointUrl, function (err) {
                need_disconnect = true;
                if (err) {
                    console.log(" cannot connect to endpoint :", endpointUrl);
                }
                callback(err);
            });
        },

        // step 2 : createSession
        (callback) => {
            this.createSession(null, (err, session) => {
                if (!err) {
                    the_session = session;
                }
                callback(err);
            });
        },

        (callback) =>{
            try {
                inner_func(the_session, function (err) {
                    the_error = err;
                    callback();
                });
            }
            catch (err) {
                console.log("OPCUAClient#withClientSession", err.message);
                the_error = err;
                callback();
            }
        },

        // close session
        (callback) =>{
            the_session.close(/*deleteSubscriptions=*/true, function (err) {
                if (err) {
                    console.log("OPCUAClient#withClientSession: session closed failed ?");
                }
                callback();
            });
        },
        (callback) => {
            this.disconnect(function (err) {
                need_disconnect = false;
                if (err) {
                    console.log("OPCUAClient#withClientSession: client disconnect failed ?");
                }
                callback();
            });
        }

    ], function (err1) {
        if (need_disconnect) {
            console.log("Disconnecting client after failure");
            this.disconnect(function (err2) {
                return callback(the_error || err1 || err2);
            });
        } else {
            return callback(the_error || err1);
        }
    });
};


//var thenify = require("thenify");
/**
 * @method connect
 * @param endpointUrl {string}
 * @async
 * @return {Promise}
 */
//OPCUAClient.prototype.connect = thenify.withCallback(OPCUAClient.prototype.connect);
/**
 * @method disconnect
 * disconnect client from server
 * @return {Promise}
 * @async
 */
//OPCUAClient.prototype.disconnect = thenify.withCallback(OPCUAClient.prototype.disconnect);
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
//OPCUAClient.prototype.createSession = thenify.withCallback(OPCUAClient.prototype.createSession);
/**
 * @method changeSessionIdentity
 * @param session
 * @param userIdentityInfo
 * @return {Promise}
 * @async
 */
//OPCUAClient.prototype.changeSessionIdentity = thenify.withCallback(OPCUAClient.prototype.changeSessionIdentity);
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
//OPCUAClient.prototype.closeSession = thenify.withCallback(OPCUAClient.prototype.closeSession);


public withSubscription(endpointUrl, subscriptionParameters, innerFunc, callback) {

    assert('function' === typeof innerFunc);
    assert('function' === typeof callback);

    this.withSession(endpointUrl, function (session, done) {
        assert('function' === typeof done);

        const subscription = new ClientSubscription(session, subscriptionParameters);

        try {
            innerFunc(session, subscription, function () {

                subscription.terminate(function (err) {
                    done(err);
                });
            });

        }
        catch (err) {
            console.log(err);
            done(err);
        }
    }, callback);
};
}

function isAnonymous(userIdentityInfo) {
    return !userIdentityInfo || (!userIdentityInfo.userName && !userIdentityInfo.password);
}

function isUserNamePassword(userIdentityInfo) {
    var res = (userIdentityInfo.userName !== undefined) && (userIdentityInfo.password !== undefined);
    return res;
}

function findUserTokenPolicy(endpoint_description : endpoints_service.EndpointDescription, userTokenType) : endpoints_service.UserTokenPolicy {
    assert(endpoint_description instanceof EndpointDescription);
    var r = endpoint_description.userIdentityTokens.filter( function (userIdentity : endpoints_service.UserTokenPolicy) {
        // assert(userIdentity instanceof UserTokenPolicy)
        // assert(userIdentity.tokenType);   
        return userIdentity.tokenType === userTokenType;
    });
    return r.length === 0 ? null : r[0];
}

function createAnonymousIdentityToken(session) {

    var endpoint_desc = session.endpoint;
    assert(endpoint_desc instanceof EndpointDescription);

    let userTokenPolicy : endpoints_service.UserTokenPolicy = findUserTokenPolicy(endpoint_desc, UserIdentityTokenType.ANONYMOUS);
    if (!userTokenPolicy) {
        throw new Error("Cannot find ANONYMOUS user token policy in end point description");
    }
    return new AnonymousIdentityToken({policyId: userTokenPolicy.policyId});
}

function createUserNameIdentityToken(session, userName, password) {

    // assert(endpoint instanceof EndpointDescription);
    assert(userName === null || typeof userName === "string");
    assert(password === null || typeof password === "string");
    var endpoint_desc = session.endpoint;
    assert(endpoint_desc instanceof EndpointDescription);

    var userTokenPolicy = findUserTokenPolicy(endpoint_desc, UserIdentityTokenType.USERNAME);

    // istanbul ignore next
    if (!userTokenPolicy) {
        throw new Error("Cannot find USERNAME user token policy in end point description");
    }

    var securityPolicy = fromURI(userTokenPolicy.securityPolicyUri);

    // if the security policy is not specified we use the session security policy
    if (securityPolicy === SecurityPolicy.Invalid) {
        securityPolicy = session._client._secureChannel.securityPolicy;
        assert(securityPolicy);
    }

    // if server does not provide certificate use unencrypted password (no server certificate !!!)

        var userIdentityToken = new UserNameIdentityToken({
            userName: userName,
            password: stringToUint8Array(password),//Buffer.from(password, "utf-8"),
            encryptionAlgorithm: null,
            policyId: userTokenPolicy.policyId
        });
        return userIdentityToken;
    
        //**nomsgcrypt**
}


