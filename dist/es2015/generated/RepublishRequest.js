import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**

*/
export class RepublishRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.retransmitSequenceNumber = (options.retransmitSequenceNumber) ? options.retransmitSequenceNumber : null;
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.subscriptionId, out);
        ec.encodeUInt32(this.retransmitSequenceNumber, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionId = ec.decodeUInt32(inp);
        this.retransmitSequenceNumber = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new RepublishRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.subscriptionId = this.subscriptionId;
        target.retransmitSequenceNumber = this.retransmitSequenceNumber;
        return target;
    }
}
export function decodeRepublishRequest(inp) {
    let obj = new RepublishRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RepublishRequest", RepublishRequest, makeExpandedNodeId(832, 0));
//# sourceMappingURL=RepublishRequest.js.map