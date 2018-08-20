import { DataStream } from '../basic-types/DataStream';
import { NodeAttributes } from './NodeAttributes';
import { INodeAttributes } from './NodeAttributes';
export interface IMethodAttributes extends INodeAttributes {
    executable?: boolean;
    userExecutable?: boolean;
}
/**
The attributes for a method node.
*/
export declare class MethodAttributes extends NodeAttributes {
    executable: boolean;
    userExecutable: boolean;
    constructor(options?: IMethodAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: MethodAttributes): MethodAttributes;
}
export declare function decodeMethodAttributes(inp: DataStream): MethodAttributes;
