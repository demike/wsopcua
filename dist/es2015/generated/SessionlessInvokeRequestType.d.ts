import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ISessionlessInvokeRequestType {
    urisVersion?: ec.UInt32[];
    namespaceUris?: string[];
    serverUris?: string[];
    localeIds?: string[];
    serviceId?: ec.UInt32;
}
/**

*/
export declare class SessionlessInvokeRequestType {
    urisVersion: ec.UInt32[];
    namespaceUris: string[];
    serverUris: string[];
    localeIds: string[];
    serviceId: ec.UInt32;
    constructor(options?: ISessionlessInvokeRequestType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SessionlessInvokeRequestType): SessionlessInvokeRequestType;
}
export declare function decodeSessionlessInvokeRequestType(inp: DataStream): SessionlessInvokeRequestType;
