import * as ec from '../basic-types';
import { DataValue } from './DataValue';
import { DataStream } from '../basic-types/DataStream';
export interface IWriteValue {
    nodeId?: ec.NodeId;
    attributeId?: ec.UInt32;
    indexRange?: string;
    value?: DataValue;
}
/**

*/
export declare class WriteValue {
    nodeId: ec.NodeId;
    attributeId: ec.UInt32;
    indexRange: string;
    value: DataValue;
    constructor(options?: IWriteValue);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: WriteValue): WriteValue;
}
export declare function decodeWriteValue(inp: DataStream): WriteValue;
