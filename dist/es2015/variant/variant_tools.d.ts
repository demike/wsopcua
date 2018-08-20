import { DataType } from './DataTypeEnum';
export declare function coerceVariantType(dataType: DataType, value: any): any;
export declare function isValidVariant(arrayType: any, dataType: any, value: any, dimensions: any): boolean;
export declare function buildVariantArray(dataType: any, nbElements: any, defaultValue: any): any;
export declare function sameVariant(v1: any, v2: any): boolean;
