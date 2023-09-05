/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export type IParsingResult = Partial<ParsingResult>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16135}
*/

export class ParsingResult {
  statusCode: ec.StatusCode | null;
  dataStatusCodes: ec.StatusCode[];
  dataDiagnosticInfos: DiagnosticInfo[];

 constructor( options?: IParsingResult) {
  options = options || {};
  this.statusCode = (options.statusCode != null) ? options.statusCode : null;
  this.dataStatusCodes = (options.dataStatusCodes != null) ? options.dataStatusCodes : [];
  this.dataDiagnosticInfos = (options.dataDiagnosticInfos != null) ? options.dataDiagnosticInfos : [];

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.statusCode, out);
  ec.encodeArray(this.dataStatusCodes, out, ec.encodeStatusCode);
  ec.encodeArray(this.dataDiagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.statusCode = ec.decodeStatusCode(inp);
  this.dataStatusCodes = ec.decodeArray(inp, ec.decodeStatusCode) ?? [];
  this.dataDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.StatusCode = ec.jsonEncodeStatusCode(this.statusCode);
  out.DataStatusCodes = ec.jsonEncodeArray(this.dataStatusCodes, ec.jsonEncodeStatusCode);
  out.DataDiagnosticInfos = this.dataDiagnosticInfos;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.statusCode = ec.jsonDecodeStatusCode(inp.StatusCode);
  this.dataStatusCodes = ec.jsonDecodeArray( inp.DataStatusCodes, ec.jsonDecodeStatusCode);
  this.dataDiagnosticInfos = ec.jsonDecodeStructArray( inp.DataDiagnosticInfos,DiagnosticInfo);

 }


 clone( target?: ParsingResult): ParsingResult {
  if (!target) {
   target = new ParsingResult();
  }
  target.statusCode = this.statusCode;
  target.dataStatusCodes = ec.cloneArray(this.dataStatusCodes);
  if (this.dataDiagnosticInfos) { target.dataDiagnosticInfos = ec.cloneComplexArray(this.dataDiagnosticInfos); }
  return target;
 }


}
export function decodeParsingResult( inp: DataStream): ParsingResult {
  const obj = new ParsingResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ParsingResult', ParsingResult, new ExpandedNodeId(2 /*numeric id*/, 612, 0));
