import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IGuidNodeId {
    namespaceIndex?: ec.UInt16;
    identifier?: ec.Guid;
}
/**

*/
export declare class GuidNodeId {
    namespaceIndex: ec.UInt16;
    identifier: ec.Guid;
    constructor(options?: IGuidNodeId);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: GuidNodeId): GuidNodeId;
}
export declare function decodeGuidNodeId(inp: DataStream): GuidNodeId;
