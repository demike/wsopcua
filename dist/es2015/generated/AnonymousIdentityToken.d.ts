import { DataStream } from '../basic-types/DataStream';
import { UserIdentityToken } from './UserIdentityToken';
import { IUserIdentityToken } from './UserIdentityToken';
export interface IAnonymousIdentityToken extends IUserIdentityToken {
}
/**
A token representing an anonymous user.
*/
export declare class AnonymousIdentityToken extends UserIdentityToken {
    constructor(options?: IAnonymousIdentityToken);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AnonymousIdentityToken): AnonymousIdentityToken;
}
export declare function decodeAnonymousIdentityToken(inp: DataStream): AnonymousIdentityToken;
