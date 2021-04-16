/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IContentFilterElementResult {
  statusCode?: ec.StatusCode;
  operandStatusCodes?: ec.StatusCode[];
  operandDiagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class ContentFilterElementResult {
  statusCode: ec.StatusCode | null;
  operandStatusCodes: ec.StatusCode[];
  operandDiagnosticInfos: DiagnosticInfo[];

 constructor( options?: IContentFilterElementResult) {
  options = options || {};
  this.statusCode = (options.statusCode != null) ? options.statusCode : null;
  this.operandStatusCodes = (options.operandStatusCodes != null) ? options.operandStatusCodes : [];
  this.operandDiagnosticInfos = (options.operandDiagnosticInfos != null) ? options.operandDiagnosticInfos : [];

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.statusCode, out);
  ec.encodeArray(this.operandStatusCodes, out, ec.encodeStatusCode);
  ec.encodeArray(this.operandDiagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.statusCode = ec.decodeStatusCode(inp);
  this.operandStatusCodes = ec.decodeArray(inp, ec.decodeStatusCode);
  this.operandDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 toJSON() {
  const out: any = {};
  out.StatusCode = ec.jsonEncodeStatusCode(this.statusCode);
  out.OperandStatusCodes = ec.jsonEncodeArray(this.operandStatusCodes, ec.jsonEncodeStatusCode);
  out.OperandDiagnosticInfos = this.operandDiagnosticInfos;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.statusCode = ec.jsonDecodeStatusCode(inp.StatusCode);
  this.operandStatusCodes = ec.jsonDecodeArray( inp.OperandStatusCodes, ec.jsonDecodeStatusCode);
  this.operandDiagnosticInfos = ec.jsonDecodeStructArray( inp.OperandDiagnosticInfos,DiagnosticInfo);

 }


 clone( target?: ContentFilterElementResult): ContentFilterElementResult {
  if (!target) {
   target = new ContentFilterElementResult();
  }
  target.statusCode = this.statusCode;
  target.operandStatusCodes = ec.cloneArray(this.operandStatusCodes);
  if (this.operandDiagnosticInfos) { target.operandDiagnosticInfos = ec.cloneComplexArray(this.operandDiagnosticInfos); }
  return target;
 }


}
export function decodeContentFilterElementResult( inp: DataStream): ContentFilterElementResult {
  const obj = new ContentFilterElementResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ContentFilterElementResult', ContentFilterElementResult, new ExpandedNodeId(2 /*numeric id*/, 606, 0));
