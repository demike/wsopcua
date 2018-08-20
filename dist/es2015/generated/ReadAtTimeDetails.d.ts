import { DataStream } from '../basic-types/DataStream';
import { HistoryReadDetails } from './HistoryReadDetails';
export interface IReadAtTimeDetails {
    reqTimes?: Date[];
    useSimpleBounds?: boolean;
}
/**

*/
export declare class ReadAtTimeDetails extends HistoryReadDetails {
    reqTimes: Date[];
    useSimpleBounds: boolean;
    constructor(options?: IReadAtTimeDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReadAtTimeDetails): ReadAtTimeDetails;
}
export declare function decodeReadAtTimeDetails(inp: DataStream): ReadAtTimeDetails;
