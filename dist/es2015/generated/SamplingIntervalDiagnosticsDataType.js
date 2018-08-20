import * as ec from '../basic-types';
/**

*/
export class SamplingIntervalDiagnosticsDataType {
    constructor(options) {
        options = options || {};
        this.samplingInterval = (options.samplingInterval) ? options.samplingInterval : null;
        this.monitoredItemCount = (options.monitoredItemCount) ? options.monitoredItemCount : null;
        this.maxMonitoredItemCount = (options.maxMonitoredItemCount) ? options.maxMonitoredItemCount : null;
        this.disabledMonitoredItemCount = (options.disabledMonitoredItemCount) ? options.disabledMonitoredItemCount : null;
    }
    encode(out) {
        ec.encodeDouble(this.samplingInterval, out);
        ec.encodeUInt32(this.monitoredItemCount, out);
        ec.encodeUInt32(this.maxMonitoredItemCount, out);
        ec.encodeUInt32(this.disabledMonitoredItemCount, out);
    }
    decode(inp) {
        this.samplingInterval = ec.decodeDouble(inp);
        this.monitoredItemCount = ec.decodeUInt32(inp);
        this.maxMonitoredItemCount = ec.decodeUInt32(inp);
        this.disabledMonitoredItemCount = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new SamplingIntervalDiagnosticsDataType();
        }
        target.samplingInterval = this.samplingInterval;
        target.monitoredItemCount = this.monitoredItemCount;
        target.maxMonitoredItemCount = this.maxMonitoredItemCount;
        target.disabledMonitoredItemCount = this.disabledMonitoredItemCount;
        return target;
    }
}
export function decodeSamplingIntervalDiagnosticsDataType(inp) {
    let obj = new SamplingIntervalDiagnosticsDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SamplingIntervalDiagnosticsDataType", SamplingIntervalDiagnosticsDataType, makeExpandedNodeId(858, 0));
//# sourceMappingURL=SamplingIntervalDiagnosticsDataType.js.map