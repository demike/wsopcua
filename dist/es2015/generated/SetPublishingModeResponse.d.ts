import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface ISetPublishingModeResponse {
    responseHeader?: ResponseHeader;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class SetPublishingModeResponse {
    responseHeader: ResponseHeader;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: ISetPublishingModeResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SetPublishingModeResponse): SetPublishingModeResponse;
}
export declare function decodeSetPublishingModeResponse(inp: DataStream): SetPublishingModeResponse;
