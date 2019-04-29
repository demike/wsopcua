'use strict';
/**
 * @module opcua.transport
 */

 // system requires
import {EventEmitter} from 'eventemitter3';
import {assert} from '../assert';

// opcua requires
import {PacketAssembler} from '../packet-assembler/packet_assembler';

import {writeTCPMessageHeader} from './tools';
import {readRawMessageHeader} from './message_builder_base';

import {debugLog, doDebug} from '../common/debug';
import { ResponseCallback } from '../client/client_base';

let fakeSocket = {invalid: true};

export function setFakeTransport(socket_like_mock) {
    fakeSocket = socket_like_mock;
}

export function getFakeTransport() {
    if (fakeSocket.invalid) {
        throw new Error('getFakeTransport: setFakeTransport must be called first  - BadProtocolVersionUnsupported');
    }
    return fakeSocket;
}

let counter = 0;

export type TcpTransportEvents = 'connect'|'message'|'connection_break'|'close'|'socket_closed';

/**
 * TCP_transport
 *
 * @class TCP_transport
 * @constructor
 * @extends EventEmitter
 */
export class TCP_transport extends EventEmitter<TcpTransportEvents> {


    packetAssembler: PacketAssembler;
    name: string;
    _timerId: number;
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
    protected _pending_buffer: ArrayBuffer;

    protected _the_callback: ResponseCallback<DataView>;

