"use strict";
import { assert } from "../assert";
import { registerType as registerBuiltInType } from './factories_builtin_types';
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
        var value = new Type();
        value.decode(stream);
        return value;
    };
}
export function registerSpecialVariantEncoder(ConstructorFunc, name) {
    assert('function' === typeof ConstructorFunc);
    registerBuiltInType({
        name: name,
        encode: _self_encode(ConstructorFunc),
        decode: _self_decode(ConstructorFunc),
        defaultValue: null
    });
}
;
//# sourceMappingURL=factories_builtin_types_special.js.map