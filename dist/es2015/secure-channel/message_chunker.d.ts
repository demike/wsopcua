import { DataStream } from '../basic-types/DataStream';
import { SequenceNumberGenerator } from "./sequence_number_generator";
/**
 * @class MessageChunker
 * @param options {Object}
 * @param options.securityHeader  {Object} SecurityHeader
 * @param [options.derivedKeys] {Object} derivedKeys
 * @constructor
 */
export declare class MessageChunker {
    protected _sequenceNumberGenerator: SequenceNumberGenerator;
    protected _securityHeader: any;
    protected _derivedKeys: any;
    protected _stream: DataStream;
    securityHeader: any;
    constructor(options: any);
    /** update security information
     * @method update
     * @param options {Object}
     * @param options.securityHeader  {Object} SecurityHeader
     * @param [options.derivedKeys] {Object} derivedKeys
     *
     */
    update(options: any): void;
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
    chunkSecureMessage(msgType: any, options: any, message: any, messageChunkCallback: any): void;
}
