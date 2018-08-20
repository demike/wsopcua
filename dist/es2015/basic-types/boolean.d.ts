import { DataStream } from './DataStream';
export declare function isValidBoolean(value: any): boolean;
export declare function randomBoolean(): boolean;
export declare function encodeBoolean(value: Boolean, stream: DataStream): void;
export declare function decodeBoolean(stream: DataStream): boolean;
export declare function coerceBoolean(value: any): any;
