import { ResponseHeader } from './ResponseHeader';
import { HistoryReadResult } from './HistoryReadResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryReadResponse {
    responseHeader?: ResponseHeader;
    results?: HistoryReadResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class HistoryReadResponse {
    responseHeader: ResponseHeader;
    results: HistoryReadResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IHistoryReadResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryReadResponse): HistoryReadResponse;
}
export declare function decodeHistoryReadResponse(inp: DataStream): HistoryReadResponse;
