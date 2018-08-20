import { DataStream } from '../basic-types/DataStream';
/**
The possible encodings for a NodeId value.*/
export declare enum NodeIdType {
    TwoByte = 0,
    FourByte = 1,
    Numeric = 2,
    String = 3,
    Guid = 4,
    ByteString = 5
}
export declare function encodeNodeIdType(data: NodeIdType, out: DataStream): void;
export declare function decodeNodeIdType(inp: DataStream): number;
