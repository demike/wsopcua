import { DataStream } from '../basic-types/DataStream';
export declare enum HistoryUpdateType {
    Insert = 1,
    Replace = 2,
    Update = 3,
    Delete = 4
}
export declare function encodeHistoryUpdateType(data: HistoryUpdateType, out: DataStream): void;
export declare function decodeHistoryUpdateType(inp: DataStream): number;
