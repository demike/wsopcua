import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
/**

*/
export class CreateSubscriptionResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.revisedPublishingInterval = (options.revisedPublishingInterval) ? options.revisedPublishingInterval : null;
        this.revisedLifetimeCount = (options.revisedLifetimeCount) ? options.revisedLifetimeCount : null;
        this.revisedMaxKeepAliveCount = (options.revisedMaxKeepAliveCount) ? options.revisedMaxKeepAliveCount : null;
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeUInt32(this.subscriptionId, out);
        ec.encodeDouble(this.revisedPublishingInterval, out);
        ec.encodeUInt32(this.revisedLifetimeCount, out);
        ec.encodeUInt32(this.revisedMaxKeepAliveCount, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.subscriptionId = ec.decodeUInt32(inp);
        this.revisedPublishingInterval = ec.decodeDouble(inp);
        this.revisedLifetimeCount = ec.decodeUInt32(inp);
        this.revisedMaxKeepAliveCount = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new CreateSubscriptionResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        target.subscriptionId = this.subscriptionId;
        target.revisedPublishingInterval = this.revisedPublishingInterval;
        target.revisedLifetimeCount = this.revisedLifetimeCount;
        target.revisedMaxKeepAliveCount = this.revisedMaxKeepAliveCount;
        return target;
    }
}
export function decodeCreateSubscriptionResponse(inp) {
    let obj = new CreateSubscriptionResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CreateSubscriptionResponse", CreateSubscriptionResponse, makeExpandedNodeId(790, 0));
//# sourceMappingURL=CreateSubscriptionResponse.js.map