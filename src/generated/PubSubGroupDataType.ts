

import * as ec from '../basic-types';
import {MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode} from './MessageSecurityMode';
import {EndpointDescription} from './EndpointDescription';
import {decodeEndpointDescription} from './EndpointDescription';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {DataStream} from '../basic-types/DataStream';

export interface IPubSubGroupDataType {
  name?: string;
  enabled?: boolean;
  securityMode?: MessageSecurityMode;
  securityGroupId?: string;
  securityKeyServices?: EndpointDescription[];
  maxNetworkMessageSize?: ec.UInt32;
  groupProperties?: KeyValuePair[];
}

/**

*/

export class PubSubGroupDataType {
  name: string;
  enabled: boolean;
  securityMode: MessageSecurityMode;
  securityGroupId: string;
  securityKeyServices: EndpointDescription[];
  maxNetworkMessageSize: ec.UInt32;
  groupProperties: KeyValuePair[];

 constructor( options?: IPubSubGroupDataType) {
  options = options || {};
  this.name = (options.name !== undefined) ? options.name : null;
  this.enabled = (options.enabled !== undefined) ? options.enabled : null;
  this.securityMode = (options.securityMode !== undefined) ? options.securityMode : null;
  this.securityGroupId = (options.securityGroupId !== undefined) ? options.securityGroupId : null;
  this.securityKeyServices = (options.securityKeyServices !== undefined) ? options.securityKeyServices : [];
  this.maxNetworkMessageSize = (options.maxNetworkMessageSize !== undefined) ? options.maxNetworkMessageSize : null;
  this.groupProperties = (options.groupProperties !== undefined) ? options.groupProperties : [];

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
  this.securityKeyServices = ec.decodeArray(inp, decodeEndpointDescription);
  this.maxNetworkMessageSize = ec.decodeUInt32(inp);
  this.groupProperties = ec.decodeArray(inp, decodeKeyValuePair);

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



