import * as ec from '../basic-types';
import { ReferenceDescription } from './ReferenceDescription';
import { DataStream } from '../basic-types/DataStream';
export interface IBrowseResult {
    statusCode?: ec.StatusCode;
    continuationPoint?: Uint8Array;
    references?: ReferenceDescription[];
}
/**
The result of a browse operation.
*/
export declare class BrowseResult {
    statusCode: ec.StatusCode;
    continuationPoint: Uint8Array;
    references: ReferenceDescription[];
    constructor(options?: IBrowseResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BrowseResult): BrowseResult;
}
export declare function decodeBrowseResult(inp: DataStream): BrowseResult;
