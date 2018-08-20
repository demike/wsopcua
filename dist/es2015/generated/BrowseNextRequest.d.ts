import { RequestHeader } from './RequestHeader';
import { DataStream } from '../basic-types/DataStream';
export interface IBrowseNextRequest {
    requestHeader?: RequestHeader;
    releaseContinuationPoints?: boolean;
    continuationPoints?: Uint8Array[];
}
/**
Continues one or more browse operations.
*/
export declare class BrowseNextRequest {
    requestHeader: RequestHeader;
    releaseContinuationPoints: boolean;
    continuationPoints: Uint8Array[];
    constructor(options?: IBrowseNextRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BrowseNextRequest): BrowseNextRequest;
}
export declare function decodeBrowseNextRequest(inp: DataStream): BrowseNextRequest;
