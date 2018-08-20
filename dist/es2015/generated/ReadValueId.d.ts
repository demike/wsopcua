import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
import { DataStream } from '../basic-types/DataStream';
export interface IReadValueId {
    nodeId?: ec.NodeId;
    attributeId?: ec.UInt32;
    indexRange?: string;
    dataEncoding?: QualifiedName;
}
/**

*/
export declare class ReadValueId {
    nodeId: ec.NodeId;
    attributeId: ec.UInt32;
    indexRange: string;
    dataEncoding: QualifiedName;
    constructor(options?: IReadValueId);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReadValueId): ReadValueId;
}
export declare function decodeReadValueId(inp: DataStream): ReadValueId;
