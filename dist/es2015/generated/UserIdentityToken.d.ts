import { DataStream } from '../basic-types/DataStream';
export interface IUserIdentityToken {
    policyId?: string;
}
/**
A base type for a user identity token.
*/
export declare class UserIdentityToken {
    policyId: string;
    constructor(options?: IUserIdentityToken);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: UserIdentityToken): UserIdentityToken;
}
export declare function decodeUserIdentityToken(inp: DataStream): UserIdentityToken;
