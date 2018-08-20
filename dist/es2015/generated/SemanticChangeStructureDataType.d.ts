import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ISemanticChangeStructureDataType {
    affected?: ec.NodeId;
    affectedType?: ec.NodeId;
}
/**

*/
export declare class SemanticChangeStructureDataType {
    affected: ec.NodeId;
    affectedType: ec.NodeId;
    constructor(options?: ISemanticChangeStructureDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SemanticChangeStructureDataType): SemanticChangeStructureDataType;
}
export declare function decodeSemanticChangeStructureDataType(inp: DataStream): SemanticChangeStructureDataType;
