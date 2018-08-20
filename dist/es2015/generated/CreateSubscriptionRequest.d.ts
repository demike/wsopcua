import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ICreateSubscriptionRequest {
    requestHeader?: RequestHeader;
    requestedPublishingInterval?: ec.Double;
    requestedLifetimeCount?: ec.UInt32;
    requestedMaxKeepAliveCount?: ec.UInt32;
    maxNotificationsPerPublish?: ec.UInt32;
    publishingEnabled?: boolean;
    priority?: ec.Byte;
}
/**

*/
export declare class CreateSubscriptionRequest {
    requestHeader: RequestHeader;
    requestedPublishingInterval: ec.Double;
    requestedLifetimeCount: ec.UInt32;
    requestedMaxKeepAliveCount: ec.UInt32;
    maxNotificationsPerPublish: ec.UInt32;
    publishingEnabled: boolean;
    priority: ec.Byte;
    constructor(options?: ICreateSubscriptionRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CreateSubscriptionRequest): CreateSubscriptionRequest;
}
export declare function decodeCreateSubscriptionRequest(inp: DataStream): CreateSubscriptionRequest;
