import { DataStream } from '../basic-types/DataStream';
import { UserIdentityToken } from './UserIdentityToken';
import { IUserIdentityToken } from './UserIdentityToken';
export interface IUserNameIdentityToken extends IUserIdentityToken {
    userName?: string;
    password?: Uint8Array;
    encryptionAlgorithm?: string;
}
/**
A token representing a user identified by a user name and password.
*/
export declare class UserNameIdentityToken extends UserIdentityToken {
    userName: string;
    password: Uint8Array;
    encryptionAlgorithm: string;
    constructor(options?: IUserNameIdentityToken);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: UserNameIdentityToken): UserNameIdentityToken;
}
export declare function decodeUserNameIdentityToken(inp: DataStream): UserNameIdentityToken;
