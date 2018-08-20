import { DataStream } from '../basic-types/DataStream';
/**
The possible user token types.*/
export declare enum UserTokenType {
    Anonymous = 0,
    UserName = 1,
    Certificate = 2,
    IssuedToken = 3
}
export declare function encodeUserTokenType(data: UserTokenType, out: DataStream): void;
export declare function decodeUserTokenType(inp: DataStream): number;
