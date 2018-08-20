import * as ec from '../basic-types';
/**

*/
export class SubscriptionAcknowledgement {
    constructor(options) {
        options = options || {};
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.sequenceNumber = (options.sequenceNumber) ? options.sequenceNumber : null;
    }
    encode(out) {
        ec.encodeUInt32(this.subscriptionId, out);
        ec.encodeUInt32(this.sequenceNumber, out);
    }
    decode(inp) {
        this.subscriptionId = ec.decodeUInt32(inp);
        this.sequenceNumber = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new SubscriptionAcknowledgement();
        }
        target.subscriptionId = this.subscriptionId;
        target.sequenceNumber = this.sequenceNumber;
        return target;
    }
}
export function decodeSubscriptionAcknowledgement(inp) {
    let obj = new SubscriptionAcknowledgement();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SubscriptionAcknowledgement", SubscriptionAcknowledgement, makeExpandedNodeId(823, 0));
//# sourceMappingURL=SubscriptionAcknowledgement.js.map