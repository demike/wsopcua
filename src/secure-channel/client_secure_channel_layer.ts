'use strict';

import { assert } from '../assert';
import { EventEmitter } from '../eventemitter';
import { DataStream } from '../basic-types/DataStream';
import { MessageSecurityMode } from '../service-secure-channel';
import {
  SecurityPolicy,
  getCryptoFactory,
  toUri,
  getOptionsForSymmetricSignAndEncrypt,
  computeDerivedKeys,
} from './security_policy';
import { MessageBuilder } from './message_builder';
import {
  OPCUAClientBase,
  ErrorCallback,
  ResponseCallback,
  OpcUaResponse,
} from '../client/client_base';

import * as log from 'loglevel';
import { doDebug, debugLog, hexDump } from '../common/debug';
import { StatusCodes } from '../constants/raw_status_codes';

/* global Buffer*/
/**
 * @module opcua.client
 */
const crypto: Crypto = window.crypto || (<any>window).msCrypto;

import * as utils from '../utils';
const get_clock_tick = utils.get_clock_tick;

import { readMessageHeader } from '../chunkmanager';

import * as backoff from '../backoff';

import { messageHeaderToString } from './message_header_to_string';
import { MessageChunker } from './message_chunker';
import * as secure_channel_service from '../service-secure-channel';
import { ChannelSecurityToken } from '../generated/ChannelSecurityToken';
import { ClientWSTransport } from '../transport/client_ws_transport';
import { IEncodable } from '../factory/factories_baseobject';
import { IRequestHeader } from '../generated/RequestHeader';
import { SecureMessageChunkManagerOptions } from './secure_message_chunk_manager';
import { ISymmetricAlgortihmSecurityHeader } from '../service-secure-channel/SymmetricAlgorithmSecurityHeader';
import { JSONMessageBuilder } from '../transport/json_message_builder';
import { MessageBuilderEvents } from '../transport/message_builder_base';
import { DER, generatePublicKeyFromDER, makeSHA1Thumbprint, rsaKeyLength } from '../crypto';

const OpenSecureChannelRequest = secure_channel_service.OpenSecureChannelRequest;
const CloseSecureChannelRequest = secure_channel_service.CloseSecureChannelRequest;
const OpenSecureChannelResponse = secure_channel_service.OpenSecureChannelResponse;
const AsymmetricAlgorithmSecurityHeader = secure_channel_service.AsymmetricAlgorithmSecurityHeader;
const ServiceFault = secure_channel_service.ServiceFault;
const SecurityTokenRequestType = secure_channel_service.SecurityTokenRequestType;

const doTraceMessage = false;
const doTraceStatistics = false;

let g_channelId = 0;
const defaultTransactionTimeout = 60 * 1000; // 1 minute

interface ITransactionStats {
  request: any;
  response: any;
  bytesWritten: number;
  bytesRead: number;
  lap_sending_request: number;
  lap_waiting_response: number;
  lap_receiving_response: number;
  lap_processing_response: number;
  lap_transaction: number;
}

interface RequestData {
  request?: IEncodable & { requestHeader: IRequestHeader };
  response?: OpcUaResponse;
  msgType?: string;
  callback?(err: Error | null, response?: OpcUaResponse): void;

  bytesWritten_before?: number;
  bytesWritten_after?: number;

  // record tick0 : before request is being sent to server
  _tick0?: number;
  // record tick1:  after request has been sent to server
  _tick1?: number;
  // record tick2 : after response message has been received, before message processing
  _tick2?: number;
  // record tick3 : after response message has been received, before message processing
  _tick3?: number;
  // record tick4 after callback
  _tick4?: number;
  chunk_count?: number;
  bytesRead?: number;
}

function dump_transaction_statistics(stats: ITransactionStats) {
  function w(str: any) {
    return ('                  ' + str).substr(-12);
  }

  console.log('--------------------------------------------------------------------->> Stats');
  console.log(
    '   request                   : ',
    stats.request.constructor.name.toString(),
    ' / ',
    stats.response.constructor.name.toString(),
    ' - ',
    stats.response.responseHeader.serviceResult.toString()
  );
  console.log('   Bytes Read                : ', w(stats.bytesRead), ' bytes');
  console.log('   Bytes Written             : ', w(stats.bytesWritten), ' bytes');
  console.log(
    '   transaction duration      : ',
    w(stats.lap_transaction.toFixed(3)),
    ' milliseconds'
  );
  console.log(
    '   time to send request      : ',
    w(stats.lap_sending_request.toFixed(3)),
    ' milliseconds'
  );
  console.log(
    '   time waiting for response : ',
    w(stats.lap_waiting_response.toFixed(3)),
    ' milliseconds'
  );
  console.log(
    '   time to receive response  : ',
    w(stats.lap_receiving_response.toFixed(3)),
    ' milliseconds'
  );
  console.log(
    '   time processing response  : ',
    w(stats.lap_processing_response.toFixed(3)),
    ' milliseconds'
  );

  console.log('---------------------------------------------------------------------<< Stats');
}

export interface ConnectionStrategyOptions {
  maxRetry?: number;
  initialDelay?: number;
  maxDelay?: number;
  randomisationFactor?: number;
}

export interface ConnectionStrategy {
  maxRetry: number;
  initialDelay: number;
  maxDelay: number;
  randomisationFactor: number;
}

export function coerceConnectionStrategy(
  options: ConnectionStrategyOptions | null
): ConnectionStrategy {
  options = options || {};

  const maxRetry: number = options.maxRetry === undefined ? 10 : options.maxRetry;
  const initialDelay = options.initialDelay || 10;
  const maxDelay = options.maxDelay || 10000;
  const randomisationFactor =
    options.randomisationFactor === undefined ? 0 : options.randomisationFactor;

  return {
    initialDelay,
    maxDelay,
    maxRetry,
    randomisationFactor,
  };
}

export interface ClientSecureChannelLayerEvents {
  end_transaction: (transaction_stats: ITransactionStats) => void;
  close: ErrorCallback;
  receive_chunk: (message_chunk: DataView) => void;
  abort: () => void;
  lifetime_75: (securityToken: ChannelSecurityToken) => void;
  backoff: (number: number, delay: number) => void;
  security_token_renewed: () => void;
  receive_response: (response: OpcUaResponse) => void;
  timed_out_request: (requestMessage: IEncodable & { requestHeader: IRequestHeader }) => void;
  send_chunk: (messageChunk: ArrayBuffer) => void;
  send_request: (requestMessage: IEncodable & { requestHeader: IRequestHeader }) => void;
}

