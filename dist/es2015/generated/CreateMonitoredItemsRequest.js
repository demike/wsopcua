import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { encodeTimestampsToReturn, decodeTimestampsToReturn } from './TimestampsToReturn';
import { decodeMonitoredItemCreateRequest } from './MonitoredItemCreateRequest';
/**

*/
export class CreateMonitoredItemsRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.timestampsToReturn = (options.timestampsToReturn) ? options.timestampsToReturn : null;
        this.itemsToCreate = (options.itemsToCreate) ? options.itemsToCreate : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.subscriptionId, out);
        encodeTimestampsToReturn(this.timestampsToReturn, out);
        ec.encodeArray(this.itemsToCreate, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionId = ec.decodeUInt32(inp);
        this.timestampsToReturn = decodeTimestampsToReturn(inp);
        this.itemsToCreate = ec.decodeArray(inp, decodeMonitoredItemCreateRequest);
    }
    clone(target) {
        if (!target) {
            target = new CreateMonitoredItemsRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.subscriptionId = this.subscriptionId;
        target.timestampsToReturn = this.timestampsToReturn;
        if (this.itemsToCreate) {
            target.itemsToCreate = ec.cloneComplexArray(this.itemsToCreate);
        }
        return target;
    }
}
export function decodeCreateMonitoredItemsRequest(inp) {
    let obj = new CreateMonitoredItemsRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CreateMonitoredItemsRequest", CreateMonitoredItemsRequest, makeExpandedNodeId(751, 0));
//# sourceMappingURL=CreateMonitoredItemsRequest.js.map