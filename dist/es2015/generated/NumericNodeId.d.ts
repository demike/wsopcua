import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface INumericNodeId {
    namespaceIndex?: ec.UInt16;
    identifier?: ec.UInt32;
}
/**

*/
export declare class NumericNodeId {
    namespaceIndex: ec.UInt16;
    identifier: ec.UInt32;
    constructor(options?: INumericNodeId);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: NumericNodeId): NumericNodeId;
}
export declare function decodeNumericNodeId(inp: DataStream): NumericNodeId;
