import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteMonitoredItemsResponse {
    responseHeader?: ResponseHeader;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class DeleteMonitoredItemsResponse {
    responseHeader: ResponseHeader;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IDeleteMonitoredItemsResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteMonitoredItemsResponse): DeleteMonitoredItemsResponse;
}
export declare function decodeDeleteMonitoredItemsResponse(inp: DataStream): DeleteMonitoredItemsResponse;
