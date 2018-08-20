import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IDecimalDataType {
    scale?: ec.Int16;
    value?: Uint8Array;
}
/**

*/
export declare class DecimalDataType {
    scale: ec.Int16;
    value: Uint8Array;
    constructor(options?: IDecimalDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DecimalDataType): DecimalDataType;
}
export declare function decodeDecimalDataType(inp: DataStream): DecimalDataType;
