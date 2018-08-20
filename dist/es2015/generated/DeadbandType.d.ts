import { DataStream } from '../basic-types/DataStream';
export declare enum DeadbandType {
    None = 0,
    Absolute = 1,
    Percent = 2
}
export declare function encodeDeadbandType(data: DeadbandType, out: DataStream): void;
export declare function decodeDeadbandType(inp: DataStream): number;
