import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { encodeTimestampsToReturn, decodeTimestampsToReturn } from './TimestampsToReturn';
import { decodeMonitoredItemModifyRequest } from './MonitoredItemModifyRequest';
/**

*/
export class ModifyMonitoredItemsRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.timestampsToReturn = (options.timestampsToReturn) ? options.timestampsToReturn : null;
        this.itemsToModify = (options.itemsToModify) ? options.itemsToModify : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.subscriptionId, out);
        encodeTimestampsToReturn(this.timestampsToReturn, out);
        ec.encodeArray(this.itemsToModify, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionId = ec.decodeUInt32(inp);
        this.timestampsToReturn = decodeTimestampsToReturn(inp);
        this.itemsToModify = ec.decodeArray(inp, decodeMonitoredItemModifyRequest);
    }
    clone(target) {
        if (!target) {
            target = new ModifyMonitoredItemsRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.subscriptionId = this.subscriptionId;
        target.timestampsToReturn = this.timestampsToReturn;
        if (this.itemsToModify) {
            target.itemsToModify = ec.cloneComplexArray(this.itemsToModify);
        }
        return target;
    }
}
export function decodeModifyMonitoredItemsRequest(inp) {
    let obj = new ModifyMonitoredItemsRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ModifyMonitoredItemsRequest", ModifyMonitoredItemsRequest, makeExpandedNodeId(763, 0));
//# sourceMappingURL=ModifyMonitoredItemsRequest.js.map