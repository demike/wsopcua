import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ITwoByteNodeId {
    identifier?: ec.Byte;
}
/**

*/
export declare class TwoByteNodeId {
    identifier: ec.Byte;
    constructor(options?: ITwoByteNodeId);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: TwoByteNodeId): TwoByteNodeId;
}
export declare function decodeTwoByteNodeId(inp: DataStream): TwoByteNodeId;
