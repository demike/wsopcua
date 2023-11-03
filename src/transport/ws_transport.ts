/**
 * @module opcua.transport
 */

// system requires
import { EventEmitter } from '../eventemitter';
import { assert } from '../assert';

// opcua requires
import { PacketAssembler } from '../packet-assembler/packet_assembler';

import { writeTCPMessageHeader } from './tools';
import { readRawMessageHeader } from './message_builder_base';

import { debugLog, doDebug } from '../common/debug';
import { ResponseCallback, ErrorCallback } from '../client/client_base';
import { ObjectRegistry } from '../object-registry/objectRegistry';

let fakeSocket: any = { invalid: true };

export function setFakeTransport(socket_like_mock: any) {
  fakeSocket = socket_like_mock;
}

export function getFakeTransport() {
  if (fakeSocket.invalid) {
    throw new Error(
      'getFakeTransport: setFakeTransport must be called first  - BadProtocolVersionUnsupported'
    );
  }
  return fakeSocket;
}

let counter = 0;

interface WSTransportEvents {
  connect: () => void;
  message: (message_chunk: DataView | string) => void;
  socket_closed: ErrorCallback;
  close: ErrorCallback;
  socket_error: (evt: CloseEvent) => void;
  connection_break: () => void;
  error: ErrorCallback;
}

/**
 * WSTransport
 *
 * @class WSTransport
 * @extends EventEmitter
 */
export abstract class WSTransport extends EventEmitter<WSTransportEvents> {
  private static registry = new ObjectRegistry();

  packetAssembler?: PacketAssembler;
  name: string;
  private _timerId: number | null = null;
  protected _socket: WebSocket | null;
  private _timeout: number;
  public readonly headerSize: number;
  _protocolVersion: number;

  bytesRead: number;
  bytesWritten: number;
  chunkReadCount: number;
  chunkWrittenCount: number;
  protected _disconnecting: boolean;
  protected _onSocketClosedHasBeenCalled: boolean;
  protected _onSocketEndedHasBeenCalled: boolean;
  protected _pending_buffer?: ArrayBuffer;

  protected _the_callback?: ResponseCallback<DataView>;

  get disconnecting() {
    return this._disconnecting;
  }

  constructor() {
    super();
    this.name = this.constructor.name + counter;
    counter += 1;

    this._timeout = 30000; // 30 seconds timeout
    this._socket = null;

    this.headerSize = 8;

    /**
     * @property protocolVersion indicates the version number of the OPCUA protocol used
     */
    this._protocolVersion = 0;

    this._disconnecting = false;

    this.bytesWritten = 0;
    this.bytesRead = 0;

    this._the_callback = undefined;

    this.chunkWrittenCount = 0;
    this.chunkReadCount = 0;

    this._onSocketClosedHasBeenCalled = false;
    this._onSocketEndedHasBeenCalled = false;

    WSTransport.registry.register(this);
  }