    get disconnecting() {
        return this.__disconnecting__;
    }

constructor() {
    super();
    /**
     * timeout
     * @property [timeout=30000]
     * @type {number}
     */
    this.timeout = 30000; // 30 seconds timeout

    this._socket = null;

    /**
     * @property headerSize the size of the header in bytes
     * @type {number}
     * @default  8
     */
    this.headerSize = 8;

    /**
     * @property protocolVersion indicates the version number of the OPCUA protocol used
     * @type {number}
     * @default  0
     */
    this._protocolVersion = 0;

    this.__disconnecting__ = false;

    this.bytesWritten = 0;
    this.bytesRead = 0;

    this._the_callback = null;


    /***
     * @property chunkWrittenCount
     * @type {number}
     */
    this.chunkWrittenCount = 0;
    /***
     * @property chunkReadCount
     * @type {number}
     */
    this.chunkReadCount = 0;
}


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
public createChunk(msg_type: string, chunk_type: string, length: number): ArrayBuffer {

    assert(msg_type === 'MSG');
    assert(this._pending_buffer === undefined, 'createChunk has already been called ( use write first)');

    const total_length = length + this.headerSize;
    const buffer = new ArrayBuffer(total_length);
    writeTCPMessageHeader('MSG', chunk_type, total_length, buffer);

    this._pending_buffer = buffer;

    return buffer;
}




protected _write_chunk(message_chunk: string | ArrayBufferLike | Blob | ArrayBufferView) {

    if (this._socket) {
        this.bytesWritten += ( (message_chunk as ArrayBufferLike).byteLength) ? (message_chunk as ArrayBufferLike).byteLength : (message_chunk as string).length;
        this.chunkWrittenCount ++;
        this._socket.write(message_chunk);
    }
}

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
public write(message_chunk: ArrayBuffer) {

    assert((this._pending_buffer === undefined)
                || this._pending_buffer === message_chunk, ' write should be used with buffer created by createChunk');

    const header = readRawMessageHeader(message_chunk);
    assert(header.length === message_chunk.byteLength);
    assert(['F', 'C', 'A'].indexOf(header.messageHeader.isFinal) !== -1);

    this._write_chunk(message_chunk);

    this._pending_buffer = undefined;
}


protected _fulfill_pending_promises(err: Error, data?: DataView) {

    this._cleanup_timers();

    const the_callback = this._the_callback;
    this._the_callback = null;

    if (the_callback) {
        the_callback(err, data);
        return true;
    }
    return false;

}

protected _on_message_received(message_chunk: DataView) {
    const has_callback = this._fulfill_pending_promises(null, message_chunk);
    this.chunkReadCount ++;

    if (!has_callback) {
        /**
         * notify the observers that a message chunk has been received
         * @event message
         * @param message_chunk {Buffer} the message chunk
         */
        this.emit('message', message_chunk);
    }
}


protected _cleanup_timers() {


    if (this._timerId) {
        clearTimeout(this._timerId);
        this._timerId = null;
    }
}

protected _start_timeout_timer() {


    assert(!this._timerId, 'timer already started');
    this._timerId = window.setTimeout( () => {
        this._timerId = null;
        this._fulfill_pending_promises(new Error('Timeout in waiting for data on socket ( timeout was = ' + this.timeout + ' ms )'));
    }, this.timeout);

}

public on_socket_closed(err: Error) {

    if (this._on_socket_closed_called) {
        return;
    }
    assert(!this._on_socket_closed_called);
    this._on_socket_closed_called = true; // we don't want to send close event twice ...
    /**
     * notify the observers that the transport layer has been disconnected.
     * @event socket_closed
     * @param err the Error object or null
     */
    this.emit('socket_closed', err || null);
}

public on_socket_ended(err: Error) {

    assert(!this._on_socket_ended_called);
    this._on_socket_ended_called = true; // we don't want to send close event twice ...
    /**
     * notify the observers that the transport layer has been disconnected.
     * @event close
     * @param err the Error object or null
     */
    this.emit('close', err || null);
}

protected _on_socket_ended_message(err: Error) {


    if (this.__disconnecting__) {
        return;
    }

    debugLog('Transport Connection ended ' + self.name);
    assert(!this.__disconnecting__);
    err = err || new Error('_socket has been disconnected by third party');

    this.on_socket_ended(err);

    this.__disconnecting__ = true;

    debugLog(' bytesRead    = ' + this.bytesRead);
    debugLog(' bytesWritten = ' + this.bytesWritten);
    this._fulfill_pending_promises(new Error('Connection aborted - ended by server : ' + (err ? err.message : '')));
};


/**
 * @method _install_socket
 * @param socket {Socket}
 * @protected
 */
protected _install_socket(socket) {

    assert(socket);


    this.name = ' Transport ' + counter;
    counter += 1;

    this._socket = socket;

    // install packet assembler ...
    this.packetAssembler = new PacketAssembler({
        readMessageFunc: readRawMessageHeader,
        minimumSizeInBytes: this.headerSize
    });

    this.packetAssembler.on('message', (message_chunk) => {
        this._on_message_received( message_chunk);
    });


    this._socket.on('data', (data) => {
        this.bytesRead += data.length;
        if (data.length > 0) {
            this.packetAssembler.feed(data);
        }

    }).on('close', (had_error: any) => {
        // istanbul ignore next
        if (doDebug) {
            debugLog(' SOCKET CLOSE : had_error =' + had_error.toString() + this.name);
        }
        if (this._socket ) {
            debugLog('  remote address = ' + this._socket.remoteAddress + ' ' + this._socket.remoteFamily + ' ' + this._socket.remotePort);
        }
        if (had_error) {
            if (this._socket) {
                this._socket.destroy();
            }
        }
        const err = had_error ? new Error('ERROR IN SOCKET') : null;
        this.on_socket_closed(err);

    }).on('end', (err: Error) => {

        // istanbul ignore next
        if (doDebug) {
            debugLog(' SOCKET END : ' +  err ? err.message : 'null' +  this._socket.name + this.name);
        }
        this._on_socket_ended_message(err);

    }).on('error', (err: Error) => {
        // istanbul ignore next
        if (doDebug) {
            debugLog(' SOCKET ERROR : ' + err.message + this._socket.name + this.name);
        }
        // note: The "close" event will be called directly following this event.
    });

    const do_destroy_on_timeout = false;
    if (do_destroy_on_timeout) {
        /*
        // set socket timeout
        debugLog("setting client/server socket timeout to ",this.timeout);
        this._socket.setTimeout(this.timeout,function(){
            console.log(" connection has timed out (timeout =",this.timeout,")");
            this._socket.destroy();
        });
        */
    }

}


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
protected _install_one_time_message_receiver(callback: ResponseCallback<DataView>) {


    assert(!this._the_callback, 'callback already set');
    assert('function' === typeof callback);
    this._the_callback = callback;
    this._start_timeout_timer();
}


/**
 * disconnect the TCP layer and close the underlying socket.
 * The ```"close"``` event will be emitted to the observers with err=null.
 *
 * @method disconnect
 * @async
 * @param callback
 */
public disconnect(callback: () => void ) {

    assert('function' === typeof callback, 'expecting a callback function, but got ' + callback);


    if (this.__disconnecting__) {
        callback();
        return;
    }

    assert(!this.__disconnecting__, 'TCP Transport has already been disconnected');
    this.__disconnecting__ = true;

    assert(!this._the_callback, 'disconnect shall not be called while the \'one time message receiver\' is in operation');
    this._cleanup_timers();

    if (this._socket) {
        this._socket.end();
        this._socket.destroy();
 // Xx        this._socket.removeAllListeners();
        this._socket = null;
    }

    setImmediate(function () {
        this.on_socket_ended(null);
        callback();
    });

}

public isValid() {
    return this._socket !== null && !this._socket.destroyed && !this.__disconnecting__;
}

}

