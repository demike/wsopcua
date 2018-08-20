import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IStringNodeId {
    namespaceIndex?: ec.UInt16;
    identifier?: string;
}
/**

*/
export declare class StringNodeId {
    namespaceIndex: ec.UInt16;
    identifier: string;
    constructor(options?: IStringNodeId);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: StringNodeId): StringNodeId;
}
export declare function decodeStringNodeId(inp: DataStream): StringNodeId;
