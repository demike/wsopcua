/**
 * @module opcua.miscellaneous
 */
import { EventEmitter } from '../eventemitter';
import { DataStream } from '../basic-types/DataStream';
import { assert } from '../assert';
import { get_clock_tick } from '../utils';

import { MessageHeader, PacketAssembler, PacketInfo } from '../packet-assembler/packet_assembler';
import { readMessageHeader } from '../chunkmanager';
import { concatArrayBuffers } from '../basic-types/array';
import { SequenceHeader } from '../service-secure-channel';
import { Lock } from '../basic-types/utils';
import { OpcUaResponse } from '../client';

const doPerfMonitoring = false;

export function readRawMessageHeader(data: DataView | ArrayBuffer): PacketInfo {
  const messageHeader = readMessageHeader(new DataStream(data));
  return {
    extra: '',
    length: messageHeader.length,
    messageHeader: messageHeader,
  };
}

export interface MessageBuilderEvents {
  start_chunk: (info: PacketInfo, data: DataView) => void;
  chunk: (messageChunk: ArrayBuffer | DataView) => void;
  new_token: (tokenId: number) => void;
  full_message_body: (full_message_body: ArrayBuffer) => void;
  message: (
    objMessage: OpcUaResponse,
    msgType: string,
    requestId: number,
    secureChannelId: number
  ) => void;
  error: (err: Error, requestId?: number) => void;
  invalid_sequence_number: (expectedSequenceNumber: number, sequenceNumber: number) => void;
}

export abstract class MessageBuilderBase extends EventEmitter<MessageBuilderEvents> {
  protected lock = new Lock();
  public readonly signatureLength: number;
  public readonly options: { signatureLength?: number };
  public readonly packetAssembler: PacketAssembler;
  protected total_body_size: number;
  public total_message_size: number;
  status_error = false;
  blocks!: any[];
  message_chunks!: DataView[];
  messageHeader?: MessageHeader;
  public secureChannelId: number;
  private readonly expected_secureChannelId: number;

  protected _tick0 = 0;
  protected _tick1 = 0;
  sequenceHeader?: SequenceHeader;

  get tick0() {
    return this._tick0;
  }

  get tick1() {
    return this._tick1;
  }

  constructor(options?: any) {
    super();
    options = options || {};
    this.signatureLength = options.signatureLength || 0;
    this.options = options;
    this.expected_secureChannelId = 0;
    this.packetAssembler = new PacketAssembler({ readMessageFunc: readRawMessageHeader });

    this.packetAssembler.on('message', async (messageChunk) => {
      const locked = this.lock.acquire();
      if (locked) {
        await locked;
      }
      try {
        await this._feed_messageChunk(messageChunk);
        this.lock.release();
      } catch (err) {
        this.lock.release();
        throw err;
      }
    });
    this.packetAssembler.on('newMessage', (info, data) => {
      // record tick 0: when the first data is received
      if (doPerfMonitoring) {
        this._tick0 = get_clock_tick();
      }
      /**
       *
       * notify the observers that a new message is being built
       * @event start_chunk
       * @param info
       * @param data
       */
      this.emit('start_chunk', info, data);
    });
    this.total_body_size = 0;
    this.total_message_size = 0;
    this.secureChannelId = 0;
    this._init_new();
  }
  protected _init_new() {
    this.status_error = false;
    this.total_body_size = 0;
    this.total_message_size = 0;
    this.blocks = [];
    this.message_chunks = [];
  }
  protected async _read_headers(binaryStream: DataStream) {
    return this.readHeadersInternal(binaryStream);
  }

  protected readHeadersInternal(binaryStream: DataStream) {
    try {
      this.messageHeader = readMessageHeader(binaryStream);
      assert(binaryStream.length === 8);
      this.secureChannelId = binaryStream.getUint32();
      assert((binaryStream.length as any) === 12);
      // verifying secureChannelId
      if (this.expected_secureChannelId && this.secureChannelId !== this.expected_secureChannelId) {
        return this._report_error('Invalid secure channel Id');
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  /**
   * append a message chunk
   * @method _append
   * @param message_chunk
   * @private
   */
  protected async _append(message_chunk: DataView | ArrayBuffer) {
    if (this.status_error) {
      // the message builder is in error mode and further message chunks should be discarded.
      return false;
    }

    //   message_chunk = (message_chunk instanceof ArrayBuffer) ? message_chunk : message_chunk.buffer;
    message_chunk =
      message_chunk instanceof ArrayBuffer ? new DataView(message_chunk) : message_chunk;

    this.message_chunks.push(message_chunk);
    this.total_message_size += message_chunk.byteLength;
    const binaryStream = new DataStream(message_chunk);
    if (!(await this._read_headers(binaryStream))) {
      return false;
    }
    assert(binaryStream.length >= 12);
    // verify message chunk length
    if (this.messageHeader?.length !== message_chunk.byteLength) {
      return this._report_error(
        'Invalid messageChunk size: ' +
          'the provided chunk is ' +
          message_chunk.byteLength +
          ' bytes long ' +
          'but header specifies ' +
          this.messageHeader?.length
      );
    }
    // the start of the message body block
    const offsetBodyStart = binaryStream.length;
    // the end of the message body block
    const offsetBodyEnd = binaryStream.view.byteLength;
    this.total_body_size += offsetBodyEnd - offsetBodyStart;

    const cloned_buf = message_chunk.buffer.slice(
      offsetBodyStart + message_chunk.byteOffset,
      offsetBodyEnd + message_chunk.byteOffset
    );
    this.blocks.push(cloned_buf);
  }
  /**
   * Feed message builder with some data
   * @method feed
   * @param data
   */
  feed(data: DataView) {
    if (!this.status_error) {
      this.packetAssembler.feed(data);
    }
  }
  protected async _feed_messageChunk(messageChunk: ArrayBuffer | DataView) {
    assert(messageChunk);
    const messageHeader = readMessageHeader(new DataStream(messageChunk));
    /**
     * notify the observers that new message chunk has been received
     * @event chunk
     * @param messageChunk {Buffer} the raw message chunk
     */
    this.emit('chunk', messageChunk);
    if (messageHeader.isFinal === 'F') {
      // last message
      await this._append(messageChunk);
      if (this.status_error) {
        return false;
      }
      const full_message_body = concatArrayBuffers(this.blocks);
      // record tick 1: when a complete message has been received ( all chunks assembled)
      this._tick1 = get_clock_tick();
      /**
       * notify the observers that a full message has been received
       * @event full_message_body
       * @param full_message_body {Buffer} the full message body made of all concatenated chunks.
       */
      this.emit('full_message_body', full_message_body);
      if (this._decode_message_body) {
        this._decode_message_body(full_message_body);
      }
      // be ready for next block
      this._init_new();
      return true;
    } else if (messageHeader.isFinal === 'A') {
      return this._report_error('received and Abort Message');
    } else if (messageHeader.isFinal === 'C') {
      return this._append(messageChunk);
    }
  }
  _report_error(errorMessage: string) {
    this.status_error = true;
    // console.log("MESSAGE BUILDER ERROR".yellow, errorMessage.red);
    /**
     * notify the observers that an error has occurred
     * @event error
     * @param error {Error} the error to raise
     */
    this.emit(
      'error',
      new Error(errorMessage),
      this.sequenceHeader ? this.sequenceHeader.requestId : undefined
    );
    return false;
  }

  public dispose() {
    this.removeAllListeners();
  }

  protected abstract _decode_message_body(full_message_body: ArrayBuffer): boolean;
}
