

import * as ec from '../basic-types';
import {PermissionType, encodePermissionType, decodePermissionType} from './PermissionType';
import {DataStream} from '../basic-types/DataStream';

export interface IRolePermissionType {
  roleId?: ec.NodeId;
  permissions?: PermissionType;
}

/**

*/

export class RolePermissionType {
  roleId: ec.NodeId;
  permissions: PermissionType;

 constructor( options?: IRolePermissionType) {
  options = options || {};
  this.roleId = (options.roleId != null) ? options.roleId : null;
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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RolePermissionType', RolePermissionType, makeExpandedNodeId(128, 0));
