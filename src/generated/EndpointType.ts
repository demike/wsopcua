/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode} from './MessageSecurityMode';
import {DataStream} from '../basic-types/DataStream';

export type IEndpointType = Partial<EndpointType>;

/**

*/

export class EndpointType {
  endpointUrl: string | null;
  securityMode: MessageSecurityMode;
  securityPolicyUri: string | null;
  transportProfileUri: string | null;

 constructor( options?: IEndpointType | null) {
  options = options || {};
  this.endpointUrl = (options.endpointUrl != null) ? options.endpointUrl : null;
  this.securityMode = (options.securityMode != null) ? options.securityMode : MessageSecurityMode.Invalid;
  this.securityPolicyUri = (options.securityPolicyUri != null) ? options.securityPolicyUri : null;
  this.transportProfileUri = (options.transportProfileUri != null) ? options.transportProfileUri : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.endpointUrl, out);
  encodeMessageSecurityMode(this.securityMode, out);
  ec.encodeString(this.securityPolicyUri, out);
  ec.encodeString(this.transportProfileUri, out);

 }


 decode( inp: DataStream) {
  this.endpointUrl = ec.decodeString(inp);
  this.securityMode = decodeMessageSecurityMode(inp);
  this.securityPolicyUri = ec.decodeString(inp);
  this.transportProfileUri = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.EndpointUrl = this.endpointUrl;
  out.SecurityMode = this.securityMode;
  out.SecurityPolicyUri = this.securityPolicyUri;
  out.TransportProfileUri = this.transportProfileUri;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.endpointUrl = inp.EndpointUrl;
  this.securityMode = inp.SecurityMode;
  this.securityPolicyUri = inp.SecurityPolicyUri;
  this.transportProfileUri = inp.TransportProfileUri;

 }


 clone( target?: EndpointType): EndpointType {
  if (!target) {
   target = new EndpointType();
  }
  target.endpointUrl = this.endpointUrl;
  target.securityMode = this.securityMode;
  target.securityPolicyUri = this.securityPolicyUri;
  target.transportProfileUri = this.transportProfileUri;
  return target;
 }


}
export function decodeEndpointType( inp: DataStream): EndpointType {
  const obj = new EndpointType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EndpointType', EndpointType, new ExpandedNodeId(2 /*numeric id*/, 15671, 0));
