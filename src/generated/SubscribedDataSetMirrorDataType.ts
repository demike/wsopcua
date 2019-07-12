

import * as ec from '../basic-types';
import {RolePermissionType} from './RolePermissionType';
import {decodeRolePermissionType} from './RolePermissionType';
import {DataStream} from '../basic-types/DataStream';
import {SubscribedDataSetDataType} from './SubscribedDataSetDataType';

export interface ISubscribedDataSetMirrorDataType {
  parentNodeName?: string;
  rolePermissions?: RolePermissionType[];
}

/**

*/

export class SubscribedDataSetMirrorDataType extends SubscribedDataSetDataType {
  parentNodeName: string;
  rolePermissions: RolePermissionType[];

 constructor( options?: ISubscribedDataSetMirrorDataType) {
  options = options || {};
  super();
  this.parentNodeName = (options.parentNodeName) ? options.parentNodeName : null;
  this.rolePermissions = (options.rolePermissions) ? options.rolePermissions : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.parentNodeName, out);
  ec.encodeArray(this.rolePermissions, out);

 }


 decode( inp: DataStream) {
  this.parentNodeName = ec.decodeString(inp);
  this.rolePermissions = ec.decodeArray(inp, decodeRolePermissionType);

 }


 clone( target?: SubscribedDataSetMirrorDataType): SubscribedDataSetMirrorDataType {
  if (!target) {
   target = new SubscribedDataSetMirrorDataType();
  }
  target.parentNodeName = this.parentNodeName;
  if (this.rolePermissions) { target.rolePermissions = ec.cloneComplexArray(this.rolePermissions); }
  return target;
 }


}
export function decodeSubscribedDataSetMirrorDataType( inp: DataStream): SubscribedDataSetMirrorDataType {
  const obj = new SubscribedDataSetMirrorDataType();
   obj.decode(inp);
   return obj;

 }



