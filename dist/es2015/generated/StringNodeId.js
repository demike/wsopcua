import * as ec from '../basic-types';
/**

*/
export class StringNodeId {
    constructor(options) {
        options = options || {};
        this.namespaceIndex = (options.namespaceIndex) ? options.namespaceIndex : null;
        this.identifier = (options.identifier) ? options.identifier : null;
    }
    encode(out) {
        ec.encodeUInt16(this.namespaceIndex, out);
        ec.encodeString(this.identifier, out);
    }
    decode(inp) {
        this.namespaceIndex = ec.decodeUInt16(inp);
        this.identifier = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new StringNodeId();
        }
        target.namespaceIndex = this.namespaceIndex;
        target.identifier = this.identifier;
        return target;
    }
}
export function decodeStringNodeId(inp) {
    let obj = new StringNodeId();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("StringNodeId", StringNodeId, makeExpandedNodeId(-1));
//# sourceMappingURL=StringNodeId.js.map