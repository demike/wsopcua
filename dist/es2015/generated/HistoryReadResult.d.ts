import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryReadResult {
    statusCode?: ec.StatusCode;
    continuationPoint?: Uint8Array;
    historyData?: ec.ExtensionObject;
}
/**

*/
export declare class HistoryReadResult {
    statusCode: ec.StatusCode;
    continuationPoint: Uint8Array;
    historyData: ec.ExtensionObject;
    constructor(options?: IHistoryReadResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryReadResult): HistoryReadResult;
}
export declare function decodeHistoryReadResult(inp: DataStream): HistoryReadResult;
