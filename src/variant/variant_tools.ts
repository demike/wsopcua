'use strict';

import { assert } from '../assert';
import { QualifiedName } from '../generated/QualifiedName';
import { LocalizedText } from '../generated/LocalizedText';
import * as ec from '../basic-types';

import { DataType } from './DataTypeEnum';
import { VariantArrayType } from './VariantArrayTypeEnum';

import * as utils from '../utils';
import { isEqual } from '../utils';
import { Variant } from './variant';

const txtEncoder = new TextEncoder();

function isEnumerationItem(value: any) {
  return value instanceof Object && value.hasOwnProperty('value') && value.hasOwnProperty('key');
}

export function coerceVariantType(dataType: DataType, value: any) {
  /* eslint max-statements: ["error",1000], complexity: ["error",1000]*/
  if (value === undefined) {
    value = null;
  }
  if (isEnumerationItem(value)) {
    // OPCUA Specification 1.0.3 5.8.2 encoding rules for various dataType:
    // [...]Enumeration are always encoded as Int32 on the wire [...]

    // istanbul ignore next
    if (dataType !== DataType.Int32) {
      throw new Error(
        'expecting DataType.Int32 for enumeration values ; got DataType.' +
          dataType.toString() +
          ' instead'
      );
    }
  }

  switch (dataType) {
    case DataType.Null:
      value = null;
      break;

    case DataType.LocalizedText:
      if (!value || !(value instanceof LocalizedText)) {
        value = new LocalizedText(value);
      }
      break;

    case DataType.QualifiedName:
      if (!value || !(value instanceof QualifiedName)) {
        value = new QualifiedName(value);
      }
      break;
    case DataType.Int16:
    case DataType.UInt16:
    case DataType.Int32:
    case DataType.UInt32:
      assert(value !== undefined);
      if (isEnumerationItem(value)) {
        // value is a enumeration of some sort
        value = value.value;
      } else {
        value = parseInt(value, 10);
      }
      assert(Number.isFinite(value), 'expecting a number');
      break;
    case DataType.UInt64:
      value = ec.coerceUInt64(value);
      break;
    case DataType.Int64:
      value = ec.coerceInt64(value);
      break;
    case DataType.ExtensionObject:
      break;
    case DataType.DateTime:
      assert(value === null || value instanceof Date);
      break;
    case DataType.String:
      assert(typeof value === 'string' || value === null);
      break;
    case DataType.ByteString:
      value = typeof value === 'string' ? txtEncoder.encode(value) : value;
      if (!(value === null || value instanceof ArrayBuffer)) {
        throw new Error('ByteString should be null or a Buffer');
      }
      assert(value === null || value instanceof ArrayBuffer);
      break;
    default:
      assert(dataType !== undefined && dataType !== null, 'Invalid DataType');
      break;
  }
  return value;
}

function isValidScalarVariant(dataType: DataType, value: any) {
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
      return typeof value === 'string' || utils.isNullOrUndefined(value);
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

function isValidArrayVariant(dataType: DataType, value: any) {
  if (dataType === DataType.Float && value instanceof Float32Array) {
    return true;
  } else if (dataType === DataType.Double && value instanceof Float64Array) {
    return true;
  } else if (dataType === DataType.SByte && value instanceof Int8Array) {
    return true;
  } else if (dataType === DataType.Byte && value instanceof Uint8Array) {
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
  // array values can be store in ArrayBuffer, Float32Array
  assert(Array.isArray(value));
  for (let i = 0; i < value.length; i++) {
    if (!isValidScalarVariant(dataType, value[i])) {
      return false;
    }
  }
  return true;
}

/* istanbul ignore next*/
function isValidMatrixVariant(dataType: DataType, value: any, dimensions?: number[]) {
  if (!dimensions) {
    return false;
  }
  if (!isValidArrayVariant(dataType, value)) {
    return false;
  }
  return true;
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

/**
 * TOOD: fix this method, code looks weird
 * @param dataType
 * @param nbElements
 * @param defaultValue
 */
export function buildVariantArray(dataType: DataType, nbElements: number, defaultValue: number) {
  let value;
  switch (dataType) {
    case DataType.Float:
      value = new Float32Array(nbElements);
      break;
    case DataType.Double:
      value = new Float64Array(nbElements);
      break;
    case DataType.UInt32:
      value = new Uint32Array(nbElements);
      break;
    case DataType.Int32:
      value = new Int32Array(nbElements);
      break;
    case DataType.UInt16:
      value = new Uint16Array(nbElements);
      break;
    case DataType.Int16:
      value = new Int16Array(nbElements);
      break;
    case DataType.Byte:
      value = new Uint8Array(nbElements);
      break;
    case DataType.SByte:
      value = new Int8Array(nbElements);
      break;
    default:
      value = new Array(nbElements);
    // xx console.log("xxx done");
  }
  if (defaultValue !== undefined) {
    for (let i = 0; i < nbElements; i++) {
      value[i] = defaultValue;
    }
  }
  return value;
}

function __check_same_array(arr1?: any[], arr2?: any[]) {
  if (!arr1 || !arr2) {
    return !arr1 && !arr2;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  if (arr1.length === 0 && 0 === arr2.length) {
    return true;
  }

  const n = arr1.length;
  for (let i = 0; i < n; i++) {
    if (!isEqual(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
}
export function sameVariant(v1?: Variant | null, v2?: Variant | null): boolean {
  // xx assert(v1 && v1.constructor.name === "Variant");
  if (v1 === v2) {
    return true;
  }
  if (!v1 || !v2) {
    return false;
  }

  if (v1.arrayType !== v2.arrayType) {
    return false;
  }
  if (v1.dataType !== v2.dataType) {
    return false;
  }
  if (v1.value === v2.value) {
    return true;
  }
  if (v1.arrayType === VariantArrayType.Scalar) {
    if (Array.isArray(v1.value) && Array.isArray(v2.value)) {
      return __check_same_array(v1.value, v2.value);
    }
  }
  if (v1.arrayType === VariantArrayType.Array) {
    return __check_same_array(v1.value, v2.value);
  } else if (v1.arrayType === VariantArrayType.Matrix) {
    if (!__check_same_array(v1.dimensions, v2.dimensions)) {
      return false;
    }
    return __check_same_array(v1.value, v2.value);
  }
  return false;
}
