import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IFourByteNodeId {
    namespaceIndex?: ec.Byte;
    identifier?: ec.UInt16;
}
/**

*/
export declare class FourByteNodeId {
    namespaceIndex: ec.Byte;
    identifier: ec.UInt16;
    constructor(options?: IFourByteNodeId);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: FourByteNodeId): FourByteNodeId;
}
export declare function decodeFourByteNodeId(inp: DataStream): FourByteNodeId;
