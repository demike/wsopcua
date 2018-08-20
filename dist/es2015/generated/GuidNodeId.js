import * as ec from '../basic-types';
/**

*/
export class GuidNodeId {
    constructor(options) {
        options = options || {};
        this.namespaceIndex = (options.namespaceIndex) ? options.namespaceIndex : null;
        this.identifier = (options.identifier) ? options.identifier : null;
    }
    encode(out) {
        ec.encodeUInt16(this.namespaceIndex, out);
        ec.encodeGuid(this.identifier, out);
    }
    decode(inp) {
        this.namespaceIndex = ec.decodeUInt16(inp);
        this.identifier = ec.decodeGuid(inp);
    }
    clone(target) {
        if (!target) {
            target = new GuidNodeId();
        }
        target.namespaceIndex = this.namespaceIndex;
        target.identifier = this.identifier;
        return target;
    }
}
export function decodeGuidNodeId(inp) {
    let obj = new GuidNodeId();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("GuidNodeId", GuidNodeId, makeExpandedNodeId(-1));
//# sourceMappingURL=GuidNodeId.js.map