import { ResponseHeader } from './ResponseHeader';
import { DataStream } from '../basic-types/DataStream';
export interface ICloseSecureChannelResponse {
    responseHeader?: ResponseHeader;
}
/**
Closes a secure channel.
*/
export declare class CloseSecureChannelResponse {
    responseHeader: ResponseHeader;
    constructor(options?: ICloseSecureChannelResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CloseSecureChannelResponse): CloseSecureChannelResponse;
}
export declare function decodeCloseSecureChannelResponse(inp: DataStream): CloseSecureChannelResponse;
