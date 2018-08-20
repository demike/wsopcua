import { DataStream } from './DataStream';
export declare function isValidDateTime(value: any): boolean;
export declare function randomDateTime(): Date;
export declare function encodeDateTime(date: Date, stream: DataStream): void;
export declare function decodeDateTime(stream: DataStream): Date;
export declare function coerceDateTime(value: any): Date;
export declare var offset_factor_1601: number[];
export declare function bn_dateToHundredNanoSecondFrom1601(date: Date): any;
export declare function bn_hundredNanoSecondFrom1601ToDate(high: any, low: any): Date;
export declare function getCurrentClock(): {
    timestamp: any;
    picoseconds: number;
};
export declare function coerceClock(timestamp: any, picoseconds: any): {
    timestamp: any;
    picoseconds: any;
};
