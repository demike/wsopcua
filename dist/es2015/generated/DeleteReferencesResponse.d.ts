import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteReferencesResponse {
    responseHeader?: ResponseHeader;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**
Delete one or more references from the server address space.
*/
export declare class DeleteReferencesResponse {
    responseHeader: ResponseHeader;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IDeleteReferencesResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteReferencesResponse): DeleteReferencesResponse;
}
export declare function decodeDeleteReferencesResponse(inp: DataStream): DeleteReferencesResponse;
