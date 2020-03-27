/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {ApplicationType, encodeApplicationType, decodeApplicationType} from './ApplicationType';
import {DataStream} from '../basic-types/DataStream';

export interface IApplicationDescription {
  applicationUri?: string;
  productUri?: string;
  applicationName?: LocalizedText;
  applicationType?: ApplicationType;
  gatewayServerUri?: string;
  discoveryProfileUri?: string;
  discoveryUrls?: string[];
}

/**

*/

export class ApplicationDescription {
  applicationUri: string | null;
  productUri: string | null;
  applicationName: LocalizedText;
  applicationType: ApplicationType;
  gatewayServerUri: string | null;
  discoveryProfileUri: string | null;
  discoveryUrls: string[];

 constructor( options?: IApplicationDescription) {
  options = options || {};
  this.applicationUri = (options.applicationUri != null) ? options.applicationUri : null;
  this.productUri = (options.productUri != null) ? options.productUri : null;
  this.applicationName = (options.applicationName != null) ? options.applicationName : new LocalizedText();
  this.applicationType = (options.applicationType != null) ? options.applicationType : null;
  this.gatewayServerUri = (options.gatewayServerUri != null) ? options.gatewayServerUri : null;
  this.discoveryProfileUri = (options.discoveryProfileUri != null) ? options.discoveryProfileUri : null;
  this.discoveryUrls = (options.discoveryUrls != null) ? options.discoveryUrls : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.applicationUri, out);
  ec.encodeString(this.productUri, out);
  this.applicationName.encode(out);
  encodeApplicationType(this.applicationType, out);
  ec.encodeString(this.gatewayServerUri, out);
  ec.encodeString(this.discoveryProfileUri, out);
  ec.encodeArray(this.discoveryUrls, out, ec.encodeString);

 }


 decode( inp: DataStream) {
  this.applicationUri = ec.decodeString(inp);
  this.productUri = ec.decodeString(inp);
  this.applicationName.decode(inp);
  this.applicationType = decodeApplicationType(inp);
  this.gatewayServerUri = ec.decodeString(inp);
  this.discoveryProfileUri = ec.decodeString(inp);
  this.discoveryUrls = ec.decodeArray(inp, ec.decodeString);

 }


 toJSON() {
  const out: any = {};
  out.ApplicationUri = this.applicationUri;
  out.ProductUri = this.productUri;
  out.ApplicationName = this.applicationName;
  out.ApplicationType = this.applicationType;
  out.GatewayServerUri = this.gatewayServerUri;
  out.DiscoveryProfileUri = this.discoveryProfileUri;
  out.DiscoveryUrls = this.discoveryUrls;
 return out;
 }


 fromJSON( inp: any) {
  this.applicationUri = inp.ApplicationUri;
  this.productUri = inp.ProductUri;
  this.applicationName.fromJSON(inp);
  this.applicationType = inp.ApplicationType;
  this.gatewayServerUri = inp.GatewayServerUri;
  this.discoveryProfileUri = inp.DiscoveryProfileUri;
  this.discoveryUrls = inp.DiscoveryUrls;

 }


 clone( target?: ApplicationDescription): ApplicationDescription {
  if (!target) {
   target = new ApplicationDescription();
  }
  target.applicationUri = this.applicationUri;
  target.productUri = this.productUri;
  if (this.applicationName) { target.applicationName = this.applicationName.clone(); }
  target.applicationType = this.applicationType;
  target.gatewayServerUri = this.gatewayServerUri;
  target.discoveryProfileUri = this.discoveryProfileUri;
  target.discoveryUrls = ec.cloneArray(this.discoveryUrls);
  return target;
 }


}
export function decodeApplicationDescription( inp: DataStream): ApplicationDescription {
  const obj = new ApplicationDescription();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ApplicationDescription', ApplicationDescription, new ExpandedNodeId(2 /*numeric id*/, 310, 0));
