import * as ec from '../basic-types';
import { FilterOperand } from './FilterOperand';
/**

*/
export class ElementOperand extends FilterOperand {
    constructor(options) {
        options = options || {};
        super();
        this.index = (options.index) ? options.index : null;
    }
    encode(out) {
        ec.encodeUInt32(this.index, out);
    }
    decode(inp) {
        this.index = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new ElementOperand();
        }
        target.index = this.index;
        return target;
    }
}
export function decodeElementOperand(inp) {
    let obj = new ElementOperand();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ElementOperand", ElementOperand, makeExpandedNodeId(594, 0));
//# sourceMappingURL=ElementOperand.js.map