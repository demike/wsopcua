import { GenericAttributeValue } from './GenericAttributeValue';
import { DataStream } from '../basic-types/DataStream';
import { NodeAttributes } from './NodeAttributes';
import { INodeAttributes } from './NodeAttributes';
export interface IGenericAttributes extends INodeAttributes {
    attributeValues?: GenericAttributeValue[];
}
/**

*/
export declare class GenericAttributes extends NodeAttributes {
    attributeValues: GenericAttributeValue[];
    constructor(options?: IGenericAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: GenericAttributes): GenericAttributes;
}
export declare function decodeGenericAttributes(inp: DataStream): GenericAttributes;
