import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface ISetMonitoringModeResponse {
    responseHeader?: ResponseHeader;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class SetMonitoringModeResponse {
    responseHeader: ResponseHeader;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: ISetMonitoringModeResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SetMonitoringModeResponse): SetMonitoringModeResponse;
}
export declare function decodeSetMonitoringModeResponse(inp: DataStream): SetMonitoringModeResponse;
