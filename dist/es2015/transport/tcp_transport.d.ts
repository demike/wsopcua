/**
 * @module opcua.transport
 */
import { EventEmitter } from 'eventemitter3';
export declare function setFakeTransport(socket_like_mock: any): void;
export declare function getFakeTransport(): {
    invalid: boolean;
};
/**
 * TCP_transport
 *
 * @class TCP_transport
 * @constructor
 * @extends EventEmitter
 */
export declare class TCP_transport extends EventEmitter {
    packetAssembler: any;
    name: string;
    _timerId: any;
    protected _socket: any;
    timeout: number;
    headerSize: number;
    _protocolVersion: number;
    bytesRead: number;
    bytesWritten: number;
    chunkReadCount: number;
    chunkWrittenCount: number;
    protected __disconnecting__: boolean;
    protected _on_socket_closed_called: boolean;
    protected _on_socket_ended_called: boolean;
    protected _pending_buffer: any;
    protected _the_callback: any;
    readonly disconnecting: boolean;
    constructor();
    /**
     * ```createChunk``` is used to construct a pre-allocated chunk to store up to ```length``` bytes of data.
     * The created chunk includes a prepended header for ```chunk_type``` of size ```self.headerSize```.
     *
     * @method createChunk
     * @param msg_type
     * @param chunk_type {String} chunk type. should be 'F' 'C' or 'A'
     * @param length
     * @return {ArrayBuffer} a buffer object with the required length representing the chunk.
     *
     * Note:
     *  - only one chunk can be created at a time.
     *  - a created chunk should be committed using the ```write``` method before an other one is created.
     */
    createChunk(msg_type: any, chunk_type: string, length: any): ArrayBuffer;
    protected _write_chunk(message_chunk: any): void;
    /**
     * write the message_chunk on the socket.
     * @method write
     * @param message_chunk {ArrayBuffer}
     *
     * Notes:
     *  - the message chunk must have been created by ```createChunk```.
     *  - once a message chunk has been written, it is possible to call ```createChunk``` again.
     *
     */
    write(message_chunk: ArrayBuffer): void;
    protected _fulfill_pending_promises(err: any, data: any): boolean;
    protected _on_message_received(message_chunk: any): void;
    protected _cleanup_timers(): void;
    protected _start_timeout_timer(): void;
    on_socket_closed(err: any): void;
    on_socket_ended(err: any): void;
    protected _on_socket_ended_message: (err: any) => void;
    /**
     * @method _install_socket
     * @param socket {Socket}
     * @protected
     */
    protected _install_socket(socket: any): void;
    /**
     * @method _install_one_time_message_receiver
     *
     * install a one time message receiver callback
     *
     * Rules:
     * * TCP_transport will not emit the ```message``` event, while the "one time message receiver" is in operation.
     * * the TCP_transport will wait for the next complete message chunk and call the provided callback func
     *   ```callback(null,messageChunk);```
     * * if a messageChunk is not received within ```TCP_transport.timeout``` or if the underlying socket reports an error,
     *    the callback function will be called with an Error.
     *
     * @param callback {Function} the callback function
     * @param callback.err {null|Error}
     * @param callback.messageChunk {Buffer|null}
     * @protected
     */
    protected _install_one_time_message_receiver(callback: any): void;
    /**
     * disconnect the TCP layer and close the underlying socket.
     * The ```"close"``` event will be emitted to the observers with err=null.
     *
     * @method disconnect
     * @async
     * @param callback
     */
    disconnect(callback: any): void;
    isValid(): boolean;
}
