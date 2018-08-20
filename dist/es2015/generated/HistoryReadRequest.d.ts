import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { TimestampsToReturn } from './TimestampsToReturn';
import { HistoryReadValueId } from './HistoryReadValueId';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryReadRequest {
    requestHeader?: RequestHeader;
    historyReadDetails?: ec.ExtensionObject;
    timestampsToReturn?: TimestampsToReturn;
    releaseContinuationPoints?: boolean;
    nodesToRead?: HistoryReadValueId[];
}
/**

*/
export declare class HistoryReadRequest {
    requestHeader: RequestHeader;
    historyReadDetails: ec.ExtensionObject;
    timestampsToReturn: TimestampsToReturn;
    releaseContinuationPoints: boolean;
    nodesToRead: HistoryReadValueId[];
    constructor(options?: IHistoryReadRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryReadRequest): HistoryReadRequest;
}
export declare function decodeHistoryReadRequest(inp: DataStream): HistoryReadRequest;
