import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteMonitoredItemsRequest {
    requestHeader?: RequestHeader;
    subscriptionId?: ec.UInt32;
    monitoredItemIds?: ec.UInt32[];
}
/**

*/
export declare class DeleteMonitoredItemsRequest {
    requestHeader: RequestHeader;
    subscriptionId: ec.UInt32;
    monitoredItemIds: ec.UInt32[];
    constructor(options?: IDeleteMonitoredItemsRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteMonitoredItemsRequest): DeleteMonitoredItemsRequest;
}
export declare function decodeDeleteMonitoredItemsRequest(inp: DataStream): DeleteMonitoredItemsRequest;
