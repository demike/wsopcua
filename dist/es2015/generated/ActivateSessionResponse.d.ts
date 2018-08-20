import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IActivateSessionResponse {
    responseHeader?: ResponseHeader;
    serverNonce?: Uint8Array;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**
Activates a session with the server.
*/
export declare class ActivateSessionResponse {
    responseHeader: ResponseHeader;
    serverNonce: Uint8Array;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IActivateSessionResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ActivateSessionResponse): ActivateSessionResponse;
}
export declare function decodeActivateSessionResponse(inp: DataStream): ActivateSessionResponse;
