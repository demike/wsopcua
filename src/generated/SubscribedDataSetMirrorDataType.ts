/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {RolePermissionType} from './RolePermissionType';
import {decodeRolePermissionType} from './RolePermissionType';
import {DataStream} from '../basic-types/DataStream';
import {SubscribedDataSetDataType} from './SubscribedDataSetDataType';

export type ISubscribedDataSetMirrorDataType = Partial<SubscribedDataSetMirrorDataType>;

/**

*/

export class SubscribedDataSetMirrorDataType extends SubscribedDataSetDataType {
  parentNodeName: string | null;
  rolePermissions: (RolePermissionType)[];

 constructor( options?: ISubscribedDataSetMirrorDataType | null) {
  options = options || {};
  super();
  this.parentNodeName = (options.parentNodeName != null) ? options.parentNodeName : null;
  this.rolePermissions = (options.rolePermissions != null) ? options.rolePermissions : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.parentNodeName, out);
  ec.encodeArray(this.rolePermissions, out);

 }


 decode( inp: DataStream) {
  this.parentNodeName = ec.decodeString(inp);
  this.rolePermissions = ec.decodeArray(inp, decodeRolePermissionType) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.ParentNodeName = this.parentNodeName;
  out.RolePermissions = this.rolePermissions;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.parentNodeName = inp.ParentNodeName;
  this.rolePermissions = ec.jsonDecodeStructArray( inp.RolePermissions,RolePermissionType);

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SubscribedDataSetMirrorDataType', SubscribedDataSetMirrorDataType, new ExpandedNodeId(2 /*numeric id*/, 15713, 0));
