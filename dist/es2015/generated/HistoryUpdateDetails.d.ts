import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryUpdateDetails {
    nodeId?: ec.NodeId;
}
/**

*/
export declare class HistoryUpdateDetails {
    nodeId: ec.NodeId;
    constructor(options?: IHistoryUpdateDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryUpdateDetails): HistoryUpdateDetails;
}
export declare function decodeHistoryUpdateDetails(inp: DataStream): HistoryUpdateDetails;
