import { DataStream } from './DataStream';
export declare function isValidByteString(value: any): boolean;
export declare function randomByteString(value: any, len: number): Uint8Array;
export declare function encodeByteString(byteString: Uint8Array, stream: DataStream): void;
export declare function decodeByteString(stream: DataStream): Uint8Array;
export declare function coerceByteString(value: any): Uint8Array;
