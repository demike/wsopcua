import { RequestHeader } from './RequestHeader';
import { decodeSubscriptionAcknowledgement } from './SubscriptionAcknowledgement';
import * as ec from '../basic-types';
/**

*/
export class PublishRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionAcknowledgements = (options.subscriptionAcknowledgements) ? options.subscriptionAcknowledgements : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.subscriptionAcknowledgements, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionAcknowledgements = ec.decodeArray(inp, decodeSubscriptionAcknowledgement);
    }
    clone(target) {
        if (!target) {
            target = new PublishRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.subscriptionAcknowledgements) {
            target.subscriptionAcknowledgements = ec.cloneComplexArray(this.subscriptionAcknowledgements);
        }
        return target;
    }
}
export function decodePublishRequest(inp) {
    let obj = new PublishRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("PublishRequest", PublishRequest, makeExpandedNodeId(826, 0));
//# sourceMappingURL=PublishRequest.js.map