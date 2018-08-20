import { DataStream } from '../basic-types/DataStream';
export interface IOptionSet {
    value?: Uint8Array;
    validBits?: Uint8Array;
}
/**
This abstract Structured DataType is the base DataType for all DataTypes representing a bit mask.
*/
export declare class OptionSet {
    value: Uint8Array;
    validBits: Uint8Array;
    constructor(options?: IOptionSet);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: OptionSet): OptionSet;
}
export declare function decodeOptionSet(inp: DataStream): OptionSet;
