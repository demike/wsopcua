import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface ISetTriggeringResponse {
    responseHeader?: ResponseHeader;
    addResults?: ec.StatusCode[];
    addDiagnosticInfos?: DiagnosticInfo[];
    removeResults?: ec.StatusCode[];
    removeDiagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class SetTriggeringResponse {
    responseHeader: ResponseHeader;
    addResults: ec.StatusCode[];
    addDiagnosticInfos: DiagnosticInfo[];
    removeResults: ec.StatusCode[];
    removeDiagnosticInfos: DiagnosticInfo[];
    constructor(options?: ISetTriggeringResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SetTriggeringResponse): SetTriggeringResponse;
}
export declare function decodeSetTriggeringResponse(inp: DataStream): SetTriggeringResponse;
