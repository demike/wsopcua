import { LocalizedText } from './LocalizedText';
import { DataStream } from '../basic-types/DataStream';
import { NodeAttributes } from './NodeAttributes';
import { INodeAttributes } from './NodeAttributes';
export interface IReferenceTypeAttributes extends INodeAttributes {
    isAbstract?: boolean;
    symmetric?: boolean;
    inverseName?: LocalizedText;
}
/**
The attributes for a reference type node.
*/
export declare class ReferenceTypeAttributes extends NodeAttributes {
    isAbstract: boolean;
    symmetric: boolean;
    inverseName: LocalizedText;
    constructor(options?: IReferenceTypeAttributes);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReferenceTypeAttributes): ReferenceTypeAttributes;
}
export declare function decodeReferenceTypeAttributes(inp: DataStream): ReferenceTypeAttributes;
