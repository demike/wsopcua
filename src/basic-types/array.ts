'use strict';
import {assert} from '../assert';
import {DataStream} from './DataStream';
/**
 * @method encodeArray
 * @param arr {Array} the array to encode.
 * @param stream {DataStream}  the stream.
 * @param encode_element_func  {(obj: any, stream: DataStream) => void}  The  function to encode a single array element.
 * @param encode_element_func.element {object}
 * @param encode_element_func.stream  {DataStream}  the stream.
 */
export function encodeArray (arr: Array<any>, stream: DataStream, encode_element_func?: (obj: any, stream: DataStream) => void ): void {

    if (arr === null) {
        stream.setUint32(0xffffffff);
        return;
    }
    assert(Array.isArray(arr));
    stream.setUint32(arr.length);

    if (encode_element_func) {
        for (let i = 0; i < arr.length; ++i) {
            encode_element_func(arr[i], stream);
        }
    } else {
        for (let i = 0; i < arr.length; ++i) {
            arr[i].encode(stream);
        }
    }
}
/**
 * @method decodeArray
 * @param stream {DataStream}  the stream.
 * @param decode_element_func {Function}
 *                      The  function to decode a single array element. This function returns the element decoded from the stream
 * @param decode_element_func.stream {DataStream}  the stream.
 */
export function decodeArray<T> (stream: DataStream, decode_element_func: (stream: DataStream) => T ): T[] | null {


    const length = stream.getInt32();
    if (length === -1) {
        return null;
    }

    const arr: T[] = [];
    for (let i = 0; i < length; i++) {
        arr.push(decode_element_func(stream));
    }

    return arr;
}



export function cloneArray (arr: any[]) {
    const out: any[] = [];

    if (arr && arr.length > 0) {
        for (const item  of arr) {
            out.push(item);
        }
    }

    return out;
}

export function cloneComplexArray(arr: any[]) {
    const out: any[] = [];

    if (arr && arr.length > 0) {
        for (const item  of arr) {
            out.push(item.clone());
        }
    }

    return out;

}

export function concatTypedArrays<T extends Uint16Array | Uint8Array | Uint32Array |
                                 Int16Array | Int8Array | Int32Array | Float32Array | Float64Array >(arrays: T[]): T {
    let len = 0;
    for (const ar of arrays) {
        len += ar.length;
    }

    const buf = new (<any>arrays[0].constructor)(len); // new (<any>T.constructor)(len);
    let offset = 0;
    for (const ar of arrays) {
        buf.set(ar, offset);
        offset += ar.length;
    }
    return buf;
}

export function concatDataViews(views: DataView[]) {
    if (views.length === 1) {
        return views[0];
    }
    let len = 0;
    for (const ar of views) {
        len += ar.byteLength;
    }

    const buf = new Uint8Array(len);

    let offset = 0;
    for (const v of views) {
        buf.set(new Uint8Array(v.buffer), offset);
        offset += v.byteLength;
    }
    return new DataView(buf.buffer);
}

export function concatArrayBuffers(arrays: ArrayBuffer[]): ArrayBuffer {
    if (arrays.length === 1) {
        return arrays[0];
    }
    let len = 0;
    for (const ar of arrays) {
        len += ar.byteLength;
    }

    const buf = new Uint8Array(len);

    let offset = 0;
    for (const ar of arrays) {
        buf.set(new Uint8Array(ar), offset);
        offset += ar.byteLength;
    }
    return buf.buffer;
}
