import { RequestHeader } from './RequestHeader';
import { BrowsePath } from './BrowsePath';
import { DataStream } from '../basic-types/DataStream';
export interface ITranslateBrowsePathsToNodeIdsRequest {
    requestHeader?: RequestHeader;
    browsePaths?: BrowsePath[];
}
/**
Translates one or more paths in the server address space.
*/
export declare class TranslateBrowsePathsToNodeIdsRequest {
    requestHeader: RequestHeader;
    browsePaths: BrowsePath[];
    constructor(options?: ITranslateBrowsePathsToNodeIdsRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: TranslateBrowsePathsToNodeIdsRequest): TranslateBrowsePathsToNodeIdsRequest;
}
export declare function decodeTranslateBrowsePathsToNodeIdsRequest(inp: DataStream): TranslateBrowsePathsToNodeIdsRequest;
