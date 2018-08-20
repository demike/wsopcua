import { DataStream } from '../basic-types/DataStream';
/**
The type of security to use on a message.*/
export declare enum MessageSecurityMode {
    Invalid = 0,
    None = 1,
    Sign = 2,
    SignAndEncrypt = 3
}
export declare function encodeMessageSecurityMode(data: MessageSecurityMode, out: DataStream): void;
export declare function decodeMessageSecurityMode(inp: DataStream): number;
