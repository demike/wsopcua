import * as ec from '../basic-types';
/**

*/
export class ByteStringNodeId {
    constructor(options) {
        options = options || {};
        this.namespaceIndex = (options.namespaceIndex) ? options.namespaceIndex : null;
        this.identifier = (options.identifier) ? options.identifier : null;
    }
    encode(out) {
        ec.encodeUInt16(this.namespaceIndex, out);
        ec.encodeByteString(this.identifier, out);
    }
    decode(inp) {
        this.namespaceIndex = ec.decodeUInt16(inp);
        this.identifier = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new ByteStringNodeId();
        }
        target.namespaceIndex = this.namespaceIndex;
        target.identifier = this.identifier;
        return target;
    }
}
export function decodeByteStringNodeId(inp) {
    let obj = new ByteStringNodeId();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ByteStringNodeId", ByteStringNodeId, makeExpandedNodeId(-1));
//# sourceMappingURL=ByteStringNodeId.js.map