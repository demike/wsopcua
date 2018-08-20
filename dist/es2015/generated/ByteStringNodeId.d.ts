import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IByteStringNodeId {
    namespaceIndex?: ec.UInt16;
    identifier?: Uint8Array;
}
/**

*/
export declare class ByteStringNodeId {
    namespaceIndex: ec.UInt16;
    identifier: Uint8Array;
    constructor(options?: IByteStringNodeId);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ByteStringNodeId): ByteStringNodeId;
}
export declare function decodeByteStringNodeId(inp: DataStream): ByteStringNodeId;
