"use strict";
/**
 * @module opcua.miscellaneous
 */

 import {assert} from '../assert'

export var _enumerations = {};

import {TypeSchema} from './factories_builtin_types';

function _encode_enumeration(member, stream) {
    stream.writeInteger(member.value);
}

/**
 * @method registerEnumeration
 * @param schema
 * @param schema.name { string}
 * @param schema.enumValues [{key:Name, value:values}]
 * @param schema.encode
 * @param schema.decode
 * @param schema.typedEnum
 * @param schema.defaultValue 
 * @return {Enum}
 */
export function registerEnumeration(name : string, enumeration : any, encode : Function, decode : Function, coerce? : Function) {

    // create a new Enum
    if (_enumerations.hasOwnProperty(name)) {
        throw new Error("factories.registerEnumeration : Enumeration " + name + " has been already inserted");
    }

    assert('function' === typeof encode);
    assert('function' === typeof decode);

    var typeSchema = new TypeSchema(    {
        name: name,
        encode: encode,
        decode: decode,
        defaultValue: enumeration[0],
        coerce: coerce,
    }
    );
    _enumerations[name] = typeSchema;

    return enumeration;
}

export function hasEnumeration(enumerationName : string) {
    return !!_enumerations[enumerationName];
};

export function getEnumeration(enumerationName : string) {
    assert(hasEnumeration(enumerationName));
    return _enumerations[enumerationName];
};