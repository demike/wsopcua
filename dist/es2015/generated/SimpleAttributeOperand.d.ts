import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
import { DataStream } from '../basic-types/DataStream';
import { FilterOperand } from './FilterOperand';
export interface ISimpleAttributeOperand {
    typeDefinitionId?: ec.NodeId;
    browsePath?: QualifiedName[];
    attributeId?: ec.UInt32;
    indexRange?: string;
}
/**

*/
export declare class SimpleAttributeOperand extends FilterOperand {
    typeDefinitionId: ec.NodeId;
    browsePath: QualifiedName[];
    attributeId: ec.UInt32;
    indexRange: string;
    constructor(options?: ISimpleAttributeOperand);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SimpleAttributeOperand): SimpleAttributeOperand;
}
export declare function decodeSimpleAttributeOperand(inp: DataStream): SimpleAttributeOperand;
