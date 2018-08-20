import { DataStream } from '../basic-types/DataStream';
export declare enum AxisScaleEnumeration {
    Linear = 0,
    Log = 1,
    Ln = 2
}
export declare function encodeAxisScaleEnumeration(data: AxisScaleEnumeration, out: DataStream): void;
export declare function decodeAxisScaleEnumeration(inp: DataStream): number;
