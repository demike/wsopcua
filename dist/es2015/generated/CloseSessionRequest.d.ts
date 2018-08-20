import { RequestHeader } from './RequestHeader';
import { DataStream } from '../basic-types/DataStream';
export interface ICloseSessionRequest {
    requestHeader?: RequestHeader;
    deleteSubscriptions?: boolean;
}
/**
Closes a session with the server.
*/
export declare class CloseSessionRequest {
    requestHeader: RequestHeader;
    deleteSubscriptions: boolean;
    constructor(options?: ICloseSessionRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CloseSessionRequest): CloseSessionRequest;
}
export declare function decodeCloseSessionRequest(inp: DataStream): CloseSessionRequest;
