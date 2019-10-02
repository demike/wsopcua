/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

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
import {TypeNode} from './TypeNode';
import {ITypeNode} from './TypeNode';

export interface IVariableTypeNode extends ITypeNode {
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
  isAbstract?: boolean;
}

/**

*/

export class VariableTypeNode extends TypeNode {
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
  isAbstract: boolean;

 constructor( options?: IVariableTypeNode) {
  options = options || {};
  super(options);
  this.nodeId = (options.nodeId != null) ? options.nodeId : ec.NodeId.NullNodeId;
  this.nodeClass = (options.nodeClass != null) ? options.nodeClass : null;
  this.browseName = (options.browseName != null) ? options.browseName : new QualifiedName();
  this.displayName = (options.displayName != null) ? options.displayName : new LocalizedText();
  this.description = (options.description != null) ? options.description : new LocalizedText();
  this.writeMask = (options.writeMask != null) ? options.writeMask : 0;
  this.userWriteMask = (options.userWriteMask != null) ? options.userWriteMask : 0;
  this.rolePermissions = (options.rolePermissions != null) ? options.rolePermissions : [];
  this.userRolePermissions = (options.userRolePermissions != null) ? options.userRolePermissions : [];
  this.accessRestrictions = (options.accessRestrictions != null) ? options.accessRestrictions : 0;
  this.references = (options.references != null) ? options.references : [];
  this.value = (options.value != null) ? options.value : new Variant();
  this.dataType = (options.dataType != null) ? options.dataType : ec.NodeId.NullNodeId;
  this.valueRank = (options.valueRank != null) ? options.valueRank : 0;
  this.arrayDimensions = (options.arrayDimensions != null) ? options.arrayDimensions : [];
  this.isAbstract = (options.isAbstract != null) ? options.isAbstract : false;

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
  ec.encodeBoolean(this.isAbstract, out);

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
  this.isAbstract = ec.decodeBoolean(inp);

 }


 clone( target?: VariableTypeNode): VariableTypeNode {
  if (!target) {
   target = new VariableTypeNode();
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
  target.isAbstract = this.isAbstract;
  return target;
 }


}
export function decodeVariableTypeNode( inp: DataStream): VariableTypeNode {
  const obj = new VariableTypeNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('VariableTypeNode', VariableTypeNode, makeExpandedNodeId(272, 0));
