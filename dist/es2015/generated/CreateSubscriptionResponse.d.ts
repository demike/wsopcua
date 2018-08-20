import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ICreateSubscriptionResponse {
    responseHeader?: ResponseHeader;
    subscriptionId?: ec.UInt32;
    revisedPublishingInterval?: ec.Double;
    revisedLifetimeCount?: ec.UInt32;
    revisedMaxKeepAliveCount?: ec.UInt32;
}
/**

*/
export declare class CreateSubscriptionResponse {
    responseHeader: ResponseHeader;
    subscriptionId: ec.UInt32;
    revisedPublishingInterval: ec.Double;
    revisedLifetimeCount: ec.UInt32;
    revisedMaxKeepAliveCount: ec.UInt32;
    constructor(options?: ICreateSubscriptionResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CreateSubscriptionResponse): CreateSubscriptionResponse;
}
export declare function decodeCreateSubscriptionResponse(inp: DataStream): CreateSubscriptionResponse;
