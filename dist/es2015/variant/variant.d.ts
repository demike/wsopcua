import { DataType } from './DataTypeEnum';
import { VariantArrayType } from './VariantArrayTypeEnum';
import { BaseUAObject } from '../factory/factories_baseobject';
import { DataStream } from "../basic-types/DataStream";
import { UInt32 } from "../basic-types";
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
export declare class Variant extends BaseUAObject {
    dataType: DataType;
    arrayType: VariantArrayType;
    value: any;
    dimensions: UInt32[];
    constructor(options?: IVariant);
    setDataType(value: number | DataType): void;
    setArrayType(value: number | VariantArrayType): void;
    encode(out: DataStream): void;
    /**
     * decode the object from a binary stream
     * @method decode
     *
     * @param stream {DataStream}
     * @param [option] {object}
     */
    decode(inp: DataStream): void;
    coerceVariant(variantLike: any): Variant;
    /**
     * @method clone
     *   deep clone a variant
     *
     * @return {Variant}
     */
    clone(): Variant;
}
export declare function isValidVariant(arrayType: VariantArrayType, dataType: DataType, value: any, dimensions: any): boolean;
export declare function decodeVariant(inp: DataStream): Variant;
