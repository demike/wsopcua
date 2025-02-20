'use strict';
/**
 * @module opcua.miscellaneous
 */
import { assert } from '../assert';

import * as ec from '../basic-types';
import { registerType, _defaultTypeMap } from './factories_builtin_types';
import { ITypeSchema } from './type_schema';

/**
 * register a Basic Type ,
 * A basic type is new entity type that resolved to  a SubType
 * @example:
 *
 *
 *   registerBasicType({name:"Duration"   ,subtype:"Double"});
 *
 * @method registerBasicType
 * @param schema
 * @param schema.name {String}
 * @param schema.subtype {String} mandatory, the basic type from which the new type derives.
 *
 * @param [schema.encode] {Function} optional,a specific encoder function to encode an instance of this type.
 * @param schema.encode.value  {*}
 * @param schema.encode.stream {Stream}
 *
 * @param [schema.decode] {Function} optional,a specific decoder function that returns  the decode value out of the stream.
 * @param [schema.decode.stream] {Stream}
 *
 * @param [schema.coerce] {Function} optional, a method to convert a value into the request type.
 * @param schema.coerce.value {*} the value to coerce.
 *
 * @param [schema.random] {Function} optional, a method to construct a random object of this type
 *
 * @param [schema.toJSONFunc]{Function} optional, a method to convert a value into the request type.
 */
export function registerBasicType(schema: ITypeSchema) {
  const name = schema.name;

  const t = schema.subtype ? _defaultTypeMap[schema.subtype] : undefined;

  /* istanbul ignore next */
  if (!t) {
    console.log(JSON.stringify(schema));
    throw new Error(' cannot find subtype ' + schema.subtype);
  }
  assert('function' === typeof t.decode);

  const encodeFunc = schema.encode || t.encode;
  assert('function' === typeof encodeFunc);

  const decodeFunc = schema.decode || t.decode;
  assert('function' === typeof decodeFunc);

  const defaultValue = schema.defaultValue === undefined ? t.defaultValue : schema.defaultValue;
  // assert('function' === typeof defaultValue);

  const coerceFunc = schema.coerce || t.coerce;

  const jsonEncode = schema.jsonEncode || t.jsonEncode;
  const jsonDecode = schema.jsonDecode || t.jsonDecode;

  const random = schema.random || defaultValue;

  const new_schema = {
    name: name,
    encode: encodeFunc,
    decode: decodeFunc,
    defaultValue: defaultValue,
    coerce: coerceFunc,
    subType: schema.subtype,
    random: random,
    jsonEncode,
    jsonDecode,
  };
  registerType(new_schema);
}

// =============================================================================================
// Registering the Basic Type already defined int the OPC-UA Specification
// =============================================================================================

registerBasicType({ name: 'Counter', subtype: 'UInt32' });
// OPC Unified Architecture, part 3.0 $8.13 page 65
registerBasicType({ name: 'Duration', subtype: 'Double' });
registerBasicType({ name: 'UAString', subtype: 'String' });
registerBasicType({ name: 'UtcTime', subtype: 'DateTime' });
registerBasicType({ name: 'Int8', subtype: 'SByte' });
registerBasicType({ name: 'UInt8', subtype: 'Byte' });
// xx registerBasicType({name:"XmlElement" ,subtype:"String"  });
registerBasicType({ name: 'Time', subtype: 'String' });
// string in the form "en-US" or "de-DE" or "fr" etc...

registerBasicType({
  name: 'LocaleId',
  subtype: 'String',
  encode: ec.encodeLocaleId,
  decode: ec.decodeLocaleId,
  validate: ec.validateLocaleId,
  defaultValue: null,
});

registerBasicType({ name: 'ContinuationPoint', subtype: 'ByteString' });
registerBasicType({ name: 'Image', subtype: 'ByteString' });
registerBasicType({ name: 'ImageBMP', subtype: 'ByteString' });
registerBasicType({ name: 'ImageJPG', subtype: 'ByteString' });
registerBasicType({ name: 'ImagePNG', subtype: 'ByteString' });
registerBasicType({ name: 'ImageGIF', subtype: 'ByteString' });
