import * as ec from '../basic-types';
import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
export interface IGenericAttributeValue {
    attributeId?: ec.UInt32;
    value?: Variant;
}
/**

*/
export declare class GenericAttributeValue {
    attributeId: ec.UInt32;
    value: Variant;
    constructor(options?: IGenericAttributeValue);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: GenericAttributeValue): GenericAttributeValue;
}
export declare function decodeGenericAttributeValue(inp: DataStream): GenericAttributeValue;
