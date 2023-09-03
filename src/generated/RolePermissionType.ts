/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {PermissionType, encodePermissionType, decodePermissionType} from './PermissionType';
import {DataStream} from '../basic-types/DataStream';

export interface IRolePermissionType {
  roleId?: ec.NodeId;
  permissions?: PermissionType;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15984}
*/

export class RolePermissionType {
  roleId: ec.NodeId;
  permissions: PermissionType;

 constructor( options?: IRolePermissionType) {
  options = options || {};
  this.roleId = (options.roleId != null) ? options.roleId : ec.NodeId.NullNodeId;
  this.permissions = (options.permissions != null) ? options.permissions : null;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.roleId, out);
  encodePermissionType(this.permissions, out);

 }


 decode( inp: DataStream) {
  this.roleId = ec.decodeNodeId(inp);
  this.permissions = decodePermissionType(inp);

 }


 toJSON() {
  const out: any = {};
  out.RoleId = ec.jsonEncodeNodeId(this.roleId);
  out.Permissions = this.permissions;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.roleId = ec.jsonDecodeNodeId(inp.RoleId);
  this.permissions = inp.Permissions;

 }


 clone( target?: RolePermissionType): RolePermissionType {
  if (!target) {
   target = new RolePermissionType();
  }
  target.roleId = this.roleId;
  target.permissions = this.permissions;
  return target;
 }


}
export function decodeRolePermissionType( inp: DataStream): RolePermissionType {
  const obj = new RolePermissionType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RolePermissionType', RolePermissionType, new ExpandedNodeId(2 /*numeric id*/, 128, 0));
