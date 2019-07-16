

import * as ec from '../basic-types';
import {NodeClass, encodeNodeClass, decodeNodeClass} from './NodeClass';
import {QualifiedName} from './QualifiedName';
import {LocalizedText} from './LocalizedText';
import {RolePermissionType} from './RolePermissionType';
import {decodeRolePermissionType} from './RolePermissionType';
import {ReferenceNode} from './ReferenceNode';
import {decodeReferenceNode} from './ReferenceNode';
import {DataStream} from '../basic-types/DataStream';
import {InstanceNode} from './InstanceNode';
import {IInstanceNode} from './InstanceNode';

export interface IViewNode extends IInstanceNode {
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
  containsNoLoops?: boolean;
  eventNotifier?: ec.Byte;
}

/**

*/

export class ViewNode extends InstanceNode {
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
  containsNoLoops: boolean;
  eventNotifier: ec.Byte;

 constructor( options?: IViewNode) {
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
  this.containsNoLoops = (options.containsNoLoops !== undefined) ? options.containsNoLoops : null;
  this.eventNotifier = (options.eventNotifier !== undefined) ? options.eventNotifier : null;

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
  ec.encodeBoolean(this.containsNoLoops, out);
  ec.encodeByte(this.eventNotifier, out);

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
  this.containsNoLoops = ec.decodeBoolean(inp);
  this.eventNotifier = ec.decodeByte(inp);

 }


 clone( target?: ViewNode): ViewNode {
  if (!target) {
   target = new ViewNode();
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
  target.containsNoLoops = this.containsNoLoops;
  target.eventNotifier = this.eventNotifier;
  return target;
 }


}
export function decodeViewNode( inp: DataStream): ViewNode {
  const obj = new ViewNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ViewNode', ViewNode, makeExpandedNodeId(281, 0));