export interface ClientSecureChannelLayerOptions {
  encoding?: 'opcua+uacp' | 'opcua+uajson'; // default: 'opcua+uacp'
  defaultSecureTokenLifeTime?: number;
  tokenRenewalInterval?: number;
  securityMode?: MessageSecurityMode;
  securityPolicy?: SecurityPolicy;
  serverCertificate?: any;
  parent?: OPCUAClientBase;
  factory?: any;
  transportTimeout?: number;
  connectionStrategy?: ConnectionStrategyOptions;
}

/**
 * a ClientSecureChannelLayer represents the client side of the OPCUA secure channel.
 * @class ClientSecureChannelLayer
 * @extends EventEmitter
 * @uses MessageChunker
 * @uses MessageBuilder
 * @param options
 * @param {Number} [options.defaultSecureTokenLifeTime=30000 = 30 seconds]
 * @param {Number} [options.tokenRenewalInterval =0]  if 0, security token renewa&l will happen at 75% of defaultSecureTokenLifetime
 * @param [options.securityMode=MessageSecurityMode.NONE]
 * @param [options.securityPolicy=SecurityPolicy.None]
 * @param [options.serverCertificate=null] the serverCertificate (required if securityMode!=None)
 * @param options.parent {OPCUAClientBase} parent
 * @param [options.factory] an factory that provides a method createObjectId(id) for the message builder
 * @param [options.transportTimeout = ClientSecureChannelLayer.defaultTransportTimeout = 10 seconds] the transport timeout interval in ms
 * @param [options.connectionStrategy] {Object}
 * @param [options.connectionStrategy.maxRetry      = 10]
 * @param [options.connectionStrategy.initialDelay  = 10]
 * @param [options.connectionStrategy.maxDelay      = 10000]
 * @constructor
 */
