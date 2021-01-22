'use strict';
/**
 * @module opcua.miscellaneous
 */
import { assert } from '../assert';
import { makeNodeId, coerceNodeId } from '../nodeid/nodeid';
import { makeExpandedNodeId, coerceExpandedNodeId } from '../nodeid/expanded_nodeid';

import { encodeBoolean, decodeBoolean, coerceBoolean } from '../basic-types/boolean';
import {
  encodeStatusCode,
  decodeStatusCode,
  coerceStatusCode,
  jsonEncodeStatusCode,
  jsonDecodeStatusCode,
} from '../basic-types/status_code_utils';
import {
  encodeNodeId,
  decodeNodeId,
  encodeExpandedNodeId,
  decodeExpandedNodeId,
  jsonEncodeNodeId,
  jsonDecodeNodeId,
  jsonDecodeExpandedNodeId,
  jsonEncodeExpandedNodeId,
} from '../basic-types/nodeid';
import {
  encodeByteString,
  decodeByteString,
  coerceByteString,
  jsonEncodeByteString,
  jsonDecodeByteString,
} from '../basic-types/byte_string';
import { encodeGuid, decodeGuid, emptyGuid } from '../basic-types/guid';
import {
  encodeDateTime,
  decodeDateTime,
  coerceDateTime,
  jsonEncodeDateTime,
  jsonDecodeDateTime,
} from '../basic-types/date_time';
import { encodeString, decodeString } from '../basic-types/string';
import {
  encodeDouble,
  decodeDouble,
  encodeFloat,
  decodeFloat,
  coerceFloat,
  jsonDecodeFloat,
  jsonEncodeFloat,
  jsonEncodeDouble,
  jsonDecodeDouble,
} from '../basic-types/floats';
import {
  encodeInt8,
  decodeInt8,
  coerceInt8,
  encodeUInt8,
  decodeUInt8,
  coerceUInt8,
  coerceSByte,
  coerceByte,
  encodeInt16,
  decodeInt16,
  coerceInt16,
  encodeUInt16,
  decodeUInt16,
  coerceUInt16,
  encodeInt32,
  decodeInt32,
  coerceInt32,
  encodeUInt32,
  decodeUInt32,
  coerceUInt32,
  encodeUInt64,
  decodeUInt64,
  coerceUInt64 as coerceInt64,
  coerceUInt64,
} from '../basic-types/integers';

import { StatusCodes } from '../constants/raw_status_codes';

import { enocdeQualifiedName, coerceQualifiedName } from '../data-model/qualified_name_util';
import { decodeQualifiedName, QualifiedName } from '../generated/QualifiedName';
import { decodeLocalizedText } from '../generated/LocalizedText';
import { enocdeLocalizedText, coerceLocalizedText } from '../data-model/localized_text_util';
import { ITypeSchema, TypeSchema } from './type_schema';
import { DataStream } from '../basic-types/DataStream';

export let minDate = new Date(Date.UTC(1601, 0, 1, 0, 0));

function encodeNull(value: any, stream: DataStream): void {}

function decodeNull(stream: DataStream): any {
  return null;
}

// there are 4 types of DataTypes in opcua:
//   Built-In DataType
//   Simple DataType
//   Complex DataType
//   Enumeration

const defaultXmlElement = '';

