"use strict";
/**
 * @module opcua.miscellaneous
 */
import { assert } from '../assert';
import { DataStream } from '../basic-types/DataStream';
import * as ec from '../basic-types';
import { SequenceNumberGenerator } from "./sequence_number_generator";
import { AsymmetricAlgorithmSecurityHeader, SymmetricAlgorithmSecurityHeader } from '../service-secure-channel';
import { SecureMessageChunkManager } from './secure_message_chunk_manager';
/**
 * @class MessageChunker
 * @param options {Object}
 * @param options.securityHeader  {Object} SecurityHeader
 * @param [options.derivedKeys] {Object} derivedKeys
 * @constructor
 */
export class MessageChunker {
    get securityHeader() {
        return this._securityHeader;
    }
    set securityHeader(header) {
        this._securityHeader = header;
    }
    constructor(options) {
        this._sequenceNumberGenerator = new SequenceNumberGenerator();
        this.update(options);
    }
    /** update security information
     * @method update
     * @param options {Object}
     * @param options.securityHeader  {Object} SecurityHeader
     * @param [options.derivedKeys] {Object} derivedKeys
     *
     */
    update(options) {
        options = options || {};
        options.securityHeader = options.securityHeader ||
            new AsymmetricAlgorithmSecurityHeader({ securityPolicyUri: "http://opcfoundation.org/UA/SecurityPolicy#None" });
        assert(typeof options === 'object');
        assert(typeof options.securityHeader === 'object');
        this._securityHeader = options.securityHeader;
        this._derivedKeys = options.derivedKeys || null;
    }
    ;
    /**
     * @method chunkSecureMessage
     * @param msgType {String}
     * @param options
     * @param options.tokenId
     * @param options.chunkSize    [default=8196]
     *
     * @param options.signatureLength  {Integer} [default=0]
     * @param options.signingFunc {Function} [default=null]
     *
     * @param message {Object}
     * @param messageChunkCallback   {Function}
     */
    chunkSecureMessage(msgType, options, message, messageChunkCallback) {
        options = options || {};
        assert('function' === typeof messageChunkCallback);
        // calculate message size ( with its  encodingDefaultBinary)
        var binSize = DataStream.binaryStoreSize(message) + 4;
        var stream = new DataStream(binSize);
        this._stream = stream;
        ec.encodeExpandedNodeId(message.encodingDefaultBinary, stream);
        message.encode(stream);
        var securityHeader;
        if (msgType === "OPN") {
            securityHeader = this._securityHeader;
        }
        else {
            securityHeader = new SymmetricAlgorithmSecurityHeader({ tokenId: options.tokenId });
        }
        var secure_chunker = new SecureMessageChunkManager(msgType, options, securityHeader, this._sequenceNumberGenerator)
            .on("chunk", function (messageChunk) {
            messageChunkCallback(messageChunk);
        })
            .on("finished", function () {
            messageChunkCallback(null);
        });
        secure_chunker.write(stream.buffer, stream.buffer.byteLength);
        secure_chunker.end();
    }
    ;
}
//# sourceMappingURL=message_chunker.js.map