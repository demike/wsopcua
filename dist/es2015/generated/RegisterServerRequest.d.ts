import { RequestHeader } from './RequestHeader';
import { RegisteredServer } from './RegisteredServer';
import { DataStream } from '../basic-types/DataStream';
export interface IRegisterServerRequest {
    requestHeader?: RequestHeader;
    server?: RegisteredServer;
}
/**
Registers a server with the discovery server.
*/
export declare class RegisterServerRequest {
    requestHeader: RequestHeader;
    server: RegisteredServer;
    constructor(options?: IRegisterServerRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RegisterServerRequest): RegisterServerRequest;
}
export declare function decodeRegisterServerRequest(inp: DataStream): RegisterServerRequest;
