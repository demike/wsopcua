import { DataStream } from '../basic-types/DataStream';
export declare enum RedundancySupport {
    None = 0,
    Cold = 1,
    Warm = 2,
    Hot = 3,
    Transparent = 4,
    HotAndMirrored = 5
}
export declare function encodeRedundancySupport(data: RedundancySupport, out: DataStream): void;
export declare function decodeRedundancySupport(inp: DataStream): number;
