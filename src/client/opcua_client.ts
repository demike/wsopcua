'use strict';
/**
 * @module opcua.client
 */

import { assert } from '../assert';

const crypto: Crypto = window.crypto || (<any>window).msCrypto; // for IE 11
import { series as async_series } from 'async';
// **nomsgcrypt** var exploreCertificate = require("node-opcua-crypto").crypto_explore_certificate.exploreCertificate;

import { StatusCodes } from '../constants';
import * as session_service from '../service-session';
import { ClientSubscription } from './ClientSubscription';

import 'setimmediate';

const AnonymousIdentityToken = session_service.AnonymousIdentityToken;
const CreateSessionRequest = session_service.CreateSessionRequest;
const CreateSessionResponse = session_service.CreateSessionResponse;
const ActivateSessionRequest = session_service.ActivateSessionRequest;
const ActivateSessionResponse = session_service.ActivateSessionResponse;
const CloseSessionRequest = session_service.CloseSessionRequest;

/**
 * import all the generated classes (they have side effects --> do not tree shake them away)
 */
import '../generated';

import * as endpoints_service from '../service-endpoints';
const ApplicationDescription = endpoints_service.ApplicationDescription;
const ApplicationType = endpoints_service.ApplicationType;
const EndpointDescription = endpoints_service.EndpointDescription;

import { MessageSecurityMode, SignatureData } from '../service-secure-channel';
import { SecurityPolicy, fromURI, getCryptoFactory } from '../secure-channel/security_policy';
import { LocalizedText } from '../generated/LocalizedText';

// **nomsgcrypt** var crypto_utils = require("node-opcua-crypto").crypto_utils;
const UserNameIdentityToken = session_service.UserNameIdentityToken;

import { computeSignature } from '../secure-channel';

import { ClientSession } from './client_session';

import { doDebug, debugLog } from '../common/debug';

import { OPCUAClientBase, ErrorCallback, ResponseCallback } from './client_base';
import { isNullOrUndefined } from '../utils';

import { makeApplicationUrn } from '../common/applicationurn';
import { UserIdentityToken } from '../generated/UserIdentityToken';
import { stringToUint8Array } from '../basic-types/DataStream';
import { repair_client_sessions } from './reconnection';
import {
  UserTokenType,
  ICreateSubscriptionRequest,
  IX509IdentityToken,
  ISignatureData,
  IssuedIdentityToken,
} from '../generated';
import { ClientSecureChannelLayer } from '../secure-channel/client_secure_channel_layer';
import { exploreCertificate, generatePublicKeyFromDER, PrivateKeyPEM } from '../crypto';
import { concatArrayBuffers } from '../basic-types/array';
import { OPCUAClientOptions } from '../common/client_options';

export interface UserIdentityInfoUserName {
  userName: string;
  password: string;
}

export interface UserIdentityInfoIssued {
  tokenData: Uint8Array;
}

export interface UserIdentityInfoX509 extends IX509IdentityToken {
  privateKey: PrivateKeyPEM;
}
export interface UserIdentityInfoAnonymous {}

export type UserIdentityInfo = Partial<
  | UserIdentityInfoAnonymous
  | UserIdentityInfoX509
  | UserIdentityInfoUserName
  | UserIdentityInfoIssued
>;

export interface SessionActivationOptions {
  userIdentityInfo?: UserIdentityInfo;
  localeIds?: string[];
}

