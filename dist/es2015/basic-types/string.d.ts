import { DataStream } from './DataStream';
export declare function isValidString(value: any): boolean;
export declare function randomString(): string;
export declare function decodeString(stream: DataStream): string;
export declare function encodeString(value: string, stream: DataStream): void;
