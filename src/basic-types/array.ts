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
export function encodeArray (arr : Array<any>, stream : DataStream, encode_element_func?: (obj : object,stream : DataStream) => void ) : void {

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
 * @return {Array}
 */
export function decodeArray (stream : DataStream, decode_element_func?: (stream : DataStream) => void ) {

    
    var length = stream.getUint32();
    if (length === 0xFFFFFFFF) {
        return null;
    }

    var arr = [];
    for (var i = 0; i < length; i++) {
        arr.push(decode_element_func(stream));
    }

    return arr;
};


