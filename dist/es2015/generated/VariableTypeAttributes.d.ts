import { Variant } from '../variant';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
import { NodeAttributes } from './NodeAttributes';
import { INodeAttributes } from './NodeAttributes';
export interface IVariableTypeAttributes extends INodeAttributes {
    value?: Variant;
    dataType?: ec.NodeId;
    valueRank?: ec.Int32;
    arrayDimensions?: ec.UInt32[];
    isAbstract?: boolean;
}
/**
The attributes for a variable type node.
*/
export declare class VariableTypeAttributes extends NodeAttributes {
    value: Variant;
    dataType: ec.NodeId;
    valueRank: ec.Int32;
    arrayDimensions: ec.UInt32[];
    isAbstract: boolean;
    constructor(options?: IVariableTypeAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: VariableTypeAttributes): VariableTypeAttributes;
}
export declare function decodeVariableTypeAttributes(inp: DataStream): VariableTypeAttributes;
