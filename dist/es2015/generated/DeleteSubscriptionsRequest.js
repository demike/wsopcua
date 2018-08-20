import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**

*/
export class DeleteSubscriptionsRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionIds = (options.subscriptionIds) ? options.subscriptionIds : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.subscriptionIds, out, ec.encodeUInt32);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionIds = ec.decodeArray(inp, ec.decodeUInt32);
    }
    clone(target) {
        if (!target) {
            target = new DeleteSubscriptionsRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.subscriptionIds = ec.cloneArray(this.subscriptionIds);
        return target;
    }
}
export function decodeDeleteSubscriptionsRequest(inp) {
    let obj = new DeleteSubscriptionsRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteSubscriptionsRequest", DeleteSubscriptionsRequest, makeExpandedNodeId(847, 0));
//# sourceMappingURL=DeleteSubscriptionsRequest.js.map