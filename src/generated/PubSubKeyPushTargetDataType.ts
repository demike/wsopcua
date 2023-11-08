/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {UserTokenPolicy} from './UserTokenPolicy';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {DataStream} from '../basic-types/DataStream';

export type IPubSubKeyPushTargetDataType = Partial<PubSubKeyPushTargetDataType>;

/**

*/

export class PubSubKeyPushTargetDataType {
  applicationUri: string | null;
  pushTargetFolder: (string | null)[];
  endpointUrl: string | null;
  securityPolicyUri: string | null;
  userTokenType: UserTokenPolicy;
  requestedKeyCount: ec.UInt16;
  retryInterval: ec.Double;
  pushTargetProperties: (KeyValuePair)[];
  securityGroups: (string | null)[];

 constructor( options?: IPubSubKeyPushTargetDataType | null) {
  options = options || {};
  this.applicationUri = (options.applicationUri != null) ? options.applicationUri : null;
  this.pushTargetFolder = (options.pushTargetFolder != null) ? options.pushTargetFolder : [];
  this.endpointUrl = (options.endpointUrl != null) ? options.endpointUrl : null;
  this.securityPolicyUri = (options.securityPolicyUri != null) ? options.securityPolicyUri : null;
  this.userTokenType = (options.userTokenType != null) ? options.userTokenType : new UserTokenPolicy();
  this.requestedKeyCount = (options.requestedKeyCount != null) ? options.requestedKeyCount : 0;
  this.retryInterval = (options.retryInterval != null) ? options.retryInterval : 0;
  this.pushTargetProperties = (options.pushTargetProperties != null) ? options.pushTargetProperties : [];
  this.securityGroups = (options.securityGroups != null) ? options.securityGroups : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.applicationUri, out);
  ec.encodeArray(this.pushTargetFolder, out, ec.encodeString);
  ec.encodeString(this.endpointUrl, out);
  ec.encodeString(this.securityPolicyUri, out);
  this.userTokenType.encode(out);
  ec.encodeUInt16(this.requestedKeyCount, out);
  ec.encodeDouble(this.retryInterval, out);
  ec.encodeArray(this.pushTargetProperties, out);
  ec.encodeArray(this.securityGroups, out, ec.encodeString);

 }


 decode( inp: DataStream) {
  this.applicationUri = ec.decodeString(inp);
  this.pushTargetFolder = ec.decodeArray(inp, ec.decodeString) ?? [];
  this.endpointUrl = ec.decodeString(inp);
  this.securityPolicyUri = ec.decodeString(inp);
  this.userTokenType.decode(inp);
  this.requestedKeyCount = ec.decodeUInt16(inp);
  this.retryInterval = ec.decodeDouble(inp);
  this.pushTargetProperties = ec.decodeArray(inp, decodeKeyValuePair) ?? [];
  this.securityGroups = ec.decodeArray(inp, ec.decodeString) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.ApplicationUri = this.applicationUri;
  out.PushTargetFolder = this.pushTargetFolder;
  out.EndpointUrl = this.endpointUrl;
  out.SecurityPolicyUri = this.securityPolicyUri;
  out.UserTokenType = this.userTokenType;
  out.RequestedKeyCount = this.requestedKeyCount;
  out.RetryInterval = this.retryInterval;
  out.PushTargetProperties = this.pushTargetProperties;
  out.SecurityGroups = this.securityGroups;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.applicationUri = inp.ApplicationUri;
  this.pushTargetFolder = inp.PushTargetFolder;
  this.endpointUrl = inp.EndpointUrl;
  this.securityPolicyUri = inp.SecurityPolicyUri;
  this.userTokenType.fromJSON(inp.UserTokenType);
  this.requestedKeyCount = inp.RequestedKeyCount;
  this.retryInterval = inp.RetryInterval;
  this.pushTargetProperties = ec.jsonDecodeStructArray( inp.PushTargetProperties,KeyValuePair);
  this.securityGroups = inp.SecurityGroups;

 }


 clone( target?: PubSubKeyPushTargetDataType): PubSubKeyPushTargetDataType {
  if (!target) {
   target = new PubSubKeyPushTargetDataType();
  }
  target.applicationUri = this.applicationUri;
  target.pushTargetFolder = ec.cloneArray(this.pushTargetFolder);
  target.endpointUrl = this.endpointUrl;
  target.securityPolicyUri = this.securityPolicyUri;
  if (this.userTokenType) { target.userTokenType = this.userTokenType.clone(); }
  target.requestedKeyCount = this.requestedKeyCount;
  target.retryInterval = this.retryInterval;
  if (this.pushTargetProperties) { target.pushTargetProperties = ec.cloneComplexArray(this.pushTargetProperties); }
  target.securityGroups = ec.cloneArray(this.securityGroups);
  return target;
 }


}
export function decodePubSubKeyPushTargetDataType( inp: DataStream): PubSubKeyPushTargetDataType {
  const obj = new PubSubKeyPushTargetDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('PubSubKeyPushTargetDataType', PubSubKeyPushTargetDataType, new ExpandedNodeId(2 /*numeric id*/, 25530, 0));
