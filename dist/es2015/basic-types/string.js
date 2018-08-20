"use strict";
import { getRandomInt } from './utils';
export function isValidString(value) {
    return typeof value === "string";
}
;
export function randomString() {
    var nbCar = getRandomInt(1, 20);
    var cars = [];
    for (var i = 0; i < nbCar; i++) {
        cars.push(String.fromCharCode(65 + getRandomInt(0, 26)));
    }
    return cars.join("");
}
;
export function decodeString(stream) {
    return stream.readString();
}
;
export function encodeString(value, stream) {
    stream.writeString(value);
}
;
//# sourceMappingURL=string.js.map