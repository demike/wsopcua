import { DataStream } from '../basic-types/DataStream';
export declare enum AccessLevelType {
    None = 0,
    CurrentRead = 1,
    CurrentWrite = 2,
    HistoryRead = 4,
    HistoryWrite = 16,
    StatusWrite = 32,
    TimestampWrite = 64
}
export declare function encodeAccessLevelType(data: AccessLevelType, out: DataStream): void;
export declare function decodeAccessLevelType(inp: DataStream): number;
