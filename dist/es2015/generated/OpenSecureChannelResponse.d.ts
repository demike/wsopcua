import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { ChannelSecurityToken } from './ChannelSecurityToken';
import { DataStream } from '../basic-types/DataStream';
export interface IOpenSecureChannelResponse {
    responseHeader?: ResponseHeader;
    serverProtocolVersion?: ec.UInt32;
    securityToken?: ChannelSecurityToken;
    serverNonce?: Uint8Array;
}
/**
Creates a secure channel with a server.
*/
export declare class OpenSecureChannelResponse {
    responseHeader: ResponseHeader;
    serverProtocolVersion: ec.UInt32;
    securityToken: ChannelSecurityToken;
    serverNonce: Uint8Array;
    constructor(options?: IOpenSecureChannelResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: OpenSecureChannelResponse): OpenSecureChannelResponse;
}
export declare function decodeOpenSecureChannelResponse(inp: DataStream): OpenSecureChannelResponse;
