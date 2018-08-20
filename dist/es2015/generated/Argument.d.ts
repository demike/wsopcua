import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
import { DataStream } from '../basic-types/DataStream';
export interface IArgument {
    name?: string;
    dataType?: ec.NodeId;
    valueRank?: ec.Int32;
    arrayDimensions?: ec.UInt32[];
    description?: LocalizedText;
}
/**
An argument for a method.
*/
export declare class Argument {
    name: string;
    dataType: ec.NodeId;
    valueRank: ec.Int32;
    arrayDimensions: ec.UInt32[];
    description: LocalizedText;
    constructor(options?: IArgument);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: Argument): Argument;
}
export declare function decodeArgument(inp: DataStream): Argument;
