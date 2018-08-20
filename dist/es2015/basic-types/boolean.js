"use strict";
export function isValidBoolean(value) {
    return typeof value === "boolean";
}
;
export function randomBoolean() {
    return (Math.random() > 0.5);
}
;
export function encodeBoolean(value, stream) {
    //   assert(isValidBoolean(value));
    stream.setUint8(value ? 1 : 0);
}
;
export function decodeBoolean(stream) {
    return stream.getUint8() ? true : false;
}
;
var falsy = /^(?:f(?:alse)?|no?|0+)$/i;
export function coerceBoolean(value) {
    if (value === null || value === undefined) {
        return value;
    }
    // http://stackoverflow.com/a/24744599/406458
    return !falsy.test(value) && !!value;
    // return !!(+value||String(value).toLowerCase().replace(!!0,''));
}
;
//# sourceMappingURL=boolean.js.map