import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ITimeZoneDataType {
    offset?: ec.Int16;
    daylightSavingInOffset?: boolean;
}
/**

*/
export declare class TimeZoneDataType {
    offset: ec.Int16;
    daylightSavingInOffset: boolean;
    constructor(options?: ITimeZoneDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: TimeZoneDataType): TimeZoneDataType;
}
export declare function decodeTimeZoneDataType(inp: DataStream): TimeZoneDataType;
