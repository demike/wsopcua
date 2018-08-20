import * as ec from '../basic-types';
import { RelativePath } from './RelativePath';
import { DataStream } from '../basic-types/DataStream';
export interface IBrowsePath {
    startingNode?: ec.NodeId;
    relativePath?: RelativePath;
}
/**
A request to translate a path into a node id.
*/
export declare class BrowsePath {
    startingNode: ec.NodeId;
    relativePath: RelativePath;
    constructor(options?: IBrowsePath);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BrowsePath): BrowsePath;
}
export declare function decodeBrowsePath(inp: DataStream): BrowsePath;
