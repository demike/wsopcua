'use strict';
/**
 * @module opcua.miscellaneous
 */

import { assert } from '../assert';
import { DataStream } from '../basic-types/DataStream';
import * as ec from '../basic-types';
import { SequenceNumberGenerator } from './sequence_number_generator';
import { SignatureData } from '../generated/SignatureData';

import {
  AsymmetricAlgorithmSecurityHeader,
  SymmetricAlgorithmSecurityHeader,
} from '../service-secure-channel';
import {
  SecureMessageChunkManager,
  SecureMessageChunkManagerOptions,
} from './secure_message_chunk_manager';
import { ISymmetricAlgortihmSecurityHeader } from '../service-secure-channel/SymmetricAlgorithmSecurityHeader';
import { DerivedKeys } from '../crypto';
import { IEncodable } from '../factory/factories_baseobject';

export interface IMessageChunkerOptions {
  securityHeader?: AsymmetricAlgorithmSecurityHeader | SymmetricAlgorithmSecurityHeader;
  derivedKeys?: DerivedKeys;
}

/**
 * @class MessageChunker
 * @param options {Object}
 * @param options.securityHeader  {Object} SecurityHeader
 * @param [options.derivedKeys] {Object} derivedKeys
 * @constructor
 */
export class MessageChunker {
  protected _sequenceNumberGenerator: SequenceNumberGenerator;
  protected _securityHeader:
    | AsymmetricAlgorithmSecurityHeader
    | SymmetricAlgorithmSecurityHeader
    | null;
  protected _derivedKeys?: DerivedKeys;
  protected _stream?: DataStream;

  get securityHeader() {
    return this._securityHeader;
  }

  set securityHeader(header) {
    this._securityHeader = header;
  }

  constructor(options: IMessageChunkerOptions) {
    this._sequenceNumberGenerator = new SequenceNumberGenerator();
    this.update(options);
  }

  public dispose() {
    this._securityHeader = null;
    this._derivedKeys = undefined;
    this._stream = undefined;
  }

  /**
   * update security information
   */
  public update(options: IMessageChunkerOptions) {
    options = options || {};
    options.securityHeader =
      options.securityHeader ||
      new AsymmetricAlgorithmSecurityHeader({
        securityPolicyUri: 'http://opcfoundation.org/UA/SecurityPolicy#None',
      });

    assert(typeof options === 'object');
    assert(typeof options.securityHeader === 'object');

    this._securityHeader = options.securityHeader;
    this._derivedKeys = options.derivedKeys;
  }

  /**
   * @method chunkSecureMessage
   * @param msgType {String}
   * @param options
   * @param options.tokenId
   * @param options.chunkSize    [default=8192]
   *
   * @param options.signatureLength  {number} [default=0]
   * @param options.signingFunc {Function} [default=null]
   *
   * @param message {Object}
   * @param messageChunkCallback   {Function}
   */
  public chunkSecureMessage(
    msgType: string,
    options: SecureMessageChunkManagerOptions & ISymmetricAlgortihmSecurityHeader,
    message: IEncodable,
    messageChunkCallback: (chunk: ArrayBuffer | null) => void
  ) {
    options = <any>options || {};
    assert('function' === typeof messageChunkCallback);

    // calculate message size ( with its  encodingDefaultBinary)
    const binSize = DataStream.binaryStoreSize(message) + 4;

    const stream = new DataStream(binSize);
    this._stream = stream;

    ec.encodeExpandedNodeId(message.encodingDefaultBinary, stream);
    message.encode(stream);

    let securityHeader;
    if (msgType === 'OPN') {
      securityHeader = this._securityHeader;
    } else {
      securityHeader = new SymmetricAlgorithmSecurityHeader({ tokenId: options.tokenId });
    }

    const secure_chunker = new SecureMessageChunkManager(
      msgType,
      options,
      securityHeader,
      this._sequenceNumberGenerator
    )
      .on('chunk', function (messageChunk: ArrayBuffer) {
        messageChunkCallback(messageChunk);
      })
      .on('finished', function () {
        messageChunkCallback(null);
        secure_chunker.removeAllListeners();
      });

    assert(stream.view.byteOffset === 0);
    secure_chunker
      .write(stream.view.buffer, stream.view.buffer.byteLength)
      .then(() => secure_chunker.end());
  }
}
