"use strict";
import { assert } from '../assert';
/**
 * @method encodeArray
 * @param arr {Array} the array to encode.
 * @param stream {DataStream}  the stream.
 * @param encode_element_func  {Function}  The  function to encode a single array element.
 * @param encode_element_func.element {object}
 * @param encode_element_func.stream  {DataStream}  the stream.
 */
export function encodeArray(arr, stream, encode_element_func) {
    if (arr === null) {
        stream.setUint32(0xFFFFFFFF);
        return;
    }
    assert(Array.isArray(arr));
    stream.setUint32(arr.length);
    if (encode_element_func) {
        for (var i = 0; i < arr.length; ++i) {
            encode_element_func(arr[i], stream);
        }
    }
    else {
        for (var i = 0; i < arr.length; ++i) {
            arr[i].encode(stream);
        }
    }
}
;
/**
 * @method decodeArray
 * @param stream {DataStream}  the stream.
 * @param decode_element_func {Function}  The  function to decode a single array element. This function returns the element decoded from the stream
 * @param decode_element_func.stream {DataStream}  the stream.
 */
export function decodeArray(stream, decode_element_func) {
    var length = stream.getInt32();
    if (length === -1) {
        return null;
    }
    var arr = [];
    for (var i = 0; i < length; i++) {
        arr.push(decode_element_func(stream));
    }
    return arr;
}
;
export function cloneArray(arr) {
    let out = [];
    if (arr && arr.length > 0) {
        for (let item of arr) {
            out.push(item);
        }
    }
    return out;
}
export function cloneComplexArray(arr) {
    let out = [];
    if (arr && arr.length > 0) {
        for (let item of arr) {
            out.push(item.clone());
        }
    }
    return out;
}
export function concatTypedArrays(arrays) {
    let len = 0;
    for (let ar of arrays) {
        len += ar.length;
    }
    let buf = new arrays[0].constructor(len); //new (<any>T.constructor)(len);
    let offset = 0;
    for (let ar of arrays) {
        buf.set(ar, offset);
        offset += ar.length;
    }
    return buf;
}
export function concatArrayBuffers(arrays) {
    if (arrays.length == 1) {
        return arrays[0];
    }
    let len = 0;
    for (let ar of arrays) {
        len += ar.byteLength;
    }
    let buf = new Uint8Array(len);
    let offset = 0;
    for (let ar of arrays) {
        buf.set(new Uint8Array(ar), offset);
        offset += ar.byteLength;
    }
    return buf.buffer;
}
//# sourceMappingURL=array.js.map