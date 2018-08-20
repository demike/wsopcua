import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryUpdateResult {
    statusCode?: ec.StatusCode;
    operationResults?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class HistoryUpdateResult {
    statusCode: ec.StatusCode;
    operationResults: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IHistoryUpdateResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryUpdateResult): HistoryUpdateResult;
}
export declare function decodeHistoryUpdateResult(inp: DataStream): HistoryUpdateResult;
