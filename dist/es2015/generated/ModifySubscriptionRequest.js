import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**

*/
export class ModifySubscriptionRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.requestedPublishingInterval = (options.requestedPublishingInterval) ? options.requestedPublishingInterval : null;
        this.requestedLifetimeCount = (options.requestedLifetimeCount) ? options.requestedLifetimeCount : null;
        this.requestedMaxKeepAliveCount = (options.requestedMaxKeepAliveCount) ? options.requestedMaxKeepAliveCount : null;
        this.maxNotificationsPerPublish = (options.maxNotificationsPerPublish) ? options.maxNotificationsPerPublish : null;
        this.priority = (options.priority) ? options.priority : null;
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.subscriptionId, out);
        ec.encodeDouble(this.requestedPublishingInterval, out);
        ec.encodeUInt32(this.requestedLifetimeCount, out);
        ec.encodeUInt32(this.requestedMaxKeepAliveCount, out);
        ec.encodeUInt32(this.maxNotificationsPerPublish, out);
        ec.encodeByte(this.priority, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionId = ec.decodeUInt32(inp);
        this.requestedPublishingInterval = ec.decodeDouble(inp);
        this.requestedLifetimeCount = ec.decodeUInt32(inp);
        this.requestedMaxKeepAliveCount = ec.decodeUInt32(inp);
        this.maxNotificationsPerPublish = ec.decodeUInt32(inp);
        this.priority = ec.decodeByte(inp);
    }
    clone(target) {
        if (!target) {
            target = new ModifySubscriptionRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.subscriptionId = this.subscriptionId;
        target.requestedPublishingInterval = this.requestedPublishingInterval;
        target.requestedLifetimeCount = this.requestedLifetimeCount;
        target.requestedMaxKeepAliveCount = this.requestedMaxKeepAliveCount;
        target.maxNotificationsPerPublish = this.maxNotificationsPerPublish;
        target.priority = this.priority;
        return target;
    }
}
export function decodeModifySubscriptionRequest(inp) {
    let obj = new ModifySubscriptionRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ModifySubscriptionRequest", ModifySubscriptionRequest, makeExpandedNodeId(793, 0));
//# sourceMappingURL=ModifySubscriptionRequest.js.map