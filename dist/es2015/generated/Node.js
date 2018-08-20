import * as ec from '../basic-types';
import { encodeNodeClass, decodeNodeClass } from './NodeClass';
import { QualifiedName } from './QualifiedName';
import { LocalizedText } from './LocalizedText';
import { decodeRolePermissionType } from './RolePermissionType';
import { decodeReferenceNode } from './ReferenceNode';
/**
Specifies the attributes which belong to all nodes.
*/
export class Node {
    constructor(options) {
        options = options || {};
        this.nodeId = (options.nodeId) ? options.nodeId : null;
        this.nodeClass = (options.nodeClass) ? options.nodeClass : null;
        this.browseName = (options.browseName) ? options.browseName : new QualifiedName();
        this.displayName = (options.displayName) ? options.displayName : new LocalizedText();
        this.description = (options.description) ? options.description : new LocalizedText();
        this.writeMask = (options.writeMask) ? options.writeMask : null;
        this.userWriteMask = (options.userWriteMask) ? options.userWriteMask : null;
        this.rolePermissions = (options.rolePermissions) ? options.rolePermissions : [];
        this.userRolePermissions = (options.userRolePermissions) ? options.userRolePermissions : [];
        this.accessRestrictions = (options.accessRestrictions) ? options.accessRestrictions : null;
        this.references = (options.references) ? options.references : [];
    }
    encode(out) {
        ec.encodeNodeId(this.nodeId, out);
        encodeNodeClass(this.nodeClass, out);
        this.browseName.encode(out);
        this.displayName.encode(out);
        this.description.encode(out);
        ec.encodeUInt32(this.writeMask, out);
        ec.encodeUInt32(this.userWriteMask, out);
        ec.encodeArray(this.rolePermissions, out);
        ec.encodeArray(this.userRolePermissions, out);
        ec.encodeUInt16(this.accessRestrictions, out);
        ec.encodeArray(this.references, out);
    }
    decode(inp) {
        this.nodeId = ec.decodeNodeId(inp);
        this.nodeClass = decodeNodeClass(inp);
        this.browseName.decode(inp);
        this.displayName.decode(inp);
        this.description.decode(inp);
        this.writeMask = ec.decodeUInt32(inp);
        this.userWriteMask = ec.decodeUInt32(inp);
        this.rolePermissions = ec.decodeArray(inp, decodeRolePermissionType);
        this.userRolePermissions = ec.decodeArray(inp, decodeRolePermissionType);
        this.accessRestrictions = ec.decodeUInt16(inp);
        this.references = ec.decodeArray(inp, decodeReferenceNode);
    }
    clone(target) {
        if (!target) {
            target = new Node();
        }
        target.nodeId = this.nodeId;
        target.nodeClass = this.nodeClass;
        if (this.browseName) {
            target.browseName = this.browseName.clone();
        }
        if (this.displayName) {
            target.displayName = this.displayName.clone();
        }
        if (this.description) {
            target.description = this.description.clone();
        }
        target.writeMask = this.writeMask;
        target.userWriteMask = this.userWriteMask;
        if (this.rolePermissions) {
            target.rolePermissions = ec.cloneComplexArray(this.rolePermissions);
        }
        if (this.userRolePermissions) {
            target.userRolePermissions = ec.cloneComplexArray(this.userRolePermissions);
        }
        target.accessRestrictions = this.accessRestrictions;
        if (this.references) {
            target.references = ec.cloneComplexArray(this.references);
        }
        return target;
    }
}
export function decodeNode(inp) {
    let obj = new Node();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("Node", Node, makeExpandedNodeId(260, 0));
//# sourceMappingURL=Node.js.map