export class ClientSecureChannelLayer
  extends EventEmitter<ClientSecureChannelLayerEvents>
  implements ITransactionStats {
  _receiverPublicKey?: CryptoKey;
  /**
   * true if the secure channel is trying to establish the connection with the server. In this case, the client
   * may be in the middle of the b ackoff connection process.
   *
   * @property isConnecting
   * @type {Boolean}
   *
   */
  public get isConnecting() {
    return !!this.__call;
  }

  get bytesRead() {
    return this._transport ? this._transport.bytesRead : 0;
  }

  get bytesWritten() {
    return this._transport ? this._transport.bytesWritten : 0;
  }

  get transactionsPerformed() {
    return this._lastRequestId;
  }

  get timedOutRequestCount() {
    return this._timedout_request_count;
  }

  get clientNonce() {
    return this._clientNonce;
  }

  get endpointUrl() {
    return this._transport ? this._transport.endpointUrl : '';
  }

  constructor(options: ClientSecureChannelLayerOptions) {
    super();

    this._lastRequestId = 0;
    this.parent = options.parent;
    this._clientNonce = null; // will be created when needed
    this.protocolVersion = 0;

    this.encoding = options.encoding || 'opcua+uacp';

    this.messageChunker = new MessageChunker({});

    this.defaultSecureTokenLifetime = options.defaultSecureTokenLifeTime || 30000;
    this.tokenRenewalInterval = options.tokenRenewalInterval || 0;

    this.securityMode = options.securityMode || MessageSecurityMode.None;

    this.securityPolicy = options.securityPolicy || SecurityPolicy.None;

    this.serverCertificate = options.serverCertificate;

    // assert(this._securityMode !== MessageSecurityMode.Invalid, "invalid security Mode");
    if (this.securityMode !== MessageSecurityMode.None) {
      assert(
        this.serverCertificate,
        'Expecting a valid certificate when security mode is not None'
      );
      assert(
        this.securityPolicy !== SecurityPolicy.None,
        'Security Policy None is not a valid choice'
      );
    }

    this._request_data = new Map();
    if (this.encoding === 'opcua+uacp') {
      this.messageBuilder = new MessageBuilder();
      this.messageBuilder.securityMode = this.securityMode;
      this.messageBuilder.privateKey = this.getPrivateKey();
    } else {
      this.messageBuilder = new JSONMessageBuilder();
    }

    (this.messageBuilder as EventEmitter<MessageBuilderEvents>)
      .on('message', (response: OpcUaResponse, msgType: string, requestId: number) =>
        this._on_message_received(response, msgType, requestId)
      )
      .on('error', (err, requestId) => {
        //
        debugLog('request id = ' + requestId + err);
        let request_data = this._request_data.get(requestId);
        if (doDebug) {
          console.log(' message was ');
          console.log(request_data);
        }
        if (!request_data) {
          request_data = this._request_data.get(requestId + 1);
          if (doDebug) {
            console.log(
              ' message was 2:',
              request_data ? request_data.request.toString() : '<null>'
            );
          }
        }
        // xx console.log(request_data.request.toString());
      });

    this.__in_normal_close_operation = false;
    this._renew_security_token_requested = 0;
    this._timedout_request_count = 0;
    this._securityTokenTimeoutId = null;
    this.transportTimeout =
      options.transportTimeout || ClientSecureChannelLayer.defaultTransportTimeout;
    this.channelId = g_channelId;
    g_channelId += 1;

    options.connectionStrategy = options.connectionStrategy || {};
    this.connectionStrategy = {};
    this.connectionStrategy.maxRetry = utils.isNullOrUndefined(options.connectionStrategy.maxRetry)
      ? 10
      : options.connectionStrategy.maxRetry;
    this.connectionStrategy.initialDelay = options.connectionStrategy.initialDelay || 10;
    this.connectionStrategy.maxDelay = options.connectionStrategy.maxDelay || 10000;

    const r = options.connectionStrategy.randomisationFactor;
    this.connectionStrategy.randomisationFactor = r === undefined ? 0 : r;
  }

  /**
   * @method getPrivateKey
   * @return {Buffer} the privateKey
   */
  public getPrivateKey() {
    return this.parent ? this.parent.getPrivateKey() : null;
  }

  public getCertificateChain() {
    return this.parent ? this.parent.getCertificateChain() : null;
  }

  protected process_request_callback(
    request_data: RequestData,
    err: Error | null,
    response: OpcUaResponse | null
  ) {
    assert('function' === typeof request_data.callback);

    if (!response && !err && request_data.msgType !== 'CLO') {
      // this case happens when CLO is called and when some pending transactions
      // remains in the queue...
      err = new Error(
        ' Connection has been closed by client , but this transaction cannot be honored'
      );
    }
    if (response && response instanceof ServiceFault) {
      response.responseHeader.stringTable = response.responseHeader.stringTable || [];
      response.responseHeader.stringTable = [response.responseHeader.stringTable.join('\n')];
      err = new Error(
        ' serviceResult = ' +
          response.responseHeader.serviceResult?.toString() +
          '  returned by server \n response:' +
          response.toString() +
          '\n  request: ' +
          request_data.request.toString()
      );
      (err as any).response = response;
      (err as any).request = request_data.request;
      response = null;
    }

    assert(request_data.msgType === 'CLO' || (err && !response) || (!err && response));

    const the_callback_func = request_data.callback;
    request_data.callback = null;
    the_callback_func(err, response);
  }

  protected on_transaction_completed(transaction_stats: ITransactionStats) {
    /* istanbul ignore next */
    if (doDebug) {
      // dump some statistics about transaction ( time and sizes )
      dump_transaction_statistics(transaction_stats);
    }
    this.emit('end_transaction', transaction_stats);
  }

  protected _record_transaction_statistics(request_data: RequestData) {
    // ---------------------------------------------------------------------------------------------------------|-
    //      _tick0                _tick1                         _tick2                       _tick3          _tick4
    //          sending request
    //        |---------------------|  waiting response
    //                              |------------------------------|      receiving response
    //                                                             |---------------------------| process.resp
    //                                                                                         |---------------|
    this.last_transaction_stats = {
      request: request_data.request,
      response: request_data.response,
      bytesWritten: request_data.bytesWritten_after - request_data.bytesWritten_before,
      bytesRead: request_data.bytesRead,
      lap_sending_request: request_data._tick1 - request_data._tick0,
      lap_waiting_response: request_data._tick2 - request_data._tick1,
      lap_receiving_response: request_data._tick3 - request_data._tick2,
      lap_processing_response: request_data._tick4 - request_data._tick3,
      lap_transaction: request_data._tick4 - request_data._tick0,
    };

    if (doTraceStatistics) {
      dump_transaction_statistics(this.last_transaction_stats);
    }
  }

  public isTransactionInProgress() {
    return this._request_data.size > 0;
  }

  protected _cancel_pending_transactions(err?: Error) {
    /* jshint validthis: true */

    if (doDebug && this._request_data) {
      debugLog(
        '_cancel_pending_transactions  ' +
          Object.keys(this._request_data) +
          (this._transport ? this._transport.name : 'no transport')
      );
    }

    if (this._request_data) {
      for (const [key, request_data] of this._request_data) {
        debugLog(
          'xxxx Cancelling pending transaction ' +
            key +
            ' ' +
            request_data.msgType +
            request_data.request.constructor.name
        );
        this.process_request_callback(request_data, err, null);
      }
    }

    this._request_data = new Map();
  }

  protected _on_transport_closed(err?: Error) {
    debugLog(' =>ClientSecureChannelLayer#_on_transport_closed  err=', err ? err.message : 'null');

    if (this.__in_normal_close_operation) {
      err = undefined;
    }
    /**
     * notify the observers that the transport connection has ended.
     * The error object is null or undefined if the disconnection was initiated by the ClientSecureChannelLayer.
     * A Error object is provided if the disconnection has been initiated by an external cause.
     *
     * @event close
     * @param error {Error}
     */
    this.emit('close', err);
    this._cancel_pending_transactions(err);

    this._transport = null;
  }

  protected _on_message_received(response: OpcUaResponse, msgType: string, requestId: number) {
    /* jshint validthis: true */

    assert(msgType !== 'ERR');

    /* istanbul ignore next */
    if (doTraceMessage) {
      console.log('xxxxx  <<<<<< _on_message_received ', requestId, response.constructor.name);
    }

    const request_data = this._request_data.get(requestId);
    if (!request_data) {
      console.log('xxxxx  <<<<<< _on_message_received ', requestId, response.constructor.name);
      throw new Error(' =>  invalid requestId =' + requestId);
    }

    log.debug(' Deleting this._request_data', requestId);
    this._request_data.delete(requestId);

    /* istanbul ignore next */
    if (
      response.responseHeader.requestHandle !== request_data.request.requestHeader.requestHandle
    ) {
      const expected = request_data.request.requestHeader.requestHandle;
      const actual = response.responseHeader.requestHandle;
      const moreinfo = 'Class = ' + response.constructor.name;
      console.log(
        ' WARNING SERVER responseHeader.requestHandle is invalid' +
          ': expecting 0x' +
          expected.toString(16) +
          '  but got 0x' +
          actual.toString(16) +
          ' ',
        moreinfo
      );
    }

    request_data.response = response;

    /* istanbul ignore next */
    if (doDebug) {
      log.debug(' RESPONSE ');
      log.debug(response.toString());
    }
    // record tick2 : after response message has been received, before message processing
    request_data._tick2 = this.messageBuilder.tick1;
    request_data.bytesRead = this.messageBuilder.total_message_size;

    // record tick3 : after response message has been received, before message processing
    request_data._tick3 = get_clock_tick();
    this.process_request_callback(request_data, null, response);

    // record tick4 after callback
    request_data._tick4 = get_clock_tick();
    // store some statistics
    this._record_transaction_statistics(request_data);

    // notify that transaction is completed
    this.on_transaction_completed(this.last_transaction_stats);
  }

  protected _on_security_token_about_to_expire() {
    debugLog(
      ' client: Security Token ' +
        this._securityToken.tokenId +
        " is about to expired, let's raise lifetime_75 event "
    );

    /**
     * notify the observer that the secure channel has now reach 75% of its allowed live time and
     * that a new token is going to be requested.
     * @event  lifetime_75
     * @param  securityToken {Object} : the security token that is about to expire.
     *
     */
    this.emit('lifetime_75', this._securityToken);

    this._renew_security_token();
  }

  protected _cancel_security_token_watchdog() {
    if (this._securityTokenTimeoutId) {
      clearTimeout(this._securityTokenTimeoutId);
      this._securityTokenTimeoutId = null;
    }
  }

  protected _install_security_token_watchdog() {
    //
    // install timer event to raise a 'lifetime_75' when security token is about to expired
    // so that client can request for a new security token
    //
    const lifeTime = this._securityToken.revisedLifetime;
    assert(lifeTime !== 0 && lifeTime > 20);

    let timeout = this.tokenRenewalInterval || (lifeTime * 75) / 100;
    timeout = Math.min(timeout, (lifeTime * 75) / 100);
    if (doDebug) {
      debugLog(
        ' time until next security token renewal = ' + timeout + '( lifefime = ' + lifeTime + ')'
      );
    }

    assert(this._securityTokenTimeoutId === null);
    this._securityTokenTimeoutId = window.setTimeout(() => {
      this._securityTokenTimeoutId = null;
      this._on_security_token_about_to_expire();
    }, timeout);
  }

  protected _build_client_nonce() {
    if (this.securityMode === MessageSecurityMode.None) {
      return null;
    }
    // create a client Nonce if secure mode is requested
    // Release 1.02 page 23 OPC Unified Architecture, Part 4 Table 7 – OpenSecureChannel Service Parameters
    // clientNonce
    // "This parameter shall have a length equal to key size used for the symmetric
    //  encryption algorithm that is identified by the securityPolicyUri"

    const cryptoFactory = getCryptoFactory(this.securityPolicy);
    if (!cryptoFactory) {
      // this securityPolicy may not be support yet ... let's return null
      return null;
    }
    assert(typeof cryptoFactory === 'object');
    const arr = new Uint8Array(cryptoFactory.symmetricKeyLength);
    crypto.getRandomValues(arr);
    return arr;
  }

  protected _open_secure_channel_request(is_initial: boolean, callback: ErrorCallback) {
    assert(this.securityMode !== MessageSecurityMode.Invalid, 'invalid security mode');
    // from the specs:
    // The OpenSecureChannel Messages are not signed or encrypted if the SecurityMode is None. The
    // Nonces are ignored and should be set to null. The SecureChannelId and the TokenId are still
    // assigned but no security is applied to Messages exchanged via the channel.

    const msgType = 'OPN';
    const requestType = is_initial
      ? SecurityTokenRequestType.Issue
      : SecurityTokenRequestType.Renew;

    this._clientNonce = this._build_client_nonce();

    this._isOpened = !is_initial;

    // OpenSecureChannel
    const msg = new OpenSecureChannelRequest({
      clientProtocolVersion: this.protocolVersion,
      requestType: requestType,
      securityMode: this.securityMode,
      requestHeader: new secure_channel_service.RequestHeader({
        /* auditEntryId: undefined, */
      }),
      clientNonce: this._clientNonce || undefined, //
      requestedLifetime: this.defaultSecureTokenLifetime,
    });

    this._performMessageTransaction(
      msgType,
      msg,
      async (error, response: secure_channel_service.OpenSecureChannelResponse) => {
        if (response && response.responseHeader.serviceResult !== StatusCodes.Good) {
          error = new Error(response.responseHeader.serviceResult.toString());
        }
        if (!error) {
          /* istanbul ignore next */
          if (false && doDebug) {
            debugLog(response.toString());
          }
          assert(response instanceof OpenSecureChannelResponse);
          // xx assert(!is_initial || this._securityToken.secureChannelId === response._securityToken.secureChannelId);

          // todo : verify that server certificate is  valid
          // A self-signed application instance certificate does not need to be verified with a CA.
          // todo : verify that Certificate URI matches the ApplicationURI of the server

          this._securityToken = response.securityToken;
          assert(
            this._securityToken.tokenId > 0 || msgType === 'OPN',
            '_sendSecureOpcUARequest: invalid token Id '
          );
          assert(response.hasOwnProperty('serverNonce'));

          this._serverNonce = response.serverNonce;

          if (this.securityMode !== MessageSecurityMode.None) {
            // verify that server nonce if provided is at least 32 bytes long

            /* istanbul ignore next */
            if (!this._serverNonce) {
              console.log(' client : server nonce is invalid !');
              return callback(new Error(' Invalid server nonce'));
            }
            // This parameter shall have a length equal to key size used for the symmetric
            // encryption algorithm that is identified by the securityPolicyUri.
            if (this._serverNonce.length !== this._clientNonce.length) {
              console.log(' client : server nonce is invalid !');
              return callback(new Error(' Invalid server nonce length'));
            }
          }

          const cryptoFactory = (this.messageBuilder as MessageBuilder).cryptoFactory;
          if (cryptoFactory) {
            assert(this._serverNonce instanceof Uint8Array);
            this._derivedKeys = await computeDerivedKeys(
              cryptoFactory,
              this._serverNonce,
              this._clientNonce
            );
          }

          const derivedServerKeys = this._derivedKeys ? this._derivedKeys.derivedServerKeys : null;
          (this.messageBuilder as MessageBuilder).pushNewToken(
            this._securityToken,
            derivedServerKeys
          );

          this._install_security_token_watchdog();
          this._isOpened = true;
        }
        callback(error);
      }
    );
  }

  protected _on_connection(transport: ClientWSTransport, callback: ErrorCallback, err?: Error) {
    /* jshint validthis: true */

    /* istanbul ignore next */
    if (err) {
      debugLog('cannot connect to server');
      callback(err);
    } else {
      this._transport = transport;

      this._transport.on('message', (message_chunk: DataView | string) => {
        if (typeof message_chunk !== 'string') {
          /**
           * notify the observers that ClientSecureChannelLayer has received a message chunk
           * @event receive_chunk
           * @param message_chunk {Buffer}
           */
          this.emit('receive_chunk', message_chunk);
          this._on_receive_message_chunk(message_chunk);
        } else {
          this._on_receive_json_message(message_chunk);
        }
      });

      this._transport.on('close', (err1) => this._on_transport_closed(err1));

      this._transport.on('connection_break', () => {
        debugLog('Client => CONNECTION BREAK  <=');
        this._on_transport_closed(new Error('Connection Break'));
      });

      this._transport.on('error', function (err1) {
        debugLog(' ERROR', err1);
      });

      if (this.encoding === 'opcua+uajson') {
        // no need to issue an open secure channel request
        this._isOpened = true;
        callback();
        return;
      }

      const is_initial = true;
      this._open_secure_channel_request(is_initial, callback);
    }
  }

  /**
   * establish a secure channel with the provided server end point.
   *
   * @method create
   * @async
   * @param endpoint_url {String}
   * @param callback {Function}  the async callback function
   * @param callback.err {Error|null}
   *
   *
   * @example
   *
   *    ```javascript
   *
   *    var secureChannel  = new ClientSecureChannelLayer();
   *
   *    secureChannel.on("end", function(err) {
   *         console.log("secure channel has ended",err);
   *         if(err) {
   *            console.log(" the connection was closed by an external cause such as server shutdown");
   *        }
   *    });
   *    secureChannel.create("opc.tcp://localhost:1234/UA/Sample", function(err) {
   *         if(err) {
   *              console.log(" cannot establish secure channel" , err);
   *         } else {
   *              console.log("secure channel has been established");
   *         }
   *    });
   *
   *    ```
   */
  public create(endpoint_url: string, callback: ErrorCallback) {
    assert('function' === typeof callback);

    if (this.securityMode !== MessageSecurityMode.None) {
      if (!this.serverCertificate) {
        return callback(
          new Error(
            'ClientSecureChannelLayer#create : expecting a  server certificate when securityMode is not NONE'
          )
        );
      }

      // take the opportunity of this async method to perform some async pre-processing

      if (!this._receiverPublicKey) {
        const cryptoFactory = getCryptoFactory(this.securityPolicy);
        cryptoFactory.generatePublicKeyFromDER(this.serverCertificate).then(
          (publicKey) => {
            this._receiverPublicKey = publicKey;
            assert(this._receiverPublicKey); // make sure we wont go into infinite recursion calling create again.
            this.create(endpoint_url, callback);
          },
          (err: Error) => {
            return callback(err);
          }
        );
        return;
      }
      assert(this._receiverPublicKey instanceof CryptoKey);
    }

    const transp = new ClientWSTransport(this.encoding);
    transp.timeout = this.transportTimeout;
    transp.protocolVersion = this.protocolVersion;

    // -------------------------------------------------------------------------
    // Handle reconnection
    // --------------------------------------------------------------------------
    const _establish_connection = (
      transport: ClientWSTransport,
      endpointUrl: string,
      cb: ErrorCallback
    ) => {
      let last_err: Error = null;

      const _connect = (_i_callback: ErrorCallback) => {
        if (this.__call && (this.__call as any)._cancelBackoff) {
          return;
        }

        transport.connect(endpointUrl, (err?: Error) => {
          // force Backoff to fail if err is not ECONNRESET or ECONNREFUSE
          // this mean that the connection to the server has succeeded but for some reason
          // the server has denied the connection
          // the cause could be:
          //   - invalid protocol version specified by client
          //   - server going to shutdown
          //   - server too busy -
          //   - server shielding itself from a DOS attack
          if (err) {
            debugLog('connection error', err);
            let should_abort = false;

            if (err.message.match(/ECONNRESET/)) {
              should_abort = true;
            }
            if (err.message.match(/BadProtocolVersionUnsupported/)) {
              should_abort = true;
            }
            last_err = err;

            if (this.__call) {
              // connection cannot be establish ? if not, abort the backoff process
              if (should_abort) {
                debugLog(' Aborting backoff process prematurally - err = ' + err.message);
                this.__call.abort();
              } else {
                debugLog(' backoff - keep trying - err = ' + err.message);
              }
            }
          }
          _i_callback(err);
        });
      };

      // No backoff required -> call the _connect function directly
      if (this.connectionStrategy.maxRetry <= 0) {
        this.__call = null;
        return _connect(cb);
      }

      const _backoff_completion = (err: Error) => {
        if (this.__call) {
          // console log =
          transport.numberOfRetry = transport.numberOfRetry || 0;
          transport.numberOfRetry += this.__call.getNumRetries();
          this.__call.removeAllListeners();
          this.__call = null;

          if (err) {
            cb(last_err || err);
          } else {
            cb();
          }
        }
      };

      this.__call = backoff.call(_connect, _backoff_completion);

      // xx this.__call._cancelBackoff = this.connectionStrategy.maxRetry <=0 ? true : false;
      this.__call.failAfter(Math.max(this.connectionStrategy.maxRetry, 1));

      this.__call.on('backoff', (number: number, delay: number) => {
        debugLog(' Backoff #' + number + 'delay = ' + delay + this.__call.getMaxNumOfRetries());
        // Do something when backoff starts, e.g. show to the
        // user the delay before next reconnection attempt.
        /**
         * @event backoff
         */
        this.emit('backoff', number, delay);
      });

      this.__call.on('abort', () => {
        debugLog(' abort # after ' + this.__call.getNumRetries() + ' retries');
        // Do something when backoff starts, e.g. show to the
        // user the delay before next reconnection attempt.
        /**
         * @event backoff
         */
        this.emit('abort');

        window.setImmediate(function () {
          _backoff_completion(new Error('Connection abandoned'));
        });
      });

      this.__call.setStrategy(new backoff.ExponentialStrategy(this.connectionStrategy));
      this.__call.start();
    };

    _establish_connection(transp, endpoint_url, (connerr) =>
      this._on_connection(transp, callback, connerr)
    );
  }

  public dispose() {
    this._cancel_security_token_watchdog();
    if (this.__call) {
      this.__call.abort();
    }
  }

  public abortConnection(callback: () => void) {
    assert('function' === typeof callback);

    if (this.__call) {
      this.__call.once('abort', function () {
        setTimeout(callback, 20);
      });
      // xx console.log("_cancelBackoff !!!");
      (this.__call as any)._cancelBackoff = true;
      this.__call.abort();
    } else {
      callback();
    }
  }

  protected _renew_security_token() {
    debugLog('ClientSecureChannelLayer#_renew_security_token');

    /* istanbul ignore if */
    if (0 && this.isTransactionInProgress()) {
      this._renew_security_token_requested += 1;
    } else {
      const is_initial = false;
      this._open_secure_channel_request(is_initial, (err) => {
        /* istanbul ignore else */
        if (!err) {
          debugLog(' token renewed');
          /**
           * notify the observers that the security has been renewed
           * @event security_token_renewed
           */
          this.emit('security_token_renewed');
        } else {
          console.error("ClientSecureChannelLayer: Warning: securityToken hasn't been renewed");
        }
      });
      this._renew_security_token_requested = 0;
    }
  }

  protected _on_receive_message_chunk(message_chunk: DataView) {
    /* istanbul ignore next */
    if (doDebug) {
      const _stream = new DataStream(message_chunk);
      const messageHeader = readMessageHeader(_stream);
      debugLog('CLIENT RECEIVED ' + (JSON.stringify(messageHeader) + ''));
      debugLog('\n' + hexDump(message_chunk));
      debugLog(messageHeaderToString(message_chunk));
    }
    (this.messageBuilder as MessageBuilder).feed(message_chunk);
  }

  protected _on_receive_json_message(message: string) {
    if (doDebug) {
      debugLog('CLIENT RECEIVED JSON Message:\n' + message);
    }
    (this.messageBuilder as JSONMessageBuilder).decodeResponse(message);
  }

  /**
   * @method makeRequestId
   * @return {Number} a newly generated request id
   * @private
   */
  public makeRequestId() {
    this._lastRequestId += 1;
    return this._lastRequestId;
  }

  /**
 * perform a OPC-UA message transaction, asynchronously.
 * @method performMessageTransaction
 * @param requestMessage {Object}
 * @param callback  {Function}

 * During a transaction, the client sends a request to the server. The provided callback will be invoked
 * at a later stage with the reply from the server, or the error.
 *
 * preconditions:
 *   - the channel must be opened
 *
 * example
 *
 *    ```javascript
 *    var secure_channel ; // get a  ClientSecureChannelLayer somehow
 *
 *    var message = new BrowseRequest({...});
 *    secure_channel.performMessageTransaction(message,function(err,response) {
 *       if (err) {
 *         // an error has occurred
 *       } else {
 *          assert(response instanceof BrowseResponse);
 *         // do something with response.
 *       }
 *    });
 *    ```
 *
 */
  public performMessageTransaction(requestMessage: any, callback: ResponseCallback<any>) {
    assert('function' === typeof callback);
    this._performMessageTransaction('MSG', requestMessage, callback);
  }

  public isValid() {
    if (!this._transport) {
      return false;
    }
    return this._transport.isValid();
  }
  public isOpened(): boolean {
    return !!this.isValid() && this._isOpened;
  }

  /**
   * internal version of _performMessageTransaction.
   *
   * @method _performMessageTransaction
   * @param msgType {String}
   * @param requestMessage
   * @param callback
   * @private
   *
   * - this method takes a extra parameter : msgType
   * TODO:
   * - this method can be re-entrant, meaning that a new transaction can be started before any pending transaction
   *   is fully completed.
   * - Any error on transport will cause all pending transactions to be cancelled
   *
   * - the method returns a timeout Error if the server fails to return a response within the timeoutHint interval.
   *
   *
   */
  protected _performMessageTransaction(
    msgType: string,
    requestMessage: IEncodable & { requestHeader: IRequestHeader },
    callback: ResponseCallback<any>
  ) {
    /* jshint validthis: true */

    assert('function' === typeof callback);

    if (!this.isValid()) {
      return callback(new Error('ClientSecureChannelLayer => Socket is closed !'));
    }

    let local_callback: ResponseCallback<any> | null = callback;

    let timeout = requestMessage.requestHeader.timeoutHint || defaultTransactionTimeout;
    timeout = Math.max(ClientSecureChannelLayer.minTransactionTimeout, timeout);

    let timerId: number | null = null;

    let hasTimedOut = false;

    const modified_callback = (err?: Error | null, response?: OpcUaResponse) => {
      /* istanbul ignore next */
      if (doDebug) {
        debugLog('------------------- client receiving response');
        if (response) {
          debugLog(response);
        }
      }

      if (!local_callback) {
        return; // already processed by time  out
      }
      // when response === null we are processing the timeout , therefore there is no need to clearTimeout
      if (!hasTimedOut && timerId) {
        window.clearTimeout(timerId);
      }
      timerId = null;

      if (!err && response) {
        /**
         * notify the observers that a server response has been received on the channel
         * @event  receive_response
         * @param response {Object} the response object
         */
        this.emit('receive_response', response);
      }
      assert(!err || err instanceof Error);

      // invoke user callback if it has not been intercepted first ( by a abrupt disconnection for instance )
      try {
        // local_callback.apply(this, [err,response]);
        local_callback(err, response);
      } catch (err) {
        console.log('ERROR !!! , please check here !!!! callback may be called twice !! ', err);
        callback(err);
      } finally {
        local_callback = null;
      }
    };

    timerId = window.setTimeout(() => {
      timerId = null;
      console.log(
        ' Timeout .... waiting for response for ',
        requestMessage.constructor.name,
        requestMessage.requestHeader.toString()
      );

      hasTimedOut = true;
      modified_callback(
        new Error('Transaction has timed out ( timeout = ' + timeout + ' ms)'),
        null
      );

      this._timedout_request_count += 1;
      /**
       * notify the observer that the response from the request has not been
       * received within the timeoutHint specified
       * @event timed_out_request
       * @param message_chunk {Object}  the message chunk
       */
      this.emit('timed_out_request', requestMessage);
    }, timeout);

    const transaction_data = {
      timerId: timerId,
      msgType: msgType,
      request: requestMessage,
      callback: modified_callback,
    };

    // xx    this._pending_callback = callback;

    this._internal_perform_transaction(transaction_data);
  }

  /**
   *
   * @param transaction_data
   * @param transaction_data.msgType
   * @param transaction_data.request
   * @param transaction_data.callback {Function}
   * @private
   */
  protected _internal_perform_transaction(transaction_data: {
    timerId?: number;
    msgType: string;
    request: any;
    callback: ResponseCallback<any>;
  }) {
    assert('function' === typeof transaction_data.callback);

    if (!this._transport) {
      setTimeout(function () {
        transaction_data.callback(new Error('Client not connected'));
      }, 100);
      return;
    }
    assert(this._transport, ' must have a valid transport');

    const msgType = transaction_data.msgType;
    const requestMessage = transaction_data.request;
    assert(msgType.length === 3);

    assert(requestMessage instanceof Object);

    // get a new requestId
    const requestId = this.makeRequestId();

    /* istanbul ignore next */
    if (doTraceMessage) {
      console.log(
        'xxxxx   >>>>>>                     ' + requestId + requestMessage.constructor.name
      );
    }
    this._request_data.set(requestId, {
      request: requestMessage,
      msgType: msgType,
      callback: transaction_data.callback,

      bytesWritten_before: this.bytesWritten,
      bytesWritten_after: 0,

      // record tick0 : before request is being sent to server
      _tick0: get_clock_tick(),
      // record tick1:  after request has been sent to server
      _tick1: 0,
      // record tick2 : after response message has been received, before message processing
      _tick2: 0,
      // record tick3 : after response message has been received, before message processing
      _tick3: 0,
      // record tick4 after callback
      _tick4: 0,
      chunk_count: 0,
    });

    this._sendSecureOpcUARequest(msgType, requestMessage, requestId);
  }

  protected _send_chunk(requestId: number, messageChunk?: ArrayBuffer) {
    const request_data = this._request_data.get(requestId);

    if (messageChunk) {
      /**
       * notify the observer that a message chunk is about to be sent to the server
       * @event send_chunk
       * @param message_chunk {Object}  the message chunk
       */
      this.emit('send_chunk', messageChunk);

      /* istanbul ignore next */
      // if (doDebug && false) {
      //     verify_message_chunk(messageChunk);
      //     debugLog("CLIENT SEND chunk ");
      //     debugLog(messageHeaderToString(messageChunk));
      //     debugLog(hexDump(messageChunk));
      // }
      assert(this._transport);
      this._transport.write(messageChunk);
      request_data.chunk_count += 1;
    } else {
      // last chunk ....

      /* istanbul ignore next */
      if (doDebug) {
        debugLog('CLIENT SEND done.');
      }
      if (request_data) {
        // record tick1: when request has been sent to server
        request_data._tick1 = get_clock_tick();
        request_data.bytesWritten_after = this.bytesWritten;
      }
    }
  }

  protected _send_json(requestId: number) {
    const request_data = this._request_data.get(requestId);

    assert(this._transport);
    this._transport.write(
      (this.messageBuilder as JSONMessageBuilder).encodeRequest(request_data.request)
    );
    request_data.chunk_count += 1;

    if (doDebug) {
      debugLog('CLIENT SEND done.');
    }
    if (request_data) {
      // record tick1: when request has been sent to server
      request_data._tick1 = get_clock_tick();
      request_data.bytesWritten_after = this.bytesWritten;
    }
  }

  protected async _construct_security_header() {
    assert(this.hasOwnProperty('securityMode'));
    assert(this.hasOwnProperty('securityPolicy'));

    this._receiverCertificate = this.serverCertificate;

    let securityHeader = null;
    switch (this.securityMode) {
      case MessageSecurityMode.Sign:
      case MessageSecurityMode.SignAndEncrypt:
        assert(this.securityPolicy !== SecurityPolicy.None);
        // get the thumbprint of the client certificate
        const thumbprint: Uint8Array | null = this._receiverCertificate
          ? new Uint8Array(await makeSHA1Thumbprint(this._receiverCertificate))
          : null;
        securityHeader = new AsymmetricAlgorithmSecurityHeader({
          securityPolicyUri: toUri(this.securityPolicy),
          senderCertificate: this.getCertificateChain(), // (client)certificate of the (client)private key used to sign the message
          receiverCertificateThumbprint: thumbprint, // thumbprint of the public key used to encrypt the message
        });
        break;
      default:
        /* istanbul ignore next */
        assert(false, 'invalid security mode');
    }
    // xx console.log("xxxx security Header",securityHeader.toJSON());
    // xx console.log("xxxx receiverCertificate",this._receiverCertificate.toString("base64").cyan);
    this._securityHeader = securityHeader;
  }

  protected async _get_security_options_for_OPN() {
    if (this.securityMode === MessageSecurityMode.None) {
      return null;
    }

    await this._construct_security_header();
    this.messageChunker.securityHeader = this._securityHeader;

    var senderPrivateKey = this.getPrivateKey();

    if (!senderPrivateKey) {
      throw new Error('invalid senderPrivateKey');
    }

    const cryptoFactory = getCryptoFactory(this.securityPolicy);

    if (!cryptoFactory) {
      return null; // may be a not yet supported security Policy
    }

    assert(cryptoFactory, 'expecting a cryptoFactory');
    assert('function' === typeof cryptoFactory.asymmetricSign);

    const options: Partial<SecureMessageChunkManagerOptions> = {};
    options.signatureLength = rsaKeyLength(
      await senderPrivateKey.getSignKey(
        cryptoFactory.sha1or256,
        cryptoFactory.asymmetricSignatureAlgorithm
      )
    );
    options.signBufferFunc = (chunk) => cryptoFactory.asymmetricSign(chunk, senderPrivateKey);

    if (!this._receiverPublicKey) {
      throw new Error(' invalid receiverPublicKey');
    }
    var keyLength = rsaKeyLength(this._receiverPublicKey);
    options.plainBlockSize = keyLength - cryptoFactory.blockPaddingSize;
    options.cipherBlockSize = keyLength;

    //  if (this.securityMode === MessageSecurityMode.SignAndEncrypt) {
    const receiverPublicKey = this._receiverPublicKey;
    options.encryptBufferFunc = function (chunk) {
      return cryptoFactory.asymmetricEncrypt(chunk, receiverPublicKey);
    };
    //  }

    return options;
  }

  protected _get_security_options_for_MSG() {
    if (this.securityMode === MessageSecurityMode.None) {
      return null;
    }

    if (!this._derivedKeys || !this._derivedKeys.derivedClientKeys) {
      throw new Error('internal error expecting valid derivedKeys');
    }
    var derivedClientKeys = this._derivedKeys.derivedClientKeys;
    assert(derivedClientKeys, 'expecting valid derivedClientKeys');
    return getOptionsForSymmetricSignAndEncrypt(this.securityMode, derivedClientKeys);
  }

  protected async _sendSecureOpcUARequest(
    msgType: string,
    requestMessage: IEncodable & { requestHeader: IRequestHeader },
    requestId: number
  ) {
    const options: SecureMessageChunkManagerOptions & ISymmetricAlgortihmSecurityHeader = {
      requestId,
      secureChannelId: this._securityToken ? this._securityToken.channelId /*.secureChannelId*/ : 0,
      tokenId: this._securityToken ? this._securityToken.tokenId : 0,
      chunkSize: 0,

      cipherBlockSize: 0,
      plainBlockSize: 0,
      sequenceHeaderSize: 0,
      signatureLength: 0,
    };

    // use chunk size that has been negotiated by the transport layer
    if (this._transport.parameters && this._transport.parameters.sendBufferSize) {
      options.chunkSize = this._transport.parameters.sendBufferSize;
    }

    requestMessage.requestHeader.requestHandle = options.requestId;
    // xx requestMessage.requestHeader.returnDiagnostics = 0x3FF;
    requestMessage.requestHeader.returnDiagnostics = 0x0;

    /* istanbul ignore next */
    if (doDebug) {
      debugLog('------------------------------------- Client Sending a request');
      debugLog(' CHANNEL ID ' + options.secureChannelId);
      debugLog(requestMessage);
    }

    var security_options =
      msgType === 'OPN'
        ? await this._get_security_options_for_OPN()
        : await this._get_security_options_for_MSG();
    Object.assign(options, security_options);

    /**
     * notify the observer that a client request is being sent the server
     * @event send_request
     * @param requestMessage {Object}
     */
    this.emit('send_request', requestMessage);

    if (this.encoding === 'opcua+uacp') {
      this.messageChunker.chunkSecureMessage(
        msgType,
        options,
        requestMessage,
        this._send_chunk.bind(this, requestId)
      );
    } else {
      this._send_json(requestId);
    }
  }

  public getDisplayName(): string {
    if (!this.parent) {
      return '';
    }
    return (
      '' +
      (this.parent.applicationName ? this.parent.applicationName + ' ' : '') +
      this.parent.clientName
    );
  }

  public cancelPendingTransactions(callback: () => void) {
    // istanbul ignore next
    if (doDebug) {
      debugLog(
        ' PENDING TRANSACTION = ',
        this.getDisplayName(),
        Array.from(this._request_data.values())
          .map((d) => d.request.constructor.name)
          .join('')
      );
    }

    for (const transaction of this._request_data.values()) {
      // kill timer id
      if (transaction.callback) {
        transaction.callback(
          new Error('Transaction has been canceled because client channel  is beeing closed')
        );
      }
    }
    window.setImmediate(callback);
  }

  /**
   * Close a client SecureChannel ,by sending a CloseSecureChannelRequest to the server.
   *
   *
   * After this call, the connection is closed and no further transaction can be made.
   *
   * @method close
   * @async
   * @param callback {Function}
   */
  public close(callback: ErrorCallback) {
    // what the specs says:
    // --------------------
    //   The client closes the connection by sending a CloseSecureChannelRequest and closing the
    //   socket gracefully. When the server receives this message it shall release all resources
    //   allocated for the channel. The server does not send a CloseSecureChannel response
    //
    // ( Note : some servers do  send a CloseSecureChannel though !)

    assert('function' === typeof callback, 'expecting a callback function, but got ' + callback);

    // cancel any pending transaction
    this.cancelPendingTransactions(() => {
      // what the specs says:
      // --------------------
      //   The client closes the connection by sending a CloseSecureChannelRequest and closing the
      //   socket gracefully. When the server receives this message it shall release all resources
      //   allocated for the channel. The server does not send a CloseSecureChannel response
      //
      // ( Note : some servers do  send a CloseSecureChannel though !)

      // there is no need for the security token expiration event to trigger anymore
      this._cancel_security_token_watchdog();

      debugLog('Sending CloseSecureChannelRequest to server');
      // xx console.log("xxxx Sending CloseSecureChannelRequest to server");
      const request = new CloseSecureChannelRequest();

      this.__in_normal_close_operation = true;

      if (!this._transport || this._transport.disconnecting) {
        this.dispose();
        return callback(new Error('Transport disconnected'));
      }

      assert((this._transport as any)._disconnecting !== undefined);
      (this._transport as any)._disconnecting = true; // avoid throwing a potential websocket 1006 error
      this._performMessageTransaction('CLO', request, () => {
        this.dispose();
        callback();
        // xxx });
      });
    });
  }

  public static defaultTransportTimeout: number = 10 * 1000;
  public static minTransactionTimeout = 30 * 1000; // 30 sec
  public static defaultTransactionTimeout = 60 * 1000; // 1 minute

  public readonly encoding: 'opcua+uacp' | 'opcua+uajson';

  _securityHeader: any;
  _derivedKeys: any;
  _receiverCertificate: DER;
  _serverNonce: any;
  _transport?: ClientWSTransport;
  _isOpened: boolean;
  _securityToken: ChannelSecurityToken;
  protected _lastRequestId: number;
  protected parent?: OPCUAClientBase;
  protected _clientNonce: Uint8Array | null;
  public protocolVersion: number;
  protected messageChunker: MessageChunker;
  public readonly securityMode: MessageSecurityMode;
  protected securityPolicy: SecurityPolicy;
  protected defaultSecureTokenLifetime: number;
  protected tokenRenewalInterval: number;
  protected serverCertificate: DER;
  protected messageBuilder: MessageBuilder | JSONMessageBuilder;

  protected _request_data: Map<number, RequestData>;
  protected __in_normal_close_operation = false;
  protected _renew_security_token_requested = 0;
  protected _timedout_request_count = 0;
  protected _securityTokenTimeoutId: number | null = null;

  // protected _transport :
  protected transportTimeout: number;
  protected channelId: number;
  protected connectionStrategy: any;

  protected __call: backoff.FunctionCall | null;

  // transaction stats
  request: any;
  response: any;
  lap_sending_request: number;
  lap_waiting_response: number;
  lap_receiving_response: number;
  lap_processing_response: number;
  lap_transaction: number;

  last_transaction_stats: ITransactionStats;
}
