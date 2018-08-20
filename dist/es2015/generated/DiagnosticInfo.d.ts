import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IDiagnosticInfo {
    symbolicId?: ec.Int32;
    namespaceURI?: ec.Int32;
    locale?: ec.Int32;
    localizedText?: ec.Int32;
    additionalInfo?: string;
    innerStatusCode?: ec.StatusCode;
    innerDiagnosticInfo?: DiagnosticInfo;
}
/**
A recursive structure containing diagnostic information associated with a status code.
*/
export declare class DiagnosticInfo {
    symbolicId: ec.Int32;
    namespaceURI: ec.Int32;
    locale: ec.Int32;
    localizedText: ec.Int32;
    additionalInfo: string;
    innerStatusCode: ec.StatusCode;
    innerDiagnosticInfo: DiagnosticInfo;
    constructor(options?: IDiagnosticInfo);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DiagnosticInfo): DiagnosticInfo;
}
export declare function decodeDiagnosticInfo(inp: DataStream): DiagnosticInfo;
