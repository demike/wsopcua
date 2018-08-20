import { DataStream } from '../basic-types/DataStream';
import { NodeAttributes } from './NodeAttributes';
import { INodeAttributes } from './NodeAttributes';
export interface IObjectTypeAttributes extends INodeAttributes {
    isAbstract?: boolean;
}
/**
The attributes for an object type node.
*/
export declare class ObjectTypeAttributes extends NodeAttributes {
    isAbstract: boolean;
    constructor(options?: IObjectTypeAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ObjectTypeAttributes): ObjectTypeAttributes;
}
export declare function decodeObjectTypeAttributes(inp: DataStream): ObjectTypeAttributes;
