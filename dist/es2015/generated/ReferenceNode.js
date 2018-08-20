import * as ec from '../basic-types';
/**
Specifies a reference which belongs to a node.
*/
export class ReferenceNode {
    constructor(options) {
        options = options || {};
        this.referenceTypeId = (options.referenceTypeId) ? options.referenceTypeId : null;
        this.isInverse = (options.isInverse) ? options.isInverse : null;
        this.targetId = (options.targetId) ? options.targetId : null;
    }
    encode(out) {
        ec.encodeNodeId(this.referenceTypeId, out);
        ec.encodeBoolean(this.isInverse, out);
        ec.encodeExpandedNodeId(this.targetId, out);
    }
    decode(inp) {
        this.referenceTypeId = ec.decodeNodeId(inp);
        this.isInverse = ec.decodeBoolean(inp);
        this.targetId = ec.decodeExpandedNodeId(inp);
    }
    clone(target) {
        if (!target) {
            target = new ReferenceNode();
        }
        target.referenceTypeId = this.referenceTypeId;
        target.isInverse = this.isInverse;
        target.targetId = this.targetId;
        return target;
    }
}
export function decodeReferenceNode(inp) {
    let obj = new ReferenceNode();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReferenceNode", ReferenceNode, makeExpandedNodeId(287, 0));
//# sourceMappingURL=ReferenceNode.js.map