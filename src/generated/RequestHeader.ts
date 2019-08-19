

import * as ec from '../basic-types';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export interface IRequestHeader {
  authenticationToken?: ec.NodeId;
  timestamp?: Date;
  requestHandle?: ec.UInt32;
  returnDiagnostics?: ec.UInt32;
  auditEntryId?: string;
  timeoutHint?: ec.UInt32;
  additionalHeader?: ExtensionObject;
}

/**

*/

export class RequestHeader {
  authenticationToken: ec.NodeId;
  timestamp: Date;
  requestHandle: ec.UInt32;
  returnDiagnostics: ec.UInt32;
  auditEntryId: string;
  timeoutHint: ec.UInt32;
  additionalHeader: ExtensionObject;

 constructor( options?: IRequestHeader) {
  options = options || {};
  this.authenticationToken = (options.authenticationToken != null) ? options.authenticationToken : null;
  this.timestamp = (options.timestamp != null) ? options.timestamp : null;
  this.requestHandle = (options.requestHandle != null) ? options.requestHandle : null;
  this.returnDiagnostics = (options.returnDiagnostics != null) ? options.returnDiagnostics : null;
  this.auditEntryId = (options.auditEntryId != null) ? options.auditEntryId : null;
  this.timeoutHint = (options.timeoutHint != null) ? options.timeoutHint : null;
  this.additionalHeader = (options.additionalHeader != null) ? options.additionalHeader : null;

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RequestHeader', RequestHeader, makeExpandedNodeId(391, 0));
