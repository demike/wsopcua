import * as ec from '../basic-types';
import { AggregateConfiguration } from './AggregateConfiguration';
import { MonitoringFilterResult } from './MonitoringFilterResult';
/**

*/
export class AggregateFilterResult extends MonitoringFilterResult {
    constructor(options) {
        options = options || {};
        super();
        this.revisedStartTime = (options.revisedStartTime) ? options.revisedStartTime : null;
        this.revisedProcessingInterval = (options.revisedProcessingInterval) ? options.revisedProcessingInterval : null;
        this.revisedAggregateConfiguration = (options.revisedAggregateConfiguration) ? options.revisedAggregateConfiguration : new AggregateConfiguration();
    }
    encode(out) {
        ec.encodeDateTime(this.revisedStartTime, out);
        ec.encodeDouble(this.revisedProcessingInterval, out);
        this.revisedAggregateConfiguration.encode(out);
    }
    decode(inp) {
        this.revisedStartTime = ec.decodeDateTime(inp);
        this.revisedProcessingInterval = ec.decodeDouble(inp);
        this.revisedAggregateConfiguration.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new AggregateFilterResult();
        }
        target.revisedStartTime = this.revisedStartTime;
        target.revisedProcessingInterval = this.revisedProcessingInterval;
        if (this.revisedAggregateConfiguration) {
            target.revisedAggregateConfiguration = this.revisedAggregateConfiguration.clone();
        }
        return target;
    }
}
export function decodeAggregateFilterResult(inp) {
    let obj = new AggregateFilterResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AggregateFilterResult", AggregateFilterResult, makeExpandedNodeId(739, 0));
//# sourceMappingURL=AggregateFilterResult.js.map