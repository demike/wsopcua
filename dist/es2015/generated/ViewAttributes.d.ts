import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
import { NodeAttributes } from './NodeAttributes';
import { INodeAttributes } from './NodeAttributes';
export interface IViewAttributes extends INodeAttributes {
    containsNoLoops?: boolean;
    eventNotifier?: ec.Byte;
}
/**
The attributes for a view node.
*/
export declare class ViewAttributes extends NodeAttributes {
    containsNoLoops: boolean;
    eventNotifier: ec.Byte;
    constructor(options?: IViewAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ViewAttributes): ViewAttributes;
}
export declare function decodeViewAttributes(inp: DataStream): ViewAttributes;
