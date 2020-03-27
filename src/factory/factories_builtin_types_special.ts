'use strict';

import {assert} from '../assert';

import {registerType as registerBuiltInType} from './factories_builtin_types';

function _self_encode(Type) {
    assert('function' === typeof Type);
    return function (value, stream) {
        if (!value || !value.encode) {
            value = new Type(value);
        }
        value.encode(stream);
    };
}
function _self_decode(Type) {
    assert('function' === typeof Type);

    return function (stream) {
        const value = new Type();
        value.decode(stream);
        return value;
    };
}

function _self_json_encode(Type) {
    assert('function' === typeof Type);
    return function (value) {
        if (!value || !value.toJSON) {
            value = new Type(value);
        }
        return value.toJSON();
    };
}
function _self_json_decode(Type) {
    assert('function' === typeof Type);

    return function (jsonObj) {
        const value = new Type();
        value.fromJSON(jsonObj);
        return value;
    };
}


export function registerSpecialVariantEncoder(ConstructorFunc, name: string) {

    assert('function' === typeof ConstructorFunc);

    registerBuiltInType({
        name: name,
        encode: _self_encode(ConstructorFunc),
        decode: _self_decode(ConstructorFunc),
        jsonEncode: _self_json_encode(ConstructorFunc),
        jsonDecode: _self_json_decode(ConstructorFunc),
        defaultValue: null
    });

}

