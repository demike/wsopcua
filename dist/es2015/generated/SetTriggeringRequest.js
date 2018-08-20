import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**

*/
export class SetTriggeringRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.triggeringItemId = (options.triggeringItemId) ? options.triggeringItemId : null;
        this.linksToAdd = (options.linksToAdd) ? options.linksToAdd : [];
        this.linksToRemove = (options.linksToRemove) ? options.linksToRemove : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.subscriptionId, out);
        ec.encodeUInt32(this.triggeringItemId, out);
        ec.encodeArray(this.linksToAdd, out, ec.encodeUInt32);
        ec.encodeArray(this.linksToRemove, out, ec.encodeUInt32);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionId = ec.decodeUInt32(inp);
        this.triggeringItemId = ec.decodeUInt32(inp);
        this.linksToAdd = ec.decodeArray(inp, ec.decodeUInt32);
        this.linksToRemove = ec.decodeArray(inp, ec.decodeUInt32);
    }
    clone(target) {
        if (!target) {
            target = new SetTriggeringRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.subscriptionId = this.subscriptionId;
        target.triggeringItemId = this.triggeringItemId;
        target.linksToAdd = ec.cloneArray(this.linksToAdd);
        target.linksToRemove = ec.cloneArray(this.linksToRemove);
        return target;
    }
}
export function decodeSetTriggeringRequest(inp) {
    let obj = new SetTriggeringRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SetTriggeringRequest", SetTriggeringRequest, makeExpandedNodeId(775, 0));
//# sourceMappingURL=SetTriggeringRequest.js.map