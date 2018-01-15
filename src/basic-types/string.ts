"use strict";
import {getRandomInt} from './utils';

export function isValidString(value) {
    return typeof value === "string";
};
export function randomString() {
    var nbCar = getRandomInt(1, 20);
    var cars = [];
    for (var i = 0; i < nbCar; i++) {
        cars.push(String.fromCharCode(65 + getRandomInt(0, 26)));
    }
    return cars.join("");
};

exports.decodeString = function (stream) {
    return stream.readString();
};
exports.encodeString = function (value, stream) {
    stream.writeString(value);
};
