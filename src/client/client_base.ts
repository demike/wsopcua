'use strict';
/**
 * @module opcua.client
 */

import { assert } from '../assert';
import * as log from 'loglevel';
import async_series from 'async-es/series';
import async_map from 'async-es/map';
import { EventEmitter } from '../eventemitter';
import { SecurityPolicy, toUri } from '../secure-channel/security_policy';
import { MessageSecurityMode } from '../secure-channel';
import { once } from '../utils/once';
import * as delayed from 'delayed';
import { ObjectRegistry } from '../object-registry/objectRegistry';
// import {OPCUASecureObject} from '../common/secure_object'
import { doDebug } from '../common/debug';
import * as endpoints_service from '../service-endpoints';

const GetEndpointsRequest = endpoints_service.GetEndpointsRequest;
const GetEndpointsResponse = endpoints_service.GetEndpointsResponse;

/**
 *
 * send a FindServers request to a discovery server
 * @method findServers
 * @async
 * @param callback [Function}
 */

import * as register_server_service from '../service-register-server';
const FindServersRequest = register_server_service.FindServersRequest;
const FindServersResponse = register_server_service.FindServersResponse;

function debugLog(s: String) {
  if (doDebug) {
    log.debug(s);
  }
}

import { ClientSecureChannelLayer } from '../secure-channel/client_secure_channel_layer';
import { OPCUASecureObject } from '../common/secure_object';
import { RequestHeader, ResponseHeader } from '../service-secure-channel';
import { ClientSession } from './client_session';
import { EndpointDescription } from '../service-endpoints';
import { IGetEndpointsRequest } from '../generated/GetEndpointsRequest';
import {
  FindServersOnNetworkRequest,
  IFindServersOnNetworkRequest,
  FindServersOnNetworkResponse,
  ServerOnNetwork,
  IRequestHeader,
  ChannelSecurityToken,
} from '../generated';
import { IEncodable } from '../factory/factories_baseobject';

const defaultConnectionStrategy = {
  maxRetry: 10000000, // almost infinite
  initialDelay: 1000,
  maxDelay: 20 * 1000, // 20 seconds
  randomisationFactor: 0.1,
};

export type ErrorCallback = (err?: Error) => void;

export interface OpcUaResponse {
  responseHeader: ResponseHeader;
}

export type ResponseCallback<R1, R2 = undefined> = (
  err?: Error | null,
  response?: R1,
  arg2?: R2
) => void;
/*
export interface ResponseCallback<R1, R2 = undefined> {
    (err: null, response: R1, arg2?: R2): void;
    (err: Error, response?: R1, arg2?: R2): void;
}
*/

export interface ConnectionStrategy {
  maxRetry?: number;
  initialDelay?: number;
  maxDelay?: number;
  randomisationFactor?: number;
}

export interface OPCUAClientOptions {
  encoding?: 'opcua+uacp' | 'opcua+uajson'; // default: 'opcua+uacp'

  defaultSecureTokenLifetime?: number; // default secure token lifetime in ms
  serverCertificate?: any; // =null] {Certificate} the server certificate.
  connectionStrategy?: ConnectionStrategy;
  // {MessageSecurityMode} the default security mode.
  securityMode?: MessageSecurityMode; //  MessageSecurityMode, // [ =  MessageSecurityMode.None]
  securityPolicy?: SecurityPolicy; // : SecurityPolicy,//  =SecurityPolicy.NONE] {SecurityPolicy} the security mode.
  requestedSessionTimeout?: number; // = 60000]            {Number} the requested session time out in CreateSession
  applicationName?: string; // ="NodeOPCUA-Client"]        {string} the client application name
  endpoint_must_exist?: boolean; // true] {Boolean} set to false if the client should accept server endpoint mismatch
  keepSessionAlive?: boolean; // =false]{Boolean}
  certificateFile?: string; // "certificates/client_selfsigned_cert_1024.pem"] {String} client certificate pem file.
  privateKeyFile?: string; // "certificates/client_key_1024.pem"] {String} client private key pem file.
  clientName?: string; // ] {String} a client name string that will be used to generate session names.
  tokenRenewalInterval?: number; // if not specify or set to 0 , token  renewal will happen around 75% of the defaultSecureTokenLiveTime
  keepPendingSessionsOnDisconnect?: boolean; // =false, if set to true,
  // pending session will not be automatically closed when disconnect is called
}

