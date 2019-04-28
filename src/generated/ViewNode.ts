

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
  this.containsNoLoops = (options.containsNoLoops) ? options.containsNoLoops : null;
  this.eventNotifier = (options.eventNotifier) ? options.eventNotifier : null;

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
