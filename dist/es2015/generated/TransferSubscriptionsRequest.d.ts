import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ITransferSubscriptionsRequest {
    requestHeader?: RequestHeader;
    subscriptionIds?: ec.UInt32[];
    sendInitialValues?: boolean;
}
/**

*/
export declare class TransferSubscriptionsRequest {
    requestHeader: RequestHeader;
    subscriptionIds: ec.UInt32[];
    sendInitialValues: boolean;
    constructor(options?: ITransferSubscriptionsRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: TransferSubscriptionsRequest): TransferSubscriptionsRequest;
}
export declare function decodeTransferSubscriptionsRequest(inp: DataStream): TransferSubscriptionsRequest;
