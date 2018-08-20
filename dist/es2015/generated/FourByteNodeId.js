import * as ec from '../basic-types';
/**

*/
export class FourByteNodeId {
    constructor(options) {
        options = options || {};
        this.namespaceIndex = (options.namespaceIndex) ? options.namespaceIndex : null;
        this.identifier = (options.identifier) ? options.identifier : null;
    }
    encode(out) {
        ec.encodeByte(this.namespaceIndex, out);
        ec.encodeUInt16(this.identifier, out);
    }
    decode(inp) {
        this.namespaceIndex = ec.decodeByte(inp);
        this.identifier = ec.decodeUInt16(inp);
    }
    clone(target) {
        if (!target) {
            target = new FourByteNodeId();
        }
        target.namespaceIndex = this.namespaceIndex;
        target.identifier = this.identifier;
        return target;
    }
}
export function decodeFourByteNodeId(inp) {
    let obj = new FourByteNodeId();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("FourByteNodeId", FourByteNodeId, makeExpandedNodeId(-1));
//# sourceMappingURL=FourByteNodeId.js.map