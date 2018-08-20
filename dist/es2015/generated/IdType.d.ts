import { DataStream } from '../basic-types/DataStream';
/**
The type of identifier used in a node id.*/
export declare enum IdType {
    Numeric = 0,
    String = 1,
    Guid = 2,
    Opaque = 3
}
export declare function encodeIdType(data: IdType, out: DataStream): void;
export declare function decodeIdType(inp: DataStream): number;
