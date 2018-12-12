/**
 * @module opcua.miscellaneous
 */
import { EventEmitter } from 'eventemitter3';
import { DataStream } from '../basic-types/DataStream';
import { PacketAssembler } from '../packet-assembler/packet_assembler';
export declare function readRawMessageHeader(data: DataView | ArrayBuffer): {
    length: number;
    messageHeader: {
        msgType: string;
        isFinal: string;
        length: number;
    };
};
export declare abstract class MessageBuilderBase extends EventEmitter {
    signatureLength: number;
    options: any;
    packetAssembler: PacketAssembler;
    security_defeated: boolean;
    total_body_size: number;
    total_message_size: number;
    status_error: boolean;
    blocks: any[];
    message_chunks: DataView[];
    messageHeader: any;
    secureChannelId: any;
    expected_secureChannelId: boolean;
    protected _tick0: number;
    protected _tick1: number;
    sequenceHeader: any;
    constructor(options?: any);
    protected _init_new(): void;
    protected _read_headers(binaryStream: DataStream): boolean;
    /**
     * append a message chunk
     * @method _append
     * @param message_chunk
     * @private
     */
    protected _append(message_chunk: DataView | ArrayBuffer): boolean;
    /**
     * Feed message builder with some data
     * @method feed
     * @param data
     */
    feed(data: any): void;
    protected _feed_messageChunk(messageChunk: ArrayBuffer | DataView): boolean;
    _report_error(errorMessage: any): boolean;
    protected abstract _decode_message_body(full_message_body: any): any;
}
