/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export type IRequestHeader = Partial<RequestHeader>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16021}
*/

export class RequestHeader {
  authenticationToken: ec.NodeId;
  timestamp: Date;
  requestHandle: ec.UInt32;
  returnDiagnostics: ec.UInt32;
  auditEntryId: string | undefined;
  timeoutHint: ec.UInt32;
  additionalHeader: ExtensionObject | undefined;

 constructor( options?: IRequestHeader | undefined) {
  options = options || {};
  this.authenticationToken = (options.authenticationToken != null) ? options.authenticationToken : ec.NodeId.NullNodeId;
  this.timestamp = (options.timestamp != null) ? options.timestamp : new Date();
  this.requestHandle = (options.requestHandle != null) ? options.requestHandle : 0;
  this.returnDiagnostics = (options.returnDiagnostics != null) ? options.returnDiagnostics : 0;
  this.auditEntryId = options.auditEntryId;
  this.timeoutHint = (options.timeoutHint != null) ? options.timeoutHint : 0;
  this.additionalHeader = options.additionalHeader;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.authenticationToken, out);
  ec.encodeDateTime(this.timestamp, out);
  ec.encodeUInt32(this.requestHandle, out);
  ec.encodeUInt32(this.returnDiagnostics, out);
  ec.encodeString(this.auditEntryId, out);
  ec.encodeUInt32(this.timeoutHint, out);
  encodeExtensionObject(this.additionalHeader, out);

 }


 decode( inp: DataStream) {
  this.authenticationToken = ec.decodeNodeId(inp);
  this.timestamp = ec.decodeDateTime(inp);
  this.requestHandle = ec.decodeUInt32(inp);
  this.returnDiagnostics = ec.decodeUInt32(inp);
  this.auditEntryId = ec.decodeString(inp);
  this.timeoutHint = ec.decodeUInt32(inp);
  this.additionalHeader = decodeExtensionObject(inp);

 }


 toJSON() {
  const out: any = {};
  out.AuthenticationToken = ec.jsonEncodeNodeId(this.authenticationToken);
  out.Timestamp = ec.jsonEncodeDateTime(this.timestamp);
  out.RequestHandle = this.requestHandle;
  out.ReturnDiagnostics = this.returnDiagnostics;
  out.AuditEntryId = this.auditEntryId;
  out.TimeoutHint = this.timeoutHint;
  out.AdditionalHeader = jsonEncodeExtensionObject(this.additionalHeader);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.authenticationToken = ec.jsonDecodeNodeId(inp.AuthenticationToken);
  this.timestamp = ec.jsonDecodeDateTime(inp.Timestamp);
  this.requestHandle = inp.RequestHandle;
  this.returnDiagnostics = inp.ReturnDiagnostics;
  this.auditEntryId = inp.AuditEntryId;
  this.timeoutHint = inp.TimeoutHint;
  this.additionalHeader = jsonDecodeExtensionObject(inp.AdditionalHeader);

 }


 clone( target?: RequestHeader): RequestHeader {
  if (!target) {
   target = new RequestHeader();
  }
  target.authenticationToken = this.authenticationToken;
  target.timestamp = this.timestamp;
  target.requestHandle = this.requestHandle;
  target.returnDiagnostics = this.returnDiagnostics;
  target.auditEntryId = this.auditEntryId;
  target.timeoutHint = this.timeoutHint;
  target.additionalHeader = this.additionalHeader;
  return target;
 }


}
export function decodeRequestHeader( inp: DataStream): RequestHeader {
  const obj = new RequestHeader();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RequestHeader', RequestHeader, new ExpandedNodeId(2 /*numeric id*/, 391, 0));
