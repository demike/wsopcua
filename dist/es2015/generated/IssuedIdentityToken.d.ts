import { DataStream } from '../basic-types/DataStream';
import { UserIdentityToken } from './UserIdentityToken';
import { IUserIdentityToken } from './UserIdentityToken';
export interface IIssuedIdentityToken extends IUserIdentityToken {
    tokenData?: Uint8Array;
    encryptionAlgorithm?: string;
}
/**
A token representing a user identified by a WS-Security XML token.
*/
export declare class IssuedIdentityToken extends UserIdentityToken {
    tokenData: Uint8Array;
    encryptionAlgorithm: string;
    constructor(options?: IIssuedIdentityToken);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: IssuedIdentityToken): IssuedIdentityToken;
}
export declare function decodeIssuedIdentityToken(inp: DataStream): IssuedIdentityToken;
