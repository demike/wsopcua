import { DataStream } from '../basic-types/DataStream';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
import { IHistoryUpdateDetails } from './HistoryUpdateDetails';
export interface IDeleteAtTimeDetails extends IHistoryUpdateDetails {
    reqTimes?: Date[];
}
/**

*/
export declare class DeleteAtTimeDetails extends HistoryUpdateDetails {
    reqTimes: Date[];
    constructor(options?: IDeleteAtTimeDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteAtTimeDetails): DeleteAtTimeDetails;
}
export declare function decodeDeleteAtTimeDetails(inp: DataStream): DeleteAtTimeDetails;
