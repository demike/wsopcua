/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
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

 * {@link https://reference.opcfoundation.org/nodesets/4/16022}
*/

export class ResponseHeader {
  timestamp: Date;
  requestHandle: ec.UInt32;
  serviceResult: ec.StatusCode | null;
  serviceDiagnostics: DiagnosticInfo;
  stringTable: string[];
  additionalHeader: ExtensionObject | null;

 constructor( options?: IResponseHeader) {
  options = options || {};
  this.timestamp = (options.timestamp != null) ? options.timestamp : new Date();
  this.requestHandle = (options.requestHandle != null) ? options.requestHandle : 0;
  this.serviceResult = (options.serviceResult != null) ? options.serviceResult : null;
  this.serviceDiagnostics = (options.serviceDiagnostics != null) ? options.serviceDiagnostics : new DiagnosticInfo();
  this.stringTable = (options.stringTable != null) ? options.stringTable : [];
  this.additionalHeader = (options.additionalHeader != null) ? options.additionalHeader : null;

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
  this.stringTable = ec.decodeArray(inp, ec.decodeString) ?? [];
  this.additionalHeader = decodeExtensionObject(inp);

 }


 toJSON() {
  const out: any = {};
  out.Timestamp = ec.jsonEncodeDateTime(this.timestamp);
  out.RequestHandle = this.requestHandle;
  out.ServiceResult = ec.jsonEncodeStatusCode(this.serviceResult);
  out.ServiceDiagnostics = this.serviceDiagnostics;
  out.StringTable = this.stringTable;
  out.AdditionalHeader = jsonEncodeExtensionObject(this.additionalHeader);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.timestamp = ec.jsonDecodeDateTime(inp.Timestamp);
  this.requestHandle = inp.RequestHandle;
  this.serviceResult = ec.jsonDecodeStatusCode(inp.ServiceResult);
  this.serviceDiagnostics.fromJSON(inp.ServiceDiagnostics);
  this.stringTable = inp.StringTable;
  this.additionalHeader = jsonDecodeExtensionObject(inp.AdditionalHeader);

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ResponseHeader', ResponseHeader, new ExpandedNodeId(2 /*numeric id*/, 394, 0));
