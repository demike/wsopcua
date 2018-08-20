import { DataStream } from '../basic-types/DataStream';
export declare enum DataChangeTrigger {
    Status = 0,
    StatusValue = 1,
    StatusValueTimestamp = 2
}
export declare function encodeDataChangeTrigger(data: DataChangeTrigger, out: DataStream): void;
export declare function decodeDataChangeTrigger(inp: DataStream): number;
