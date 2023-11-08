/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export type ISetTriggeringResponse = Partial<SetTriggeringResponse>;

/**

*/

export class SetTriggeringResponse {
  responseHeader: ResponseHeader;
  addResults: (ec.StatusCode)[];
  addDiagnosticInfos: (DiagnosticInfo)[];
  removeResults: (ec.StatusCode)[];
  removeDiagnosticInfos: (DiagnosticInfo)[];

 constructor( options?: ISetTriggeringResponse | null) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.addResults = (options.addResults != null) ? options.addResults : [];
  this.addDiagnosticInfos = (options.addDiagnosticInfos != null) ? options.addDiagnosticInfos : [];
  this.removeResults = (options.removeResults != null) ? options.removeResults : [];
  this.removeDiagnosticInfos = (options.removeDiagnosticInfos != null) ? options.removeDiagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.addResults, out, ec.encodeStatusCode);
  ec.encodeArray(this.addDiagnosticInfos, out);
  ec.encodeArray(this.removeResults, out, ec.encodeStatusCode);
  ec.encodeArray(this.removeDiagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.addResults = ec.decodeArray(inp, ec.decodeStatusCode) ?? [];
  this.addDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo) ?? [];
  this.removeResults = ec.decodeArray(inp, ec.decodeStatusCode) ?? [];
  this.removeDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.AddResults = ec.jsonEncodeArray(this.addResults, ec.jsonEncodeStatusCode);
  out.AddDiagnosticInfos = this.addDiagnosticInfos;
  out.RemoveResults = ec.jsonEncodeArray(this.removeResults, ec.jsonEncodeStatusCode);
  out.RemoveDiagnosticInfos = this.removeDiagnosticInfos;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.addResults = ec.jsonDecodeArray( inp.AddResults, ec.jsonDecodeStatusCode);
  this.addDiagnosticInfos = ec.jsonDecodeStructArray( inp.AddDiagnosticInfos,DiagnosticInfo);
  this.removeResults = ec.jsonDecodeArray( inp.RemoveResults, ec.jsonDecodeStatusCode);
  this.removeDiagnosticInfos = ec.jsonDecodeStructArray( inp.RemoveDiagnosticInfos,DiagnosticInfo);

 }


 clone( target?: SetTriggeringResponse): SetTriggeringResponse {
  if (!target) {
   target = new SetTriggeringResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.addResults = ec.cloneArray(this.addResults);
  if (this.addDiagnosticInfos) { target.addDiagnosticInfos = ec.cloneComplexArray(this.addDiagnosticInfos); }
  target.removeResults = ec.cloneArray(this.removeResults);
  if (this.removeDiagnosticInfos) { target.removeDiagnosticInfos = ec.cloneComplexArray(this.removeDiagnosticInfos); }
  return target;
 }


}
export function decodeSetTriggeringResponse( inp: DataStream): SetTriggeringResponse {
  const obj = new SetTriggeringResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SetTriggeringResponse', SetTriggeringResponse, new ExpandedNodeId(2 /*numeric id*/, 778, 0));
