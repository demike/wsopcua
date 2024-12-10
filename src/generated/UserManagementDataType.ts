/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {UserConfigurationMask, encodeUserConfigurationMask, decodeUserConfigurationMask} from './UserConfigurationMask';
import {DataStream} from '../basic-types/DataStream';

export type IUserManagementDataType = Partial<UserManagementDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16981}
*/

export class UserManagementDataType {
  userName: string | undefined;
  userConfiguration: UserConfigurationMask;
  description: string | undefined;

 constructor( options?: IUserManagementDataType | undefined) {
  options = options || {};
  this.userName = options.userName;
  this.userConfiguration = (options.userConfiguration != null) ? options.userConfiguration : UserConfigurationMask.None;
  this.description = options.description;

 }


 encode( out: DataStream) {
  ec.encodeString(this.userName, out);
  encodeUserConfigurationMask(this.userConfiguration, out);
  ec.encodeString(this.description, out);

 }


 decode( inp: DataStream) {
  this.userName = ec.decodeString(inp);
  this.userConfiguration = decodeUserConfigurationMask(inp);
  this.description = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.UserName = this.userName;
  out.UserConfiguration = this.userConfiguration;
  out.Description = this.description;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.userName = inp.UserName;
  this.userConfiguration = inp.UserConfiguration;
  this.description = inp.Description;

 }


 clone( target?: UserManagementDataType): UserManagementDataType {
  if (!target) {
   target = new UserManagementDataType();
  }
  target.userName = this.userName;
  target.userConfiguration = this.userConfiguration;
  target.description = this.description;
  return target;
 }


}
export function decodeUserManagementDataType( inp: DataStream): UserManagementDataType {
  const obj = new UserManagementDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UserManagementDataType', UserManagementDataType, new ExpandedNodeId(2 /*numeric id*/, 24292, 0));
