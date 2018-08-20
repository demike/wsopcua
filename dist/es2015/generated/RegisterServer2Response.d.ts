import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IRegisterServer2Response {
    responseHeader?: ResponseHeader;
    configurationResults?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class RegisterServer2Response {
    responseHeader: ResponseHeader;
    configurationResults: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IRegisterServer2Response);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RegisterServer2Response): RegisterServer2Response;
}
export declare function decodeRegisterServer2Response(inp: DataStream): RegisterServer2Response;
