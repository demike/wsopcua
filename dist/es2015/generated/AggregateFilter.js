import * as ec from '../basic-types';
import { AggregateConfiguration } from './AggregateConfiguration';
import { MonitoringFilter } from './MonitoringFilter';
/**

*/
export class AggregateFilter extends MonitoringFilter {
    constructor(options) {
        options = options || {};
        super();
        this.startTime = (options.startTime) ? options.startTime : null;
        this.aggregateType = (options.aggregateType) ? options.aggregateType : null;
        this.processingInterval = (options.processingInterval) ? options.processingInterval : null;
        this.aggregateConfiguration = (options.aggregateConfiguration) ? options.aggregateConfiguration : new AggregateConfiguration();
    }
    encode(out) {
        ec.encodeDateTime(this.startTime, out);
        ec.encodeNodeId(this.aggregateType, out);
        ec.encodeDouble(this.processingInterval, out);
        this.aggregateConfiguration.encode(out);
    }
    decode(inp) {
        this.startTime = ec.decodeDateTime(inp);
        this.aggregateType = ec.decodeNodeId(inp);
        this.processingInterval = ec.decodeDouble(inp);
        this.aggregateConfiguration.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new AggregateFilter();
        }
        target.startTime = this.startTime;
        target.aggregateType = this.aggregateType;
        target.processingInterval = this.processingInterval;
        if (this.aggregateConfiguration) {
            target.aggregateConfiguration = this.aggregateConfiguration.clone();
        }
        return target;
    }
}
export function decodeAggregateFilter(inp) {
    let obj = new AggregateFilter();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AggregateFilter", AggregateFilter, makeExpandedNodeId(730, 0));
//# sourceMappingURL=AggregateFilter.js.map