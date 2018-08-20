import { HistoryEventFieldList } from './HistoryEventFieldList';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryEvent {
    events?: HistoryEventFieldList[];
}
/**

*/
export declare class HistoryEvent {
    events: HistoryEventFieldList[];
    constructor(options?: IHistoryEvent);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryEvent): HistoryEvent;
}
export declare function decodeHistoryEvent(inp: DataStream): HistoryEvent;
