import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
import { DataStream } from '../basic-types/DataStream';
export interface IStructureField {
    name?: string;
    description?: LocalizedText;
    dataType?: ec.NodeId;
    valueRank?: ec.Int32;
    arrayDimensions?: ec.UInt32[];
    maxStringLength?: ec.UInt32;
    isOptional?: boolean;
}
/**

*/
export declare class StructureField {
    name: string;
    description: LocalizedText;
    dataType: ec.NodeId;
    valueRank: ec.Int32;
    arrayDimensions: ec.UInt32[];
    maxStringLength: ec.UInt32;
    isOptional: boolean;
    constructor(options?: IStructureField);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: StructureField): StructureField;
}
export declare function decodeStructureField(inp: DataStream): StructureField;
