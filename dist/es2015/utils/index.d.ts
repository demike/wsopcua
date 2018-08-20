/**
 * set a flag
 * @method set_flag
 * @param value
 * @param mask
 * @return {number}
 */
export declare function set_flag(value: number, mask: number): number;
/**
 * check if a set of bits are set in the values
 * @method check_flag
 *
 * @param value
 * @param mask
 * @return {boolean}
 */
export declare function check_flag(value: any, mask: any): boolean;
export { buffer_ellipsis } from './buffer_ellipsis';
export * from './string_utils';
export * from './get_clock_tick';
export declare function isNullOrUndefined(value: any): boolean;
export * from './get_function_parameters_name';
export * from './once';
export * from './isEqual';
