import * as ec from '../basic-types';
import { MonitoringParameters } from './MonitoringParameters';
/**

*/
export class MonitoredItemModifyRequest {
    constructor(options) {
        options = options || {};
        this.monitoredItemId = (options.monitoredItemId) ? options.monitoredItemId : null;
        this.requestedParameters = (options.requestedParameters) ? options.requestedParameters : new MonitoringParameters();
    }
    encode(out) {
        ec.encodeUInt32(this.monitoredItemId, out);
        this.requestedParameters.encode(out);
    }
    decode(inp) {
        this.monitoredItemId = ec.decodeUInt32(inp);
        this.requestedParameters.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new MonitoredItemModifyRequest();
        }
        target.monitoredItemId = this.monitoredItemId;
        if (this.requestedParameters) {
            target.requestedParameters = this.requestedParameters.clone();
        }
        return target;
    }
}
export function decodeMonitoredItemModifyRequest(inp) {
    let obj = new MonitoredItemModifyRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoredItemModifyRequest", MonitoredItemModifyRequest, makeExpandedNodeId(757, 0));
//# sourceMappingURL=MonitoredItemModifyRequest.js.map