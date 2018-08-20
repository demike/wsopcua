import * as ec from '../basic-types';
/**

*/
export class DecimalDataType {
    constructor(options) {
        options = options || {};
        this.scale = (options.scale) ? options.scale : null;
        this.value = (options.value) ? options.value : null;
    }
    encode(out) {
        ec.encodeInt16(this.scale, out);
        ec.encodeByteString(this.value, out);
    }
    decode(inp) {
        this.scale = ec.decodeInt16(inp);
        this.value = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new DecimalDataType();
        }
        target.scale = this.scale;
        target.value = this.value;
        return target;
    }
}
export function decodeDecimalDataType(inp) {
    let obj = new DecimalDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DecimalDataType", DecimalDataType, makeExpandedNodeId(17863, 0));
//# sourceMappingURL=DecimalDataType.js.map