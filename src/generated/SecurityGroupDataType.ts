/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {RolePermissionType} from './RolePermissionType';
import {decodeRolePermissionType} from './RolePermissionType';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {DataStream} from '../basic-types/DataStream';

export interface ISecurityGroupDataType {
  name?: string;
  securityGroupFolder?: string[];
  keyLifetime?: ec.Double;
  securityPolicyUri?: string;
  maxFutureKeyCount?: ec.UInt32;
  maxPastKeyCount?: ec.UInt32;
  securityGroupId?: string;
  rolePermissions?: RolePermissionType[];
  groupProperties?: KeyValuePair[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16814}
*/

export class SecurityGroupDataType {
  name: string | null;
  securityGroupFolder: string[];
  keyLifetime: ec.Double;
  securityPolicyUri: string | null;
  maxFutureKeyCount: ec.UInt32;
  maxPastKeyCount: ec.UInt32;
  securityGroupId: string | null;
  rolePermissions: RolePermissionType[];
  groupProperties: KeyValuePair[];

 constructor( options?: ISecurityGroupDataType) {
  options = options || {};
  this.name = (options.name != null) ? options.name : null;
  this.securityGroupFolder = (options.securityGroupFolder != null) ? options.securityGroupFolder : [];
  this.keyLifetime = (options.keyLifetime != null) ? options.keyLifetime : 0;
  this.securityPolicyUri = (options.securityPolicyUri != null) ? options.securityPolicyUri : null;
  this.maxFutureKeyCount = (options.maxFutureKeyCount != null) ? options.maxFutureKeyCount : 0;
  this.maxPastKeyCount = (options.maxPastKeyCount != null) ? options.maxPastKeyCount : 0;
  this.securityGroupId = (options.securityGroupId != null) ? options.securityGroupId : null;
  this.rolePermissions = (options.rolePermissions != null) ? options.rolePermissions : [];
  this.groupProperties = (options.groupProperties != null) ? options.groupProperties : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.name, out);
  ec.encodeArray(this.securityGroupFolder, out, ec.encodeString);
  ec.encodeDouble(this.keyLifetime, out);
  ec.encodeString(this.securityPolicyUri, out);
  ec.encodeUInt32(this.maxFutureKeyCount, out);
  ec.encodeUInt32(this.maxPastKeyCount, out);
  ec.encodeString(this.securityGroupId, out);
  ec.encodeArray(this.rolePermissions, out);
  ec.encodeArray(this.groupProperties, out);

 }


 decode( inp: DataStream) {
  this.name = ec.decodeString(inp);
  this.securityGroupFolder = ec.decodeArray(inp, ec.decodeString);
  this.keyLifetime = ec.decodeDouble(inp);
  this.securityPolicyUri = ec.decodeString(inp);
  this.maxFutureKeyCount = ec.decodeUInt32(inp);
  this.maxPastKeyCount = ec.decodeUInt32(inp);
  this.securityGroupId = ec.decodeString(inp);
  this.rolePermissions = ec.decodeArray(inp, decodeRolePermissionType);
  this.groupProperties = ec.decodeArray(inp, decodeKeyValuePair);

 }


 toJSON() {
  const out: any = {};
  out.Name = this.name;
  out.SecurityGroupFolder = this.securityGroupFolder;
  out.KeyLifetime = this.keyLifetime;
  out.SecurityPolicyUri = this.securityPolicyUri;
  out.MaxFutureKeyCount = this.maxFutureKeyCount;
  out.MaxPastKeyCount = this.maxPastKeyCount;
  out.SecurityGroupId = this.securityGroupId;
  out.RolePermissions = this.rolePermissions;
  out.GroupProperties = this.groupProperties;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.name = inp.Name;
  this.securityGroupFolder = inp.SecurityGroupFolder;
  this.keyLifetime = inp.KeyLifetime;
  this.securityPolicyUri = inp.SecurityPolicyUri;
  this.maxFutureKeyCount = inp.MaxFutureKeyCount;
  this.maxPastKeyCount = inp.MaxPastKeyCount;
  this.securityGroupId = inp.SecurityGroupId;
  this.rolePermissions = ec.jsonDecodeStructArray( inp.RolePermissions,RolePermissionType);
  this.groupProperties = ec.jsonDecodeStructArray( inp.GroupProperties,KeyValuePair);

 }


 clone( target?: SecurityGroupDataType): SecurityGroupDataType {
  if (!target) {
   target = new SecurityGroupDataType();
  }
  target.name = this.name;
  target.securityGroupFolder = ec.cloneArray(this.securityGroupFolder);
  target.keyLifetime = this.keyLifetime;
  target.securityPolicyUri = this.securityPolicyUri;
  target.maxFutureKeyCount = this.maxFutureKeyCount;
  target.maxPastKeyCount = this.maxPastKeyCount;
  target.securityGroupId = this.securityGroupId;
  if (this.rolePermissions) { target.rolePermissions = ec.cloneComplexArray(this.rolePermissions); }
  if (this.groupProperties) { target.groupProperties = ec.cloneComplexArray(this.groupProperties); }
  return target;
 }


}
export function decodeSecurityGroupDataType( inp: DataStream): SecurityGroupDataType {
  const obj = new SecurityGroupDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SecurityGroupDataType', SecurityGroupDataType, new ExpandedNodeId(2 /*numeric id*/, 23601, 0));
