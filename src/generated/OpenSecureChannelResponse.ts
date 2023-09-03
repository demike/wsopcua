/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {ChannelSecurityToken} from './ChannelSecurityToken';
import {DataStream} from '../basic-types/DataStream';

export interface IOpenSecureChannelResponse {
  responseHeader?: ResponseHeader;
  serverProtocolVersion?: ec.UInt32;
  securityToken?: ChannelSecurityToken;
  serverNonce?: Uint8Array;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16049}
*/

export class OpenSecureChannelResponse {
  responseHeader: ResponseHeader;
  serverProtocolVersion: ec.UInt32;
  securityToken: ChannelSecurityToken;
  serverNonce: Uint8Array | null;

 constructor( options?: IOpenSecureChannelResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.serverProtocolVersion = (options.serverProtocolVersion != null) ? options.serverProtocolVersion : 0;
  this.securityToken = (options.securityToken != null) ? options.securityToken : new ChannelSecurityToken();
  this.serverNonce = (options.serverNonce != null) ? options.serverNonce : null;

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeUInt32(this.serverProtocolVersion, out);
  this.securityToken.encode(out);
  ec.encodeByteString(this.serverNonce, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.serverProtocolVersion = ec.decodeUInt32(inp);
  this.securityToken.decode(inp);
  this.serverNonce = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.ServerProtocolVersion = this.serverProtocolVersion;
  out.SecurityToken = this.securityToken;
  out.ServerNonce = ec.jsonEncodeByteString(this.serverNonce);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.serverProtocolVersion = inp.ServerProtocolVersion;
  this.securityToken.fromJSON(inp.SecurityToken);
  this.serverNonce = ec.jsonDecodeByteString(inp.ServerNonce);

 }


 clone( target?: OpenSecureChannelResponse): OpenSecureChannelResponse {
  if (!target) {
   target = new OpenSecureChannelResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.serverProtocolVersion = this.serverProtocolVersion;
  if (this.securityToken) { target.securityToken = this.securityToken.clone(); }
  target.serverNonce = this.serverNonce;
  return target;
 }


}
export function decodeOpenSecureChannelResponse( inp: DataStream): OpenSecureChannelResponse {
  const obj = new OpenSecureChannelResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('OpenSecureChannelResponse', OpenSecureChannelResponse, new ExpandedNodeId(2 /*numeric id*/, 449, 0));
