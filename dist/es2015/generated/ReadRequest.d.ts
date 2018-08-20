import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { TimestampsToReturn } from './TimestampsToReturn';
import { ReadValueId } from './ReadValueId';
import { DataStream } from '../basic-types/DataStream';
export interface IReadRequest {
    requestHeader?: RequestHeader;
    maxAge?: ec.Double;
    timestampsToReturn?: TimestampsToReturn;
    nodesToRead?: ReadValueId[];
}
/**

*/
export declare class ReadRequest {
    requestHeader: RequestHeader;
    maxAge: ec.Double;
    timestampsToReturn: TimestampsToReturn;
    nodesToRead: ReadValueId[];
    constructor(options?: IReadRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReadRequest): ReadRequest;
}
export declare function decodeReadRequest(inp: DataStream): ReadRequest;
