

import * as ec from '../basic-types';
import {NodeClass, encodeNodeClass, decodeNodeClass} from './NodeClass';
import {QualifiedName} from './QualifiedName';
import {LocalizedText} from './LocalizedText';
import {RolePermissionType} from './RolePermissionType';
import {decodeRolePermissionType} from './RolePermissionType';
import {ReferenceNode} from './ReferenceNode';
import {decodeReferenceNode} from './ReferenceNode';
import {Variant} from '../variant';
import {DataStream} from '../basic-types/DataStream';
import {InstanceNode} from './InstanceNode';
import {IInstanceNode} from './InstanceNode';

export interface IVariableNode extends IInstanceNode {
  nodeId?: ec.NodeId;
  nodeClass?: NodeClass;
  browseName?: QualifiedName;
  displayName?: LocalizedText;
  description?: LocalizedText;
  writeMask?: ec.UInt32;
  userWriteMask?: ec.UInt32;
  rolePermissions?: RolePermissionType[];
  userRolePermissions?: RolePermissionType[];
  accessRestrictions?: ec.UInt16;
  references?: ReferenceNode[];
  value?: Variant;
  dataType?: ec.NodeId;
  valueRank?: ec.Int32;
  arrayDimensions?: ec.UInt32[];
  accessLevel?: ec.Byte;
  userAccessLevel?: ec.Byte;
  minimumSamplingInterval?: ec.Double;
  historizing?: boolean;
  accessLevelEx?: ec.UInt32;
}

/**

*/

export class VariableNode extends InstanceNode {
  nodeId: ec.NodeId;
  nodeClass: NodeClass;
  browseName: QualifiedName;
  displayName: LocalizedText;
  description: LocalizedText;
  writeMask: ec.UInt32;
  userWriteMask: ec.UInt32;
  rolePermissions: RolePermissionType[];
  userRolePermissions: RolePermissionType[];
  accessRestrictions: ec.UInt16;
  references: ReferenceNode[];
  value: Variant;
  dataType: ec.NodeId;
  valueRank: ec.Int32;
  arrayDimensions: ec.UInt32[];
  accessLevel: ec.Byte;
  userAccessLevel: ec.Byte;
  minimumSamplingInterval: ec.Double;
  historizing: boolean;
  accessLevelEx: ec.UInt32;

 constructor( options?: IVariableNode) {
  options = options || {};
  super(options);
  this.nodeId = (options.nodeId != null) ? options.nodeId : null;
  this.nodeClass = (options.nodeClass != null) ? options.nodeClass : null;
  this.browseName = (options.browseName != null) ? options.browseName : new QualifiedName();
  this.displayName = (options.displayName != null) ? options.displayName : new LocalizedText();
  this.description = (options.description != null) ? options.description : new LocalizedText();
  this.writeMask = (options.writeMask != null) ? options.writeMask : null;
  this.userWriteMask = (options.userWriteMask != null) ? options.userWriteMask : null;
  this.rolePermissions = (options.rolePermissions != null) ? options.rolePermissions : [];
  this.userRolePermissions = (options.userRolePermissions != null) ? options.userRolePermissions : [];
  this.accessRestrictions = (options.accessRestrictions != null) ? options.accessRestrictions : null;
  this.references = (options.references != null) ? options.references : [];
  this.value = (options.value != null) ? options.value : new Variant();
  this.dataType = (options.dataType != null) ? options.dataType : null;
  this.valueRank = (options.valueRank != null) ? options.valueRank : null;
  this.arrayDimensions = (options.arrayDimensions != null) ? options.arrayDimensions : [];
  this.accessLevel = (options.accessLevel != null) ? options.accessLevel : null;
  this.userAccessLevel = (options.userAccessLevel != null) ? options.userAccessLevel : null;
  this.minimumSamplingInterval = (options.minimumSamplingInterval != null) ? options.minimumSamplingInterval : null;
  this.historizing = (options.historizing != null) ? options.historizing : null;
  this.accessLevelEx = (options.accessLevelEx != null) ? options.accessLevelEx : null;

 }


 encode( out: DataStream) {
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


 decode( inp: DataStream) {
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


 clone( target?: VariableNode): VariableNode {
  if (!target) {
   target = new VariableNode();
  }
  super.clone(target);
  target.nodeId = this.nodeId;
  target.nodeClass = this.nodeClass;
  if (this.browseName) { target.browseName = this.browseName.clone(); }
  if (this.displayName) { target.displayName = this.displayName.clone(); }
  if (this.description) { target.description = this.description.clone(); }
  target.writeMask = this.writeMask;
  target.userWriteMask = this.userWriteMask;
  if (this.rolePermissions) { target.rolePermissions = ec.cloneComplexArray(this.rolePermissions); }
  if (this.userRolePermissions) { target.userRolePermissions = ec.cloneComplexArray(this.userRolePermissions); }
  target.accessRestrictions = this.accessRestrictions;
  if (this.references) { target.references = ec.cloneComplexArray(this.references); }
  if (this.value) { target.value = this.value.clone(); }
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
export function decodeVariableNode( inp: DataStream): VariableNode {
  const obj = new VariableNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('VariableNode', VariableNode, makeExpandedNodeId(269, 0));
