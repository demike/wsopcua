'use strict';
/**
 * @module opcua.miscellaneous
 */

import {assert} from '../assert';
import {DataStream} from '../basic-types/DataStream';
import * as ec from '../basic-types';
import {SequenceNumberGenerator} from './sequence_number_generator';
import { SignatureData } from '../generated/SignatureData';


import {AsymmetricAlgorithmSecurityHeader, SymmetricAlgorithmSecurityHeader} from '../service-secure-channel';
import {SecureMessageChunkManager, SecureMessageChunkManagerOptions} from './secure_message_chunk_manager';
import { ISymmetricAlgortihmSecurityHeader } from '../service-secure-channel/SymmetricAlgorithmSecurityHeader';

/**
 * @class MessageChunker
 * @param options {Object}
 * @param options.securityHeader  {Object} SecurityHeader
 * @param [options.derivedKeys] {Object} derivedKeys
 * @constructor
 */
export class MessageChunker {

    protected _sequenceNumberGenerator: SequenceNumberGenerator;
    protected _securityHeader;
    protected _derivedKeys;
    protected _stream: DataStream;

    get securityHeader() {
        return this._securityHeader;
    }

    set securityHeader(header ) {
        this._securityHeader = header;
    }

    constructor(options) {

        this._sequenceNumberGenerator = new SequenceNumberGenerator();
        this.update(options);

    }

    public dispose() {
        this._sequenceNumberGenerator = null;
        this._securityHeader = null;
        this._derivedKeys = null;
        this._stream = null;
    }


/** update security information
 * @method update
 * @param options {Object}
 * @param options.securityHeader  {Object} SecurityHeader
 * @param [options.derivedKeys] {Object} derivedKeys
 *
 */
public update(options) {

    options = options || {};
    options.securityHeader = options.securityHeader ||
        new AsymmetricAlgorithmSecurityHeader({securityPolicyUri: 'http://opcfoundation.org/UA/SecurityPolicy#None'});

    assert(typeof options === 'object');
    assert(typeof options.securityHeader === 'object');

    this._securityHeader = options.securityHeader;
    this._derivedKeys = options.derivedKeys || null;

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
public chunkSecureMessage(msgType: string, options: SecureMessageChunkManagerOptions & ISymmetricAlgortihmSecurityHeader,
     message, messageChunkCallback: (chunk: DataView) => void) {

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
        securityHeader = new SymmetricAlgorithmSecurityHeader({tokenId: options.tokenId});
    }

    const secure_chunker = new SecureMessageChunkManager(
        msgType, options, securityHeader, this._sequenceNumberGenerator
    )
        .on('chunk', function (messageChunk: DataView) {
            messageChunkCallback(messageChunk);
        })
        .on('finished', function () {
            messageChunkCallback(null);
        });

    assert(stream.view.byteOffset === 0);
    secure_chunker.write(stream.view.buffer, stream.view.buffer.byteLength);
    secure_chunker.end();
}
}
