import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryEventFieldList {
    eventFields?: Variant[];
}
/**

*/
export declare class HistoryEventFieldList {
    eventFields: Variant[];
    constructor(options?: IHistoryEventFieldList);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryEventFieldList): HistoryEventFieldList;
}
export declare function decodeHistoryEventFieldList(inp: DataStream): HistoryEventFieldList;
