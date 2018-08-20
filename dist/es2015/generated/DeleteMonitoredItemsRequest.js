import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**

*/
export class DeleteMonitoredItemsRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.monitoredItemIds = (options.monitoredItemIds) ? options.monitoredItemIds : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.subscriptionId, out);
        ec.encodeArray(this.monitoredItemIds, out, ec.encodeUInt32);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionId = ec.decodeUInt32(inp);
        this.monitoredItemIds = ec.decodeArray(inp, ec.decodeUInt32);
    }
    clone(target) {
        if (!target) {
            target = new DeleteMonitoredItemsRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.subscriptionId = this.subscriptionId;
        target.monitoredItemIds = ec.cloneArray(this.monitoredItemIds);
        return target;
    }
}
export function decodeDeleteMonitoredItemsRequest(inp) {
    let obj = new DeleteMonitoredItemsRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteMonitoredItemsRequest", DeleteMonitoredItemsRequest, makeExpandedNodeId(781, 0));
//# sourceMappingURL=DeleteMonitoredItemsRequest.js.map