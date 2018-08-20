/**
 * @module opcua.miscellaneous
 */
import { EventEmitter } from 'eventemitter3';
export declare function verify_message_chunk(message_chunk: DataView | ArrayBuffer): void;
/**
 * @class ChunkManager
 * @param options {Object}
 * @param options.chunkSize  {number}
 * @param [options.headerSize = 0 ] {number}
 * @param [options.signatureLength = 0] {number}
 * @param [options.sequenceHeaderSize = 8] {number}size of the sequence header
 * @param [options.cipherBlockSize=0] {number}
 * @param [options.plainBlockSize=0]  {number}
 * @param [options.compute_signature=null] {Function}
 * @param [options.encrypt_buffer] {Function}
 * @param [options.writeSequenceHeaderFunc=null] {Function}
 * @param [options.writeHeaderFunc] {Function}
 * @extends EventEmitter
 * @constructor
 */
export declare class ChunkManager extends EventEmitter {
    chunkSize: any;
    headerSize: any;
    writeHeaderFunc: any;
    sequenceHeaderSize: any;
    writeSequenceHeaderFunc: any;
    signatureLength: any;
    compute_signature: any;
    plainBlockSize: number;
    cipherBlockSize: number;
    maxBodySize: number;
    encrypt_buffer: any;
    maxBlock: number;
    dataOffset: number;
    chunk: ArrayBuffer;
    chunkArray: Uint8Array;
    cursor: number;
    pending_chunk: ArrayBuffer;
    dataEnd: any;
    constructor(options: any);
    /**
     * compute the signature of the chunk and append it at the end
     * of the data block.
     *
     * @method _write_signature
     * @private
     */
    _write_signature(chunk: any): void;
    _encrypt(chunk: any): void;
    _push_pending_chunk(isLast: any): void;
    /**
     * @method write
     * @param buffer {Buffer}
     * @param length {Number}
     */
    write(buffer: ArrayBuffer, length: number): void;
    _write_padding_bytes(nbPaddingByteTotal: any): void;
    _postprocess_current_chunk(): void;
    /**
     * @method end
     */
    end(): void;
}
