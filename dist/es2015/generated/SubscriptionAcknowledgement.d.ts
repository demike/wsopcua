import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ISubscriptionAcknowledgement {
    subscriptionId?: ec.UInt32;
    sequenceNumber?: ec.UInt32;
}
/**

*/
export declare class SubscriptionAcknowledgement {
    subscriptionId: ec.UInt32;
    sequenceNumber: ec.UInt32;
    constructor(options?: ISubscriptionAcknowledgement);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SubscriptionAcknowledgement): SubscriptionAcknowledgement;
}
export declare function decodeSubscriptionAcknowledgement(inp: DataStream): SubscriptionAcknowledgement;
