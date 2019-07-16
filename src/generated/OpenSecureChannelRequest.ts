

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {SecurityTokenRequestType, encodeSecurityTokenRequestType, decodeSecurityTokenRequestType} from './SecurityTokenRequestType';
import {MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode} from './MessageSecurityMode';
import {DataStream} from '../basic-types/DataStream';

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
  clientNonce: Uint8Array;
  requestedLifetime: ec.UInt32;

 constructor( options?: IOpenSecureChannelRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader !== undefined) ? options.requestHeader : new RequestHeader();
  this.clientProtocolVersion = (options.clientProtocolVersion !== undefined) ? options.clientProtocolVersion : null;
  this.requestType = (options.requestType !== undefined) ? options.requestType : null;
  this.securityMode = (options.securityMode !== undefined) ? options.securityMode : null;
  this.clientNonce = (options.clientNonce !== undefined) ? options.clientNonce : null;
  this.requestedLifetime = (options.requestedLifetime !== undefined) ? options.requestedLifetime : null;

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



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('OpenSecureChannelRequest', OpenSecureChannelRequest, makeExpandedNodeId(446, 0));
