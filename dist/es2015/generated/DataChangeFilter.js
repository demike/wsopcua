import { encodeDataChangeTrigger, decodeDataChangeTrigger } from './DataChangeTrigger';
import * as ec from '../basic-types';
import { MonitoringFilter } from './MonitoringFilter';
/**

*/
export class DataChangeFilter extends MonitoringFilter {
    constructor(options) {
        options = options || {};
        super();
        this.trigger = (options.trigger) ? options.trigger : null;
        this.deadbandType = (options.deadbandType) ? options.deadbandType : null;
        this.deadbandValue = (options.deadbandValue) ? options.deadbandValue : null;
    }
    encode(out) {
        encodeDataChangeTrigger(this.trigger, out);
        ec.encodeUInt32(this.deadbandType, out);
        ec.encodeDouble(this.deadbandValue, out);
    }
    decode(inp) {
        this.trigger = decodeDataChangeTrigger(inp);
        this.deadbandType = ec.decodeUInt32(inp);
        this.deadbandValue = ec.decodeDouble(inp);
    }
    clone(target) {
        if (!target) {
            target = new DataChangeFilter();
        }
        target.trigger = this.trigger;
        target.deadbandType = this.deadbandType;
        target.deadbandValue = this.deadbandValue;
        return target;
    }
}
export function decodeDataChangeFilter(inp) {
    let obj = new DataChangeFilter();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DataChangeFilter", DataChangeFilter, makeExpandedNodeId(724, 0));
//# sourceMappingURL=DataChangeFilter.js.map