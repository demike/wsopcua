/* eslint-disable no-bitwise */
'use strict';

import { assert } from '../assert';

import { DataType } from './DataTypeEnum';
import { VariantArrayType } from './VariantArrayTypeEnum';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';

import { _defaultTypeMap } from '../factory/factories_builtin_types';
import * as ec from '../basic-types';

import { BaseUAObject } from '../factory/factories_baseobject';
import { DataStream } from '../basic-types/DataStream';
import { cloneComplexArray, UInt32, unFlattenArray } from '../basic-types';

import { findBuiltInType } from '../factory/factories_builtin_types';
import { generate_new_id } from '../factory';

export const VARIANT_ARRAY_MASK = 0x80;
export const VARIANT_ARRAY_DIMENSIONS_MASK = 0x40;
export const VARIANT_TYPE_MASK = 0x3f;

export interface IVariant {
  dataType?: DataType;
  arrayType?: VariantArrayType;
  value?: any;
  dimensions?: UInt32[];
}

/**
 *
 * @class Variant
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.dataType = 0] {DataType} the variant type.
 * @param  [options.arrayType = 0] {VariantArrayType}
 * @param  [options.value = null] {Any}
 * @param  [options.dimensions = null] {UInt32[]} the matrix dimensions
 */
export class Variant extends BaseUAObject {
  public dataType: DataType = DataType.Null;
  public arrayType: VariantArrayType = VariantArrayType.Scalar;
  public value?: any = null; // default value null
  public dimensions?: UInt32[];

  constructor(options: IVariant = {}) {
    super();

    /**
     * the variant type.
     * @property dataType
     * @type {DataType}
     * @default  0
     */
    if (options.dataType !== undefined) {
      this.setDataType(options.dataType);
    }

    /**
     *
     * @property arrayType
     * @type {VariantArrayType}
     * @default  0
     */
    if (options.arrayType !== undefined) {
      this.setArrayType(options.arrayType);
    } else if (
      options.value &&
      (Array.isArray(options.value) ||
        (options.value.buffer !== undefined && this.dataType !== DataType.ByteString))
    ) {
      if (options.dataType === DataType.UInt64 || options.dataType === DataType.Int64) {
        throw new Error(
          'Variant#constructor : when using UInt64 or Int64 arrayType must be specified , as automatic detection is impossible'
        );
      } else {
        this.arrayType = VariantArrayType.Array;
      }
    }

    /**
     *
     * @property value
     * @type {Any}
     * @default  null
     */
    if (options.value !== undefined) {
      this.value = options.value;
    }

    /**
     * the matrix dimensions
     * @property dimensions
     * @type {UInt32[]}
     * @default  null
     */
    if (options.dimensions !== undefined) {
      // TODO: this could also be done lazily in the encode methods
      this.dimensions = options.dimensions;
      this.arrayType = VariantArrayType.Matrix;
      const elementCnt = this.dimensions.reduce((prev, current) => prev * current, 1);
      if (elementCnt !== this.value.length) {
        // it' a multidimensional array --> flatten it
        this.value = this.value.flat(this.dimensions.length - 1);
      }

      if (elementCnt !== this.value.length) {
        throw new Error(
          `Dimensions ${this.dimensions} and actual array length ${this.value.length} do not match!`
        );
      }
    }

    // Object.preventExtensions(self);
  }

  // ## Define Enumeration setters
  public setDataType(value: number | DataType) {
    if (!(value in DataType)) {
      throw new Error('value cannot be coerced to DataType: ' + value);
    }

    this.dataType = value;
  }

  public setArrayType(value: number | VariantArrayType) {
    if (!(value in VariantArrayType)) {
      throw new Error('value cannot be coerced to VariantArrayType: ' + value);
    }

    this.arrayType = value;
  }

  public toString() {
    return variantToString(this);
  }
  public isValid(): boolean {
    return isValidVariant(this.arrayType, this.dataType, this.value, this.dimensions);
  }

  // Variant.prototype.encodingDefaultBinary = makeExpandedNodeId(schema.id);
  // Variant.prototype._schema = schema;

