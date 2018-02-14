"use strict";
import {encodeString,decodeString} from './string';

export type LocaleId = string;

export function validateLocaleId(/*value*/) {
    // TODO : check that localeID is well-formed
    // see part 3 $8.4 page 63
    return true;
};

export var encodeLocaleId = encodeString;
export var decodeLocaleId = decodeString;
