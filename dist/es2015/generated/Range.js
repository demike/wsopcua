import * as ec from '../basic-types';
/**

*/
export class Range {
    constructor(options) {
        options = options || {};
        this.low = (options.low) ? options.low : null;
        this.high = (options.high) ? options.high : null;
    }
    encode(out) {
        ec.encodeDouble(this.low, out);
        ec.encodeDouble(this.high, out);
    }
    decode(inp) {
        this.low = ec.decodeDouble(inp);
        this.high = ec.decodeDouble(inp);
    }
    clone(target) {
        if (!target) {
            target = new Range();
        }
        target.low = this.low;
        target.high = this.high;
        return target;
    }
}
export function decodeRange(inp) {
    let obj = new Range();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("Range", Range, makeExpandedNodeId(886, 0));
//# sourceMappingURL=Range.js.map