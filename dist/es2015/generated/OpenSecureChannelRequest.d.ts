import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { SecurityTokenRequestType } from './SecurityTokenRequestType';
import { MessageSecurityMode } from './MessageSecurityMode';
import { DataStream } from '../basic-types/DataStream';
export interface IOpenSecureChannelRequest {
    requestHeader?: RequestHeader;
    clientProtocolVersion?: ec.UInt32;
    requestType?: SecurityTokenRequestType;
    securityMode?: MessageSecurityMode;
    clientNonce?: Uint8Array;
    requestedLifetime?: ec.UInt32;
}
/**
Creates a secure channel with a server.
*/
export declare class OpenSecureChannelRequest {
    requestHeader: RequestHeader;
    clientProtocolVersion: ec.UInt32;
    requestType: SecurityTokenRequestType;
    securityMode: MessageSecurityMode;
    clientNonce: Uint8Array;
    requestedLifetime: ec.UInt32;
    constructor(options?: IOpenSecureChannelRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: OpenSecureChannelRequest): OpenSecureChannelRequest;
}
export declare function decodeOpenSecureChannelRequest(inp: DataStream): OpenSecureChannelRequest;
