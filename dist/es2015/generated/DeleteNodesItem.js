import * as ec from '../basic-types';
/**
A request to delete a node to the server address space.
*/
export class DeleteNodesItem {
    constructor(options) {
        options = options || {};
        this.nodeId = (options.nodeId) ? options.nodeId : null;
        this.deleteTargetReferences = (options.deleteTargetReferences) ? options.deleteTargetReferences : null;
    }
    encode(out) {
        ec.encodeNodeId(this.nodeId, out);
        ec.encodeBoolean(this.deleteTargetReferences, out);
    }
    decode(inp) {
        this.nodeId = ec.decodeNodeId(inp);
        this.deleteTargetReferences = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new DeleteNodesItem();
        }
        target.nodeId = this.nodeId;
        target.deleteTargetReferences = this.deleteTargetReferences;
        return target;
    }
}
export function decodeDeleteNodesItem(inp) {
    let obj = new DeleteNodesItem();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteNodesItem", DeleteNodesItem, makeExpandedNodeId(384, 0));
//# sourceMappingURL=DeleteNodesItem.js.map