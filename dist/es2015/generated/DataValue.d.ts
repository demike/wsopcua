import { Variant } from '../variant';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IDataValue {
    value?: Variant;
    statusCode?: ec.StatusCode;
    sourceTimestamp?: Date;
    sourcePicoseconds?: ec.UInt16;
    serverTimestamp?: Date;
    serverPicoseconds?: ec.UInt16;
}
/**
A value with an associated timestamp, and quality.
*/
export declare class DataValue {
    value: Variant;
    statusCode: ec.StatusCode;
    sourceTimestamp: Date;
    sourcePicoseconds: ec.UInt16;
    serverTimestamp: Date;
    serverPicoseconds: ec.UInt16;
    constructor(options?: IDataValue);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DataValue): DataValue;
}
export declare function decodeDataValue(inp: DataStream): DataValue;
