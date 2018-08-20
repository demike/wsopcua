import * as ec from '../basic-types';
import { BrowsePathTarget } from './BrowsePathTarget';
import { DataStream } from '../basic-types/DataStream';
export interface IBrowsePathResult {
    statusCode?: ec.StatusCode;
    targets?: BrowsePathTarget[];
}
/**
The result of a translate opearation.
*/
export declare class BrowsePathResult {
    statusCode: ec.StatusCode;
    targets: BrowsePathTarget[];
    constructor(options?: IBrowsePathResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BrowsePathResult): BrowsePathResult;
}
export declare function decodeBrowsePathResult(inp: DataStream): BrowsePathResult;
