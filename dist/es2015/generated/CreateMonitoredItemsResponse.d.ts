import { ResponseHeader } from './ResponseHeader';
import { MonitoredItemCreateResult } from './MonitoredItemCreateResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface ICreateMonitoredItemsResponse {
    responseHeader?: ResponseHeader;
    results?: MonitoredItemCreateResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class CreateMonitoredItemsResponse {
    responseHeader: ResponseHeader;
    results: MonitoredItemCreateResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: ICreateMonitoredItemsResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CreateMonitoredItemsResponse): CreateMonitoredItemsResponse;
}
export declare function decodeCreateMonitoredItemsResponse(inp: DataStream): CreateMonitoredItemsResponse;
