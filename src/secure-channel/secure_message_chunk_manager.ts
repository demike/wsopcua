'use strict';
/**
 * @module opcua.miscellaneous
 */

import { assert } from '../assert';
import { EventEmitter } from '../eventemitter';

import { ChunkManager } from '../chunkmanager';
import { DataStream } from '../basic-types/DataStream';

import {
  SequenceHeader,
  AsymmetricAlgorithmSecurityHeader,
  SymmetricAlgorithmSecurityHeader,
} from '../service-secure-channel';
import { SequenceNumberGenerator } from './sequence_number_generator';

export interface SecureMessageChunkManagerEvents {
  chunk: (chunk: ArrayBuffer, is_last: boolean) => void;
  finished: () => void;
}

export function chooseSecurityHeader(msgType: string) {
  const securityHeader =
    msgType === 'OPN'
      ? new AsymmetricAlgorithmSecurityHeader()
      : new SymmetricAlgorithmSecurityHeader();
  return securityHeader;
}

export interface SecureMessageChunkManagerOptions {
  sequenceHeaderSize: number;
  secureChannelId?: number;
  chunkSize?: number;
  requestId: number;
  signatureLength: number;
  signingFunc?: Function;
  plainBlockSize: number;
  cipherBlockSize: number;
  encrypt_buffer?: ArrayBuffer;
}

/**
 * @class SecureMessageChunkManager
 *
 * @param msgType
 * @param options
 * @param options.chunkSize {number} [=8192]
 * @param options.secureChannelId
 * @param options.requestId
 * @param options.signatureLength  {number}  [undefined]
 * @param options.signingFunc {Function} [undefined]
 *
 * @param securityHeader
 * @param sequenceNumberGenerator
 * @constructor
 */
export class SecureMessageChunkManager extends EventEmitter<SecureMessageChunkManagerEvents> {
  protected _chunkManager: ChunkManager;
  protected _sequenceHeader: SequenceHeader;
  protected _securityHeader: AsymmetricAlgorithmSecurityHeader | SymmetricAlgorithmSecurityHeader;
  protected _sequenceNumberGenerator: SequenceNumberGenerator;
  protected _secureChannelId: number;
  protected _msgType: string;
  protected _chunkSize: number;
  protected _aborted: boolean;
  protected _headerSize: number;
  constructor(
    msgType: string,
    options: SecureMessageChunkManagerOptions,
    securityHeader: AsymmetricAlgorithmSecurityHeader | SymmetricAlgorithmSecurityHeader | null,
    sequenceNumberGenerator: SequenceNumberGenerator
  ) {
    super();
    this._aborted = false;

    msgType = msgType || 'OPN';

    securityHeader = securityHeader || chooseSecurityHeader(msgType);
    assert(typeof securityHeader === 'object');

    // the maximum size of a message chunk:
    // Note: OPCUA requires that chunkSize is at least 8192
    this._chunkSize = options.chunkSize || 1024 * 128;

    this._msgType = msgType;

    options.secureChannelId = options.secureChannelId || 0;
    assert(Number.isFinite(options.secureChannelId));
    this._secureChannelId = options.secureChannelId;

    const requestId = options.requestId;

    this._sequenceNumberGenerator = sequenceNumberGenerator;

    this._securityHeader = securityHeader;

    assert(requestId > 0, 'expecting a valid request ID');

    this._sequenceHeader = new SequenceHeader({ requestId: requestId, sequenceNumber: -1 });

    const securityHeaderSize = DataStream.binaryStoreSize(this._securityHeader);
    const sequenceHeaderSize = DataStream.binaryStoreSize(this._sequenceHeader);
    assert(sequenceHeaderSize === 8);

    this._headerSize = 12 + securityHeaderSize;
    const self = this;
    const params = {
      chunkSize: this._chunkSize,

      headerSize: this._headerSize,
      writeHeaderFunc: (block: DataStream | DataView, isLast: boolean, totalLength: number) => {
        let finalC: 'A' | 'F' | 'C' = isLast ? 'F' : 'C';
        finalC = this._aborted ? 'A' : finalC;
        this.write_header(finalC, block, totalLength);
      },

      sequenceHeaderSize,
      writeSequenceHeaderFunc: function (block: DataStream | DataView) {
        assert(block.byteLength === this.sequenceHeaderSize);
        self.writeSequenceHeader(block);
      },

      // ---------------------------------------- Signing stuff
      signatureLength: options.signatureLength,
      compute_signature: options.signingFunc,

      // ---------------------------------------- Encrypting stuff
      plainBlockSize: options.plainBlockSize,
      cipherBlockSize: options.cipherBlockSize,
      encrypt_buffer: options.encrypt_buffer,
    };

    this._chunkManager = new ChunkManager(params);

    this._chunkManager.on('chunk', (chunk: ArrayBuffer, is_last) => {
      /**
       * @event chunk
       * @param chunk {Buffer}
       */
      this.emit('chunk', chunk, is_last || this._aborted);
    });
  }

  public write_header(finalC: 'A' | 'F' | 'C', buf: DataStream | DataView, length: number) {
    assert(buf.byteLength > 12);
    assert(finalC.length === 1);

    if (buf instanceof DataView) {
      buf = new DataStream(buf);
    }

    // message header --------------------------

    // ---------------------------------------------------------------
    // OPC UA Secure Conversation Message Header : Part 6 page 36
    // MessageType     Byte[3]
    // IsFinal         Byte[1]  C : intermediate, F: Final , A: Final with Error
    // MessageSize     UInt32   The length of the MessageChunk, in bytes. This value includes size of the message header.
    // SecureChannelId UInt32   A unique identifier for the ClientSecureChannelLayer assigned by the server.

    buf.setUint8(this._msgType.charCodeAt(0));
    buf.setUint8(this._msgType.charCodeAt(1));
    buf.setUint8(this._msgType.charCodeAt(2));
    buf.setUint8(finalC.charCodeAt(0));

    buf.setUint32(length);
    buf.setUint32(this._secureChannelId);

    assert(buf.length === 12);

    // xx console.log("securityHeader size = ",DataStream.binaryStoreSize(this.securityHeader));
    // write Security Header -----------------
    this._securityHeader.encode(buf);
    assert(buf.length === this._headerSize);
  }

  public writeSequenceHeader(block: DataStream | DataView) {
    if (block instanceof DataView) {
      block = new DataStream(block);
    }
    // write Sequence Header -----------------
    this._sequenceHeader.sequenceNumber = this._sequenceNumberGenerator.next();
    this._sequenceHeader.encode(block);
    assert(block.length === 8);
  }

  /**
   * @method write
   * @param buffer {Buffer}
   * @param length {Integer} - optional if not provided  buffer.length is used instead.
   */
  public write(buffer: ArrayBuffer, length: number) {
    length = length || buffer.byteLength;
    this._chunkManager.write(buffer, length);
  }

  /**
   * @method abort
   *
   */
  public abort() {
    this._aborted = true;
    this.end();
  }

  /**
   * @method end
   */
  public end() {
    this._chunkManager.end();
    this.emit('finished');
  }
}
