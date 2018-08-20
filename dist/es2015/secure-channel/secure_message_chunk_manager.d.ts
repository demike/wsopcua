import { EventEmitter } from 'eventemitter3';
import { ChunkManager } from '../chunkmanager';
import { DataStream } from '../basic-types/DataStream';
import { SequenceHeader, AsymmetricAlgorithmSecurityHeader, SymmetricAlgorithmSecurityHeader } from '../service-secure-channel';
export declare function chooseSecurityHeader(msgType: any): AsymmetricAlgorithmSecurityHeader | SymmetricAlgorithmSecurityHeader;
export interface SecureMessageChunkManagerOptions {
    sequenceHeaderSize: number;
    secureChannelId: any;
    chunkSize?: number;
    requestId?: number;
    signatureLength: number;
    signingFunc: Function;
    plainBlockSize: number;
    cipherBlockSize: number;
    encrypt_buffer: ArrayBuffer;
}
/**
 * @class SecureMessageChunkManager
 *
 * @param msgType
 * @param options
 * @param options.chunkSize {Integer} [=8196]
 * @param options.secureChannelId
 * @param options.requestId
 * @param options.signatureLength  {Integer}  [undefined]
 * @param options.signingFunc {Function} [undefined]
 *
 * @param securityHeader
 * @param sequenceNumberGenerator
 * @constructor
 */
export declare class SecureMessageChunkManager extends EventEmitter {
    protected _chunkManager: ChunkManager;
    protected _sequenceHeader: SequenceHeader;
    protected _securityHeader: any;
    protected _sequenceNumberGenerator: any;
    protected _secureChannelId: any;
    protected _msgType: any;
    protected _chunkSize: number;
    protected _aborted: boolean;
    protected _headerSize: number;
    constructor(msgType: any, options: SecureMessageChunkManagerOptions, securityHeader: any, sequenceNumberGenerator: any);
    write_header(finalC: any, buf: DataStream | DataView, length: any): void;
    writeSequenceHeader(block: DataStream | DataView): void;
    /**
     * @method write
     * @param buffer {Buffer}
     * @param length {Integer} - optional if not provided  buffer.length is used instead.
     */
    write(buffer: ArrayBuffer, length: number): void;
    /**
     * @method abort
     *
     */
    abort(): void;
    /**
     * @method end
     */
    end(): void;
}