export interface IFindServersOptions {
  endpointUrl?: string;
  localeIds?: string[];
  serverUris?: string[];
}

export interface OPCUAClientEvents {
  close: ErrorCallback;
  backoff: (number: number, delay: number) => void;
  abort: () => void;
  start_reconnection: () => void;
  send_chunk: (messageChunk: ArrayBuffer) => void;
  after_reconnection: ErrorCallback;
  send_request: (requestMessage: IEncodable & { requestHeader: IRequestHeader }) => void;
  receive_chunk: (message_chunk: DataView) => void;
  receive_response;
  lifetime_75: (token: ChannelSecurityToken) => void;
  security_token_renewed: () => void;
  connection_lost: () => void;
  connection_reestablished: () => void;
  timed_out_request: (requestMessage: IEncodable & { requestHeader: IRequestHeader }) => void;
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
 * @param [options.keepPendingSessionsOnDisconnect=false] if set to true, pending session will not be automatically closed *
 *                                                  when disconnect is called
 * @constructor
 */
export class OPCUAClientBase extends EventEmitter<OPCUAClientEvents> {
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

  /* TODO: check if this should be static */
  protected registry = new ObjectRegistry();

  protected _sessions: ClientSession[];
  protected defaultSecureTokenLifetime: number;
  protected tokenRenewalInterval: number;
  protected keepPendingSessionsOnDisconnect: boolean;

  protected _endpointUrl: string;
  protected connectionStrategy: ConnectionStrategy;

  public readonly encoding: 'opcua+uacp' | 'opcua+uajson';

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

  protected _clientName: string;
  protected _applicationName: string;
  /**
   * total number of bytes read by the client
   * @property bytesRead
   * @type {Number}
   */
  get bytesRead() {
    return this._byteRead + (this._secureChannel ? this._secureChannel.bytesRead : 0);
  }

  /**
   * total number of bytes written by the client
   * @property bytesWritten
   * @type {Number}
   */
  get bytesWritten() {
    return this._byteWritten + (this._secureChannel ? this._secureChannel.bytesWritten : 0);
  }

  /**
   * total number of transactions performed by the client
   * @property transactionsPerformed
   * @type {Number}
   */
  get transactionsPerformed() {
    return (
      this._transactionsPerformed +
      (this._secureChannel ? this._secureChannel.transactionsPerformed : 0)
    );
  }

  get timedOutRequestCount() {
    return (
      this._timedOutRequestCount +
      (this._secureChannel ? this._secureChannel.timedOutRequestCount : 0)
    );
  }

  /**
   * is true when the client has already requested the server end points.
   * @property knowsServerEndpoint
   * @type boolean
   */
  get knowsServerEndpoint() {
    return this._server_endpoints && this._server_endpoints.length > 0;
  }

  /**
   * @property isReconnecting
   * @type {Boolean} true if the client is trying to reconnect to the server after a connection break.
   */
  get isReconnecting() {
    return !!(this._secureChannel && this._secureChannel.isConnecting);
  }

  /**
   * true if the connection strategy is set to automatically try to reconnect in case of failure
   * @property reconnectOnFailure
   * @type {Boolean}
   */
  get reconnectOnFailure() {
    return this.connectionStrategy.maxRetry > 0 || this.connectionStrategy.maxRetry === -1;
  }

  get secureChannel() {
    return this._secureChannel;
  }

  get endpointUrl() {
    return this._endpointUrl;
  }

  get sessions(): ClientSession[] {
    return this._sessions;
  }

  get clientName(): string {
    return this._clientName;
  }

  get applicationName(): string {
    return this._applicationName;
  }

