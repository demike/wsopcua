'use strict';


export function get_clock_tick(): number {
    // return Date.now();
    return performance.now();
}
