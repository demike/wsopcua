import * as ec from '../basic-types';
import { ModificationInfo } from './ModificationInfo';
import { DataStream } from '../basic-types/DataStream';
import { HistoryData } from './HistoryData';
import { IHistoryData } from './HistoryData';
export interface IHistoryModifiedData extends IHistoryData {
    noOfDataValues?: ec.Int32;
    modificationInfos?: ModificationInfo[];
}
/**

*/
export declare class HistoryModifiedData extends HistoryData {
    noOfDataValues: ec.Int32;
    modificationInfos: ModificationInfo[];
    constructor(options?: IHistoryModifiedData);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryModifiedData): HistoryModifiedData;
}
export declare function decodeHistoryModifiedData(inp: DataStream): HistoryModifiedData;