  constructor(options?: OPCUAClientOptions) {
    super();

    options = options || {};

    this._clientName = options.clientName || 'Session';
    this._applicationName = options.applicationName || 'NodeOPCUA-Client';
    this.encoding = options.encoding || 'opcua+uacp';

    // options.certificateFile = options.certificateFile || path.join(__dirname, "../certificates/client_selfsigned_cert_1024.pem");
    // options.privateKeyFile = options.privateKeyFile || path.join(__dirname, "../certificates/PKI/own/private/private_key.pem");
    //          // istanbul ignore next
    // if (!fs.existsSync(options.certificateFile)) {
    //     throw new Error(" cannot locate certificate file " + options.certificateFile);
    // }

    // // istanbul ignore next
    // if (!fs.existsSync(options.privateKeyFile)) {
    //     throw new Error(" cannot locate private key file " + options.privateKeyFile);
    // }

    //       OPCUASecureObject.call(this, options);
    this.secureObject = new OPCUASecureObject(options);

    this.registry = new ObjectRegistry();
    // must be ZERO with Spec 1.0.2
    this.protocolVersion = 0;

    this._sessions = [];

    this._server_endpoints = [];
    this._secureChannel = null;

    this.defaultSecureTokenLifetime = options.defaultSecureTokenLifetime || 600000;
    this.tokenRenewalInterval = options.tokenRenewalInterval || 0;
    assert(Number.isFinite(this.tokenRenewalInterval) && this.tokenRenewalInterval >= 0);
    this.securityMode = options.securityMode || MessageSecurityMode.None;

    /**
     * @property securityPolicy
     * @type {SecurityPolicy}
     */
    this.securityPolicy = options.securityPolicy || toUri('None');
    this.securityPolicy = SecurityPolicy[this.securityPolicy]; // TODO CHECK IF THIS IS RIGHT!!!

    /**
     * @property serverCertificate
     * @type {Certificate}
     */
    this.serverCertificate = options.serverCertificate || null;

    this.keepSessionAlive = options.keepSessionAlive ? options.keepSessionAlive : false;

    // statistics...
    this._byteRead = 0;
    this._byteWritten = 0;
    this._transactionsPerformed = 0;
    this._timedOutRequestCount = 0;

    /**
     * @property connectionStrategy
     * @type {options.connectionStrategy|{maxRetry, initialDelay, maxDelay, randomisationFactor}|*
     *              |{maxRetry: number, initialDelay: number, maxDelay: number, randomisationFactor: number}}
     */
    this.connectionStrategy = options.connectionStrategy || defaultConnectionStrategy;
    this.keepPendingSessionsOnDisconnect = options.keepPendingSessionsOnDisconnect || false;
  }

  closeSession(session: ClientSession, deleteSubscriptions: boolean, callback: ErrorCallback): any {
    throw new Error('Method not implemented.');
  }

