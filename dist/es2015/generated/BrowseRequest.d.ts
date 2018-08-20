import { RequestHeader } from './RequestHeader';
import { ViewDescription } from './ViewDescription';
import * as ec from '../basic-types';
import { BrowseDescription } from './BrowseDescription';
import { DataStream } from '../basic-types/DataStream';
export interface IBrowseRequest {
    requestHeader?: RequestHeader;
    view?: ViewDescription;
    requestedMaxReferencesPerNode?: ec.UInt32;
    nodesToBrowse?: BrowseDescription[];
}
/**
Browse the references for one or more nodes from the server address space.
*/
export declare class BrowseRequest {
    requestHeader: RequestHeader;
    view: ViewDescription;
    requestedMaxReferencesPerNode: ec.UInt32;
    nodesToBrowse: BrowseDescription[];
    constructor(options?: IBrowseRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BrowseRequest): BrowseRequest;
}
export declare function decodeBrowseRequest(inp: DataStream): BrowseRequest;
