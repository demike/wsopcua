

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export interface IResponseHeader {
  timestamp?: Date;
  requestHandle?: ec.UInt32;
  serviceResult?: ec.StatusCode;
  serviceDiagnostics?: DiagnosticInfo;
  stringTable?: string[];
  additionalHeader?: ExtensionObject;
}

/**

*/

export class ResponseHeader {
  timestamp: Date;
  requestHandle: ec.UInt32;
  serviceResult: ec.StatusCode;
  serviceDiagnostics: DiagnosticInfo;
  stringTable: string[];
  additionalHeader: ExtensionObject;

 constructor( options?: IResponseHeader) {
  options = options || {};
  this.timestamp = (options.timestamp !== undefined) ? options.timestamp : null;
  this.requestHandle = (options.requestHandle !== undefined) ? options.requestHandle : null;
  this.serviceResult = (options.serviceResult !== undefined) ? options.serviceResult : null;
  this.serviceDiagnostics = (options.serviceDiagnostics !== undefined) ? options.serviceDiagnostics : new DiagnosticInfo();
  this.stringTable = (options.stringTable !== undefined) ? options.stringTable : [];
  this.additionalHeader = (options.additionalHeader !== undefined) ? options.additionalHeader : null;

 }


 encode( out: DataStream) {
  ec.encodeDateTime(this.timestamp, out);
  ec.encodeUInt32(this.requestHandle, out);
  ec.encodeStatusCode(this.serviceResult, out);
  this.serviceDiagnostics.encode(out);
  ec.encodeArray(this.stringTable, out, ec.encodeString);
  encodeExtensionObject(this.additionalHeader, out);

 }


 decode( inp: DataStream) {
  this.timestamp = ec.decodeDateTime(inp);
  this.requestHandle = ec.decodeUInt32(inp);
  this.serviceResult = ec.decodeStatusCode(inp);
  this.serviceDiagnostics.decode(inp);
  this.stringTable = ec.decodeArray(inp, ec.decodeString);
  this.additionalHeader = decodeExtensionObject(inp);

 }


 clone( target?: ResponseHeader): ResponseHeader {
  if (!target) {
   target = new ResponseHeader();
  }
  target.timestamp = this.timestamp;
  target.requestHandle = this.requestHandle;
  target.serviceResult = this.serviceResult;
  if (this.serviceDiagnostics) { target.serviceDiagnostics = this.serviceDiagnostics.clone(); }
  target.stringTable = ec.cloneArray(this.stringTable);
  target.additionalHeader = this.additionalHeader;
  return target;
 }


}
export function decodeResponseHeader( inp: DataStream): ResponseHeader {
  const obj = new ResponseHeader();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ResponseHeader', ResponseHeader, makeExpandedNodeId(394, 0));
