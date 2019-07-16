

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
  this.nodeId = (options.nodeId !== undefined) ? options.nodeId : null;
  this.nodeClass = (options.nodeClass !== undefined) ? options.nodeClass : null;
  this.browseName = (options.browseName !== undefined) ? options.browseName : new QualifiedName();
  this.displayName = (options.displayName !== undefined) ? options.displayName : new LocalizedText();
  this.description = (options.description !== undefined) ? options.description : new LocalizedText();
  this.writeMask = (options.writeMask !== undefined) ? options.writeMask : null;
  this.userWriteMask = (options.userWriteMask !== undefined) ? options.userWriteMask : null;
  this.rolePermissions = (options.rolePermissions !== undefined) ? options.rolePermissions : [];
  this.userRolePermissions = (options.userRolePermissions !== undefined) ? options.userRolePermissions : [];
  this.accessRestrictions = (options.accessRestrictions !== undefined) ? options.accessRestrictions : null;
  this.references = (options.references !== undefined) ? options.references : [];
  this.value = (options.value !== undefined) ? options.value : new Variant();
  this.dataType = (options.dataType !== undefined) ? options.dataType : null;
  this.valueRank = (options.valueRank !== undefined) ? options.valueRank : null;
  this.arrayDimensions = (options.arrayDimensions !== undefined) ? options.arrayDimensions : [];
  this.isAbstract = (options.isAbstract !== undefined) ? options.isAbstract : null;

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
