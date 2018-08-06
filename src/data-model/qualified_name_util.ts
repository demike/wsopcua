"use strict";

import {QualifiedName} from '../generated/QualifiedName';
import {assert} from '../assert';
/**
 * @method stringToQualifiedName
 * @param value {String}
 * @return {{namespaceIndex: Number, name: String}}
 *
 * @example
 *
 *  stringToQualifiedName("Hello")   => {namespaceIndex: 0, name: "Hello"}
 *  stringToQualifiedName("3:Hello") => {namespaceIndex: 3, name: "Hello"}
 */
export function stringToQualifiedName(value) {

    var split_array = value.split(":");
    var namespaceIndex = 0;
    if (!isNaN(parseFloat(split_array[0])) && isFinite(split_array[0]) && Number.isInteger(parseFloat(split_array[0])) && split_array.length > 1) {
        namespaceIndex = parseInt(split_array[0]);
        split_array.shift();
        value = split_array.join(':');
    }
    return new QualifiedName({namespaceIndex: namespaceIndex, name: value});
}


export function coerceQualifyName(value) {

    if (!value) {
        return null;
    } else if (value instanceof QualifiedName) {
        return value;
    } else if (typeof value === 'string' || value instanceof String) {
        return stringToQualifiedName(value);
    } else {
        assert(value.hasOwnProperty("namespaceIndex"));
        assert(value.hasOwnProperty("name"));
        return new QualifiedName(value);
    }
}

