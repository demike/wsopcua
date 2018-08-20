import * as ec from '../basic-types';
/**
This abstract Structured DataType is the base DataType for all DataTypes representing a bit mask.
*/
export class OptionSet {
    constructor(options) {
        options = options || {};
        this.value = (options.value) ? options.value : null;
        this.validBits = (options.validBits) ? options.validBits : null;
    }
    encode(out) {
        ec.encodeByteString(this.value, out);
        ec.encodeByteString(this.validBits, out);
    }
    decode(inp) {
        this.value = ec.decodeByteString(inp);
        this.validBits = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new OptionSet();
        }
        target.value = this.value;
        target.validBits = this.validBits;
        return target;
    }
}
export function decodeOptionSet(inp) {
    let obj = new OptionSet();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("OptionSet", OptionSet, makeExpandedNodeId(12765, 0));
//# sourceMappingURL=OptionSet.js.map