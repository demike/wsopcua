'use strict';
import {getRandomInt} from './utils';
import {DataStream} from './DataStream';

export function isValidString(value: any) {
    return typeof value === 'string';
}
export function randomString() {
    const nbCar = getRandomInt(1, 20);
    const cars = [];
    for (let i = 0; i < nbCar; i++) {
        cars.push(String.fromCharCode(65 + getRandomInt(0, 26)));
    }
    return cars.join('');
}

export function decodeString(stream: DataStream) {
    return stream.readString();
}
export function encodeString(value: string|undefined|null, stream: DataStream) {
    stream.writeString(value);
}
