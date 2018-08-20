import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { TimestampsToReturn } from './TimestampsToReturn';
import { MonitoredItemCreateRequest } from './MonitoredItemCreateRequest';
import { DataStream } from '../basic-types/DataStream';
export interface ICreateMonitoredItemsRequest {
    requestHeader?: RequestHeader;
    subscriptionId?: ec.UInt32;
    timestampsToReturn?: TimestampsToReturn;
    itemsToCreate?: MonitoredItemCreateRequest[];
}
/**

*/
export declare class CreateMonitoredItemsRequest {
    requestHeader: RequestHeader;
    subscriptionId: ec.UInt32;
    timestampsToReturn: TimestampsToReturn;
    itemsToCreate: MonitoredItemCreateRequest[];
    constructor(options?: ICreateMonitoredItemsRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CreateMonitoredItemsRequest): CreateMonitoredItemsRequest;
}
export declare function decodeCreateMonitoredItemsRequest(inp: DataStream): CreateMonitoredItemsRequest;
