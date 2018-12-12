import { EventEmitter } from 'eventemitter3';
import { MessageSecurityMode } from '../service-secure-channel';
import { SecurityPolicy } from './security_policy';
import { MessageBuilder } from './message_builder';
import { OPCUAClientBase } from '../client/client_base';
import { MessageChunker } from "./message_chunker";
import { ChannelSecurityToken } from '../generated/ChannelSecurityToken';
import { ClientWSTransport } from '../transport/client_ws_transport';
export interface ITransactionStats {
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
export declare function dump_transaction_statistics(stats: ITransactionStats): void;
/**
 * a ClientSecureChannelLayer represents the client side of the OPCUA secure channel.
 * @class ClientSecureChannelLayer
 * @extends EventEmitter
 * @uses MessageChunker
 * @uses MessageBuilder
 * @param options
 * @param {Number} [options.defaultSecureTokenLifetime=30000 = 30 seconds]
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
export declare class ClientSecureChannelLayer extends EventEmitter implements ITransactionStats {
    _securityHeader: any;
    _derivedKeys: any;
    _receiverCertificate: string;
    _serverNonce: any;
    _receiverPublicKey(arg0: any): any;
    _transport: ClientWSTransport;
    _isOpened: boolean;
    _securityToken: ChannelSecurityToken;
    protected _lastRequestId: number;
    protected parent: OPCUAClientBase;
    protected _clientNonce: Uint8Array;
    protocolVersion: number;
    protected messageChunker: MessageChunker;
    protected _securityMode: MessageSecurityMode;
    protected securityPolicy: SecurityPolicy;
    protected defaultSecureTokenLifetime: number;
    protected serverCertificate: string;
    protected messageBuilder: MessageBuilder;
    protected _request_data: any;
    protected __in_normal_close_operation: boolean;
    protected _renew_security_token_requested: number;
    protected _timedout_request_count: number;
    protected _securityTokenTimeoutId: any;
    protected transportTimeout: number;
    protected channelId: any;
    protected connectionStrategy: any;
    protected __call: any;
    static defaultTransportTimeout: number;
    static minTransactionTimeout: number;
    static defaultTransactionTimeout: number;
    request: any;
    response: any;
    lap_sending_request: number;
    lap_waiting_response: number;
    lap_receiving_response: number;
    lap_processing_response: number;
    lap_transaction: number;
    last_transaction_stats: ITransactionStats;
    /**
     * true if the secure channel is trying to establish the connection with the server. In this case, the client
     * may be in the middle of the b ackoff connection process.
     *
     * @property isConnecting
     * @type {Boolean}
     *
     */
    readonly isConnecting: boolean;
    readonly bytesRead: number;
    readonly bytesWritten: number;
    readonly securityMode: MessageSecurityMode;
    readonly transactionsPerformed: number;
    readonly timedOutRequestCount: number;
    readonly clientNonce: Uint8Array;
    readonly endpointUrl: string;
    constructor(options: any);
    /**
     * @method getPrivateKey
     * @return {Buffer} the privateKey
     */
    getPrivateKey(): any;
    getCertificateChain(): any;
    protected on_transaction_completed(transaction_stats: ITransactionStats): void;
    protected _record_transaction_statistics(request_data: any): void;
    isTransactionInProgress(): boolean;
    protected _cancel_pending_transactions(err: any): void;
    protected _on_transport_closed(error: any): void;
    protected _on_security_token_about_to_expire(): void;
    protected _cancel_security_token_watchdog(): void;
    protected _install_security_token_watchdog(): void;
    protected _build_client_nonce(): Uint8Array;
    protected _open_secure_channel_request(is_initial: any, callback: any): void;
    protected _on_connection(transport: any, callback: any, err?: any): void;
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
    create(endpoint_url: string, callback: Function): any;
    dispose(): void;
    abortConnection(callback: any): void;
    protected _renew_security_token(): void;
    protected _on_receive_message_chunk(message_chunk: any): void;
    /**
     * @method makeRequestId
     * @return {Number} a newly generated request id
     * @private
     */
    makeRequestId(): number;
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
     * @example
     *
     *    ```javascript
     *    var secure_channel ; // get a  ClientSecureChannelLayer somehow
     *
     *    var message = new BrowseNameRequest({...});
     *    secure_channel.performMessageTransaction(message,function(err,response) {
     *       if (err) {
     *         // an error has occurred
     *       } else {
     *          assert(response instanceof BrowseNameResponse);
     *         // do something with response.
     *       }
     *    });
     *    ```
     *
    
     */
    performMessageTransaction(requestMessage: any, callback: any): void;
    isValid(): boolean;
    isOpened(): boolean;
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
    protected _performMessageTransaction(msgType: any, requestMessage: any, callback: any): any;
    /**
     *
     * @param transaction_data
     * @param transaction_data.msgType
     * @param transaction_data.request
     * @param transaction_data.callback {Function}
     * @private
     */
    protected _internal_perform_transaction(transaction_data: any): void;
    protected _send_chunk(requestId: any, messageChunk?: any): void;
    protected _construct_security_header(): void;
    protected _sendSecureOpcUARequest(msgType: any, requestMessage: any, requestId: any): void;
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
    close(callback: any): any;
}
