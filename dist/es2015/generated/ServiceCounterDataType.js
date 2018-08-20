import * as ec from '../basic-types';
/**

*/
export class ServiceCounterDataType {
    constructor(options) {
        options = options || {};
        this.totalCount = (options.totalCount) ? options.totalCount : null;
        this.errorCount = (options.errorCount) ? options.errorCount : null;
    }
    encode(out) {
        ec.encodeUInt32(this.totalCount, out);
        ec.encodeUInt32(this.errorCount, out);
    }
    decode(inp) {
        this.totalCount = ec.decodeUInt32(inp);
        this.errorCount = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new ServiceCounterDataType();
        }
        target.totalCount = this.totalCount;
        target.errorCount = this.errorCount;
        return target;
    }
}
export function decodeServiceCounterDataType(inp) {
    let obj = new ServiceCounterDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ServiceCounterDataType", ServiceCounterDataType, makeExpandedNodeId(873, 0));
//# sourceMappingURL=ServiceCounterDataType.js.map