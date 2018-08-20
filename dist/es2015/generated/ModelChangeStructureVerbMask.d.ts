import { DataStream } from '../basic-types/DataStream';
export declare enum ModelChangeStructureVerbMask {
    NodeAdded = 1,
    NodeDeleted = 2,
    ReferenceAdded = 4,
    ReferenceDeleted = 8,
    DataTypeChanged = 16
}
export declare function encodeModelChangeStructureVerbMask(data: ModelChangeStructureVerbMask, out: DataStream): void;
export declare function decodeModelChangeStructureVerbMask(inp: DataStream): number;
