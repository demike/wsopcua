import { DataStream } from '../basic-types/DataStream';
export declare enum PerformUpdateType {
    Insert = 1,
    Replace = 2,
    Update = 3,
    Remove = 4
}
export declare function encodePerformUpdateType(data: PerformUpdateType, out: DataStream): void;
export declare function decodePerformUpdateType(inp: DataStream): number;
