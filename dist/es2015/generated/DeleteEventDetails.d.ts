import { DataStream } from '../basic-types/DataStream';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
import { IHistoryUpdateDetails } from './HistoryUpdateDetails';
export interface IDeleteEventDetails extends IHistoryUpdateDetails {
    eventIds?: Uint8Array[];
}
/**

*/
export declare class DeleteEventDetails extends HistoryUpdateDetails {
    eventIds: Uint8Array[];
    constructor(options?: IDeleteEventDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteEventDetails): DeleteEventDetails;
}
export declare function decodeDeleteEventDetails(inp: DataStream): DeleteEventDetails;
