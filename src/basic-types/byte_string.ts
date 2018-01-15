"use strict";
import * as _ from 'underscore';
import { DataStream } from './DataStream';

function getRandomInt(min : number, max : number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}



export function isValidByteString(value) {
    return value === null || value instanceof ArrayBuffer;
};
export function randomByteString(value, len : number){
    len = len || getRandomInt(1, 200);
    var b = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        b[i] = getRandomInt(0, 255);
    }
    return b;
};
export function encodeByteString(byteString : Uint8Array, stream : DataStream) : void {
    stream.writeByteStream(byteString);
};
export function decodeByteString(stream : DataStream) : Uint8Array{
    return stream.readByteStream();
};

export function coerceByteString(value) : Uint8Array {

    if (_.isArray(value)) {
        return new Uint8Array(value);
    }
    if (typeof value === "string") {
        let str = window.btoa(value);
        let buf =  new Uint8Array(str.length);
        for(var i=0,j=str.length;i<j;++i){
            buf[i]=str.charCodeAt(i);
          }
        return buf;
    }
    return value;
}

