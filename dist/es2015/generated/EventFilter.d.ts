import { SimpleAttributeOperand } from './SimpleAttributeOperand';
import { ContentFilter } from './ContentFilter';
import { DataStream } from '../basic-types/DataStream';
import { MonitoringFilter } from './MonitoringFilter';
export interface IEventFilter {
    selectClauses?: SimpleAttributeOperand[];
    whereClause?: ContentFilter;
}
/**

*/
export declare class EventFilter extends MonitoringFilter {
    selectClauses: SimpleAttributeOperand[];
    whereClause: ContentFilter;
    constructor(options?: IEventFilter);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EventFilter): EventFilter;
}
export declare function decodeEventFilter(inp: DataStream): EventFilter;
