import { PerformUpdateType } from './PerformUpdateType';
import { EventFilter } from './EventFilter';
import { HistoryEventFieldList } from './HistoryEventFieldList';
import { DataStream } from '../basic-types/DataStream';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
import { IHistoryUpdateDetails } from './HistoryUpdateDetails';
export interface IUpdateEventDetails extends IHistoryUpdateDetails {
    performInsertReplace?: PerformUpdateType;
    filter?: EventFilter;
    eventData?: HistoryEventFieldList[];
}
/**

*/
export declare class UpdateEventDetails extends HistoryUpdateDetails {
    performInsertReplace: PerformUpdateType;
    filter: EventFilter;
    eventData: HistoryEventFieldList[];
    constructor(options?: IUpdateEventDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: UpdateEventDetails): UpdateEventDetails;
}
export declare function decodeUpdateEventDetails(inp: DataStream): UpdateEventDetails;
