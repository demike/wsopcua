import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ICancelResponse {
    responseHeader?: ResponseHeader;
    cancelCount?: ec.UInt32;
}
/**
Cancels an outstanding request.
*/
export declare class CancelResponse {
    responseHeader: ResponseHeader;
    cancelCount: ec.UInt32;
    constructor(options?: ICancelResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CancelResponse): CancelResponse;
}
export declare function decodeCancelResponse(inp: DataStream): CancelResponse;
