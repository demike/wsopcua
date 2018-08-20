import { DataStream } from '../basic-types/DataStream';
export declare enum TimestampsToReturn {
    Source = 0,
    Server = 1,
    Both = 2,
    Neither = 3,
    Invalid = 4
}
export declare function encodeTimestampsToReturn(data: TimestampsToReturn, out: DataStream): void;
export declare function decodeTimestampsToReturn(inp: DataStream): number;
