import * as ec from '../basic-types';
/**
The target of the translated path.
*/
export class BrowsePathTarget {
    constructor(options) {
        options = options || {};
        this.targetId = (options.targetId) ? options.targetId : null;
        this.remainingPathIndex = (options.remainingPathIndex) ? options.remainingPathIndex : null;
    }
    encode(out) {
        ec.encodeExpandedNodeId(this.targetId, out);
        ec.encodeUInt32(this.remainingPathIndex, out);
    }
    decode(inp) {
        this.targetId = ec.decodeExpandedNodeId(inp);
        this.remainingPathIndex = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new BrowsePathTarget();
        }
        target.targetId = this.targetId;
        target.remainingPathIndex = this.remainingPathIndex;
        return target;
    }
}
export function decodeBrowsePathTarget(inp) {
    let obj = new BrowsePathTarget();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowsePathTarget", BrowsePathTarget, makeExpandedNodeId(548, 0));
//# sourceMappingURL=BrowsePathTarget.js.map