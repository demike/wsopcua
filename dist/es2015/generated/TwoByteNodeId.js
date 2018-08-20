import * as ec from '../basic-types';
/**

*/
export class TwoByteNodeId {
    constructor(options) {
        options = options || {};
        this.identifier = (options.identifier) ? options.identifier : null;
    }
    encode(out) {
        ec.encodeByte(this.identifier, out);
    }
    decode(inp) {
        this.identifier = ec.decodeByte(inp);
    }
    clone(target) {
        if (!target) {
            target = new TwoByteNodeId();
        }
        target.identifier = this.identifier;
        return target;
    }
}
export function decodeTwoByteNodeId(inp) {
    let obj = new TwoByteNodeId();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("TwoByteNodeId", TwoByteNodeId, makeExpandedNodeId(-1));
//# sourceMappingURL=TwoByteNodeId.js.map