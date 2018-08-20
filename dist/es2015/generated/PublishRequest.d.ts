import { RequestHeader } from './RequestHeader';
import { SubscriptionAcknowledgement } from './SubscriptionAcknowledgement';
import { DataStream } from '../basic-types/DataStream';
export interface IPublishRequest {
    requestHeader?: RequestHeader;
    subscriptionAcknowledgements?: SubscriptionAcknowledgement[];
}
/**

*/
export declare class PublishRequest {
    requestHeader: RequestHeader;
    subscriptionAcknowledgements: SubscriptionAcknowledgement[];
    constructor(options?: IPublishRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: PublishRequest): PublishRequest;
}
export declare function decodePublishRequest(inp: DataStream): PublishRequest;
