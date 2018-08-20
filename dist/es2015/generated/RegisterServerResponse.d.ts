import { ResponseHeader } from './ResponseHeader';
import { DataStream } from '../basic-types/DataStream';
export interface IRegisterServerResponse {
    responseHeader?: ResponseHeader;
}
/**
Registers a server with the discovery server.
*/
export declare class RegisterServerResponse {
    responseHeader: ResponseHeader;
    constructor(options?: IRegisterServerResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RegisterServerResponse): RegisterServerResponse;
}
export declare function decodeRegisterServerResponse(inp: DataStream): RegisterServerResponse;
