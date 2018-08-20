import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteSubscriptionsRequest {
    requestHeader?: RequestHeader;
    subscriptionIds?: ec.UInt32[];
}
/**

*/
export declare class DeleteSubscriptionsRequest {
    requestHeader: RequestHeader;
    subscriptionIds: ec.UInt32[];
    constructor(options?: IDeleteSubscriptionsRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteSubscriptionsRequest): DeleteSubscriptionsRequest;
}
export declare function decodeDeleteSubscriptionsRequest(inp: DataStream): DeleteSubscriptionsRequest;
