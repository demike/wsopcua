"use strict";
/**
 * @module opcua.utils
 */
import { assert } from '../assert';
/**
 * set a flag
 * @method set_flag
 * @param value
 * @param mask
 * @return {number}
 */
export function set_flag(value, mask) {
    assert(mask !== undefined);
    return (value | mask);
}
/**
 * check if a set of bits are set in the values
 * @method check_flag
 *
 * @param value
 * @param mask
 * @return {boolean}
 */
export function check_flag(value, mask) {
    assert(mask !== undefined);
    return ((value & mask) === mask);
}
export { buffer_ellipsis } from './buffer_ellipsis';
export * from './string_utils';
export * from './get_clock_tick';
//exports.compare_buffers = require("./src/compare_buffers").compare_buffers;
export function isNullOrUndefined(value) {
    return (value === undefined) || (value === null);
}
export * from './get_function_parameters_name';
export * from './once';
export * from './isEqual';
//# sourceMappingURL=index.js.map