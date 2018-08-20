import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
import { NodeAttributes } from './NodeAttributes';
import { INodeAttributes } from './NodeAttributes';
export interface IObjectAttributes extends INodeAttributes {
    eventNotifier?: ec.Byte;
}
/**
The attributes for an object node.
*/
export declare class ObjectAttributes extends NodeAttributes {
    eventNotifier: ec.Byte;
    constructor(options?: IObjectAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ObjectAttributes): ObjectAttributes;
}
export declare function decodeObjectAttributes(inp: DataStream): ObjectAttributes;
