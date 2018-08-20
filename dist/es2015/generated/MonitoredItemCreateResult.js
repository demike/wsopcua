import * as ec from '../basic-types';
/**

*/
export class MonitoredItemCreateResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.monitoredItemId = (options.monitoredItemId) ? options.monitoredItemId : null;
        this.revisedSamplingInterval = (options.revisedSamplingInterval) ? options.revisedSamplingInterval : null;
        this.revisedQueueSize = (options.revisedQueueSize) ? options.revisedQueueSize : null;
        this.filterResult = (options.filterResult) ? options.filterResult : null;
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeUInt32(this.monitoredItemId, out);
        ec.encodeDouble(this.revisedSamplingInterval, out);
        ec.encodeUInt32(this.revisedQueueSize, out);
        ec.encodeExtensionObject(this.filterResult, out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.monitoredItemId = ec.decodeUInt32(inp);
        this.revisedSamplingInterval = ec.decodeDouble(inp);
        this.revisedQueueSize = ec.decodeUInt32(inp);
        this.filterResult = ec.decodeExtensionObject(inp);
    }
    clone(target) {
        if (!target) {
            target = new MonitoredItemCreateResult();
        }
        target.statusCode = this.statusCode;
        target.monitoredItemId = this.monitoredItemId;
        target.revisedSamplingInterval = this.revisedSamplingInterval;
        target.revisedQueueSize = this.revisedQueueSize;
        target.filterResult = this.filterResult;
        return target;
    }
}
export function decodeMonitoredItemCreateResult(inp) {
    let obj = new MonitoredItemCreateResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoredItemCreateResult", MonitoredItemCreateResult, makeExpandedNodeId(748, 0));
//# sourceMappingURL=MonitoredItemCreateResult.js.map