import { UserTokenType } from './UserTokenType';
import { DataStream } from '../basic-types/DataStream';
export interface IUserTokenPolicy {
    policyId?: string;
    tokenType?: UserTokenType;
    issuedTokenType?: string;
    issuerEndpointUrl?: string;
    securityPolicyUri?: string;
}
/**
Describes a user token that can be used with a server.
*/
export declare class UserTokenPolicy {
    policyId: string;
    tokenType: UserTokenType;
    issuedTokenType: string;
    issuerEndpointUrl: string;
    securityPolicyUri: string;
    constructor(options?: IUserTokenPolicy);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: UserTokenPolicy): UserTokenPolicy;
}
export declare function decodeUserTokenPolicy(inp: DataStream): UserTokenPolicy;
