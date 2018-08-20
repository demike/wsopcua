import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IRange {
    low?: ec.Double;
    high?: ec.Double;
}
/**

*/
export declare class Range {
    low: ec.Double;
    high: ec.Double;
    constructor(options?: IRange);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: Range): Range;
}
export declare function decodeRange(inp: DataStream): Range;
