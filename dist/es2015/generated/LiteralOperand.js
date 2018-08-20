import { Variant } from '../variant';
import { FilterOperand } from './FilterOperand';
/**

*/
export class LiteralOperand extends FilterOperand {
    constructor(options) {
        options = options || {};
        super();
        this.value = (options.value) ? options.value : new Variant();
    }
    encode(out) {
        this.value.encode(out);
    }
    decode(inp) {
        this.value.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new LiteralOperand();
        }
        if (this.value) {
            target.value = this.value.clone();
        }
        return target;
    }
}
export function decodeLiteralOperand(inp) {
    let obj = new LiteralOperand();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("LiteralOperand", LiteralOperand, makeExpandedNodeId(597, 0));
//# sourceMappingURL=LiteralOperand.js.map