  /**
   *
   * connect the OPC-UA client to a server end point.
   * @param options
   * @param callback
   */
  connect(endpointUrl: string, callback: ErrorCallback): void {
    assert('function' === typeof callback, 'expecting a callback');

    this._endpointUrl = endpointUrl;

    debugLog('OPCUAClientBase#connect ' + endpointUrl);

    // prevent illegal call to connect
    if (this._secureChannel !== null) {
      window.setImmediate(() => {
        callback(new Error('connect already called'));
      });
      return;
    }

    if (!this.serverCertificate && this.securityMode !== MessageSecurityMode.None) {
      debugLog('OPCUAClient : getting serverCertificate');
      // we have not been given the serverCertificate but this certificate
      // is required as the connection is to be secured.
      //
      // Let's explore the server endpoint that matches our security settings
      // This will give us the missing Certificate as well from the server itself.
      // todo :
      // Once we have the certificate, we cannot trust it straight away
      // we have to verify that the certificate is valid and not outdated and not revoked.
      // if the certificate is self-signed the certificate must appear in the trust certificate
      // list.
      // if the certificate has been certified by an Certificate Authority we have to
      // verify that the certificates in the chain are valid and not revoked.
      //

      /** NOCRYPT
            const cert = this.certificateFile || 'certificates/client_selfsigned_cert_1024.pem';
            const key = self.privateKeyFile || 'certificates/client_key_1024.pem';
        */
      const appName = this._applicationName || 'NodeOPCUA-Client';
      const params = {
        securityMode: this.securityMode,
        securityPolicy: this.securityPolicy,
        connectionStrategy: this.connectionStrategy,
        endpoint_must_exist: false,
        applicationName: appName,
      };
      return OPCUAClientBase.__findEndpoint(endpointUrl, params, (err: Error, endpoint: any) => {
        if (err) {
          return callback(err);
        }
        if (!endpoint) {
          // no matching end point can be found ...
          return callback(new Error('cannot find end point'));
        }
        // xx console.log(" Found End point ");

        return this.connect(endpointUrl, callback);
      });
    }

    // todo: make sure endpointUrl exists in the list of endpoints send by the server
    // [...]

    // make sure callback will only be call once regardless of outcome, and will be also deferred.
    const callback_od = once(delayed.deferred(callback));
    callback = null;

    this.registry.register(this);

    this._internal_create_secure_channel((err) => {
      callback_od(err);
    });
  }
  /**
   * @method connectAsync
   * @param endpointUrl {string}
   * @async
   * @return {Promise}
   */
  connectP(endpointUrl: string): Promise<void> {
    return new Promise((res, rej) => {
      this.connect(endpointUrl, (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  disconnect(callback: ErrorCallback): void {
    assert('function' === typeof callback);

    debugLog('OPCUAClientBase#disconnect' + this.endpointUrl);

    if (this.isReconnecting) {
      debugLog('OPCUAClientBase#disconnect called while reconnection is in progress');
      // let's abort the reconnection process
      return this._cancel_reconnection((err) => {
        assert(!err, ' why would this fail ?');
        assert(!this.isReconnecting);
        // sessions cannot be cancelled properly and must be discarded.
        this.disconnect(callback);
      });
    }
    if (this._sessions.length && !this.keepPendingSessionsOnDisconnect) {
      console.log('warning : disconnection : closing pending sessions');
      // disconnect has been called whereas living session exists
      // we need to close them first ....
      this._close_pending_sessions((/*err*/) => {
        this.disconnect(callback);
      });
      return;
    }

    if (this._sessions.length) {
      // transfer active session to  orphan and detach them from channel
      this._sessions.forEach((session) => {
        this._removeSession(session);
      });
      this._sessions = [];
    }

    assert(this._sessions.length === 0, ' attempt to disconnect a client with live sessions ');

    this.registry.unregister(this);

    if (this._secureChannel) {
      const tmp_channel = this._secureChannel;

      this._destroy_secure_channel();

      tmp_channel.close(() => {
        debugLog(' EMIT NORMAL CLOSE');
        /**
         * @event close
         */
        this.emit('close', null);
        window.setImmediate(callback);
      });
    } else {
      this.emit('close', null);
      window.setImmediate(callback);
    }
  }
  /**
   * @method disconnectAsync
   * disconnect client from server
   * @return {Promise}
   * @async
   */
  disconnectP(): Promise<void> {
    return new Promise((res, rej) => {
      this.disconnect((err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  performMessageTransaction(request: any, callback: ResponseCallback<any>): void {
    if (!this._secureChannel) {
      // this may happen if the Server has closed the connection abruptly for some unknown reason
      // or if the tcp connection has been broken.
      return callback(
        new Error('No SecureChannel , connection may have been canceled abruptly by server')
      );
    }
    assert(this._secureChannel);
    assert(request);
    assert(request.requestHeader);
    assert(typeof callback === 'function');
    this._secureChannel.performMessageTransaction(request, callback);
  }

  /**
   * @method findServers
   * @param options
   * @param [options.endpointUrl]
   * @param [options.localeIds] Array
   * @param [options.serverUris] Array
   * @param callback
   */
  public findServers(
    options: IFindServersOptions,
    callback: ResponseCallback<endpoints_service.ApplicationDescription[]>
  ) {
    if (!this._secureChannel) {
      window.setImmediate(function () {
        callback(new Error('Invalid Secure Channel'));
      });
      return;
    }

    const request = new FindServersRequest({
      endpointUrl: options.endpointUrl || this._endpointUrl,
      localeIds: options.localeIds || [],
      serverUris: options.serverUris || [],
    });

    this.performMessageTransaction(request, function (err, response) {
      if (err) {
        return callback(err);
      }

      if (!response || !(response instanceof FindServersResponse)) {
        return callback(new Error('Internal Error'));
      }
      response.servers = response.servers || [];
      callback(null, response.servers);
    });
  }
  public findServersP(
    options: IFindServersOptions
  ): Promise<endpoints_service.ApplicationDescription[]> {
    return new Promise((res, rej) => {
      this.findServers(options, (err, applDescription) => {
        if (err) {
          rej(err);
        } else {
          res(applDescription);
        }
      });
    });
  }

  public findServersOnNetwork(
    options: IFindServersOnNetworkRequest,
    callback: (error: Error | null, servers?: ServerOnNetwork[]) => void
  ) {
    if (!this._secureChannel) {
      window.setImmediate(function () {
        callback(new Error('Invalid Secure Channel'));
      });
      return;
    }

    const request = new FindServersOnNetworkRequest(options);

    this.performMessageTransaction(request, function (err, response) {
      if (err) {
        return callback(err);
      }
      if (!response || !(response instanceof FindServersOnNetworkResponse)) {
        return new Error('Internal Error');
      }
      response.servers = response.servers || [];
      callback(null, (<FindServersOnNetworkResponse>response).servers);
    });
  }
  public findServersOnNetworkP(options: IFindServersOnNetworkRequest): Promise<ServerOnNetwork[]> {
    return new Promise((res, rej) => {
      this.findServersOnNetwork(options, (err, servers) => {
        if (err) {
          rej(err);
        } else {
          res(servers);
        }
      });
    });
  }

  protected _close_pending_sessions(callback: ErrorCallback) {
    assert('function' === typeof callback);

    const sessions = this._sessions.slice(); // _.clone(this._sessions);
    async_map(
      sessions,
      (session: ClientSession, next: () => void) => {
        assert(session.client === this);
        session.close(true, function (err) {
          // We should not bother if we have an error here
          // Session may fail to close , if they haven't been activate and forcefully closed by server
          // in a attempt to preserve resources in the case of a DOS attack for instance.
          if (err) {
            debugLog(' failing to close session ' + session.authenticationToken.toString());
          }
          next();
        });
      },
      (err: Error) => {
        // istanbul ignore next
        if (this._sessions.length > 0) {
          console.log(
            this._sessions
              .map(function (s) {
                return s.authenticationToken.toString();
              })
              .join(' ')
          );
        }

        assert(this._sessions.length === 0, ' failed to disconnect exiting sessions ');
        callback(err);
      }
    );
  }
  /**
   * @method getEndpoints
   * @async
   * @async
   *
   * @param [options]
   * @param [options.endpointUrl] {String} the network address that the Client used to access the Discovery Endpoint .
   * @param [options.localeIds} {Array<LocaleId>}  List of locales to use.
   * @param [options.profileUris} {Array<String>}  List of transport profiles that the returned Endpoints shall support.
   * @param callback {(err: Error, endpoints?: EndpointDescription[]) => void}
   * @param callback.err {Error|null}
   * @param callback.serverEndpoints {Array<EndpointDescription>} the array of endpoint descriptions
   *
   */
  public getEndpoints(
    options: IGetEndpointsRequest | null,
    callback: (err: Error, endpoints?: EndpointDescription[]) => void
  ): void {
    if (!options) {
      options = {};
    }

    assert('function' === typeof callback);

    //  options.endpointUrl = options.hasOwnProperty("endpointUrl") ? options.endpointUrl : this._endpointUrl;
    options.localeIds = options.localeIds || [];
    options.profileUris = options.profileUris || [];

    const request = new GetEndpointsRequest({
      endpointUrl: options.endpointUrl || this.endpointUrl,
      localeIds: options.localeIds,
      profileUris: options.profileUris,
      requestHeader: new RequestHeader({
        auditEntryId: null,
      }),
    });

    this.performMessageTransaction(request, (err, response) => {
      this._server_endpoints = null;
      if (!err) {
        assert(response instanceof GetEndpointsResponse);
        this._server_endpoints = response.endpoints;
      }
      callback(err, this._server_endpoints);
    });
  }
  public getEndpointsP(options: IGetEndpointsRequest | null): Promise<EndpointDescription[]> {
    return new Promise((res, rej) => {
      this.getEndpoints(options, (err, eps) => {
        if (err) {
          rej(err);
        } else {
          res(eps);
        }
      });
    });
  }

  // override me !
  protected _on_connection_reestablished(callback: ErrorCallback) {
    callback();
  }

  protected _addSession(session: ClientSession) {
    assert(!session.client || session.client === this);
    assert(this._sessions.indexOf(session) < 0, 'session already added');
    session.client = this;
    this._sessions.push(session);

    if (this.keepSessionAlive) {
      session.startKeepAliveManager();
    }
  }

  protected _removeSession(session: ClientSession) {
    const index = this._sessions.indexOf(session);
    if (index >= 0) {
      this._sessions.splice(index, 1);
      assert(this._sessions.indexOf(session) < 0);
      assert(session.client === this);
      session.client = null;
    }
    assert(this._sessions.indexOf(session) < 0);
  }

  /**
   *
   * return the endpoint information matching the specified url , security mode and security policy.
   * @method findEndpoint
   * @return {EndPoint}
   */
  public findEndpoint(
    endpointUrl: string,
    securityMode: MessageSecurityMode,
    securityPolicy: string
  ) {
    assert(this.knowsServerEndpoint, 'Server end point are not known yet');
    return this._server_endpoints.find(function (endpoint) {
      return (
        endpoint.endpointUrl === endpointUrl &&
        endpoint.securityMode === securityMode &&
        endpoint.securityPolicyUri === securityPolicy
      );
    });
  }

  public toString(): string {
    let str = '';
    str += '  defaultSecureTokenLifetime.... ' + this.defaultSecureTokenLifetime;
    str += '  securityMode.................. ' + this.securityMode.toString();
    str += '  securityPolicy................ ' + this.securityPolicy.toString();
    // xx this.serverCertificate = options.serverCertificate || null;
    str += '  keepSessionAlive.............. ' + this.keepSessionAlive;
    str += '  bytesRead..................... ' + this.bytesRead;
    str += '  bytesWritten.................. ' + this.bytesWritten;
    str += '  transactionsPerformed......... ' + this.transactionsPerformed;
    str += '  timedOutRequestCount.......... ' + this.timedOutRequestCount;
    str += '  connectionStrategy.';
    str += '        .maxRetry............... ' + this.connectionStrategy.maxRetry;
    str += '        .initialDelay........... ' + this.connectionStrategy.initialDelay;
    str += '        .maxDelay............... ' + this.connectionStrategy.maxDelay;
    str += '        .randomisationFactor.... ' + this.connectionStrategy.randomisationFactor;
    str += '  keepSessionAlive.............. ' + this.keepSessionAlive;

    // console.log(str);

    return str;
  }

  protected _destroy_secure_channel() {
    if (this._secureChannel) {
      if (doDebug) {
        debugLog(' DESTROYING SECURE CHANNEL ' + this._secureChannel.isTransactionInProgress());
      }

      // keep accumulated statistics
      this._byteWritten += this._secureChannel.bytesWritten;
      this._byteRead += this._secureChannel.bytesRead;
      this._transactionsPerformed += this._secureChannel.transactionsPerformed;
      this._timedOutRequestCount += this._secureChannel.timedOutRequestCount;

      this._secureChannel.dispose();

      this._secureChannel.removeAllListeners();
      this._secureChannel = null;
      if (doDebug) {
        debugLog('byteWritten  = ' + this._byteWritten);
        debugLog('byteRead     = ' + this._byteRead);
      }
    }
  }

  private static __findEndpoint(
    endpointUrl: string,
    params: OPCUAClientOptions,
    callback: ResponseCallback<{
      selectedEndpoint: endpoints_service.EndpointDescription;
      endpoints: endpoints_service.EndpointDescription[];
    }>
  ) {
    const securityMode = params.securityMode;
    const securityPolicy = params.securityPolicy;

    const options = {
      connectionStrategy: params.connectionStrategy,
      endpoint_must_exist: false,
      certificateFile: params.certificateFile,
      privateKeyFile: params.privateKeyFile,
      applicationName: params.applicationName,
    };

    const client = new OPCUAClientBase(options);

    let selected_endpoint: endpoints_service.EndpointDescription = null;
    let all_endpoints: endpoints_service.EndpointDescription[] = null;
    const tasks = [
      function (cb: ErrorCallback) {
        client.on('backoff', function () {
          console.log('finding Endpoint => reconnecting ');
        });
        client.connect(endpointUrl, function (err) {
          if (err) {
            console.log(
              'Fail to connect to server ',
              endpointUrl,
              ' to collect certificate server'
            );
          }
          return cb(err);
        });
      },
      function (cb: ErrorCallback) {
        client.getEndpoints(null, (err, endpoints) => {
          all_endpoints = endpoints;
          if (!err) {
            endpoints.forEach(function (endpoint) {
              if (
                endpoint.securityMode === securityMode &&
                endpoint.securityPolicyUri === securityPolicy
              ) {
                selected_endpoint = endpoint; // found it
              }
            });
          }
          cb(err);
        });
      },
      function (cb: ErrorCallback) {
        client.disconnect(cb);
      },
    ];

    async_series(tasks, function (err: Error) {
      if (err) {
        return callback(err);
      }
      if (!selected_endpoint) {
        callback(
          new Error(
            ' Cannot find an Endpoint matching ' +
              ' security mode: ' +
              securityMode.toString() +
              ' policy: ' +
              securityPolicy.toString()
          )
        );
      }

      const result = {
        selectedEndpoint: selected_endpoint,
        endpoints: all_endpoints,
      };
      callback(null, result);
    });
  }

  protected _cancel_reconnection(callback: ErrorCallback) {
    // istanbul ignore next
    if (!this._secureChannel) {
      return callback(null); // nothing to do
    }
    this._secureChannel.abortConnection(() => {
      this._secureChannel = null;
      callback();
    });
  }

  protected _recreate_secure_channel(callback: ErrorCallback) {
    debugLog('_recreate_secure_channel...');

    assert('function' === typeof callback);

    if (!this.knowsServerEndpoint) {
      console.log('Cannot reconnect , server endpoint is unknown');
      return callback(new Error('Cannot reconnect, server endpoint is unknown'));
    }
    assert(this.knowsServerEndpoint);

    assert(!this.isReconnecting);

    /**
     * notifies the observer that the OPCUA is now trying to reestablish the connection
     * after having received a connection break...
     * @event start_reconnection
     *
     */
    this.emit('start_reconnection'); // send after callback

    // create a secure channel
    // a new secure channel must be established
    window.setImmediate(() => {
      this._destroy_secure_channel();

      assert(!this._secureChannel);

      this._internal_create_secure_channel((err) => {
        if (err) {
          debugLog('OPCUAClientBase: cannot reconnect ..');
        } else {
          assert(this._secureChannel);
          // a new channel has be created and a new connection is established
          debugLog('OPCUAClientBase:  RECONNECTED                                       !!!');
        }

        callback(err);

        /**
         * notify the observers that the reconnection process has been completed
         * @event after_reconnection
         * @param err
         */
        this.emit('after_reconnection', err); // send after callback
      });
    });
  }

  protected _internal_create_secure_channel(callback: ResponseCallback<ClientSecureChannelLayer>) {
    let secureChannel: ClientSecureChannelLayer;
    assert(this._secureChannel === null);
    assert(typeof this._endpointUrl === 'string' || <any>this._endpointUrl instanceof String);

    async_series(
      [
        // ------------------------------------------------- STEP 2 : OpenSecureChannel
        (_inner_callback: ErrorCallback) => {
          secureChannel = new ClientSecureChannelLayer({
            encoding: this.encoding,
            defaultSecureTokenLifeTime: this.defaultSecureTokenLifetime,
            securityMode: this.securityMode,
            securityPolicy: this.securityPolicy,
            serverCertificate: this.serverCertificate,
            parent: this,
            //      objectFactory: this.objectFactory,
            connectionStrategy: this.connectionStrategy,
            tokenRenewalInterval: this.tokenRenewalInterval,
          });

          this._secureChannel = secureChannel;

          secureChannel.protocolVersion = this.protocolVersion;

          secureChannel.create(this._endpointUrl, (err) => {
            if (err) {
              debugLog('Cannot create secureChannel' + (err.message ? err.message : ''));
              this._destroy_secure_channel();
            } else {
              if (!this._secureChannel) {
                console.log('_secureChannel has been closed during the transaction !');
                this._destroy_secure_channel();
                return _inner_callback(new Error('Secure Channel Closed'));
              }
              OPCUAClientBase._install_secure_channel_event_handlers(this, secureChannel);
            }
            _inner_callback(err);
          });

          secureChannel.on('backoff', (number, delay) => {
            this.emit('backoff', number, delay);
          });

          secureChannel.on('abort', () => {
            this.emit('abort');
          });
        },
        // ------------------------------------------------- STEP 3 : GetEndpointsRequest
        (_inner_callback: ErrorCallback) => {
          if (!this.knowsServerEndpoint) {
            assert(this._secureChannel !== null);
            this.getEndpoints(null, (err /*, endpoints*/) => {
              _inner_callback(err);
            });
          } else {
            // end points are already known
            _inner_callback(null);
          }
        },
      ],
      (err: Error) => {
        if (err) {
          // xx this.disconnect(function () {
          // xx });
          this._secureChannel = null;
          callback(err);
        } else {
          callback(err, secureChannel);
        }
      }
    );
  }

  private static _install_secure_channel_event_handlers(
    client: OPCUAClientBase,
    secureChannel: ClientSecureChannelLayer
  ) {
    assert(client instanceof OPCUAClientBase);

    secureChannel.on('send_chunk', (message_chunk) => {
      /**
       * notify the observer that a message_chunk has been sent
       * @event send_chunk
       * @param message_chunk
       */
      client.emit('send_chunk', message_chunk);
    });

    secureChannel.on('receive_chunk', (message_chunk) => {
      /**
       * notify the observer that a message_chunk has been received
       * @event receive_chunk
       * @param message_chunk
       */
      client.emit('receive_chunk', message_chunk);
    });

    secureChannel.on('send_request', (message) => {
      /**
       * notify the observer that a request has been sent to the server.
       * @event send_request
       * @param message
       */
      client.emit('send_request', message);
    });

    secureChannel.on('receive_response', (message) => {
      /**
       * notify the observer that a response has been received from the server.
       * @event receive_response
       * @param message
       */
      client.emit('receive_response', message);
    });

    secureChannel.on('lifetime_75', (token) => {
      // secureChannel requests a new token
      debugLog(
        'SecureChannel Security Token ' +
          token.tokenId +
          " is about to expired , it's time to request a new token"
      );
      // forward message to upper level
      client.emit('lifetime_75', token);
    });

    secureChannel.on('security_token_renewed', () => {
      // forward message to upper level
      client.emit('security_token_renewed');
    });

    secureChannel.on('close', (err) => {
      debugLog(' OPCUAClientBase emitting close' + err);

      if (!err || !client.reconnectOnFailure) {
        // this is a normal close operation initiated byu
        /**
         * @event close
         * @param error {Error}
         */
        client.emit('close', err);
        window.setImmediate(() => {
          client._destroy_secure_channel();
        });
        return;
      } else {
        client.emit('connection_lost');
        debugLog('recreating new secure channel ');
        window.setImmediate(() =>
          client._recreate_secure_channel((err) => {
            debugLog(
              'secureChannel#on(close) => _recreate_secure_channel returns ' +
                (err ? err.message : 'OK')
            );
            if (err) {
              // xx assert(!this._secureChannel);
              debugLog('_recreate_secure_channel has failed');
              // xx this.emit("close", err1);
              return;
            } else {
              /**
               * @event connection_reestablished
               *        send when the connection is reestablished after a connection break
               */
              client.emit('connection_reestablished');

              // now delegate to upper class the
              if (client._on_connection_reestablished) {
                assert('function' === typeof client._on_connection_reestablished);
                client._on_connection_reestablished((err) => {
                  if (err) {
                    debugLog('connection_reestablished has failed');
                    client.disconnect(() => {
                      // xx callback(err);
                    });
                  }
                });
              }
            }
          })
        );
      }
      // xx console.log("xxxx OPCUAClientBase emitting close".yellow.bold,err);
    });

    secureChannel.on('timed_out_request', (request) => {
      /**
       * send when a request has timed out without receiving a response
       * @event timed_out_request
       * @param request
       */
      client.emit('timed_out_request', request);
    });
    //            client._secureChannel.on("end", (err) => {
    //                console.log("xxx OPCUAClientBase emitting end".yellow.bold,err);
    //                client.emit("close", err);
    //            });
  }

  public getClientNonce() {
    return this._secureChannel.clientNonce;
  }

  public getPrivateKey() {
    return this.secureObject.getPrivateKey();
  }

  public getCertificate() {
    return this.secureObject.getCertificate();
  }

  public getCertificateChain() {
    return this.secureObject.getCertificateChain();
  }

  /**
   *
   * return the endpoint information matching  security mode and security policy.
   * @method findEndpoint
   * @return {EndPoint}
   */
  public findEndpointForSecurity(
    securityMode: MessageSecurityMode,
    securityPolicy: SecurityPolicy
  ) {
    assert(this.knowsServerEndpoint, 'Server end point are not known yet');
    return this._server_endpoints.find((endpoint) => {
      return (
        endpoint.securityMode === securityMode && endpoint.securityPolicyUri === securityPolicy
      );
    });
  }
}
