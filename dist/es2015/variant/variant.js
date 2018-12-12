"use strict";
import { assert } from "../assert";
import { DataType } from './DataTypeEnum';
import { VariantArrayType } from './VariantArrayTypeEnum';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
import * as ec from '../basic-types';
var encodeArray = ec.encodeArray;
var decodeArray = ec.decodeArray;
import { BaseUAObject } from '../factory/factories_baseobject';
var Variant_ArrayMask = 0x80;
var Variant_ArrayDimensionsMask = 0x40;
var Variant_TypeMask = 0x3F;
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
    constructor(options) {
        super();
        this.dataType = DataType.Null;
        this.arrayType = VariantArrayType.Scalar;
        this.dimensions = null;
        options = options || {};
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
            this.dimensions = options.dimensions;
        }
        // Object.preventExtensions(self);
    }
    //## Define Enumeration setters
    setDataType(value) {
        if (!(value in DataType)) {
            throw new Error("value cannot be coerced to DataType: " + value);
        }
        this.dataType = value;
    }
    ;
    setArrayType(value) {
        if (!(value in VariantArrayType)) {
            throw new Error("value cannot be coerced to VariantArrayType: " + value);
        }
        this.arrayType = value;
    }
    ;
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
    encode(out) {
        var encodingByte = this.dataType;
        if (this.arrayType === VariantArrayType.Array || this.arrayType === VariantArrayType.Matrix) {
            encodingByte |= Variant_ArrayMask;
        }
        if (this.dimensions) {
            encodingByte |= Variant_ArrayDimensionsMask;
        }
        ec.encodeUInt8(encodingByte, out);
        if (this.arrayType === VariantArrayType.Array || this.arrayType === VariantArrayType.Matrix) {
            encodeVariantArray(this.dataType, out, this.value);
        }
        else {
            var encode = get_encoder(this.dataType);
            encode(this.value, out);
        }
        if (this.dimensions) {
            encodeGeneralArray(DataType.UInt32, out, this.dimensions);
        }
    }
    ;
    /**
     * decode the object from a binary stream
     * @method decode
     *
     * @param stream {DataStream}
     * @param [option] {object}
     */
    decode(inp) {
        var encodingByte = ec.decodeUInt8(inp);
        var isArray = ((encodingByte & Variant_ArrayMask) === Variant_ArrayMask);
        var hasDimension = ((encodingByte & Variant_ArrayDimensionsMask) === Variant_ArrayDimensionsMask);
        this.dataType = encodingByte & Variant_TypeMask;
        if (!(this.dataType in DataType)) {
            throw new Error("cannot find DataType for encodingByte = 0x" + (encodingByte & Variant_TypeMask).toString(16));
        }
        if (isArray) {
            this.arrayType = hasDimension ? VariantArrayType.Matrix : VariantArrayType.Array;
            this.value = decodeVariantArray(this.dataType, inp);
        }
        else {
            this.arrayType = VariantArrayType.Scalar;
            var decode = get_decoder(this.dataType);
            this.value = decode(inp);
        }
        if (hasDimension) {
            this.dimensions = decodeGeneralArray(DataType.UInt32, inp);
            var verification = calculate_product(this.dimensions);
            if (verification !== this.value.length) {
                throw new Error("BadDecodingError");
            }
        }
    }
    ;
    coerceVariant(variantLike) {
        var value = (variantLike instanceof Variant) ? variantLike : new Variant(variantLike);
        assert(value instanceof Variant);
        return value;
    }
    /**
     * @method clone
     *   deep clone a variant
     *
     * @return {Variant}
     */
    clone() {
        return new Variant(this);
    }
    ;
}
import { register_class_definition } from '../factory/factories_factories';
import { registerSpecialVariantEncoder } from '../factory/factories_builtin_types_special';
register_class_definition("Variant", Variant, makeExpandedNodeId(generate_new_id()));
registerSpecialVariantEncoder(Variant, "Variant");
export function isValidVariant(arrayType, dataType, value, dimensions) {
    assert(dataType, "expecting a variant type");
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
function isValidScalarVariant(dataType, value) {
    assert(value === null || DataType.Int64 === dataType || DataType.ByteString === dataType || DataType.UInt64 === dataType || !(value instanceof Array));
    assert(value === null || !(value instanceof Int32Array));
    assert(value === null || !(value instanceof Uint32Array));
    switch (dataType) {
        case DataType.NodeId:
            return ec.isValidNodeId(value);
        case DataType.String:
            return typeof value === "string" || value === null || value === undefined;
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
function isValidArrayVariant(dataType, value) {
    if (dataType === DataType.Float && value instanceof Float32Array) {
        return true;
    }
    else if (dataType === DataType.Double && value instanceof Float64Array) {
        return true;
    }
    else if (dataType === DataType.SByte && (value instanceof Int8Array)) {
        return true;
    }
    else if (dataType === DataType.Byte && (value instanceof Uint8Array /*|| value instanceof Buffer*/)) {
        return true;
    }
    else if (dataType === DataType.Int16 && value instanceof Int16Array) {
        return true;
    }
    else if (dataType === DataType.Int32 && value instanceof Int32Array) {
        return true;
    }
    else if (dataType === DataType.UInt16 && value instanceof Uint16Array) {
        return true;
    }
    else if (dataType === DataType.UInt32 && value instanceof Uint32Array) {
        return true;
    }
    // array values can be store in Buffer, Float32Array
    assert(Array.isArray(value));
    for (var i = 0; i < value.length; i++) {
        if (!isValidScalarVariant(dataType, value[i])) {
            return false;
        }
    }
    return true;
}
/*istanbul ignore next*/
function isValidMatrixVariant(dataType, value, dimensions) {
    if (!dimensions) {
        return false;
    }
    if (!isValidArrayVariant(dataType, value)) {
        return false;
    }
    return true;
}
import { findBuiltInType } from '../factory/factories_builtin_types';
import { generate_new_id } from "../factory";
function get_encoder(dataType) {
    var encode = findBuiltInType(DataType[dataType]).encode;
    /* istanbul ignore next */
    if (!encode) {
        throw new Error("Cannot find encode function for dataType " + dataType);
    }
    return encode;
}
function get_decoder(dataType) {
    var decode = findBuiltInType(DataType[dataType]).decode;
    /* istanbul ignore next */
    if (!decode) {
        throw new Error("Variant.decode : cannot find decoder for type " + dataType);
    }
    return decode;
}
function encodeGeneralArray(dataType, stream, value) {
    var arr = value || [];
    assert(arr instanceof Array);
    assert(Number.isFinite(arr.length));
    ec.encodeUInt32(arr.length, stream);
    var encode = get_encoder(dataType);
    var i, n = arr.length;
    for (i = 0; i < n; i++) {
        encode(arr[i], stream);
    }
}
function encodeVariantArray(dataType, stream, value) {
    if (value.buffer && value.buffer instanceof ArrayBuffer) {
        try {
            ec.encodeUInt32(value.length, stream);
            stream.writeArrayBuffer(value.buffer, value.byteOffset, value.byteLength);
        }
        catch (err) {
            console.log("DATATYPE: " + dataType);
            console.log("value: " + value.length);
        }
    }
    return encodeGeneralArray(dataType, stream, value);
}
function decodeGeneralArray(dataType, stream, length = 0xFFFFFFFF) {
    var length = (length == 0xFFFFFFFF) ? ec.decodeUInt32(stream) : length;
    if (length === 0xFFFFFFFF) {
        return null;
    }
    var decode = get_decoder(dataType);
    var arr = [];
    for (var i = 0; i < length; i++) {
        arr.push(decode(stream));
    }
    return arr;
}
function decodeVariantArray(dataType, stream) {
    let length = ec.decodeUInt32(stream);
    if (length === 0xFFFFFFFF) {
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
        //() case DataType.UInt64: ?
    }
    return decodeGeneralArray(dataType, stream, length);
}
function calculate_product(array) {
    return array.reduce(function (n, p) {
        return n * p;
    }, 1);
}
export function decodeVariant(inp) {
    let obj = new Variant(null);
    obj.decode(inp);
    return obj;
}
//# sourceMappingURL=variant.js.map