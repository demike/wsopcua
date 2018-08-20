import { DataStream } from "../basic-types/DataStream";
export declare function isValidDateTime(value: any): boolean;
export declare function randomDateTime(): Date;
export declare function encodeDateTime(date: Date, stream: DataStream): void;
export declare function decodeDateTime(stream: DataStream): Date;
export declare function coerceDateTime(value: any): Date;
