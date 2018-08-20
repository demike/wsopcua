import { DataStream } from '../basic-types/DataStream';
/**
A mask specifying the class of the node.*/
export declare enum NodeClass {
    Unspecified = 0,
    Object = 1,
    Variable = 2,
    Method = 4,
    ObjectType = 8,
    VariableType = 16,
    ReferenceType = 32,
    DataType = 64,
    View = 128
}
export declare function encodeNodeClass(data: NodeClass, out: DataStream): void;
export declare function decodeNodeClass(inp: DataStream): number;
