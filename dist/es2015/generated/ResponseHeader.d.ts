import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IResponseHeader {
    timestamp?: Date;
    requestHandle?: ec.UInt32;
    serviceResult?: ec.StatusCode;
    serviceDiagnostics?: DiagnosticInfo;
    stringTable?: string[];
    additionalHeader?: ec.ExtensionObject;
}
/**
The header passed with every server response.
*/
export declare class ResponseHeader {
    timestamp: Date;
    requestHandle: ec.UInt32;
    serviceResult: ec.StatusCode;
    serviceDiagnostics: DiagnosticInfo;
    stringTable: string[];
    additionalHeader: ec.ExtensionObject;
    constructor(options?: IResponseHeader);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ResponseHeader): ResponseHeader;
}
export declare function decodeResponseHeader(inp: DataStream): ResponseHeader;
