import * as ec from '../basic-types';
import { EventFilter } from './EventFilter';
import { DataStream } from '../basic-types/DataStream';
import { HistoryReadDetails } from './HistoryReadDetails';
export interface IReadEventDetails {
    numValuesPerNode?: ec.UInt32;
    startTime?: Date;
    endTime?: Date;
    filter?: EventFilter;
}
/**

*/
export declare class ReadEventDetails extends HistoryReadDetails {
    numValuesPerNode: ec.UInt32;
    startTime: Date;
    endTime: Date;
    filter: EventFilter;
    constructor(options?: IReadEventDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReadEventDetails): ReadEventDetails;
}
export declare function decodeReadEventDetails(inp: DataStream): ReadEventDetails;
