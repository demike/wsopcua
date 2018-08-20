import * as ec from '../basic-types';
import { Node } from './Node';
/**

*/
export class InstanceNode extends Node {
    constructor(options) {
        options = options || {};
        super(options);
        this.noOfRolePermissions = (options.noOfRolePermissions) ? options.noOfRolePermissions : null;
        this.noOfUserRolePermissions = (options.noOfUserRolePermissions) ? options.noOfUserRolePermissions : null;
        this.noOfReferences = (options.noOfReferences) ? options.noOfReferences : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeInt32(this.noOfRolePermissions, out);
        ec.encodeInt32(this.noOfUserRolePermissions, out);
        ec.encodeInt32(this.noOfReferences, out);
    }
    decode(inp) {
        super.decode(inp);
        this.noOfRolePermissions = ec.decodeInt32(inp);
        this.noOfUserRolePermissions = ec.decodeInt32(inp);
        this.noOfReferences = ec.decodeInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new InstanceNode();
        }
        super.clone(target);
        target.noOfRolePermissions = this.noOfRolePermissions;
        target.noOfUserRolePermissions = this.noOfUserRolePermissions;
        target.noOfReferences = this.noOfReferences;
        return target;
    }
}
export function decodeInstanceNode(inp) {
    let obj = new InstanceNode();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("InstanceNode", InstanceNode, makeExpandedNodeId(11889, 0));
//# sourceMappingURL=InstanceNode.js.map