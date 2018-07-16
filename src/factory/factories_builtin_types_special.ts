"use strict";

import {assert} from "../assert";
import * as _ from "underscore";

import  {registerType as registerBuiltInType} from './factories_builtin_types';

function _self_encode(Type) {
    assert(_.isFunction(Type));
    return function (value, stream) {
        if (!value || !value.encode) {
            value = new Type(value);
        }
        value.encode(stream);
    };
}
function _self_decode(Type) {
    assert(_.isFunction(Type));

    return function (stream) {
        var value = new Type();
        value.decode(stream);
        return value;
    };
}

export function registerSpecialVariantEncoder(ConstructorFunc,name : string) {

    assert(_.isFunction(ConstructorFunc));

    registerBuiltInType({
        name: name,
        encode: _self_encode(ConstructorFunc),
        decode: _self_decode(ConstructorFunc),
        defaultValue: null
    });

};

