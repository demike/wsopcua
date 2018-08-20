import { DataStream } from '../basic-types/DataStream';
export declare enum ExceptionDeviationFormat {
    AbsoluteValue = 0,
    PercentOfValue = 1,
    PercentOfRange = 2,
    PercentOfEURange = 3,
    Unknown = 4
}
export declare function encodeExceptionDeviationFormat(data: ExceptionDeviationFormat, out: DataStream): void;
export declare function decodeExceptionDeviationFormat(inp: DataStream): number;
