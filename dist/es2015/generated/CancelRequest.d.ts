import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ICancelRequest {
    requestHeader?: RequestHeader;
    requestHandle?: ec.UInt32;
}
/**
Cancels an outstanding request.
*/
export declare class CancelRequest {
    requestHeader: RequestHeader;
    requestHandle: ec.UInt32;
    constructor(options?: ICancelRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CancelRequest): CancelRequest;
}
export declare function decodeCancelRequest(inp: DataStream): CancelRequest;