  // var encode_DataType = _enumerations.DataType.encode;
  // var decode_DataType = _enumerations.DataType.decode;
  // var encode_VariantArrayType = _enumerations.VariantArrayType.encode;
  // var decode_VariantArrayType = _enumerations.VariantArrayType.decode;
  // var encode_Any = _defaultTypeMap.Any.encode;
  // var decode_Any = _defaultTypeMap.Any.decode;
  // var encode_UInt32 = _defaultTypeMap.UInt32.encode;
  // var decode_UInt32 = _defaultTypeMap.UInt32.decode;
  public encode(out: DataStream) {
    let encodingByte = this.dataType;

    if (this.arrayType === VariantArrayType.Array || this.arrayType === VariantArrayType.Matrix) {
      encodingByte |= VARIANT_ARRAY_MASK;
    }
    if (this.dimensions) {
      encodingByte |= VARIANT_ARRAY_DIMENSIONS_MASK;
    }
    ec.encodeUInt8(encodingByte, out);

    if (this.arrayType === VariantArrayType.Array || this.arrayType === VariantArrayType.Matrix) {
      encodeVariantArray(this.dataType, out, this.value);
    } else {
      const encode = get_encoder(this.dataType);
      encode(this.value, out);
    }

    if (this.dimensions) {
      encodeGeneralArray(DataType.UInt32, out, this.dimensions);
    }
  }
  /**
   * decode the object from a binary stream
   * @method decode
   *
   * @param stream {DataStream}
   * @param [option] {object}
   */
  public decode(inp: DataStream) {
    const encodingByte = ec.decodeUInt8(inp);

    const isArray = (encodingByte & VARIANT_ARRAY_MASK) === VARIANT_ARRAY_MASK;

    const hasDimension =
      (encodingByte & VARIANT_ARRAY_DIMENSIONS_MASK) === VARIANT_ARRAY_DIMENSIONS_MASK;

    this.dataType = encodingByte & VARIANT_TYPE_MASK;

    if (!(this.dataType in DataType)) {
      throw new Error(
        'cannot find DataType for encodingByte = 0x' +
          (encodingByte & VARIANT_TYPE_MASK).toString(16)
      );
    }
    if (isArray) {
      this.arrayType = hasDimension ? VariantArrayType.Matrix : VariantArrayType.Array;
      this.value = decodeVariantArray(this.dataType, inp);
    } else {
      this.arrayType = VariantArrayType.Scalar;
      const decode = get_decoder(this.dataType);
      this.value = decode(inp);
    }
    if (hasDimension) {
      this.dimensions = decodeGeneralArray(DataType.UInt32, inp);
      const verification = calculate_product(this.dimensions);
      if (verification !== this.value.length) {
        throw new Error('BadDecodingError');
      }
    }
  }

  /**
   * @method clone
   *   deep clone a variant
   *
   * @return {Variant}
   */
  public clone(): Variant {
    const newvar = new Variant(this);
    if (newvar.dimensions) {
      newvar.dimensions = newvar.dimensions.slice(0);
    }

    if (newvar.value === undefined || newvar.value === null) {
      return newvar;
    }

    if (this.arrayType === VariantArrayType.Scalar) {
      if (newvar.value.clone !== undefined) {
        newvar.value = newvar.value.clone();
      }
    } else {
      if (newvar.value.length > 0 && newvar.value[0].clone !== undefined) {
        // it is an array with complex types
        newvar.value = cloneComplexArray(newvar.value);
      } else {
        newvar.value = newvar.value.slice(0);
      }
    }

    return newvar;
  }

  public fromJSON(inp: any) {
    const body = inp.Body;
    if (inp.Type) {
      this.dataType = inp.Type;
    } else {
      // it is the non reversable form --> just store the variant body to value as is
      this.value = body;
      return;
    }

    if (inp.Dimensions) {
      this.arrayType = VariantArrayType.Matrix;
      this.dimensions = inp.Dimensions;
      this.value = jsonDecodeMatrix(this.dataType, body, inp.Dimensions);
    } else if (Array.isArray(body)) {
      this.arrayType = VariantArrayType.Array;
      this.value = jsonDecodeVariantArray(this.dataType, body);
    } else {
      const decode = get_json_decoder(this.dataType);
      this.value = decode ? decode(body) : body;
    }
  }