  public get timeout(): number {
    return this._timeout;
  }
  public set timeout(value: number) {
    debugLog('Setting socket ' + this.name + ' timeout = ', value);
    this._timeout = value;
  }
  protected dispose() {
    this._cleanup_timers();
    assert(!this._timerId);
    if (this._socket) {
      this._socket.onclose = null;
      this._socket.onerror = null;
      this._socket.onopen = null;
      this._socket.onmessage = null;
      this._socket = null;
    }
    WSTransport.registry.unregister(this);
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
    assert(
      this._pending_buffer === undefined,
      'createChunk has already been called ( use write first)'
    );

    const total_length = length + this.headerSize;
    const buffer = new ArrayBuffer(total_length);
    writeTCPMessageHeader('MSG', chunk_type, total_length, buffer);

    this._pending_buffer = buffer;

    return buffer;
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
  public write(message_chunk: ArrayBuffer | string) {
    if (typeof message_chunk === 'string') {
      return this._write_json(message_chunk);
    }

    assert(
      this._pending_buffer === undefined || this._pending_buffer === message_chunk,
      ' write should be used with buffer created by createChunk'
    );

    const header = readRawMessageHeader(message_chunk);
    assert(header.length === message_chunk.byteLength);
    assert(['F', 'C', 'A'].indexOf(header.messageHeader.isFinal) !== -1);
    this._write_chunk(message_chunk);
    this._pending_buffer = undefined;
  }

  /**
   * disconnect the TCP layer and close the underlying socket.
   * The ```"close"``` event will be emitted to the observers with err=null.
   *
   * @method disconnect
   * @async
   * @param callback
   */
  public disconnect(callback: () => void) {
    assert('function' === typeof callback, 'expecting a callback function, but got ' + callback);

    if (this._disconnecting || !this._socket) {
      callback();
      return;
    }

    assert(!this._disconnecting, 'TCP Transport has already been disconnected');
    this._disconnecting = true;

    // xx assert(!this._the_callback, 'disconnect shall not be called while the \'one time message receiver\' is in operation');
    this._cleanup_timers();

    if (this._socket) {
      this._socket.onclose = () => {
        this.on_socket_ended(null);
        callback();
      };

      const sock = this._socket;
      this._socket = null;
      sock.close(1000);
    }
  }

  public isValid() {
    return this._socket && this._socket.readyState === this._socket.OPEN && !this._disconnecting;
  }

  protected _write_chunk(message_chunk: ArrayBuffer) {
    if (this._socket) {
      this.bytesWritten += message_chunk.byteLength;
      this.chunkWrittenCount++;
      this._socket.send(message_chunk);
    }
  }

  protected _write_json(message: string) {
    if (this._socket) {
      this.bytesWritten += message.length;
      this.chunkWrittenCount++;
      this._socket.send(message);
    }
  }

  public on_socket_ended(err: Error | null) {
    assert(!this._onSocketEndedHasBeenCalled);
    this._onSocketEndedHasBeenCalled = true; // we don't want to send ende event twice ...
    /**
     * notify the observers that the transport layer has been disconnected.
     * @event close
     * @param err the Error object or null
     */
    this.emit('close', err || null);
  }

  /**
   * @method _install_socket
   * @param socket {Socket}
   * @protected
   */
  protected _install_socket(socket: WebSocket) {
    assert(socket);
    this._socket = socket;

    // install packet assembler ...
    this.packetAssembler = new PacketAssembler({
      readMessageFunc: readRawMessageHeader,
      minimumSizeInBytes: this.headerSize,
    });

    this.packetAssembler.on('message', (message_chunk: DataView) => {
      this._on_message_received(message_chunk);
    });

    this._socket.onmessage = (evt: MessageEvent) => this._on_socket_data(evt);
    this._socket.onclose = (evt: CloseEvent) => {
      this._on_socket_close(evt);
      this.dispose();
    };
    /*
    this._socket.on("end", function (err) {

        // istanbul ignore next
        if (doDebug) {
            debugLog(" SOCKET END : " +  err ? err.message : "null" +  this._socket.name + this.name);
        }
        this._on_socket_ended_message(err);

    };
    */

    this._socket.addEventListener('error', (evt: Event) => {
      // istanbul ignore next
      if (doDebug) {
        debugLog(' SOCKET ERROR : ' + this.name);
      }

      // note: The "close" event will be called directly following this event.
    });
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
    this._start_one_time_message_receiver();
  }

  protected _fulfill_pending_promises(err: Error | null, data?: DataView) {
    this._cleanup_timers();

    const the_callback = this._the_callback;
    this._the_callback = undefined;

    if (the_callback) {
      the_callback(err, data);
      return true;
    }
    return false;
  }

  protected _on_message_received(message_chunk: DataView) {
    const has_callback = this._fulfill_pending_promises(null, message_chunk);
    this.chunkReadCount++;

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

  protected _start_one_time_message_receiver() {
    assert(!this._timerId, 'timer already started');
    this._timerId = window.setTimeout(() => {
      this._timerId = null;
      this._fulfill_pending_promises(
        new Error(
          'Timeout in waiting for data on socket ( timeout was = ' + this._timeout + ' ms )'
        )
      );
    }, this._timeout);
  }

  public on_socket_closed(err?: Error) {
    if (this._onSocketClosedHasBeenCalled) {
      return;
    }
    assert(!this._onSocketClosedHasBeenCalled);
    this._onSocketClosedHasBeenCalled = true; // we don't want to send close event twice ...
    /**
     * notify the observers that the transport layer has been disconnected.
     * @event socket_closed
     * @param err the Error object or null
     */
    this.emit('socket_closed', err || null);
  }

  protected _on_socket_data(evt: MessageEvent): void {
    if (typeof evt.data !== 'string') {
      this._on_binary_data(evt);
    } else {
      this._on_json_data(evt);
    }
  }

  protected _on_binary_data(evt: MessageEvent): void {
    if (!this.packetAssembler) {
      throw new Error('internal Error');
    }
    this.bytesRead += evt.data.byteLength;
    if (evt.data.byteLength > 0) {
      this.packetAssembler.feed(new DataView(evt.data));
    }
  }

  protected _on_json_data(evt: MessageEvent): void {
    this._on_message_received(evt.data);
  }

  private _on_socket_close(evt: CloseEvent) {
    if (this._disconnecting) {
      return; // actively disconnecting --> do nothing
    }

    if (doDebug) {
      debugLog(
        ' SOCKET CLOSE : reason =' + evt.reason + ' code=' + evt.code + ' name=' + this.name
      );
    }
    if (this._socket) {
      debugLog('  remote address = ' + this._socket.url);
    }

    let err: Error | undefined;
    if (evt.code !== 1000 /* if not normal*/ && evt.code !== 1005 /* no status code set */) {
      /* TODO: what should we do now
        if (this._socket) {
            this._socket.destroy();
        }
        */
      this.emit('socket_error', evt);
      err = new Error(
        'ERROR IN SOCKET: reason=' + evt.reason + ' code=' + evt.code + ' name=' + this.name
      );
    } else {
      this._on_socket_ended_message(new Error('Connection aborted'));
    }

    this.on_socket_closed(err);
  }

  protected _on_socket_ended_message(err?: Error) {
    if (this._disconnecting) {
      return;
    }

    debugLog('Transport Connection ended ' + this.name);
    assert(!this._disconnecting);
    err = err || new Error('_socket has been disconnected by third party');

    this.on_socket_ended(err);

    this._disconnecting = true;

    debugLog(' bytesRead    = ' + this.bytesRead);
    debugLog(' bytesWritten = ' + this.bytesWritten);
    this._fulfill_pending_promises(
      new Error('Connection aborted - ended by server : ' + (err ? err.message : ''))
    );
  }
}
