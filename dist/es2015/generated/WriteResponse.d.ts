import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IWriteResponse {
    responseHeader?: ResponseHeader;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class WriteResponse {
    responseHeader: ResponseHeader;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IWriteResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: WriteResponse): WriteResponse;
}
export declare function decodeWriteResponse(inp: DataStream): WriteResponse;
