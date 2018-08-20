import { DataStream } from '../basic-types/DataStream';
export declare enum EventNotifierType {
    None = 0,
    SubscribeToEvents = 1,
    HistoryRead = 4,
    HistoryWrite = 8
}
export declare function encodeEventNotifierType(data: EventNotifierType, out: DataStream): void;
export declare function decodeEventNotifierType(inp: DataStream): number;
