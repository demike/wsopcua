import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IModifySubscriptionResponse {
    responseHeader?: ResponseHeader;
    revisedPublishingInterval?: ec.Double;
    revisedLifetimeCount?: ec.UInt32;
    revisedMaxKeepAliveCount?: ec.UInt32;
}
/**

*/
export declare class ModifySubscriptionResponse {
    responseHeader: ResponseHeader;
    revisedPublishingInterval: ec.Double;
    revisedLifetimeCount: ec.UInt32;
    revisedMaxKeepAliveCount: ec.UInt32;
    constructor(options?: IModifySubscriptionResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ModifySubscriptionResponse): ModifySubscriptionResponse;
}
export declare function decodeModifySubscriptionResponse(inp: DataStream): ModifySubscriptionResponse;
