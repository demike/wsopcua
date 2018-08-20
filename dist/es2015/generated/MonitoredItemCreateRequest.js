import { ReadValueId } from './ReadValueId';
import { encodeMonitoringMode, decodeMonitoringMode } from './MonitoringMode';
import { MonitoringParameters } from './MonitoringParameters';
/**

*/
export class MonitoredItemCreateRequest {
    constructor(options) {
        options = options || {};
        this.itemToMonitor = (options.itemToMonitor) ? options.itemToMonitor : new ReadValueId();
        this.monitoringMode = (options.monitoringMode) ? options.monitoringMode : null;
        this.requestedParameters = (options.requestedParameters) ? options.requestedParameters : new MonitoringParameters();
    }
    encode(out) {
        this.itemToMonitor.encode(out);
        encodeMonitoringMode(this.monitoringMode, out);
        this.requestedParameters.encode(out);
    }
    decode(inp) {
        this.itemToMonitor.decode(inp);
        this.monitoringMode = decodeMonitoringMode(inp);
        this.requestedParameters.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new MonitoredItemCreateRequest();
        }
        if (this.itemToMonitor) {
            target.itemToMonitor = this.itemToMonitor.clone();
        }
        target.monitoringMode = this.monitoringMode;
        if (this.requestedParameters) {
            target.requestedParameters = this.requestedParameters.clone();
        }
        return target;
    }
}
export function decodeMonitoredItemCreateRequest(inp) {
    let obj = new MonitoredItemCreateRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoredItemCreateRequest", MonitoredItemCreateRequest, makeExpandedNodeId(745, 0));
//# sourceMappingURL=MonitoredItemCreateRequest.js.map