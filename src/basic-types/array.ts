"use strict";
import {assert} from '../assert';
import * as _ from 'underscore';
import {DataStream} from './DataStream';
/**
 * @method encodeArray
 * @param arr {Array} the array to encode.
 * @param stream {DataStream}  the stream.
 * @param encode_element_func  {Function}  The  function to encode a single array element.
 * @param encode_element_func.element {object}
 * @param encode_element_func.stream  {DataStream}  the stream.
 */
export function encodeArray (arr : Array<any>, stream : DataStream, encode_element_func?: (obj : any,stream : DataStream) => void ) : void {

    if (arr === null) {
        stream.setUint32(0xFFFFFFFF);
        return;
    }
    assert(_.isArray(arr));
    stream.setUint32(arr.length);

    if (encode_element_func) {
        for (var i = 0; i < arr.length; ++i) {
            encode_element_func(arr[i], stream);
        }
    } else {
        for (var i = 0; i <arr.length; ++i) {
            arr[i].encode(stream);
        }
    }
};
/**
 * @method decodeArray
 * @param stream {DataStream}  the stream.
 * @param decode_element_func {Function}  The  function to decode a single array element. This function returns the element decoded from the stream
 * @param decode_element_func.stream {DataStream}  the stream.
 */
export function decodeArray (stream : DataStream, decode_element_func?: (stream : DataStream) => void ) {

    
    var length = stream.getInt32();
    if (length === -1) {
        return null;
    }

    var arr = [];
    for (var i = 0; i < length; i++) {
        arr.push(decode_element_func(stream));
    }

    return arr;
};



export function cloneArray (arr : any[]) {
    let out = [];

    if (arr && arr.length > 0) {
        for (let item  of arr) {
            out.push(item);
        }
    }

    return out;
}

export function cloneComplexArray(arr : any[]) {
    let out = [];

    if (arr && arr.length > 0) {
        for (let item  of arr) {
            out.push(item.clone());
        }
    }

    return out;

}

export function concatTypedArrays<T extends Uint16Array | Uint8Array | Uint32Array | Int16Array | Int8Array | Int32Array | Float32Array | Float64Array >(arrays : T[]) : T {
    let len : number = 0;
    for (let ar of arrays) {
        len += ar.length;
    }

    let buf = new (<any>arrays[0].constructor)(len); //new (<any>T.constructor)(len);
    let offset = 0;  
    for (let ar of arrays) {
        buf.set(ar,offset);
        offset += ar.length;
    }
    return buf;
}

export function concatArrayBuffers(arrays : ArrayBuffer[]) : ArrayBuffer {
    if (arrays.length == 1) {
        return arrays[0];
    }
    let len : number = 0;
    for (let ar of arrays) {
        len += ar.byteLength;
    }

    let buf = new Uint8Array(len);

    let offset = 0;  
    for (let ar of arrays) {
        buf.set(new Uint8Array(ar),offset);
        offset += ar.byteLength;
    }
    return buf.buffer;
}