  public toJSON() {
    const out: any = {};
    out.Type = this.dataType;
    out.Dimensions = this.dimensions;

    if (this.dataType === DataType.Null) {
      // it is the non reversable form --> just try to store the variant value to the body
      out.Body = this.value;
      return out;
    }

    if (this.arrayType === VariantArrayType.Array) {
      out.Body = jsonEncodeVariantArray(this.dataType, this.value);
    } else if (this.arrayType === VariantArrayType.Matrix) {
      out.Body = jsonEncodeMatrix(this.dataType, this.value, this.dimensions);
    } else {
      const encode = get_json_encoder(this.dataType);
      if (encode) {
        out.Body = encode(this.value);
      } else {
        out.Body = this.value;
      }
    }

    return out;
  }
}

import { register_class_definition } from '../factory/factories_factories';
import { registerSpecialVariantEncoder } from '../factory/factories_builtin_types_special';

register_class_definition('Variant', Variant, makeExpandedNodeId(generate_new_id()));
registerSpecialVariantEncoder(Variant, 'Variant');

export function coerceVariant(variantLike: any) {
  const value = variantLike instanceof Variant ? variantLike : new Variant(variantLike);
  assert(value instanceof Variant);
  return value;
}

export function isValidVariant(
  arrayType: VariantArrayType,
  dataType: DataType,
  value: any,
  dimensions?: number[]
) {
  assert(dataType, 'expecting a variant type');

  switch (arrayType) {
    case VariantArrayType.Scalar:
      return isValidScalarVariant(dataType, value);
    case VariantArrayType.Array:
      return isValidArrayVariant(dataType, value);
    default:
      assert(arrayType === VariantArrayType.Matrix);
      return isValidMatrixVariant(dataType, value, dimensions);
  }
}

function isValidScalarVariant(dataType: DataType, value: any): boolean {
  assert(
    value === null ||
      DataType.Int64 === dataType ||
      DataType.ByteString === dataType ||
      DataType.UInt64 === dataType ||
      !(value instanceof Array)
  );
  assert(value === null || !(value instanceof Int32Array));
  assert(value === null || !(value instanceof Uint32Array));
  switch (dataType) {
    case DataType.NodeId:
      return ec.isValidNodeId(value);
    case DataType.String:
      return typeof value === 'string' || value === null || value === undefined;
    case DataType.Int64:
      return ec.isValidInt64(value);
    case DataType.UInt64:
      return ec.isValidUInt64(value);
    case DataType.UInt32:
      return ec.isValidUInt32(value);
    case DataType.Int32:
      return ec.isValidInt32(value);
    case DataType.UInt16:
      return ec.isValidUInt16(value);
    case DataType.Int16:
      return ec.isValidInt16(value);
    case DataType.Byte:
      return ec.isValidUInt8(value);
    case DataType.SByte:
      return ec.isValidInt8(value);
    case DataType.Boolean:
      return ec.isValidBoolean(value);
    case DataType.ByteString:
      return ec.isValidByteString(value);
    default:
      return true;
  }
}

function isValidArrayVariant(dataType: DataType, value: any): boolean {
  if (dataType === DataType.Float && value instanceof Float32Array) {
    return true;
  } else if (dataType === DataType.Double && value instanceof Float64Array) {
    return true;
  } else if (dataType === DataType.SByte && value instanceof Int8Array) {
    return true;
  } else if (
    dataType === DataType.Byte &&
    value instanceof Uint8Array /* || value instanceof Buffer*/
  ) {
    return true;
  } else if (dataType === DataType.Int16 && value instanceof Int16Array) {
    return true;
  } else if (dataType === DataType.Int32 && value instanceof Int32Array) {
    return true;
  } else if (dataType === DataType.UInt16 && value instanceof Uint16Array) {
    return true;
  } else if (dataType === DataType.UInt32 && value instanceof Uint32Array) {
    return true;
  }
  // array values can be store in Buffer, Float32Array
  assert(Array.isArray(value));
  for (let i = 0; i < value.length; i++) {
    if (!isValidScalarVariant(dataType, value[i])) {
      return false;
    }
  }
  return true;
}

