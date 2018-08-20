import * as ec from '../basic-types';
import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
export interface IEventFieldList {
    clientHandle?: ec.UInt32;
    eventFields?: Variant[];
}
/**

*/
export declare class EventFieldList {
    clientHandle: ec.UInt32;
    eventFields: Variant[];
    constructor(options?: IEventFieldList);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EventFieldList): EventFieldList;
}
export declare function decodeEventFieldList(inp: DataStream): EventFieldList;
