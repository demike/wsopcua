import { DataStream } from '../basic-types/DataStream';
/**
Indicates whether a token if being created or renewed.*/
export declare enum SecurityTokenRequestType {
    Issue = 0,
    Renew = 1
}
export declare function encodeSecurityTokenRequestType(data: SecurityTokenRequestType, out: DataStream): void;
export declare function decodeSecurityTokenRequestType(inp: DataStream): number;
