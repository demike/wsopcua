import { DataStream } from '../basic-types/DataStream';
export declare enum OpenFileMode {
    Read = 1,
    Write = 2,
    EraseExisting = 4,
    Append = 8
}
export declare function encodeOpenFileMode(data: OpenFileMode, out: DataStream): void;
export declare function decodeOpenFileMode(inp: DataStream): number;
