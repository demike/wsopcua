import { DataStream } from './DataStream';
/**
 * @method encodeArray
 * @param arr {Array} the array to encode.
 * @param stream {DataStream}  the stream.
 * @param encode_element_func  {Function}  The  function to encode a single array element.
 * @param encode_element_func.element {object}
 * @param encode_element_func.stream  {DataStream}  the stream.
 */
export declare function encodeArray(arr: Array<any>, stream: DataStream, encode_element_func?: (obj: any, stream: DataStream) => void): void;
/**
 * @method decodeArray
 * @param stream {DataStream}  the stream.
 * @param decode_element_func {Function}  The  function to decode a single array element. This function returns the element decoded from the stream
 * @param decode_element_func.stream {DataStream}  the stream.
 */
export declare function decodeArray(stream: DataStream, decode_element_func?: (stream: DataStream) => void): any[];
export declare function cloneArray(arr: any[]): any[];
export declare function cloneComplexArray(arr: any[]): any[];
export declare function concatTypedArrays<T extends Uint16Array | Uint8Array | Uint32Array | Int16Array | Int8Array | Int32Array | Float32Array | Float64Array>(arrays: T[]): T;
export declare function concatArrayBuffers(arrays: ArrayBuffer[]): ArrayBuffer;
