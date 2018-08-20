import { DataStream } from '../basic-types/DataStream';
import { UserIdentityToken } from './UserIdentityToken';
import { IUserIdentityToken } from './UserIdentityToken';
export interface IX509IdentityToken extends IUserIdentityToken {
    certificateData?: Uint8Array;
}
/**
A token representing a user identified by an X509 certificate.
*/
export declare class X509IdentityToken extends UserIdentityToken {
    certificateData: Uint8Array;
    constructor(options?: IX509IdentityToken);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: X509IdentityToken): X509IdentityToken;
}
export declare function decodeX509IdentityToken(inp: DataStream): X509IdentityToken;
