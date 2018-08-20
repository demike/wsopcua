import { RelativePathElement } from './RelativePathElement';
import { DataStream } from '../basic-types/DataStream';
export interface IRelativePath {
    elements?: RelativePathElement[];
}
/**
A relative path constructed from reference types and browse names.
*/
export declare class RelativePath {
    elements: RelativePathElement[];
    constructor(options?: IRelativePath);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RelativePath): RelativePath;
}
export declare function decodeRelativePath(inp: DataStream): RelativePath;
