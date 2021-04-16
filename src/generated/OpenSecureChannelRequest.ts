/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from '.';
import * as ec from '../basic-types';
import {SecurityTokenRequestType, encodeSecurityTokenRequestType, decodeSecurityTokenRequestType} from '.';
import {MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode} from '.';
import {DataStream} from '../basic-types';

export interface IOpenSecureChannelRequest {
  requestHeader?: RequestHeader;
  clientProtocolVersion?: ec.UInt32;
  requestType?: SecurityTokenRequestType;
  securityMode?: MessageSecurityMode;
  clientNonce?: Uint8Array;
  requestedLifetime?: ec.UInt32;
}

/**

*/

export class OpenSecureChannelRequest {
  requestHeader: RequestHeader;
  clientProtocolVersion: ec.UInt32;
  requestType: SecurityTokenRequestType;
  securityMode: MessageSecurityMode;
  clientNonce: Uint8Array | null;
  requestedLifetime: ec.UInt32;

 constructor( options?: IOpenSecureChannelRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.clientProtocolVersion = (options.clientProtocolVersion != null) ? options.clientProtocolVersion : 0;
  this.requestType = (options.requestType != null) ? options.requestType : null;
  this.securityMode = (options.securityMode != null) ? options.securityMode : null;
  this.clientNonce = (options.clientNonce != null) ? options.clientNonce : null;
  this.requestedLifetime = (options.requestedLifetime != null) ? options.requestedLifetime : 0;

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeUInt32(this.clientProtocolVersion, out);
  encodeSecurityTokenRequestType(this.requestType, out);
  encodeMessageSecurityMode(this.securityMode, out);
  ec.encodeByteString(this.clientNonce, out);
  ec.encodeUInt32(this.requestedLifetime, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.clientProtocolVersion = ec.decodeUInt32(inp);
  this.requestType = decodeSecurityTokenRequestType(inp);
  this.securityMode = decodeMessageSecurityMode(inp);
  this.clientNonce = ec.decodeByteString(inp);
  this.requestedLifetime = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.ClientProtocolVersion = this.clientProtocolVersion;
  out.RequestType = this.requestType;
  out.SecurityMode = this.securityMode;
  out.ClientNonce = ec.jsonEncodeByteString(this.clientNonce);
  out.RequestedLifetime = this.requestedLifetime;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.clientProtocolVersion = inp.ClientProtocolVersion;
  this.requestType = inp.RequestType;
  this.securityMode = inp.SecurityMode;
  this.clientNonce = ec.jsonDecodeByteString(inp.ClientNonce);
  this.requestedLifetime = inp.RequestedLifetime;

 }


 clone( target?: OpenSecureChannelRequest): OpenSecureChannelRequest {
  if (!target) {
   target = new OpenSecureChannelRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.clientProtocolVersion = this.clientProtocolVersion;
  target.requestType = this.requestType;
  target.securityMode = this.securityMode;
  target.clientNonce = this.clientNonce;
  target.requestedLifetime = this.requestedLifetime;
  return target;
 }


}
export function decodeOpenSecureChannelRequest( inp: DataStream): OpenSecureChannelRequest {
  const obj = new OpenSecureChannelRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('OpenSecureChannelRequest', OpenSecureChannelRequest, new ExpandedNodeId(2 /*numeric id*/, 446, 0));
