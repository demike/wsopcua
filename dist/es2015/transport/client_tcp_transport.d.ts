import { TCP_transport } from './tcp_transport';
/**
 * a ClientTCP_transport connects to a remote server socket and
 * initiates a communication with a HEL/ACK transaction.
 * It negociates the communication parameters with the other end.
 *
 * @class ClientTCP_transport
 * @extends TCP_transport
 * @constructor
 *
 *
 *
 * @example
 *
 *    ```javascript
 *    var transport = ClientTCP_transport(url);
 *
 *    transport.timeout = 1000;
 *
 *    transport.connect(function(err)) {
 *         if (err) {
 *            // cannot connect
 *         } else {
 *            // connected
 *
 *         }
 *    });
 *    ....
 *
 *    transport.write(message_chunk,'F');
 *
 *    ....
 *
 *    transport.on("message",function(message_chunk) {
 *        // do something with message from server...
 *    });
 *
 *
 *    ```
 *
 *
 */
export declare class ClientTCP_transport extends TCP_transport {
    numberOfRetry: number;
    _connected: boolean;
    serverUri: string;
    endpointUrl: string;
    _protocolVersion: number;
    _parameters: any;
    protocolVersion: number;
    readonly connected: boolean;
    readonly parameters: any;
    constructor();
    on_socket_ended(err: any): void;
    /**
     * @method connect
     * @async
     * @param endpointUrl {String}
     * @param callback {Function} the callback function
     * @param [options={}]
     */
    connect(endpointUrl: string, callback: Function, options?: any): any;
    protected _handle_ACK_response(message_chunk: any, callback: any): void;
    protected _send_HELLO_request(): void;
    protected _perform_HEL_ACK_transaction(callback: any): void;
}
