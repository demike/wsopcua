'use strict';
import { DataStream } from './DataStream';

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export function isValidByteString(value) {
    return value === null || value instanceof Uint8Array;
}
export function randomByteString(value, len: number) {
    len = len || getRandomInt(1, 200);
    const b = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        b[i] = getRandomInt(0, 255);
    }
    return b;
}
export function encodeByteString(byteString: Uint8Array, stream: DataStream): void {
    stream.writeByteStream(byteString);
}
export function decodeByteString(stream: DataStream): Uint8Array {
    return stream.readByteStream();
}

export function coerceByteString(value): Uint8Array {

    if (value instanceof Uint8Array) {
        return value;
    }
    if (Array.isArray(value) || value instanceof ArrayBuffer ) {
        return new Uint8Array(value);
    }
    if (ArrayBuffer.isView(value)) {
        return new Uint8Array(value.buffer, value.byteOffset, value.byteLength );
    }
    if (typeof value === 'string') {
        const str = window.btoa(value);
        const buf = new Uint8Array(str.length);
        for (let i = 0, j = str.length; i < j; ++i) {
            buf[i] = str.charCodeAt(i);
        }
        return buf;
    }
    return value;
}

