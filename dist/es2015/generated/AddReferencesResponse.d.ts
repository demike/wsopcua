import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IAddReferencesResponse {
    responseHeader?: ResponseHeader;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**
Adds one or more references to the server address space.
*/
export declare class AddReferencesResponse {
    responseHeader: ResponseHeader;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IAddReferencesResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AddReferencesResponse): AddReferencesResponse;
}
export declare function decodeAddReferencesResponse(inp: DataStream): AddReferencesResponse;
