import { ResponseHeader } from './ResponseHeader';
import { DataStream } from '../basic-types/DataStream';
export interface ICloseSessionResponse {
    responseHeader?: ResponseHeader;
}
/**
Closes a session with the server.
*/
export declare class CloseSessionResponse {
    responseHeader: ResponseHeader;
    constructor(options?: ICloseSessionResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CloseSessionResponse): CloseSessionResponse;
}
export declare function decodeCloseSessionResponse(inp: DataStream): CloseSessionResponse;
