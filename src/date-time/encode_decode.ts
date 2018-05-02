import { DataStream } from "../basic-types/DataStream";

"use strict";
var assert = require("node-opcua-assert");
var _ =require("underscore");

var date_time = require("./date_time");
var bn_dateToHundredNanoSecondFrom1601 = date_time.bn_dateToHundredNanoSecondFrom1601;
var bn_hundredNanoSecondFrom1601ToDate = date_time.bn_hundredNanoSecondFrom1601ToDate;



//  Date(year, month [, day, hours, minutes, seconds, ms])
export function isValidDateTime(value) {
    return value instanceof Date;
};

/**
 * return a random integer value in the range of  min inclusive and  max exclusive
 * @method getRandomInt
 * @param min
 * @param max
 * @return {*}
 * @private
 */
function getRandomInt(min, max) {
    // note : Math.random() returns a random number between 0 (inclusive) and 1 (exclusive):
    return Math.floor(Math.random() * (max - min)) + min;
}


export function randomDateTime() {
    var r = getRandomInt;
    return new Date(
      1900 + r(0, 200), r(0, 11), r(0, 28),
      r(0, 24), r(0, 59), r(0, 59), r(0, 1000));

};
export function encodeDateTime(date : Date, stream : DataStream) {

    if (!date) {
        stream.setUint32(0);
        stream.setUint32(0);
        return;
    }
    if (!(date instanceof Date)){
        throw new Error("Expecting a Date : but got a " + typeof(date) + " " + (<any>date).toString());
    }
    assert(date instanceof Date);
    var hl = bn_dateToHundredNanoSecondFrom1601(date);
    var hi = hl[0];
    var lo = hl[1];

    // make sure that date are not lower than expected limit
    if (hi<0 || lo<0) {
        hi=0;lo=0;
    }
    if (hi <0 || lo<0 || hi > 2**32 || lo > 2**32 ) {
        var hl = bn_dateToHundredNanoSecondFrom1601(date);
        throw new Error("INVALID " + hi  + " "+lo + " "+date.toUTCString());
    }
    stream.setUint32(lo);
    stream.setUint32(hi);
    //xx assert(date.toString() === bn_hundredNanoSecondFrom1601ToDate(hi, lo).toString());
};

export function decodeDateTime(stream : DataStream) {
    var lo = stream.getUint32();
    var hi = stream.getUint32();
    return bn_hundredNanoSecondFrom1601ToDate(hi, lo);
};


export function coerceDateTime(value) {
    if (value instanceof Date) {
        return value;
    }
    return new Date(value);
}