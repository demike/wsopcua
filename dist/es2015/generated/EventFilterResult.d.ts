import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { ContentFilterResult } from './ContentFilterResult';
import { DataStream } from '../basic-types/DataStream';
import { MonitoringFilterResult } from './MonitoringFilterResult';
export interface IEventFilterResult {
    selectClauseResults?: ec.StatusCode[];
    selectClauseDiagnosticInfos?: DiagnosticInfo[];
    whereClauseResult?: ContentFilterResult;
}
/**

*/
export declare class EventFilterResult extends MonitoringFilterResult {
    selectClauseResults: ec.StatusCode[];
    selectClauseDiagnosticInfos: DiagnosticInfo[];
    whereClauseResult: ContentFilterResult;
    constructor(options?: IEventFilterResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EventFilterResult): EventFilterResult;
}
export declare function decodeEventFilterResult(inp: DataStream): EventFilterResult;
