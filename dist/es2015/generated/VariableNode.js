import * as ec from '../basic-types';
import { encodeNodeClass, decodeNodeClass } from './NodeClass';
import { QualifiedName } from './QualifiedName';
import { LocalizedText } from './LocalizedText';
import { decodeRolePermissionType } from './RolePermissionType';
import { decodeReferenceNode } from './ReferenceNode';
import { Variant } from '../variant';
import { InstanceNode } from './InstanceNode';
/**
Specifies the attributes which belong to variable nodes.
*/
export class VariableNode extends InstanceNode {
    constructor(options) {
        options = options || {};
        super(options);
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
        this.value = (options.value) ? options.value : new Variant();
        this.dataType = (options.dataType) ? options.dataType : null;
        this.valueRank = (options.valueRank) ? options.valueRank : null;
        this.arrayDimensions = (options.arrayDimensions) ? options.arrayDimensions : [];
        this.accessLevel = (options.accessLevel) ? options.accessLevel : null;
        this.userAccessLevel = (options.userAccessLevel) ? options.userAccessLevel : null;
        this.minimumSamplingInterval = (options.minimumSamplingInterval) ? options.minimumSamplingInterval : null;
        this.historizing = (options.historizing) ? options.historizing : null;
        this.accessLevelEx = (options.accessLevelEx) ? options.accessLevelEx : null;
    }
    encode(out) {
        super.encode(out);
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
        this.value.encode(out);
        ec.encodeNodeId(this.dataType, out);
        ec.encodeInt32(this.valueRank, out);
        ec.encodeArray(this.arrayDimensions, out, ec.encodeUInt32);
        ec.encodeByte(this.accessLevel, out);
        ec.encodeByte(this.userAccessLevel, out);
        ec.encodeDouble(this.minimumSamplingInterval, out);
        ec.encodeBoolean(this.historizing, out);
        ec.encodeUInt32(this.accessLevelEx, out);
    }
    decode(inp) {
        super.decode(inp);
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
        this.value.decode(inp);
        this.dataType = ec.decodeNodeId(inp);
        this.valueRank = ec.decodeInt32(inp);
        this.arrayDimensions = ec.decodeArray(inp, ec.decodeUInt32);
        this.accessLevel = ec.decodeByte(inp);
        this.userAccessLevel = ec.decodeByte(inp);
        this.minimumSamplingInterval = ec.decodeDouble(inp);
        this.historizing = ec.decodeBoolean(inp);
        this.accessLevelEx = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new VariableNode();
        }
        super.clone(target);
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
        if (this.value) {
            target.value = this.value.clone();
        }
        target.dataType = this.dataType;
        target.valueRank = this.valueRank;
        target.arrayDimensions = ec.cloneArray(this.arrayDimensions);
        target.accessLevel = this.accessLevel;
        target.userAccessLevel = this.userAccessLevel;
        target.minimumSamplingInterval = this.minimumSamplingInterval;
        target.historizing = this.historizing;
        target.accessLevelEx = this.accessLevelEx;
        return target;
    }
}
export function decodeVariableNode(inp) {
    let obj = new VariableNode();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("VariableNode", VariableNode, makeExpandedNodeId(269, 0));
//# sourceMappingURL=VariableNode.js.map