import * as ec from '../basic-types';
/**

*/
export class RolePermissionType {
    constructor(options) {
        options = options || {};
        this.roleId = (options.roleId) ? options.roleId : null;
        this.permissions = (options.permissions) ? options.permissions : null;
    }
    encode(out) {
        ec.encodeNodeId(this.roleId, out);
        ec.encodeUInt32(this.permissions, out);
    }
    decode(inp) {
        this.roleId = ec.decodeNodeId(inp);
        this.permissions = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new RolePermissionType();
        }
        target.roleId = this.roleId;
        target.permissions = this.permissions;
        return target;
    }
}
export function decodeRolePermissionType(inp) {
    let obj = new RolePermissionType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RolePermissionType", RolePermissionType, makeExpandedNodeId(128, 0));
//# sourceMappingURL=RolePermissionType.js.map