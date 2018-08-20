import { RequestHeader } from './RequestHeader';
import { DataStream } from '../basic-types/DataStream';
export interface IQueryNextRequest {
    requestHeader?: RequestHeader;
    releaseContinuationPoint?: boolean;
    continuationPoint?: Uint8Array;
}
/**

*/
export declare class QueryNextRequest {
    requestHeader: RequestHeader;
    releaseContinuationPoint: boolean;
    continuationPoint: Uint8Array;
    constructor(options?: IQueryNextRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: QueryNextRequest): QueryNextRequest;
}
export declare function decodeQueryNextRequest(inp: DataStream): QueryNextRequest;
