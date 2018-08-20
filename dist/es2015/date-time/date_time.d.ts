export declare function offset_factor_1601(): number[];
/**
 *
 * @param date {Date}
 * @returns {[high,low]}
 */
export declare function bn_dateToHundredNanoSecondFrom1601_fast(date: Date): number[];
export declare function bn_hundredNanoSecondFrom1601ToDate_fast(high: number, low: number): Date;
export declare function getCurrentClock(): {
    timestamp: any;
    picoseconds: number;
};
export declare function coerceClock(timestamp: any, picoseconds: any): {
    timestamp: any;
    picoseconds: any;
};