/* istanbul ignore next*/
function isValidMatrixVariant(dataType: DataType, value: any, dimensions?: number[]): boolean {
  if (!dimensions) {
    return false;
  }
  if (!isValidArrayVariant(dataType, value)) {
    return false;
  }
  return true;
}

function get_encoder(dataType: DataType) {
  const encode = findBuiltInType(DataType[dataType]).encode;
  /* istanbul ignore next */
  if (!encode) {
    throw new Error('Cannot find encode function for dataType ' + dataType);
  }
  return encode;
}

function get_decoder(dataType: DataType) {
  const decode = findBuiltInType(DataType[dataType]).decode;
  /* istanbul ignore next */
  if (!decode) {
    throw new Error('Variant.decode : cannot find decoder for type ' + dataType);
  }
  return decode;
}

function encodeGeneralArray(dataType: DataType, stream: DataStream, value: any) {
  const arr = value || [];
  assert(arr instanceof Array);
  assert(Number.isFinite(arr.length));
  ec.encodeUInt32(arr.length, stream);
  const encode = get_encoder(dataType);
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    encode(arr[i], stream);
  }
}

function encodeVariantArray(dataType: DataType, stream: DataStream, value: any) {
  if (value && value.buffer && value.buffer instanceof ArrayBuffer) {
    try {
      ec.encodeUInt32(value.length, stream);
      stream.writeArrayBuffer(value.buffer, value.byteOffset, value.byteLength);
    } catch (err) {
      console.log('DATATYPE: ' + dataType);
      console.log('value: ' + value.length);
    }
    return;
  }
  return encodeGeneralArray(dataType, stream, value);
}

function decodeGeneralArray(dataType: DataType, stream: DataStream, length: number = 0xffffffff) {
  length = length === 0xffffffff ? ec.decodeUInt32(stream) : length;

  if (length === 0xffffffff) {
    return null;
  }

  const decode = get_decoder(dataType);

  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(decode(stream));
  }
  return arr;
}

function decodeVariantArray(dataType: DataType, stream: DataStream) {
  const length = ec.decodeUInt32(stream);
  if (length === 0xffffffff) {
    return null;
  }
  switch (dataType) {
    case DataType.Float:
      return new Float32Array(stream.readArrayBuffer(length * Float32Array.BYTES_PER_ELEMENT));
    case DataType.Double:
      return new Float64Array(stream.readArrayBuffer(length * Float64Array.BYTES_PER_ELEMENT));
    case DataType.SByte:
      return new Int8Array(stream.readArrayBuffer(length));
    case DataType.Byte:
      return stream.readArrayBuffer(length);
    case DataType.Int16:
      return new Int16Array(stream.readArrayBuffer(length * Int16Array.BYTES_PER_ELEMENT));
    case DataType.Int32:
      return new Int32Array(stream.readArrayBuffer(length * Int32Array.BYTES_PER_ELEMENT));
    case DataType.UInt16:
      return new Uint16Array(stream.readArrayBuffer(length * Uint32Array.BYTES_PER_ELEMENT));
    case DataType.UInt32:
      return new Uint32Array(stream.readArrayBuffer(length * Uint32Array.BYTES_PER_ELEMENT));
    // () case DataType.UInt64: ?
  }

  return decodeGeneralArray(dataType, stream, length);
}

function calculate_product(array: number[]) {
  return array.reduce(function (n, p) {
    return n * p;
  }, 1);
}

export function decodeVariant(inp: DataStream): Variant {
  const obj = new Variant();
  obj.decode(inp);
  return obj;
}

export type VariantLike = IVariant | Variant;

