import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**

*/
export class TransferSubscriptionsRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionIds = (options.subscriptionIds) ? options.subscriptionIds : [];
        this.sendInitialValues = (options.sendInitialValues) ? options.sendInitialValues : null;
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.subscriptionIds, out, ec.encodeUInt32);
        ec.encodeBoolean(this.sendInitialValues, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionIds = ec.decodeArray(inp, ec.decodeUInt32);
        this.sendInitialValues = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new TransferSubscriptionsRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.subscriptionIds = ec.cloneArray(this.subscriptionIds);
        target.sendInitialValues = this.sendInitialValues;
        return target;
    }
}
export function decodeTransferSubscriptionsRequest(inp) {
    let obj = new TransferSubscriptionsRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("TransferSubscriptionsRequest", TransferSubscriptionsRequest, makeExpandedNodeId(841, 0));
//# sourceMappingURL=TransferSubscriptionsRequest.js.map