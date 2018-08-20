import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
import { DataStream } from '../basic-types/DataStream';
export interface INodeAttributes {
    specifiedAttributes?: ec.UInt32;
    displayName?: LocalizedText;
    description?: LocalizedText;
    writeMask?: ec.UInt32;
    userWriteMask?: ec.UInt32;
}
/**
The base attributes for all nodes.
*/
export declare class NodeAttributes {
    specifiedAttributes: ec.UInt32;
    displayName: LocalizedText;
    description: LocalizedText;
    writeMask: ec.UInt32;
    userWriteMask: ec.UInt32;
    constructor(options?: INodeAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: NodeAttributes): NodeAttributes;
}
export declare function decodeNodeAttributes(inp: DataStream): NodeAttributes;
