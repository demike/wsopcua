import * as ec from '../basic-types';
import { StructureType } from './StructureType';
import { StructureField } from './StructureField';
import { DataStream } from '../basic-types/DataStream';
export interface IStructureDefinition {
    defaultEncodingId?: ec.NodeId;
    baseDataType?: ec.NodeId;
    structureType?: StructureType;
    fields?: StructureField[];
}
/**

*/
export declare class StructureDefinition {
    defaultEncodingId: ec.NodeId;
    baseDataType: ec.NodeId;
    structureType: StructureType;
    fields: StructureField[];
    constructor(options?: IStructureDefinition);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: StructureDefinition): StructureDefinition;
}
export declare function decodeStructureDefinition(inp: DataStream): StructureDefinition;
