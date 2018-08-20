import { ResponseHeader } from './ResponseHeader';
import { MonitoredItemModifyResult } from './MonitoredItemModifyResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IModifyMonitoredItemsResponse {
    responseHeader?: ResponseHeader;
    results?: MonitoredItemModifyResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class ModifyMonitoredItemsResponse {
    responseHeader: ResponseHeader;
    results: MonitoredItemModifyResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IModifyMonitoredItemsResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ModifyMonitoredItemsResponse): ModifyMonitoredItemsResponse;
}
export declare function decodeModifyMonitoredItemsResponse(inp: DataStream): ModifyMonitoredItemsResponse;
