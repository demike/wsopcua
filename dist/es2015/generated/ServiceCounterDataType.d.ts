import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IServiceCounterDataType {
    totalCount?: ec.UInt32;
    errorCount?: ec.UInt32;
}
/**

*/
export declare class ServiceCounterDataType {
    totalCount: ec.UInt32;
    errorCount: ec.UInt32;
    constructor(options?: IServiceCounterDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ServiceCounterDataType): ServiceCounterDataType;
}
export declare function decodeServiceCounterDataType(inp: DataStream): ServiceCounterDataType;
