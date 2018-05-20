"use strict";
/**
 * @module opcua.miscellaneous
 */

import {assert} from '../assert';
import * as _ from 'underscore';
import {DataStream} from '../basic-types/DataStream'
import * as ec from '../basic-types'
import {SequenceNumberGenerator} from "./sequence_number_generator";
import { SignatureData } from '../generated/SignatureData';


import {AsymmetricAlgorithmSecurityHeader,SymmetricAlgorithmSecurityHeader} from '../service-secure-channel';
import {SecureMessageChunkManager} from './secure_message_chunk_manager';

/**
 * @class MessageChunker
 * @param options {Object}
 * @param options.securityHeader  {Object} SecurityHeader
 * @param [options.derivedKeys] {Object} derivedKeys
 * @constructor
 */
export class MessageChunker {

    protected _sequenceNumberGenerator : SequenceNumberGenerator;
    protected _securityHeader;
    protected _derivedKeys;
    protected _stream : DataStream;

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
        new AsymmetricAlgorithmSecurityHeader({securityPolicyUri: "http://opcfoundation.org/UA/SecurityPolicy#None"});

    assert(_.isObject(options));
    assert(_.isObject(options.securityHeader));

    this._securityHeader = options.securityHeader;
    this._derivedKeys = options.derivedKeys || null;

};

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
public chunkSecureMessage(msgType, options, message, messageChunkCallback) {

    assert(_.isFunction(messageChunkCallback));

    // calculate message size ( with its  encodingDefaultBinary)
    var binSize = message.binaryStoreSize() + 4;
    
    var stream = new DataStream(binSize);
    this._stream = stream;

    ec.encodeExpandedNodeId(message.encodingDefaultBinary, stream);
    message.encode(stream);

    var securityHeader;
    if (msgType === "OPN") {
        securityHeader = this._securityHeader;
    } else {
        securityHeader.tokenId = options.tokenId;
    }

    var secure_chunker = new SecureMessageChunkManager(
        msgType, options, securityHeader, this._sequenceNumberGenerator
    )
        .on("chunk", function (messageChunk) {
            messageChunkCallback(messageChunk);
        })
        .on("finished", function () {
            messageChunkCallback(null);
        });

    secure_chunker.write(stream.buffer, stream.buffer.byteLength);
    secure_chunker.end();
};
}