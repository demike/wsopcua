import * as ec from '../basic-types';
import { AggregateConfiguration } from './AggregateConfiguration';
import { HistoryReadDetails } from './HistoryReadDetails';
/**

*/
export class ReadProcessedDetails extends HistoryReadDetails {
    constructor(options) {
        options = options || {};
        super();
        this.startTime = (options.startTime) ? options.startTime : null;
        this.endTime = (options.endTime) ? options.endTime : null;
        this.processingInterval = (options.processingInterval) ? options.processingInterval : null;
        this.aggregateType = (options.aggregateType) ? options.aggregateType : [];
        this.aggregateConfiguration = (options.aggregateConfiguration) ? options.aggregateConfiguration : new AggregateConfiguration();
    }
    encode(out) {
        ec.encodeDateTime(this.startTime, out);
        ec.encodeDateTime(this.endTime, out);
        ec.encodeDouble(this.processingInterval, out);
        ec.encodeArray(this.aggregateType, out, ec.encodeNodeId);
        this.aggregateConfiguration.encode(out);
    }
    decode(inp) {
        this.startTime = ec.decodeDateTime(inp);
        this.endTime = ec.decodeDateTime(inp);
        this.processingInterval = ec.decodeDouble(inp);
        this.aggregateType = ec.decodeArray(inp, ec.decodeNodeId);
        this.aggregateConfiguration.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new ReadProcessedDetails();
        }
        target.startTime = this.startTime;
        target.endTime = this.endTime;
        target.processingInterval = this.processingInterval;
        target.aggregateType = ec.cloneArray(this.aggregateType);
        if (this.aggregateConfiguration) {
            target.aggregateConfiguration = this.aggregateConfiguration.clone();
        }
        return target;
    }
}
export function decodeReadProcessedDetails(inp) {
    let obj = new ReadProcessedDetails();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReadProcessedDetails", ReadProcessedDetails, makeExpandedNodeId(652, 0));
//# sourceMappingURL=ReadProcessedDetails.js.map