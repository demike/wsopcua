

import * as ec from '../basic-types';
import {MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode} from './MessageSecurityMode';
import {DataStream} from '../basic-types/DataStream';

export interface IEndpointType {
  endpointUrl?: string;
  securityMode?: MessageSecurityMode;
  securityPolicyUri?: string;
  transportProfileUri?: string;
}

/**

*/

export class EndpointType {
  endpointUrl: string;
  securityMode: MessageSecurityMode;
  securityPolicyUri: string;
  transportProfileUri: string;

 constructor( options?: IEndpointType) {
  options = options || {};
  this.endpointUrl = (options.endpointUrl != null) ? options.endpointUrl : null;
  this.securityMode = (options.securityMode != null) ? options.securityMode : null;
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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EndpointType', EndpointType, makeExpandedNodeId(15671, 0));
