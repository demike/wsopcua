import { Variant } from '../variant';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
import { NodeAttributes } from './NodeAttributes';
import { INodeAttributes } from './NodeAttributes';
export interface IVariableAttributes extends INodeAttributes {
    value?: Variant;
    dataType?: ec.NodeId;
    valueRank?: ec.Int32;
    arrayDimensions?: ec.UInt32[];
    accessLevel?: ec.Byte;
    userAccessLevel?: ec.Byte;
    minimumSamplingInterval?: ec.Double;
    historizing?: boolean;
}
/**
The attributes for a variable node.
*/
export declare class VariableAttributes extends NodeAttributes {
    value: Variant;
    dataType: ec.NodeId;
    valueRank: ec.Int32;
    arrayDimensions: ec.UInt32[];
    accessLevel: ec.Byte;
    userAccessLevel: ec.Byte;
    minimumSamplingInterval: ec.Double;
    historizing: boolean;
    constructor(options?: IVariableAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: VariableAttributes): VariableAttributes;
}
export declare function decodeVariableAttributes(inp: DataStream): VariableAttributes;
