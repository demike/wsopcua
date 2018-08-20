import { ResponseHeader } from './ResponseHeader';
import { CallMethodResult } from './CallMethodResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface ICallResponse {
    responseHeader?: ResponseHeader;
    results?: CallMethodResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class CallResponse {
    responseHeader: ResponseHeader;
    results: CallMethodResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: ICallResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CallResponse): CallResponse;
}
export declare function decodeCallResponse(inp: DataStream): CallResponse;
