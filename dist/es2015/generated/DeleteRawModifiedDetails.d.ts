import { DataStream } from '../basic-types/DataStream';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
import { IHistoryUpdateDetails } from './HistoryUpdateDetails';
export interface IDeleteRawModifiedDetails extends IHistoryUpdateDetails {
    isDeleteModified?: boolean;
    startTime?: Date;
    endTime?: Date;
}
/**

*/
export declare class DeleteRawModifiedDetails extends HistoryUpdateDetails {
    isDeleteModified: boolean;
    startTime: Date;
    endTime: Date;
    constructor(options?: IDeleteRawModifiedDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteRawModifiedDetails): DeleteRawModifiedDetails;
}
export declare function decodeDeleteRawModifiedDetails(inp: DataStream): DeleteRawModifiedDetails;
