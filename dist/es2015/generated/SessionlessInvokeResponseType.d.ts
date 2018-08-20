import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ISessionlessInvokeResponseType {
    namespaceUris?: string[];
    serverUris?: string[];
    serviceId?: ec.UInt32;
}
/**

*/
export declare class SessionlessInvokeResponseType {
    namespaceUris: string[];
    serverUris: string[];
    serviceId: ec.UInt32;
    constructor(options?: ISessionlessInvokeResponseType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SessionlessInvokeResponseType): SessionlessInvokeResponseType;
}
export declare function decodeSessionlessInvokeResponseType(inp: DataStream): SessionlessInvokeResponseType;
