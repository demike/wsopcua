

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

*/

export class OpenSecureChannelResponse {
  responseHeader: ResponseHeader;
  serverProtocolVersion: ec.UInt32;
  securityToken: ChannelSecurityToken;
  serverNonce: Uint8Array;

 constructor( options?: IOpenSecureChannelResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.serverProtocolVersion = (options.serverProtocolVersion != null) ? options.serverProtocolVersion : null;
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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('OpenSecureChannelResponse', OpenSecureChannelResponse, makeExpandedNodeId(449, 0));
