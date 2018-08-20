import * as ec from '../basic-types';
/**

*/
export class NumericNodeId {
    constructor(options) {
        options = options || {};
        this.namespaceIndex = (options.namespaceIndex) ? options.namespaceIndex : null;
        this.identifier = (options.identifier) ? options.identifier : null;
    }
    encode(out) {
        ec.encodeUInt16(this.namespaceIndex, out);
        ec.encodeUInt32(this.identifier, out);
    }
    decode(inp) {
        this.namespaceIndex = ec.decodeUInt16(inp);
        this.identifier = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new NumericNodeId();
        }
        target.namespaceIndex = this.namespaceIndex;
        target.identifier = this.identifier;
        return target;
    }
}
export function decodeNumericNodeId(inp) {
    let obj = new NumericNodeId();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("NumericNodeId", NumericNodeId, makeExpandedNodeId(-1));
//# sourceMappingURL=NumericNodeId.js.map