function variantToString(self: Variant, options?: any) {
  function toString(value: any): string {
    switch (self.dataType) {
      case DataType.Null:
        return '<null>';
      case DataType.ByteString:
        return value ? '0x' + value.toString('hex') : '<null>';
      case DataType.Boolean:
        return value.toString();
      case DataType.DateTime:
        return value ? (value.toISOString ? value.toISOString() : value.toString()) : '<null>';
      default:
        return value ? value.toString(options) : '0';
    }
  }

  function f(value: any) {
    if (value === undefined || (value === null && typeof value === 'object')) {
      return '<null>';
    }
    return toString(value);
  }

  let data = VariantArrayType[self.arrayType];

  if (self.dimensions && self.dimensions.length > 0) {
    data += '[ ' + self.dimensions.join(',') + ' ]';
  }

  data += '<' + DataType[self.dataType] + '>';
  if (self.arrayType === VariantArrayType.Scalar) {
    data += ', value: ' + f(self.value);
  } else if (
    self.arrayType === VariantArrayType.Array ||
    self.arrayType === VariantArrayType.Matrix
  ) {
    if (!self.value) {
      data += ', null';
    } else {
      const a = [];
      assert(Array.isArray(self.value) || self.value.buffer instanceof ArrayBuffer);
      for (let i = 0; i < Math.min(10, self.value.length); i++) {
        a[i] = self.value[i];
      }
      if (self.value.length > 10) {
        a.push('...');
      }
      data += ', l= ' + self.value.length + ', value=[' + a.map(f).join(',') + ']';
    }
  }
  return 'Variant(' + data + ')';
}

// json coding
function get_json_encoder(dataType: DataType) {
  return findBuiltInType(DataType[dataType]).jsonEncode;
}

function get_json_decoder(dataType: DataType) {
  return findBuiltInType(DataType[dataType]).jsonDecode;
}

function jsonDecodeVariantArray(dataType: DataType, array: any[]) {
  switch (dataType) {
    case DataType.Float:
      return new Float32Array(array);
    case DataType.Double:
      return new Float64Array(array);
    case DataType.SByte:
      return new Int8Array(array);
    case DataType.Byte:
      return new Uint8Array(array).buffer;
    case DataType.Int16:
      return new Int16Array(array);
    case DataType.Int32:
      return new Int32Array(array);
    case DataType.UInt16:
      return new Uint16Array(array);
    case DataType.UInt32:
      return new Uint32Array(array);
    // () case DataType.UInt64: ?
  }

  return jsonDecodeGeneralArray(dataType, array);
}

function jsonDecodeGeneralArray(dataType: DataType, array: any[]) {
  const decode = get_json_decoder(dataType);
  if (!decode) {
    return array;
  }
  return array.map(decode);
}

function jsonEncodeVariantArray(dataType: DataType, array: any[]) {
  switch (dataType) {
    case DataType.Float:
    case DataType.Double:
    case DataType.SByte:
    case DataType.Byte:
    case DataType.Int16:
    case DataType.Int32:
    case DataType.UInt16:
    case DataType.UInt32:
    case DataType.UInt64:
      return Array.from(array);
  }

  return jsonEncodeGeneralArray(dataType, array);
}

function jsonEncodeGeneralArray(dataType: DataType, array: any[]) {
  const encode = get_json_encoder(dataType);
  if (!encode) {
    return array;
  }
  return array.map(encode);
}

function jsonEncodeMatrix(dataType: DataType, matrix: any[], dimesions: number[]) {
  // 2*3*2 matrix:
  // [0,1,2,3,4,5,6,7,8,9,10,11] ==>
  // [[[0,1],[2,3],[4,5]] , [[6,7], [8,9], [10,11]]];
  return unFlattenArray(jsonEncodeVariantArray(dataType, matrix), dimesions);
}

function jsonDecodeMatrix(dataType: DataType, matrix: any[], dimensions: number[]) {
  // TODO fix the compiler warning about flat
  return jsonDecodeVariantArray(dataType, (matrix as any).flat(dimensions.length - 1));
}
