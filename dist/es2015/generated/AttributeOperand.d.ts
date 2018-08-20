import * as ec from '../basic-types';
import { RelativePath } from './RelativePath';
import { DataStream } from '../basic-types/DataStream';
import { FilterOperand } from './FilterOperand';
export interface IAttributeOperand {
    nodeId?: ec.NodeId;
    alias?: string;
    browsePath?: RelativePath;
    attributeId?: ec.UInt32;
    indexRange?: string;
}
/**

*/
export declare class AttributeOperand extends FilterOperand {
    nodeId: ec.NodeId;
    alias: string;
    browsePath: RelativePath;
    attributeId: ec.UInt32;
    indexRange: string;
    constructor(options?: IAttributeOperand);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AttributeOperand): AttributeOperand;
}
export declare function decodeAttributeOperand(inp: DataStream): AttributeOperand;
