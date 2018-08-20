import { DataStream } from './DataStream';
export declare type Int8 = number;
export declare type SByte = number;
export declare type Int16 = number;
export declare type Int32 = number;
export declare type Int64 = number[];
export declare type UInt8 = number;
export declare type Byte = number;
export declare type UInt16 = number;
export declare type UInt32 = number;
export declare type UInt64 = number;
export declare function isValidUInt16(value: any): boolean;
export declare function randomUInt16(): number;
export declare function encodeUInt16(value: number, stream: DataStream): void;
export declare function decodeUInt16(stream: DataStream): number;
export declare function isValidInt16(value: any): boolean;
export declare function randomInt16(): number;
export declare function encodeInt16(value: number, stream: DataStream): void;
export declare function decodeInt16(stream: DataStream): number;
export declare function isValidInt32(value: any): boolean;
export declare function randomInt32(): number;
export declare function encodeInt32(value: number, stream: DataStream): void;
export declare function decodeInt32(stream: DataStream): number;
export declare function isValidUInt32(value: any): boolean;
export declare function randomUInt32(): number;
export declare function encodeUInt32(value: number, stream: DataStream): void;
export declare function decodeUInt32(stream: DataStream): number;
export declare function isValidInt8(value: any): boolean;
export declare function randomInt8(): number;
export declare function encodeInt8(value: number, stream: DataStream): void;
export declare function decodeInt8(stream: DataStream): number;
export declare var isValidSByte: typeof isValidInt8;
export declare var randomSByte: typeof randomInt8;
export declare var encodeSByte: typeof encodeInt8;
export declare var decodeSByte: typeof decodeInt8;
export declare function isValidUInt8(value: any): boolean;
export declare function randomUInt8(): number;
export declare function encodeUInt8(value: number, stream: DataStream): void;
export declare function decodeUInt8(stream: DataStream): number;
export declare var isValidByte: typeof isValidUInt8;
export declare var randomByte: typeof randomUInt8;
export declare var encodeByte: typeof encodeUInt8;
export declare var decodeByte: typeof decodeUInt8;
export declare function isValidUInt64(value: any): boolean;
export declare function randomUInt64(): Array<number>;
export declare function encodeUInt64(value: any, stream: DataStream): void;
export declare function decodeUInt64(stream: DataStream): number[];
export declare function constructInt64(high: number, low: number): number[];
export declare function coerceUInt64(value: any): number[];
export declare function randomInt64(): number[];
export declare function coerceInt8(value: any): number;
export declare function coerceUInt8(value: any): number;
export declare function coerceByte(value: any): number;
export declare function coerceSByte(value: any): number;
export declare function coerceUInt16(value: any): number;
export declare function coerceInt16(value: any): number;
export declare function coerceUInt32(value: any): number;
export declare function coerceInt32(value: any): number;