/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export type ISetMonitoringModeResponse = Partial<SetMonitoringModeResponse>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16198}
*/

export class SetMonitoringModeResponse {
  responseHeader: ResponseHeader;
  results: (ec.StatusCode)[];
  diagnosticInfos: (DiagnosticInfo)[];

 constructor( options?: ISetMonitoringModeResponse | null) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.results = (options.results != null) ? options.results : [];
  this.diagnosticInfos = (options.diagnosticInfos != null) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.results, out, ec.encodeStatusCode);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.results = ec.decodeArray(inp, ec.decodeStatusCode) ?? [];
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.Results = ec.jsonEncodeArray(this.results, ec.jsonEncodeStatusCode);
  out.DiagnosticInfos = this.diagnosticInfos;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.results = ec.jsonDecodeArray( inp.Results, ec.jsonDecodeStatusCode);
  this.diagnosticInfos = ec.jsonDecodeStructArray( inp.DiagnosticInfos,DiagnosticInfo);

 }


 clone( target?: SetMonitoringModeResponse): SetMonitoringModeResponse {
  if (!target) {
   target = new SetMonitoringModeResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.results = ec.cloneArray(this.results);
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeSetMonitoringModeResponse( inp: DataStream): SetMonitoringModeResponse {
  const obj = new SetMonitoringModeResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SetMonitoringModeResponse', SetMonitoringModeResponse, new ExpandedNodeId(2 /*numeric id*/, 772, 0));
