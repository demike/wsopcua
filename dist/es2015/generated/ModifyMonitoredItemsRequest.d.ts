import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { TimestampsToReturn } from './TimestampsToReturn';
import { MonitoredItemModifyRequest } from './MonitoredItemModifyRequest';
import { DataStream } from '../basic-types/DataStream';
export interface IModifyMonitoredItemsRequest {
    requestHeader?: RequestHeader;
    subscriptionId?: ec.UInt32;
    timestampsToReturn?: TimestampsToReturn;
    itemsToModify?: MonitoredItemModifyRequest[];
}
/**

*/
export declare class ModifyMonitoredItemsRequest {
    requestHeader: RequestHeader;
    subscriptionId: ec.UInt32;
    timestampsToReturn: TimestampsToReturn;
    itemsToModify: MonitoredItemModifyRequest[];
    constructor(options?: IModifyMonitoredItemsRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ModifyMonitoredItemsRequest): ModifyMonitoredItemsRequest;
}
export declare function decodeModifyMonitoredItemsRequest(inp: DataStream): ModifyMonitoredItemsRequest;
