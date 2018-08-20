import { DataStream } from '../basic-types/DataStream';
import { NodeAttributes } from './NodeAttributes';
import { INodeAttributes } from './NodeAttributes';
export interface IDataTypeAttributes extends INodeAttributes {
    isAbstract?: boolean;
}
/**
The attributes for a data type node.
*/
export declare class DataTypeAttributes extends NodeAttributes {
    isAbstract: boolean;
    constructor(options?: IDataTypeAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DataTypeAttributes): DataTypeAttributes;
}
export declare function decodeDataTypeAttributes(inp: DataStream): DataTypeAttributes;
