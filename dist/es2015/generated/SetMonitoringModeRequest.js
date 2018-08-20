import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { encodeMonitoringMode, decodeMonitoringMode } from './MonitoringMode';
/**

*/
export class SetMonitoringModeRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.monitoringMode = (options.monitoringMode) ? options.monitoringMode : null;
        this.monitoredItemIds = (options.monitoredItemIds) ? options.monitoredItemIds : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.subscriptionId, out);
        encodeMonitoringMode(this.monitoringMode, out);
        ec.encodeArray(this.monitoredItemIds, out, ec.encodeUInt32);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.subscriptionId = ec.decodeUInt32(inp);
        this.monitoringMode = decodeMonitoringMode(inp);
        this.monitoredItemIds = ec.decodeArray(inp, ec.decodeUInt32);
    }
    clone(target) {
        if (!target) {
            target = new SetMonitoringModeRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.subscriptionId = this.subscriptionId;
        target.monitoringMode = this.monitoringMode;
        target.monitoredItemIds = ec.cloneArray(this.monitoredItemIds);
        return target;
    }
}
export function decodeSetMonitoringModeRequest(inp) {
    let obj = new SetMonitoringModeRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SetMonitoringModeRequest", SetMonitoringModeRequest, makeExpandedNodeId(769, 0));
//# sourceMappingURL=SetMonitoringModeRequest.js.map