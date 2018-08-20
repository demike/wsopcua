import { RequestHeader } from './RequestHeader';
import { DataStream } from '../basic-types/DataStream';
export interface ICloseSecureChannelRequest {
    requestHeader?: RequestHeader;
}
/**
Closes a secure channel.
*/
export declare class CloseSecureChannelRequest {
    requestHeader: RequestHeader;
    constructor(options?: ICloseSecureChannelRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CloseSecureChannelRequest): CloseSecureChannelRequest;
}
export declare function decodeCloseSecureChannelRequest(inp: DataStream): CloseSecureChannelRequest;
