'use strict';

import {QualifiedName, IQualifiedName} from '../generated/QualifiedName';
import {assert} from '../assert';
import { DataStream } from '../basic-types/DataStream';
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
export function stringToQualifiedName(value: string) {

    const split_array = value.split(':');
    let namespaceIndex = 0;
    if (!isNaN(parseFloat(split_array[0])) && isFinite(<number><unknown>split_array[0]) &&
            Number.isInteger(parseFloat(split_array[0])) && split_array.length > 1) {
        namespaceIndex = parseInt(split_array[0], 10);
        split_array.shift();
        value = split_array.join(':');
    }
    return new QualifiedName({namespaceIndex: namespaceIndex, name: value});
}

export function qualifiedNameToString(qn: QualifiedName): string {
    if (qn.namespaceIndex > 0) {
        return qn.namespaceIndex + ':' + qn.name;
    }
    return qn.name;

}

export function coerceQualifiedName(value: string| IQualifiedName) {

    if (!value) {
        return null;
    } else if (value instanceof QualifiedName) {
        return value;
    } else if (typeof value === 'string') {
        return stringToQualifiedName(value);
    } else {
        assert(value.hasOwnProperty('namespaceIndex'));
        assert(value.hasOwnProperty('name'));
        return new QualifiedName(value);
    }
}

export function enocdeQualifiedName( value: QualifiedName, stream: DataStream) {
    value.encode(stream);
}


