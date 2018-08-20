import { DataStream } from '../basic-types/DataStream';
/**
The directions of the references to return.*/
export declare enum BrowseDirection {
    Forward = 0,
    Inverse = 1,
    Both = 2,
    Invalid = 3
}
export declare function encodeBrowseDirection(data: BrowseDirection, out: DataStream): void;
export declare function decodeBrowseDirection(inp: DataStream): number;