// Built-In Type
const _defaultType: any[] = [
  // Built-in DataTypes ( see OPCUA Part III v1.02 - $5.8.2 )
  {
    name: 'Null',
    encode: encodeNull,
    decode: decodeNull,
    defaultValue: null,
  },
  {
    name: 'Any',
    encode: function () {
      assert(false, "type 'Any' cannot be encoded");
    },
    decode: function () {
      assert(false, "type 'Any' cannot be decoded");
    },
  },
  {
    name: 'Boolean',
    encode: encodeBoolean,
    decode: decodeBoolean,
    defaultValue: false,
    coerce: coerceBoolean,
  },
  { name: 'Int8', encode: encodeInt8, decode: decodeInt8, defaultValue: 0, coerce: coerceInt8 },
  { name: 'UInt8', encode: encodeUInt8, decode: decodeUInt8, defaultValue: 0, coerce: coerceUInt8 },
  { name: 'SByte', encode: encodeInt8, decode: decodeInt8, defaultValue: 0, coerce: coerceSByte },
  { name: 'Byte', encode: encodeUInt8, decode: decodeUInt8, defaultValue: 0, coerce: coerceByte },
  { name: 'Int16', encode: encodeInt16, decode: decodeInt16, defaultValue: 0, coerce: coerceInt16 },
  {
    name: 'UInt16',
    encode: encodeUInt16,
    decode: decodeUInt16,
    defaultValue: 0,
    coerce: coerceUInt16,
  },
  { name: 'Int32', encode: encodeInt32, decode: decodeInt32, defaultValue: 0, coerce: coerceInt32 },
  {
    name: 'UInt32',
    encode: encodeUInt32,
    decode: decodeUInt32,
    defaultValue: 0,
    coerce: coerceUInt32,
  },
  {
    name: 'Int64',
    encode: encodeUInt64, // encodeInt64,
    decode: decodeUInt64, // decodeInt64,
    defaultValue: 0, // coerceInt64(0),
    coerce: coerceInt64,
  },
  {
    name: 'UInt64',
    encode: encodeUInt64,
    decode: decodeUInt64,
    defaultValue: 0, // coerceUInt64(0),
    coerce: coerceUInt64,
  },
  {
    name: 'Float',
    encode: encodeFloat,
    decode: decodeFloat,
    jsonEncode: jsonEncodeFloat,
    jsonDecode: jsonDecodeFloat,
    defaultValue: 0.0,
    coerce: coerceFloat,
  },
  {
    name: 'Double',
    encode: encodeDouble,
    decode: decodeDouble,
    jsonEncode: jsonEncodeDouble,
    jsonDecode: jsonDecodeDouble,
    defaultValue: 0.0,
    coerce: coerceFloat,
  },
  { name: 'String', encode: encodeString, decode: decodeString, defaultValue: '' },
  // OPC Unified Architecture, part 3.0 $8.26 page 67
  {
    name: 'DateTime',
    encode: encodeDateTime,
    decode: decodeDateTime,
    defaultValue: minDate,
    coerce: coerceDateTime,
    jsonEncode: jsonEncodeDateTime,
    jsonDecode: jsonDecodeDateTime,
  },
  { name: 'Guid', encode: encodeGuid, decode: decodeGuid, defaultValue: emptyGuid },

  {
    name: 'ByteString',
    encode: encodeByteString,
    decode: decodeByteString,
    defaultValue: function () {
      return new ArrayBuffer(0);
    },
    coerce: coerceByteString,
    jsonDecode: jsonDecodeByteString,
    jsonEncode: jsonEncodeByteString,
  },
  {
    name: 'XmlElement',
    encode: encodeString,
    decode: decodeString,
    defaultValue: defaultXmlElement,
  },

  // see OPCUA Part 3 - V1.02 $8.2.1
  {
    name: 'NodeId',
    encode: encodeNodeId,
    decode: decodeNodeId,
    defaultValue: makeNodeId,
    coerce: coerceNodeId,
    jsonEncode: jsonEncodeNodeId,
    jsonDecode: jsonDecodeNodeId,
  },

  {
    name: 'QualifiedName',
    encode: enocdeQualifiedName,
    decode: decodeQualifiedName,
    coerce: coerceQualifiedName,
    defaultValue: null,
  },

  {
    name: 'LocalizedText',
    encode: enocdeLocalizedText,
    decode: decodeLocalizedText,
    coerce: coerceLocalizedText,
    defaultValue: null,
  },

  {
    name: 'ExpandedNodeId',
    encode: encodeExpandedNodeId,
    decode: decodeExpandedNodeId,
    defaultValue: makeExpandedNodeId,
    coerce: coerceExpandedNodeId,
    jsonDecode: jsonDecodeExpandedNodeId,
    jsonEncode: jsonEncodeExpandedNodeId,
  },

  // ----------------------------------------------------------------------------------------
  // Simple  DataTypes
  // ( see OPCUA Part III v1.02 - $5.8.2 )
  // Simple DataTypes are subtypes of the Built-in DataTypes. They are handled on the wire like the
  // Built-in   DataType, i.e. they cannot be distinguished on the wire from their  Built-in supertypes.
  // Since they are handled like  Built-in   DataTypes  regarding the encoding they cannot have encodings
  // defined  in the  AddressSpace.  Clients  can read the  DataType  Attribute  of a  Variable  or  VariableType  to
  // identify the  Simple  DataType  of the  Value  Attribute. An example of a  Simple  DataType  is  Duration. It
  // is handled on the wire as a  Double   but the Client can read the  DataType  Attribute  and thus interpret
  // the value as defined by  Duration
  //

  // OPC Unified Architecture, part 4.0 $7.13
  // IntegerID: This primitive data type is an UInt32 that is used as an identifier, such as a handle. All values,
  // except for 0, are valid.
  { name: 'IntegerId', encode: encodeUInt32, decode: decodeUInt32, defaultValue: 0xffffffff },

  // The StatusCode is a 32-bit unsigned integer. The top 16 bits represent the numeric value of the
  // code that shall be used for detecting specific errors or conditions. The bottom 16 bits are bit flags
  // that contain additional information but do not affect the meaning of the StatusCode.
  // 7.33 Part 4 - P 143
  {
    name: 'StatusCode',
    encode: encodeStatusCode,
    decode: decodeStatusCode,
    jsonEncode: jsonEncodeStatusCode,
    jsonDecode: jsonDecodeStatusCode,
    defaultValue: StatusCodes.Good,
    coerce: coerceStatusCode,
  },
];

