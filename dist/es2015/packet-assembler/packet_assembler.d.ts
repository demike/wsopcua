/**
 * @module opcua.transport
 */
import { EventEmitter } from 'eventemitter3';
/***
 * @class PacketAssembler
 * @param options
 * @param options.readMessageFunc {Function} a function to read
 * @param options.minimumSizeInBytes {Integer} the minimum number of bytes that need to be received before the
 *                                             readMessageFunc can be called
 * @constructor
 */
export declare class PacketAssembler extends EventEmitter {
    packet_info: any;
    minimumSizeInBytes: any;
    readMessageFunc: any;
    currentLength: number;
    expectedLength: number;
    protected _stack: any[];
    constructor(options: any);
    protected _read_packet_info(data: DataView): any;
    protected _build_data(data: any): any;
    feed(data: DataView): void;
}
