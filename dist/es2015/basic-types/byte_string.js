"use strict";
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function isValidByteString(value) {
    return value === null || value instanceof ArrayBuffer;
}
;
export function randomByteString(value, len) {
    len = len || getRandomInt(1, 200);
    var b = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        b[i] = getRandomInt(0, 255);
    }
    return b;
}
;
export function encodeByteString(byteString, stream) {
    stream.writeByteStream(byteString);
}
;
export function decodeByteString(stream) {
    return stream.readByteStream();
}
;
export function coerceByteString(value) {
    if (Array.isArray(value)) {
        return new Uint8Array(value);
    }
    if (typeof value === "string") {
        let str = window.btoa(value);
        let buf = new Uint8Array(str.length);
        for (var i = 0, j = str.length; i < j; ++i) {
            buf[i] = str.charCodeAt(i);
        }
        return buf;
    }
    return value;
}
//# sourceMappingURL=byte_string.js.map