/**
 * @method registerType
 * @param schema {TypeSchema}
 */
export function registerType<T extends ITypeSchema>(schema: T) {
  assert(typeof schema.name === 'string');
  if ('function' !== typeof schema.encode) {
    throw new Error('schema ' + schema.name + ' has no encode function');
  }
  if ('function' !== typeof schema.decode) {
    throw new Error('schema ' + schema.name + ' has no decode function');
  }

  // schema.category = "basic";
  _defaultTypeMap[schema.name] = new TypeSchema(schema);
}

export function unregisterType(typeName: string) {
  delete _defaultTypeMap[typeName];
}

/**
 * @method findSimpleType
 * @param name
 * @return {TypeSchema|null}
 */
export function findSimpleType(name: string) {
  assert(name in _defaultTypeMap);
  const typeschema = _defaultTypeMap[name];
  assert(typeschema instanceof TypeSchema);
  return typeschema;
}

// populate the default type map
export let _defaultTypeMap: { [key: string]: TypeSchema } = {};
for (const t of _defaultType) {
  registerType(t);
}
// _defaultType.forEach(registerType);

/**
 * @method findBuiltInType
 * find the Builtin Type that this
 * @param datatypeName
 * @return {*}
 */
export function findBuiltInType(datatypeName: string | QualifiedName): TypeSchema {
  // coerce string or Qualified Name to string
  if ((datatypeName as QualifiedName).name) {
    datatypeName = datatypeName.toString();
  }
  assert(typeof datatypeName === 'string', 'findBuiltInType : expecting a string ' + datatypeName);
  const t = _defaultTypeMap[datatypeName as string];
  if (!t) {
    throw new Error('datatype ' + datatypeName + ' must be registered');
  }
  if (t.subType && t.subType !== t.name /* avoid infinite recursion */) {
    return findBuiltInType(t.subType);
  }
  return t;
}
