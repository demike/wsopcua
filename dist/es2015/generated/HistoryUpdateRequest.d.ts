import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryUpdateRequest {
    requestHeader?: RequestHeader;
    historyUpdateDetails?: ec.ExtensionObject[];
}
/**

*/
export declare class HistoryUpdateRequest {
    requestHeader: RequestHeader;
    historyUpdateDetails: ec.ExtensionObject[];
    constructor(options?: IHistoryUpdateRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryUpdateRequest): HistoryUpdateRequest;
}
export declare function decodeHistoryUpdateRequest(inp: DataStream): HistoryUpdateRequest;
