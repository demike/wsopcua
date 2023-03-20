/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode} from './MessageSecurityMode';
import {DataStream} from '../basic-types/DataStream';

export interface ISessionSecurityDiagnosticsDataType {
  sessionId?: ec.NodeId;
  clientUserIdOfSession?: string;
  clientUserIdHistory?: string[];
  authenticationMechanism?: string;
  encoding?: string;
  transportProtocol?: string;
  securityMode?: MessageSecurityMode;
  securityPolicyUri?: string;
  clientCertificate?: Uint8Array;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16237}
*/

export class SessionSecurityDiagnosticsDataType {
  sessionId: ec.NodeId;
  clientUserIdOfSession: string | null;
  clientUserIdHistory: string[];
  authenticationMechanism: string | null;
  encoding: string | null;
  transportProtocol: string | null;
  securityMode: MessageSecurityMode;
  securityPolicyUri: string | null;
  clientCertificate: Uint8Array | null;

 constructor( options?: ISessionSecurityDiagnosticsDataType) {
  options = options || {};
  this.sessionId = (options.sessionId != null) ? options.sessionId : ec.NodeId.NullNodeId;
  this.clientUserIdOfSession = (options.clientUserIdOfSession != null) ? options.clientUserIdOfSession : null;
  this.clientUserIdHistory = (options.clientUserIdHistory != null) ? options.clientUserIdHistory : [];
  this.authenticationMechanism = (options.authenticationMechanism != null) ? options.authenticationMechanism : null;
  this.encoding = (options.encoding != null) ? options.encoding : null;
  this.transportProtocol = (options.transportProtocol != null) ? options.transportProtocol : null;
  this.securityMode = (options.securityMode != null) ? options.securityMode : null;
  this.securityPolicyUri = (options.securityPolicyUri != null) ? options.securityPolicyUri : null;
  this.clientCertificate = (options.clientCertificate != null) ? options.clientCertificate : null;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.sessionId, out);
  ec.encodeString(this.clientUserIdOfSession, out);
  ec.encodeArray(this.clientUserIdHistory, out, ec.encodeString);
  ec.encodeString(this.authenticationMechanism, out);
  ec.encodeString(this.encoding, out);
  ec.encodeString(this.transportProtocol, out);
  encodeMessageSecurityMode(this.securityMode, out);
  ec.encodeString(this.securityPolicyUri, out);
  ec.encodeByteString(this.clientCertificate, out);

 }


 decode( inp: DataStream) {
  this.sessionId = ec.decodeNodeId(inp);
  this.clientUserIdOfSession = ec.decodeString(inp);
  this.clientUserIdHistory = ec.decodeArray(inp, ec.decodeString);
  this.authenticationMechanism = ec.decodeString(inp);
  this.encoding = ec.decodeString(inp);
  this.transportProtocol = ec.decodeString(inp);
  this.securityMode = decodeMessageSecurityMode(inp);
  this.securityPolicyUri = ec.decodeString(inp);
  this.clientCertificate = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = {};
  out.SessionId = ec.jsonEncodeNodeId(this.sessionId);
  out.ClientUserIdOfSession = this.clientUserIdOfSession;
  out.ClientUserIdHistory = this.clientUserIdHistory;
  out.AuthenticationMechanism = this.authenticationMechanism;
  out.Encoding = this.encoding;
  out.TransportProtocol = this.transportProtocol;
  out.SecurityMode = this.securityMode;
  out.SecurityPolicyUri = this.securityPolicyUri;
  out.ClientCertificate = ec.jsonEncodeByteString(this.clientCertificate);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.sessionId = ec.jsonDecodeNodeId(inp.SessionId);
  this.clientUserIdOfSession = inp.ClientUserIdOfSession;
  this.clientUserIdHistory = inp.ClientUserIdHistory;
  this.authenticationMechanism = inp.AuthenticationMechanism;
  this.encoding = inp.Encoding;
  this.transportProtocol = inp.TransportProtocol;
  this.securityMode = inp.SecurityMode;
  this.securityPolicyUri = inp.SecurityPolicyUri;
  this.clientCertificate = ec.jsonDecodeByteString(inp.ClientCertificate);

 }


 clone( target?: SessionSecurityDiagnosticsDataType): SessionSecurityDiagnosticsDataType {
  if (!target) {
   target = new SessionSecurityDiagnosticsDataType();
  }
  target.sessionId = this.sessionId;
  target.clientUserIdOfSession = this.clientUserIdOfSession;
  target.clientUserIdHistory = ec.cloneArray(this.clientUserIdHistory);
  target.authenticationMechanism = this.authenticationMechanism;
  target.encoding = this.encoding;
  target.transportProtocol = this.transportProtocol;
  target.securityMode = this.securityMode;
  target.securityPolicyUri = this.securityPolicyUri;
  target.clientCertificate = this.clientCertificate;
  return target;
 }


}
export function decodeSessionSecurityDiagnosticsDataType( inp: DataStream): SessionSecurityDiagnosticsDataType {
  const obj = new SessionSecurityDiagnosticsDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SessionSecurityDiagnosticsDataType', SessionSecurityDiagnosticsDataType, new ExpandedNodeId(2 /*numeric id*/, 868, 0));
