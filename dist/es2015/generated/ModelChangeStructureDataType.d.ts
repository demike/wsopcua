import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IModelChangeStructureDataType {
    affected?: ec.NodeId;
    affectedType?: ec.NodeId;
    verb?: ec.Byte;
}
/**

*/
export declare class ModelChangeStructureDataType {
    affected: ec.NodeId;
    affectedType: ec.NodeId;
    verb: ec.Byte;
    constructor(options?: IModelChangeStructureDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ModelChangeStructureDataType): ModelChangeStructureDataType;
}
export declare function decodeModelChangeStructureDataType(inp: DataStream): ModelChangeStructureDataType;
