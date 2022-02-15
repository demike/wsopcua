'use strict';

import { assert } from '../assert';
import { DataStream } from '../basic-types/DataStream';
import { IEncodable } from './factories_baseobject';

import { registerType as registerBuiltInType } from './factories_builtin_types';

function _self_encode(Type: new (...args: any[]) => IEncodable) {
  assert('function' === typeof Type);
  return function (value: any, stream: DataStream) {
    if (!value || !value.encode) {
      value = new Type(value);
    }
    value.encode(stream);
  };
}
function _self_decode(Type: new (...args: any[]) => IEncodable) {
  assert('function' === typeof Type);

  return function (stream: DataStream) {
    const value = new Type();
    value.decode(stream);
    return value;
  };
}

function _self_json_encode(Type: new (...args: any[]) => IEncodable) {
  assert('function' === typeof Type);
  return function (value: any) {
    if (!value || !value.toJSON) {
      value = new Type(value);
    }
    return value.toJSON();
  };
}
function _self_json_decode(Type: new (...args: any[]) => IEncodable) {
  assert('function' === typeof Type);

  return function (jsonObj: any) {
    const value = new Type();
    value.fromJSON(jsonObj);
    return value;
  };
}

export function registerSpecialVariantEncoder(
  ConstructorFunc: new (...args: any[]) => IEncodable,
  name: string
) {
  assert('function' === typeof ConstructorFunc);

  registerBuiltInType({
    name: name,
    encode: _self_encode(ConstructorFunc),
    decode: _self_decode(ConstructorFunc),
    jsonEncode: _self_json_encode(ConstructorFunc),
    jsonDecode: _self_json_decode(ConstructorFunc),
    defaultValue: null,
  });
}