function validateServerNonce(serverNonce: Uint8Array | null): serverNonce is Uint8Array {
  return serverNonce && serverNonce.length < 32 ? false : true;
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

  requestedSessionTimeout: any;
  endpoint_must_exist: boolean;

  get clientNonce() {
    return this._clientNonce;
  }
  constructor(options: OPCUAClientOptions) {
    super(options);
    options = options || {};

    // @property endpoint_must_exist {Boolean}
    // if set to true , create Session will only accept connection from server which endpoint_url has been reported
    // by GetEndpointsRequest.
    // By default, the client is strict.
    this.endpoint_must_exist = isNullOrUndefined(options.endpoint_must_exist)
      ? true
      : !!options.endpoint_must_exist;
    this.requestedSessionTimeout = options.requestedSessionTimeout || 60000; // 1 minute
  }

  protected _nextSessionName(): string {
    if (!this.___sessionName_counter) {
      this.___sessionName_counter = 0;
    }
    this.___sessionName_counter += 1;
    return this._clientName + this.___sessionName_counter;
  }

  protected _getApplicationUri(): Promise<string> {
    // get applicationURI from certificate

    /**msgcrypt**/
    const certificate = this.getCertificate();
    let applicationUri;
    if (certificate) {
      const e = exploreCertificate(certificate);
      if (!e.tbsCertificate.extensions || !e.tbsCertificate.extensions.subjectAltName) {
        console.log(' Warning: client certificate is invalid : subjectAltName is missing');
        applicationUri = makeApplicationUrn(window.location.hostname, this.applicationName);
      } else {
        applicationUri = e.tbsCertificate.extensions.subjectAltName.uniformResourceIdentifier[0];
        return Promise.resolve(applicationUri);
      }
    } else {
      applicationUri = makeApplicationUrn(window.location.hostname, this.applicationName);
    }
    return applicationUri;
  }

  protected __resolveEndPoint(): boolean {
    this.securityPolicy = this.securityPolicy || SecurityPolicy.None;

    let endpoint = this.findEndpoint(
      this._secureChannel!.endpointUrl,
      this.securityMode,
      this.securityPolicy
    );
    this.endpoint = endpoint;

    // this is explained here : see OPCUA Part 4 Version 1.02 $5.4.1 page 12:
    //   A  Client  shall verify the  HostName  specified in the  Server Certificate  is the same as the  HostName
    //   contained in the  endpointUrl  provided in the  EndpointDescription. If there is a difference  then  the
    //   Client  shall report the difference and may close the  SecureChannel.

    if (!this.endpoint) {
      if (this.endpoint_must_exist) {
        debugLog(
          'OPCUAClient#endpoint_must_exist = true and endpoint with url ',
          this._secureChannel!.endpointUrl,
          ' cannot be found'
        );
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
  }

  protected _createSession(callback: ResponseCallback<ClientSession>): void {
    assert(typeof callback === 'function');
    assert(this._secureChannel);
    if (!this.__resolveEndPoint() || !this.endpoint) {
      console.log(
        this._server_endpoints.map(function (endpoint) {
          return (
            endpoint.endpointUrl +
            ' ' +
            endpoint.securityMode.toString() +
            ' ' +
            endpoint.securityPolicyUri
          );
        })
      );
      return callback(new Error(' End point must exist ' + this._secureChannel!.endpointUrl));
    }
    this._serverUri = this.endpoint.server.applicationUri;
    this._endpointUrl = this._secureChannel!.endpointUrl;

    const session = new ClientSession(this);
    this.__createSession_step2(session, callback);
  }

  protected static verifyEndpointDescriptionMatches(
    client: OPCUAClient,
    responseServerEndpoints: endpoints_service.EndpointDescription[]
  ): boolean {
    // The Server returns its EndpointDescriptions in the response. Clients use this information to
    // determine whether the list of EndpointDescriptions returned from the Discovery Endpoint matches
    // the Endpoints that the Server has. If there is a difference then the Client shall close the
    // Session and report an error.
    // The Server returns all EndpointDescriptions for the serverUri
    // specified by the Client in the request. The Client only verifies EndpointDescriptions with a
    // transportProfileUri that matches the profileUri specified in the original GetEndpoints request.
    // A Client may skip this check if the EndpointDescriptions were provided by a trusted source
    // such as the Administrator.
    // serverEndpoints:
    // The Client shall verify this list with the list from a Discovery Endpoint if it used a Discovery Endpoint
    // fetch to the EndpointDescriptions.

    // ToDo

    return true;
  }

  protected async __createSession_step2(
    session: ClientSession,
    callback: ResponseCallback<ClientSession>
  ) {
    assert(typeof callback === 'function');
    assert(this._secureChannel);
    assert(this._serverUri, ' must have a valid server URI');
    assert(this._endpointUrl, ' must have a valid server endpointUrl');
    assert(this.endpoint);

    const applicationUri = await this._getApplicationUri();

    const applicationDescription = new ApplicationDescription({
      applicationUri: applicationUri,
      productUri: 'OPCUA-Client',
      applicationName: new LocalizedText({ text: this.applicationName }),
      applicationType: ApplicationType.Client,
      gatewayServerUri: undefined,
      discoveryProfileUri: undefined,
      discoveryUrls: [],
    });

    // note : do not confuse CreateSessionRequest.clientNonce with OpenSecureChannelRequest.clientNonce
    //        which are two different nonce, with different size (although they share the same name )
    this._clientNonce = crypto.getRandomValues(new Uint8Array(32)); // randomBytes(32);

    const request = new CreateSessionRequest({
      clientDescription: applicationDescription,
      serverUri: this._serverUri,
      endpointUrl: this.endpointUrl,
      sessionName: this._nextSessionName(),
      clientNonce: this._clientNonce,
      clientCertificate: this.getCertificate(),
      requestedSessionTimeout: this.requestedSessionTimeout,
      maxResponseMessageSize: 800000,
    });

    // a client Nonce must be provided if security mode is set
    assert(
      this._secureChannel.securityMode === MessageSecurityMode.None || request.clientNonce !== null
    );

    this.performMessageTransaction(
      request,
      (err, response: session_service.CreateSessionResponse) => {
        if (!err) {
          // xx console.log("xxxxx response",response.toString());
          // xx console.log("xxxxx response",response.responseHeader.serviceResult);
          if (response.responseHeader.serviceResult === StatusCodes.BadTooManySessions) {
            err = new Error(
              'Too Many Sessions : ' + response.responseHeader.serviceResult.toString()
            );
          } else if (response.responseHeader.serviceResult === StatusCodes.Good) {
            assert(response instanceof CreateSessionResponse);

            // istanbul ignore next
            if (!validateServerNonce(response.serverNonce)) {
              return callback(new Error('invalid server Nonce'));
            }

            // todo: verify SignedSoftwareCertificates and  response.serverSignature

            session = session || new ClientSession(this);
            session.name = request.sessionName;
            session.sessionId = response.sessionId;
            session.authenticationToken = response.authenticationToken;
            session.timeout = response.revisedSessionTimeout;
            session.serverNonce = response.serverNonce;
            session.serverCertificate = response.serverCertificate ?? undefined;
            session.serverSignature = response.serverSignature;

            debugLog('revised session timeout = ' + session.timeout);

            if (!OPCUAClient.verifyEndpointDescriptionMatches(this, response.serverEndpoints)) {
              console.log('Endpoint description previously retrieved with GetendpointsDescription');
              console.log(this._server_endpoints);
              console.log('CreateSessionResponse.serverEndpoints= ');
              console.log(response.serverEndpoints);
              return callback(new Error('Invalid endpoint descriptions Found'));
            }

            // TODO: session.serverEndpoints = response.serverEndpoints;
          } else {
            err = new Error(
              'Error ' +
                response.responseHeader.serviceResult?.name +
                ' ' +
                response.responseHeader.serviceResult?.description
            );
          }
        }
        if (err) {
          callback(err);
        } else {
          callback(null, session);
        }
      }
    );
  }

  public computeClientSignature(
    channel: ClientSecureChannelLayer,
    serverCertificate: Uint8Array,
    serverNonce: Uint8Array
  ): Promise<SignatureData> {
    return computeSignature(
      serverCertificate,
      serverNonce,
      this.getPrivateKey(),
      (<any>channel).messageBuilder._securityPolicy
    );
  }

  protected createUserIdentityTokenP(
    session: ClientSession,
    userIdentityInfo: UserIdentityToken | UserIdentityInfo
  ): Promise<UserIdentityToken> {
    return new Promise((res, rej) => {
      this.createUserIdentityToken(session, userIdentityInfo, (err, _userIdentityToken) => {
        if (err) {
          rej(err);
        } else {
          res(_userIdentityToken);
        }
      });
    });
  }

  protected createUserIdentityToken(
    session: ClientSession,
    userIdentityInfo: UserIdentityInfo | null,
    callback: ResponseCallback<UserIdentityToken>
  ): void {
    assert('function' === typeof callback);
    userIdentityInfo = userIdentityInfo ?? {};
    if (isAnonymous(userIdentityInfo)) {
      try {
        const token = createAnonymousIdentityToken(session);
        return callback(null, token);
      } catch (err) {
        return callback(err);
      }
    } else if (isUserNamePassword(userIdentityInfo)) {
      const userName = (userIdentityInfo as UserIdentityInfoUserName).userName;
      const password = (userIdentityInfo as UserIdentityInfoUserName).password;

      try {
        createUserNameIdentityToken(session, userName, password).then((token) => {
          callback(null, token);
        });
        return;
      } catch (err) {
        // xx console.log(err.stack);
        return callback(err);
      }
    } else if (isIssued(userIdentityInfo)) {
      const tokenData = (userIdentityInfo as UserIdentityInfoIssued).tokenData;
      createIssuedIdentityToken(session, tokenData).then((token) => {
        callback(null, token);
      });
    } else {
      console.log(' userIdentityToken = ', userIdentityInfo);
      return callback(new Error('CLIENT: Invalid userIdentityToken'));
    }
  }

  // see OPCUA Part 4 - $7.35
  protected _activateSession(
    session: ClientSession,
    options: SessionActivationOptions | null,
    callback: ResponseCallback<ClientSession>
  ) {
    assert(typeof callback === 'function');
    options = options ?? {};

    // istanbul ignore next
    if (!this._secureChannel) {
      return callback(new Error(' No secure channel'));
    }

    const serverCertificate = session.serverCertificate;
    // If the securityPolicyUri is NONE and none of the UserTokenPolicies requires encryption,
    // the Client shall ignore the ApplicationInstanceCertificate (serverCertificate)
    assert(serverCertificate === null || serverCertificate instanceof Uint8Array);

    const serverNonce = session.serverNonce;
    assert(!serverNonce || serverNonce instanceof Uint8Array);

    // make sure session is attached to this client
    const _old_client = session.client;
    session.client = this;

    this.createUserIdentityToken(
      session,
      options.userIdentityInfo ?? null,
      async (err, userIdentityToken) => {
        if (err) {
          session.client = _old_client;
          return callback(err);
        }

        // TODO. fill the ActivateSessionRequest
        // see 5.6.3.2 Parameters OPC Unified Architecture, Part 4 30 Release 1.02
        const request = new ActivateSessionRequest({
          // This is a signature generated with the private key associated with the
          // clientCertificate. The SignatureAlgorithm shall be the AsymmetricSignatureAlgorithm
          // specified in the SecurityPolicy for the Endpoint. The SignatureData type is defined in 7.32.

          clientSignature: await this.computeClientSignature(
            this._secureChannel,
            serverCertificate,
            serverNonce
          ),

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
          localeIds: options.localeIds ?? [],

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
            signature: null,
          }),
        });

        session.performMessageTransaction(request, function (err, response) {
          if (!err && response.responseHeader.serviceResult === StatusCodes.Good) {
            if (!(response instanceof ActivateSessionResponse)) {
              return callback(new Error('Internal Error'));
            }

            if (!validateServerNonce(session.serverNonce)) {
              return callback(new Error('Invalid server Nonce'));
            }

            session.serverNonce = response.serverNonce;
            // TODO: session.lastResponseReceivedTime = Date.now();

            // 05.11.2019: Derfler added new session_activated
            session.emit('session_activated');
            return callback(null, session);
          } else {
            err = err || new Error(response.responseHeader.serviceResult.toString());
            session.client = _old_client;
            return callback(err, null);
          }
        });
      }
    );
  }

  /**
   * transfer session to this client
   * @method reactivateSession
   * @param session
   * @param callback
   * @return {*}
   */
  public reactivateSession(
    session: ClientSession,
    options: SessionActivationOptions,
    callback: ErrorCallback
  ) {
    assert(typeof callback === 'function');
    assert(this._secureChannel, ' client must be connected first');

    // istanbul ignore next
    if (!this.__resolveEndPoint() || !this.endpoint) {
      return callback(new Error(' End point must exist ' + this._secureChannel.endpointUrl));
    }

    assert(
      !session.client || session.client.endpointUrl === this.endpointUrl,
      'cannot reactivateSession on a different endpoint'
    );
    const old_client: OPCUAClientBase = session.client;

    debugLog('OPCUAClient#reactivateSession');

    this._activateSession(session, options, (err) => {
      if (!err) {
        if (old_client !== this) {
          // remove session from old client:
          if (old_client) {
            (<any>old_client)._removeSession(session); // cast to any as access of protected member to other instance should be possible
            assert(
              (<any>old_client)._sessions.indexOf(session) <
                0 /*!_.contains( (<any>old_client)._sessions, session*/
            );
          }
          this._addSession(session);

          assert(this._sessions.indexOf(session) >= 0 /*_.contains(this._sessions, session)*/);
        }
      } else {
        // istanbul ignore next
        if (doDebug) {
          console.log('reactivateSession has failed !', err.message);
        }
      }
      callback(err);
    });
  }

  /**
   * transfer session to this client
   * @method reactivateSession
   * @param session
   * @param callback
   * @return {*}
   */
  public reactivateSessionP(
    session: ClientSession,
    options: SessionActivationOptions
  ): Promise<void> {
    return new Promise((res, rej) => {
      this.reactivateSession(session, options, (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  /**
   * create and activate a new session
   * @async
   * @method createSession
   *
   * @param [userIdentityInfo {Object} ] optional
   * @param [userIdentityInfo.userName {String} ]
   * @param [userIdentityInfo.password {String} ]
   *
   * @param callback {ErrorCallback}
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

  public createSession(
    options: SessionActivationOptions | null,
    callback: ResponseCallback<ClientSession>
  ): void {
    assert('function' === typeof callback);

    this._createSession((err, session) => {
      if (err) {
        callback(err);
      } else {
        this._addSession(session);

        this._activateSession(session, options, function (err) {
          callback(err, session);
        });
      }
    });
  }

  /**
   * @method createSessionAsync
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
  public createSessionP(options: SessionActivationOptions | null): Promise<ClientSession> {
    return new Promise((res, rej) => {
      this.createSession(options, (err, clientSession) => {
        if (err) {
          rej(err);
        } else {
          res(clientSession);
        }
      });
    });
  }

  /**
   * @method changeSessionIdentity
   * @param session
   * @param userIdentityInfo //set to null to go back to anonymous user
   * @param callback
   * @async
   */
  public changeSessionIdentity(
    session: ClientSession | null,
    options: SessionActivationOptions | null,
    callback: ErrorCallback
  ) {
    assert('function' === typeof callback);

    this._activateSession(session, options, function (err) {
      callback(err);
    });
  }
  public changeSessionIdentityP(
    session: ClientSession | null,
    options: SessionActivationOptions | null
  ): Promise<void> {
    return new Promise((res, rej) => {
      this.changeSessionIdentity(session, options, (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  protected _closeSession(
    session: ClientSession,
    deleteSubscriptions: boolean,
    callback: ResponseCallback<session_service.CloseSessionResponse>
  ) {
    assert('function' === typeof callback);

    // istanbul ignore next
    if (!this._secureChannel) {
      return callback(new Error('no channel'));
    }
    assert(this._secureChannel);

    if (!this._secureChannel.isValid()) {
      return callback(null);
    }

    if (this.isReconnecting) {
      console.log(
        'OPCUAClient#_closeSession called while reconnection in progress ! What shall we do'
      );
      return callback(null);
    }

    const request = new CloseSessionRequest({
      deleteSubscriptions: deleteSubscriptions,
    });

    session.performMessageTransaction(request, function (err, response) {
      if (err) {
        // xx console.log("xxx received : ", err, response);
        // xx self._secureChannel.close(function () {
        // xx     callback(err, null);
        // xx });
        callback(err, null);
      } else {
        callback(err, response);
      }
    });
  }

  /**
   *
   * @method closeSession
   * @async
   * @param session  {ClientSession} - the created client session
   * @param deleteSubscriptions  {Boolean} - whether to delete subscriptions or not
   * @param callback {ErrorCallback} - the callback
   * @param callback.err {Error|null}   - the Error if the async method has failed
   */
  public closeSession(
    session: ClientSession,
    deleteSubscriptions: boolean,
    callback: ErrorCallback
  ) {
    // assert(_.isBoolean(deleteSubscriptions));
    assert('function' === typeof callback);
    assert(session);
    assert(session.client === this, 'session must be attached to self');
    session.closed = true;
    // todo : send close session on secure channel
    this._closeSession(session, deleteSubscriptions, (err) => {
      session.emitCloseEvent();

      this._removeSession(session);
      session.dispose();

      assert(this._sessions.indexOf(session) < 0);
      assert(session.closed, 'session must indicate it is closed');

      callback(err);
    });
  }
  /**
   *
   * @method closeSessionAsync
   * @async
   * @param session  {ClientSession} - the created client session
   * @param deleteSubscriptions  {Boolean} - whether to delete subscriptions or not
   */
  public closeSessionP(session: ClientSession, deleteSubscriptions: boolean): Promise<void> {
    return new Promise((res, rej) => {
      this.closeSession(session, deleteSubscriptions, (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  protected _on_connection_reestablished(callback: ErrorCallback) {
    assert('function' === typeof callback);

    // call base class implementation first
    super._on_connection_reestablished((err: Error) => {
      repair_client_sessions(this, callback);
    });
  }

  public toString(): string {
    const superStr = super.toString();
    let str = '  requestedSessionTimeout....... ' + this.requestedSessionTimeout;
    str += '  endpointUrl................... ' + this.endpointUrl;
    str += '  serverUri..................... ' + this._serverUri;
    // console.log(str);
    return superStr + str;
  }

  /**
   * @method withSession
   * @param inner_func {function}
   * @param inner_func.session {ClientSession}
   * @param inner_func.callback {function}
   * @param callback {function}
   */
  public withSession(
    endpointUrl: string,
    inner_func: (sess: ClientSession, cb: ErrorCallback) => void,
    callback: ErrorCallback
  ) {
    assert('function' === typeof inner_func, 'expecting inner function');
    assert('function' === typeof callback, 'expecting callback function');

    let the_session: ClientSession;
    let the_error: Error | undefined | null;
    let need_disconnect = false;
    async_series(
      [
        // step 1 : connect to
        (innerCallback: ErrorCallback) => {
          this.connect(endpointUrl, function (err) {
            need_disconnect = true;
            if (err) {
              console.log(' cannot connect to endpoint :', endpointUrl);
            }
            innerCallback(err);
          });
        },

        // step 2 : createSession
        (innerCallback: ErrorCallback) => {
          this.createSession(null, (err, session) => {
            if (!err) {
              the_session = session!;
            }
            innerCallback(err);
          });
        },

        (innerCallback: () => void) => {
          try {
            inner_func(the_session, function (err) {
              the_error = err;
              innerCallback();
            });
          } catch (err) {
            console.log('OPCUAClient#withClientSession', err.message);
            the_error = err;
            innerCallback();
          }
        },

        // close session
        (innerCallback: () => void) => {
          the_session.close(/*deleteSubscriptions=*/ true, function (err) {
            if (err) {
              console.log('OPCUAClient#withClientSession: session closed failed ?');
            }
            innerCallback();
          });
        },
        (innerCallback: () => void) => {
          this.disconnect(function (err) {
            need_disconnect = false;
            if (err) {
              console.log('OPCUAClient#withClientSession: client disconnect failed ?');
            }
            innerCallback();
          });
        },
      ],
      (err1: Error) => {
        if (need_disconnect) {
          console.log('Disconnecting client after failure');
          this.disconnect(function (err2) {
            return callback(the_error || err1 || err2);
          });
        } else {
          return callback(the_error || err1);
        }
      }
    );
  }

  public withSubscription(
    endpointUrl: string,
    subscriptionParameters: ICreateSubscriptionRequest,
    innerFunc: (arg0: ClientSession, arg1: ClientSubscription, arg2: () => void) => void,
    callback: ErrorCallback
  ) {
    assert('function' === typeof innerFunc);
    assert('function' === typeof callback);

    this.withSession(
      endpointUrl,
      function (session, done) {
        assert('function' === typeof done);

        const subscription = new ClientSubscription(session, subscriptionParameters);

        try {
          innerFunc(session, subscription, function () {
            subscription.terminate(function (err) {
              done(err);
            });
          });
        } catch (err) {
          console.log(err);
          done(err);
        }
      },
      callback
    );
  }
}

export function isAnonymous(
  userIdentityInfo: UserIdentityInfo
): userIdentityInfo is UserIdentityInfoAnonymous {
  return (
    !userIdentityInfo ||
    (!(
      (userIdentityInfo as Partial<UserIdentityInfoUserName>).userName &&
      (userIdentityInfo as Partial<UserIdentityInfoUserName>).password
    ) &&
      !(userIdentityInfo as Partial<UserIdentityInfoIssued>).tokenData)
  );
}

export function isUserNamePassword(
  userIdentityInfo: UserIdentityInfo
): userIdentityInfo is UserIdentityInfoUserName {
  const res =
    (userIdentityInfo as Partial<UserIdentityInfoUserName>).userName !== undefined &&
    (userIdentityInfo as Partial<UserIdentityInfoUserName>).password !== undefined;
  return res;
}

export function isIssued(
  userIdentityInfo: UserIdentityInfo
): userIdentityInfo is UserIdentityInfoIssued {
  const res = (userIdentityInfo as Partial<UserIdentityInfoIssued>).tokenData !== undefined;

  return res;
}

function findUserTokenPolicy(
  endpoint_description: endpoints_service.EndpointDescription,
  userTokenType: UserTokenType
): endpoints_service.UserTokenPolicy | null {
  assert(endpoint_description instanceof EndpointDescription);
  const r = endpoint_description.userIdentityTokens.filter(function (
    userIdentity: endpoints_service.UserTokenPolicy
  ) {
    // assert(userIdentity instanceof UserTokenPolicy)
    // assert(userIdentity.tokenType);
    return userIdentity.tokenType === userTokenType;
  });
  return r.length === 0 ? null : r[0];
}

function createAnonymousIdentityToken(
  session: ClientSession
): session_service.AnonymousIdentityToken {
  const endpoint_desc = session.endpoint;
  assert(endpoint_desc instanceof EndpointDescription);

  const userTokenPolicy = findUserTokenPolicy(endpoint_desc, UserTokenType.Anonymous);
  if (!userTokenPolicy || !userTokenPolicy.policyId) {
    throw new Error('Cannot find ANONYMOUS user token policy in end point description');
  }
  return new AnonymousIdentityToken({ policyId: userTokenPolicy.policyId });
}

async function createUserNameIdentityToken(
  session: ClientSession,
  userName: string,
  password: string
): Promise<session_service.UserNameIdentityToken> {
  // assert(endpoint instanceof EndpointDescription);
  assert(userName === null || typeof userName === 'string');
  assert(password === null || typeof password === 'string');
  const endpoint_desc = session.endpoint;
  assert(endpoint_desc instanceof EndpointDescription);

  /**
   * OPC Unified Architecture 1.0.4:  Part 4 155
   * Each UserIdentityToken allowed by an Endpoint shall have a UserTokenPolicy specified in the
   * EndpointDescription. The UserTokenPolicy specifies what SecurityPolicy to use when encrypting
   * or signing. If this SecurityPolicy is omitted then the Client uses the SecurityPolicy in the
   * EndpointDescription. If the matching SecurityPolicy is set to None then no encryption or signature
   * is required.
   *
   */
  const userTokenPolicy = findUserTokenPolicy(endpoint_desc, UserTokenType.UserName);

  // istanbul ignore next
  if (!userTokenPolicy) {
    throw new Error('Cannot find USERNAME user token policy in end point description');
  }

  let securityPolicy = fromURI(userTokenPolicy.securityPolicyUri);

  // if the security policy is not specified we use the session security policy
  if (securityPolicy === SecurityPolicy.Invalid) {
    securityPolicy = (<any>session)._client._secureChannel.securityPolicy;
    assert(securityPolicy);
  }

  let identityToken: session_service.UserNameIdentityToken;
  // if server does not provide certificate use unencrypted password (no server certificate !!!)
  if (!session.serverCertificate) {
    identityToken = new UserNameIdentityToken({
      userName: userName,
      password: stringToUint8Array(password), // Buffer.from(password, "utf-8"),
      encryptionAlgorithm: null,
      policyId: userTokenPolicy.policyId,
    });
    return identityToken;
  }
  // **nomsgcrypt**

  const serverNonce = session.serverNonce || new Uint8Array(0);
  // assert(serverNonce instanceof Uint8Array);

  // If None is specified for the UserTokenPolicy and SecurityPolicy is None
  // then the password only contains the UTF-8 encoded password.
  // note: this means that password is sent in clear text to the server
  // note: OPCUA specification discourages use of unencrypted password
  //       but some old OPCUA server may only provide this policy and we
  //       still have to support in the client?
  if (securityPolicy === SecurityPolicy.None) {
    identityToken = new UserNameIdentityToken({
      encryptionAlgorithm: null,
      password: stringToUint8Array(password),
      policyId: userTokenPolicy.policyId,
      userName,
    });
    return identityToken;
  }
  // see Release 1.02 155 OPC Unified Architecture, Part 4
  const cryptoFactory = getCryptoFactory(securityPolicy);

  // istanbul ignore next
  if (!cryptoFactory) {
    throw new Error(' Unsupported security Policy');
  }

  identityToken = new UserNameIdentityToken({
    encryptionAlgorithm: cryptoFactory.asymmetricEncryptionAlgorithm,
    password: stringToUint8Array(password),
    policyId: userTokenPolicy.policyId,
    userName: userName,
  });

  // now encrypt password as requested

  assert(session.serverCertificate instanceof Uint8Array);

  const lenBuf = new Uint32Array(1);
  lenBuf[0] = identityToken.password.length + serverNonce.length;
  const block = concatArrayBuffers([
    lenBuf.buffer,
    identityToken.password.buffer,
    serverNonce.buffer,
  ]);

  // let ci = exploreCertificate(session.serverCertificate);
  try {
    const publicKey = await generatePublicKeyFromDER(session.serverCertificate);
    const buffer = await cryptoFactory.asymmetricEncrypt(block, publicKey);
    identityToken.password = new Uint8Array(buffer);
  } catch (err) {
    console.log(err.message);
  }
  return identityToken;
}

async function createIssuedIdentityToken(
  session: ClientSession,
  tokenData: Uint8Array
): Promise<session_service.IssuedIdentityToken> {
  // assert(endpoint instanceof EndpointDescription);

  const endpoint_desc = session.endpoint;
  assert(endpoint_desc instanceof EndpointDescription);

  /**
   * OPC Unified Architecture 1.0.4:  Part 4 155
   * Each UserIdentityToken allowed by an Endpoint shall have a UserTokenPolicy specified in the
   * EndpointDescription. The UserTokenPolicy specifies what SecurityPolicy to use when encrypting
   * or signing. If this SecurityPolicy is omitted then the Client uses the SecurityPolicy in the
   * EndpointDescription. If the matching SecurityPolicy is set to None then no encryption or signature
   * is required.
   *
   */
  const userTokenPolicy = findUserTokenPolicy(endpoint_desc, UserTokenType.IssuedToken);

  // istanbul ignore next
  if (!userTokenPolicy) {
    throw new Error('Cannot find ISSUED user token policy in end point description');
  }

  let securityPolicy = fromURI(userTokenPolicy.securityPolicyUri);

  // if the security policy is not specified we use the session security policy
  if (securityPolicy === SecurityPolicy.Invalid) {
    securityPolicy = (<any>session)._client._secureChannel.securityPolicy;
    assert(securityPolicy);
  }

  let identityToken: IssuedIdentityToken;
  // if securtiy policy is none or
  // server does not provide certificate use unencrypted password (no server certificate !!!)
  // note: this means that password is sent in clear text to the server
  // note: OPCUA specification discourages use of unencrypted password
  //       but in case of WSS this is no problem
  if (!session.serverCertificate || securityPolicy === SecurityPolicy.None) {
    identityToken = new IssuedIdentityToken({
      tokenData,
      encryptionAlgorithm: null,
      policyId: userTokenPolicy.policyId,
    });
    return identityToken;
  }

  const serverNonce = session.serverNonce || new Uint8Array(0);

  // see Release 1.02 155 OPC Unified Architecture, Part 4
  const cryptoFactory = getCryptoFactory(securityPolicy);

  // istanbul ignore next
  if (!cryptoFactory) {
    throw new Error(' Unsupported security Policy');
  }

  identityToken = new IssuedIdentityToken({
    encryptionAlgorithm: cryptoFactory.asymmetricEncryptionAlgorithm,
    tokenData,
    policyId: userTokenPolicy.policyId,
  });

  // now encrypt isseud token as requested

  assert(session.serverCertificate instanceof Uint8Array);

  const lenBuf = new Uint32Array(1);
  lenBuf[0] = identityToken.tokenData.length + serverNonce.length;
  const block = concatArrayBuffers([
    lenBuf.buffer,
    identityToken.tokenData.buffer,
    serverNonce.buffer,
  ]);

  try {
    const publicKey = await generatePublicKeyFromDER(session.serverCertificate);
    const buffer = await cryptoFactory.asymmetricEncrypt(block, publicKey);
    identityToken.tokenData = new Uint8Array(buffer);
  } catch (err) {
    console.log(err.message);
  }
  return identityToken;
}
