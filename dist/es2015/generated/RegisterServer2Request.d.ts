import { RequestHeader } from './RequestHeader';
import { RegisteredServer } from './RegisteredServer';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IRegisterServer2Request {
    requestHeader?: RequestHeader;
    server?: RegisteredServer;
    discoveryConfiguration?: ec.ExtensionObject[];
}
/**

*/
export declare class RegisterServer2Request {
    requestHeader: RequestHeader;
    server: RegisteredServer;
    discoveryConfiguration: ec.ExtensionObject[];
    constructor(options?: IRegisterServer2Request);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RegisterServer2Request): RegisterServer2Request;
}
export declare function decodeRegisterServer2Request(inp: DataStream): RegisterServer2Request;
