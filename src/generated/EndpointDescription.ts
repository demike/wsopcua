/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

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

 * {@link https://reference.opcfoundation.org/nodesets/4/16036}
*/

export class EndpointDescription {
  endpointUrl: string | null;
  server: ApplicationDescription;
  serverCertificate: Uint8Array | null;
  securityMode: MessageSecurityMode;
  securityPolicyUri: string | null;
  userIdentityTokens: UserTokenPolicy[];
  transportProfileUri: string | null;
  securityLevel: ec.Byte;

 constructor( options?: IEndpointDescription) {
  options = options || {};
  this.endpointUrl = (options.endpointUrl != null) ? options.endpointUrl : null;
  this.server = (options.server != null) ? options.server : new ApplicationDescription();
  this.serverCertificate = (options.serverCertificate != null) ? options.serverCertificate : null;
  this.securityMode = (options.securityMode != null) ? options.securityMode : null;
  this.securityPolicyUri = (options.securityPolicyUri != null) ? options.securityPolicyUri : null;
  this.userIdentityTokens = (options.userIdentityTokens != null) ? options.userIdentityTokens : [];
  this.transportProfileUri = (options.transportProfileUri != null) ? options.transportProfileUri : null;
  this.securityLevel = (options.securityLevel != null) ? options.securityLevel : 0;

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


 toJSON() {
  const out: any = {};
  out.EndpointUrl = this.endpointUrl;
  out.Server = this.server;
  out.ServerCertificate = ec.jsonEncodeByteString(this.serverCertificate);
  out.SecurityMode = this.securityMode;
  out.SecurityPolicyUri = this.securityPolicyUri;
  out.UserIdentityTokens = this.userIdentityTokens;
  out.TransportProfileUri = this.transportProfileUri;
  out.SecurityLevel = this.securityLevel;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.endpointUrl = inp.EndpointUrl;
  this.server.fromJSON(inp.Server);
  this.serverCertificate = ec.jsonDecodeByteString(inp.ServerCertificate);
  this.securityMode = inp.SecurityMode;
  this.securityPolicyUri = inp.SecurityPolicyUri;
  this.userIdentityTokens = ec.jsonDecodeStructArray( inp.UserIdentityTokens,UserTokenPolicy);
  this.transportProfileUri = inp.TransportProfileUri;
  this.securityLevel = inp.SecurityLevel;

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EndpointDescription', EndpointDescription, new ExpandedNodeId(2 /*numeric id*/, 312, 0));
