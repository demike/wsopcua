import { DataStream } from '../basic-types/DataStream';
export declare enum StructureType {
    Structure = 0,
    StructureWithOptionalFields = 1,
    Union = 2
}
export declare function encodeStructureType(data: StructureType, out: DataStream): void;
export declare function decodeStructureType(inp: DataStream): number;
