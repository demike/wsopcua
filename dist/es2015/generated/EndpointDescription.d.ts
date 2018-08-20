import * as ec from '../basic-types';
import { ApplicationDescription } from './ApplicationDescription';
import { MessageSecurityMode } from './MessageSecurityMode';
import { UserTokenPolicy } from './UserTokenPolicy';
import { DataStream } from '../basic-types/DataStream';
export interface IEndpointDescription {
    endpointUrl?: string;
    server?: ApplicationDescription;
    serverCertificate?: Uint8Array;
    securityMode?: MessageSecurityMode;
    securityPolicyUri?: string;
    userIdentityTokens?: UserTokenPolicy[];
    transportProfileUri?: string;
    securityLevel?: ec.Byte;
}
/**
The description of a endpoint that can be used to access a server.
*/
export declare class EndpointDescription {
    endpointUrl: string;
    server: ApplicationDescription;
    serverCertificate: Uint8Array;
    securityMode: MessageSecurityMode;
    securityPolicyUri: string;
    userIdentityTokens: UserTokenPolicy[];
    transportProfileUri: string;
    securityLevel: ec.Byte;
    constructor(options?: IEndpointDescription);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EndpointDescription): EndpointDescription;
}
export declare function decodeEndpointDescription(inp: DataStream): EndpointDescription;
