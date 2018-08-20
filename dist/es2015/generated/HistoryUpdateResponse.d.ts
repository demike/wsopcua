import { ResponseHeader } from './ResponseHeader';
import { HistoryUpdateResult } from './HistoryUpdateResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryUpdateResponse {
    responseHeader?: ResponseHeader;
    results?: HistoryUpdateResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class HistoryUpdateResponse {
    responseHeader: ResponseHeader;
    results: HistoryUpdateResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IHistoryUpdateResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryUpdateResponse): HistoryUpdateResponse;
}
export declare function decodeHistoryUpdateResponse(inp: DataStream): HistoryUpdateResponse;
