

import * as ec from '../basic-types';
import {ApplicationDescription} from './ApplicationDescription';
import {MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode} from './MessageSecurityMode';
import {UserTokenPolicy} from './UserTokenPolicy';
import {decodeUserTokenPolicy} from './UserTokenPolicy';
import {DataStream} from '../basic-types/DataStream';

export interface IEndpointDescription {
  endpointUrl?: string;
  server?: ApplicationDescription;
  serverCertificate?: Uint8Array;
  securityMode?: MessageSecurityMode;
  securityPolicyUri?: string;
  userIdentityTokens?: UserTokenPolicy[];
  transportProfileUri?: string;
  securityLevel?: ec.Byte;
}

/**

*/

export class EndpointDescription {
  endpointUrl: string;
  server: ApplicationDescription;
  serverCertificate: Uint8Array;
  securityMode: MessageSecurityMode;
  securityPolicyUri: string;
  userIdentityTokens: UserTokenPolicy[];
  transportProfileUri: string;
  securityLevel: ec.Byte;

 constructor( options?: IEndpointDescription) {
  options = options || {};
  this.endpointUrl = (options.endpointUrl !== undefined) ? options.endpointUrl : null;
  this.server = (options.server !== undefined) ? options.server : new ApplicationDescription();
  this.serverCertificate = (options.serverCertificate !== undefined) ? options.serverCertificate : null;
  this.securityMode = (options.securityMode !== undefined) ? options.securityMode : null;
  this.securityPolicyUri = (options.securityPolicyUri !== undefined) ? options.securityPolicyUri : null;
  this.userIdentityTokens = (options.userIdentityTokens !== undefined) ? options.userIdentityTokens : [];
  this.transportProfileUri = (options.transportProfileUri !== undefined) ? options.transportProfileUri : null;
  this.securityLevel = (options.securityLevel !== undefined) ? options.securityLevel : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.endpointUrl, out);
  this.server.encode(out);
  ec.encodeByteString(this.serverCertificate, out);
  encodeMessageSecurityMode(this.securityMode, out);
  ec.encodeString(this.securityPolicyUri, out);
  ec.encodeArray(this.userIdentityTokens, out);
  ec.encodeString(this.transportProfileUri, out);
  ec.encodeByte(this.securityLevel, out);

 }


 decode( inp: DataStream) {
  this.endpointUrl = ec.decodeString(inp);
  this.server.decode(inp);
  this.serverCertificate = ec.decodeByteString(inp);
  this.securityMode = decodeMessageSecurityMode(inp);
  this.securityPolicyUri = ec.decodeString(inp);
  this.userIdentityTokens = ec.decodeArray(inp, decodeUserTokenPolicy);
  this.transportProfileUri = ec.decodeString(inp);
  this.securityLevel = ec.decodeByte(inp);

 }


 clone( target?: EndpointDescription): EndpointDescription {
  if (!target) {
   target = new EndpointDescription();
  }
  target.endpointUrl = this.endpointUrl;
  if (this.server) { target.server = this.server.clone(); }
  target.serverCertificate = this.serverCertificate;
  target.securityMode = this.securityMode;
  target.securityPolicyUri = this.securityPolicyUri;
  if (this.userIdentityTokens) { target.userIdentityTokens = ec.cloneComplexArray(this.userIdentityTokens); }
  target.transportProfileUri = this.transportProfileUri;
  target.securityLevel = this.securityLevel;
  return target;
 }


}
export function decodeEndpointDescription( inp: DataStream): EndpointDescription {
  const obj = new EndpointDescription();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EndpointDescription', EndpointDescription, makeExpandedNodeId(314, 0));
