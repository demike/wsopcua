/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {ApplicationDescription} from './ApplicationDescription';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ICreateSessionRequest = Partial<CreateSessionRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16055}
*/

export class CreateSessionRequest {
  requestHeader: RequestHeader;
  clientDescription: ApplicationDescription;
  serverUri: string | null;
  endpointUrl: string | null;
  sessionName: string | null;
  clientNonce: Uint8Array | null;
  clientCertificate: Uint8Array | null;
  requestedSessionTimeout: ec.Double;
  maxResponseMessageSize: ec.UInt32;

 constructor( options?: ICreateSessionRequest | null) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.clientDescription = (options.clientDescription != null) ? options.clientDescription : new ApplicationDescription();
  this.serverUri = (options.serverUri != null) ? options.serverUri : null;
  this.endpointUrl = (options.endpointUrl != null) ? options.endpointUrl : null;
  this.sessionName = (options.sessionName != null) ? options.sessionName : null;
  this.clientNonce = (options.clientNonce != null) ? options.clientNonce : null;
  this.clientCertificate = (options.clientCertificate != null) ? options.clientCertificate : null;
  this.requestedSessionTimeout = (options.requestedSessionTimeout != null) ? options.requestedSessionTimeout : 0;
  this.maxResponseMessageSize = (options.maxResponseMessageSize != null) ? options.maxResponseMessageSize : 0;

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  this.clientDescription.encode(out);
  ec.encodeString(this.serverUri, out);
  ec.encodeString(this.endpointUrl, out);
  ec.encodeString(this.sessionName, out);
  ec.encodeByteString(this.clientNonce, out);
  ec.encodeByteString(this.clientCertificate, out);
  ec.encodeDouble(this.requestedSessionTimeout, out);
  ec.encodeUInt32(this.maxResponseMessageSize, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.clientDescription.decode(inp);
  this.serverUri = ec.decodeString(inp);
  this.endpointUrl = ec.decodeString(inp);
  this.sessionName = ec.decodeString(inp);
  this.clientNonce = ec.decodeByteString(inp);
  this.clientCertificate = ec.decodeByteString(inp);
  this.requestedSessionTimeout = ec.decodeDouble(inp);
  this.maxResponseMessageSize = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.ClientDescription = this.clientDescription;
  out.ServerUri = this.serverUri;
  out.EndpointUrl = this.endpointUrl;
  out.SessionName = this.sessionName;
  out.ClientNonce = ec.jsonEncodeByteString(this.clientNonce);
  out.ClientCertificate = ec.jsonEncodeByteString(this.clientCertificate);
  out.RequestedSessionTimeout = this.requestedSessionTimeout;
  out.MaxResponseMessageSize = this.maxResponseMessageSize;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.clientDescription.fromJSON(inp.ClientDescription);
  this.serverUri = inp.ServerUri;
  this.endpointUrl = inp.EndpointUrl;
  this.sessionName = inp.SessionName;
  this.clientNonce = ec.jsonDecodeByteString(inp.ClientNonce);
  this.clientCertificate = ec.jsonDecodeByteString(inp.ClientCertificate);
  this.requestedSessionTimeout = inp.RequestedSessionTimeout;
  this.maxResponseMessageSize = inp.MaxResponseMessageSize;

 }


 clone( target?: CreateSessionRequest): CreateSessionRequest {
  if (!target) {
   target = new CreateSessionRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.clientDescription) { target.clientDescription = this.clientDescription.clone(); }
  target.serverUri = this.serverUri;
  target.endpointUrl = this.endpointUrl;
  target.sessionName = this.sessionName;
  target.clientNonce = this.clientNonce;
  target.clientCertificate = this.clientCertificate;
  target.requestedSessionTimeout = this.requestedSessionTimeout;
  target.maxResponseMessageSize = this.maxResponseMessageSize;
  return target;
 }


}
export function decodeCreateSessionRequest( inp: DataStream): CreateSessionRequest {
  const obj = new CreateSessionRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CreateSessionRequest', CreateSessionRequest, new ExpandedNodeId(2 /*numeric id*/, 461, 0));
