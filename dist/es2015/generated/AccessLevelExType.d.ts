import { DataStream } from '../basic-types/DataStream';
export declare enum AccessLevelExType {
    None = 0,
    CurrentRead = 1,
    CurrentWrite = 2,
    HistoryRead = 4,
    HistoryWrite = 16,
    StatusWrite = 32,
    TimestampWrite = 64,
    NonatomicRead = 65536,
    NonatomicWrite = 131072,
    WriteFullArrayOnly = 262144
}
export declare function encodeAccessLevelExType(data: AccessLevelExType, out: DataStream): void;
export declare function decodeAccessLevelExType(inp: DataStream): number;
