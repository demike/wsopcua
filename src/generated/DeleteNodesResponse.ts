/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteNodesResponse {
  responseHeader?: ResponseHeader;
  results?: ec.StatusCode[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class DeleteNodesResponse {
  responseHeader: ResponseHeader;
  results: ec.StatusCode[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IDeleteNodesResponse) {
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
  this.results = ec.decodeArray(inp, ec.decodeStatusCode);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.Results = this.results.map(m => ec.jsonEncodeStatusCode);
  out.DiagnosticInfos = this.diagnosticInfos;
 return out;
 }


 fromJSON( inp: any) {
  this.responseHeader.fromJSON(inp);
  this.results = inp.Results.map(m => ec.jsonDecodeStatusCode);
  this.diagnosticInfos = inp.DiagnosticInfos.map(m => { const mem = new DiagnosticInfo(); mem.fromJSON(m); return mem;});

 }


 clone( target?: DeleteNodesResponse): DeleteNodesResponse {
  if (!target) {
   target = new DeleteNodesResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.results = ec.cloneArray(this.results);
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeDeleteNodesResponse( inp: DataStream): DeleteNodesResponse {
  const obj = new DeleteNodesResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DeleteNodesResponse', DeleteNodesResponse, new ExpandedNodeId(2 /*numeric id*/, 503, 0));
