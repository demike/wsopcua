/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode} from './MessageSecurityMode';
import {EndpointDescription} from './EndpointDescription';
import {decodeEndpointDescription} from './EndpointDescription';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {DataStream} from '../basic-types/DataStream';

export type IPubSubGroupDataType = Partial<PubSubGroupDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15804}
*/

export class PubSubGroupDataType {
  name: string | undefined;
  enabled: boolean;
  securityMode: MessageSecurityMode;
  securityGroupId: string | undefined;
  securityKeyServices: (EndpointDescription)[];
  maxNetworkMessageSize: ec.UInt32;
  groupProperties: (KeyValuePair)[];

 constructor( options?: IPubSubGroupDataType | undefined) {
  options = options || {};
  this.name = options.name;
  this.enabled = (options.enabled != null) ? options.enabled : false;
  this.securityMode = (options.securityMode != null) ? options.securityMode : MessageSecurityMode.Invalid;
  this.securityGroupId = options.securityGroupId;
  this.securityKeyServices = (options.securityKeyServices != null) ? options.securityKeyServices : [];
  this.maxNetworkMessageSize = (options.maxNetworkMessageSize != null) ? options.maxNetworkMessageSize : 0;
  this.groupProperties = (options.groupProperties != null) ? options.groupProperties : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.name, out);
  ec.encodeBoolean(this.enabled, out);
  encodeMessageSecurityMode(this.securityMode, out);
  ec.encodeString(this.securityGroupId, out);
  ec.encodeArray(this.securityKeyServices, out);
  ec.encodeUInt32(this.maxNetworkMessageSize, out);
  ec.encodeArray(this.groupProperties, out);

 }


 decode( inp: DataStream) {
  this.name = ec.decodeString(inp);
  this.enabled = ec.decodeBoolean(inp);
  this.securityMode = decodeMessageSecurityMode(inp);
  this.securityGroupId = ec.decodeString(inp);
  this.securityKeyServices = ec.decodeArray(inp, decodeEndpointDescription) ?? [];
  this.maxNetworkMessageSize = ec.decodeUInt32(inp);
  this.groupProperties = ec.decodeArray(inp, decodeKeyValuePair) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.Name = this.name;
  out.Enabled = this.enabled;
  out.SecurityMode = this.securityMode;
  out.SecurityGroupId = this.securityGroupId;
  out.SecurityKeyServices = this.securityKeyServices;
  out.MaxNetworkMessageSize = this.maxNetworkMessageSize;
  out.GroupProperties = this.groupProperties;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.name = inp.Name;
  this.enabled = inp.Enabled;
  this.securityMode = inp.SecurityMode;
  this.securityGroupId = inp.SecurityGroupId;
  this.securityKeyServices = ec.jsonDecodeStructArray( inp.SecurityKeyServices,EndpointDescription);
  this.maxNetworkMessageSize = inp.MaxNetworkMessageSize;
  this.groupProperties = ec.jsonDecodeStructArray( inp.GroupProperties,KeyValuePair);

 }


 clone( target?: PubSubGroupDataType): PubSubGroupDataType {
  if (!target) {
   target = new PubSubGroupDataType();
  }
  target.name = this.name;
  target.enabled = this.enabled;
  target.securityMode = this.securityMode;
  target.securityGroupId = this.securityGroupId;
  if (this.securityKeyServices) { target.securityKeyServices = ec.cloneComplexArray(this.securityKeyServices); }
  target.maxNetworkMessageSize = this.maxNetworkMessageSize;
  if (this.groupProperties) { target.groupProperties = ec.cloneComplexArray(this.groupProperties); }
  return target;
 }


}
export function decodePubSubGroupDataType( inp: DataStream): PubSubGroupDataType {
  const obj = new PubSubGroupDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('PubSubGroupDataType', PubSubGroupDataType, new ExpandedNodeId(2 /*numeric id*/, 15689, 0));
