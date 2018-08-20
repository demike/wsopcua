import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IRequestHeader {
    authenticationToken?: ec.NodeId;
    timestamp?: Date;
    requestHandle?: ec.UInt32;
    returnDiagnostics?: ec.UInt32;
    auditEntryId?: string;
    timeoutHint?: ec.UInt32;
    additionalHeader?: ec.ExtensionObject;
}
/**
The header passed with every server request.
*/
export declare class RequestHeader {
    authenticationToken: ec.NodeId;
    timestamp: Date;
    requestHandle: ec.UInt32;
    returnDiagnostics: ec.UInt32;
    auditEntryId: string;
    timeoutHint: ec.UInt32;
    additionalHeader: ec.ExtensionObject;
    constructor(options?: IRequestHeader);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RequestHeader): RequestHeader;
}
export declare function decodeRequestHeader(inp: DataStream): RequestHeader;
