import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IModifySubscriptionRequest {
    requestHeader?: RequestHeader;
    subscriptionId?: ec.UInt32;
    requestedPublishingInterval?: ec.Double;
    requestedLifetimeCount?: ec.UInt32;
    requestedMaxKeepAliveCount?: ec.UInt32;
    maxNotificationsPerPublish?: ec.UInt32;
    priority?: ec.Byte;
}
/**

*/
export declare class ModifySubscriptionRequest {
    requestHeader: RequestHeader;
    subscriptionId: ec.UInt32;
    requestedPublishingInterval: ec.Double;
    requestedLifetimeCount: ec.UInt32;
    requestedMaxKeepAliveCount: ec.UInt32;
    maxNotificationsPerPublish: ec.UInt32;
    priority: ec.Byte;
    constructor(options?: IModifySubscriptionRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ModifySubscriptionRequest): ModifySubscriptionRequest;
}
export declare function decodeModifySubscriptionRequest(inp: DataStream): ModifySubscriptionRequest;
