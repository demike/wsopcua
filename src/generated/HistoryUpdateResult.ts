/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export type IHistoryUpdateResult = Partial<HistoryUpdateResult>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16170}
*/

export class HistoryUpdateResult {
  statusCode: ec.StatusCode;
  operationResults: (ec.StatusCode)[];
  diagnosticInfos: (DiagnosticInfo)[];

 constructor( options?: IHistoryUpdateResult | undefined) {
  options = options || {};
  this.statusCode = (options.statusCode != null) ? options.statusCode : ec.StatusCodes.Good;
  this.operationResults = (options.operationResults != null) ? options.operationResults : [];
  this.diagnosticInfos = (options.diagnosticInfos != null) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.statusCode, out);
  ec.encodeArray(this.operationResults, out, ec.encodeStatusCode);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.statusCode = ec.decodeStatusCode(inp);
  this.operationResults = ec.decodeArray(inp, ec.decodeStatusCode) ?? [];
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.StatusCode = ec.jsonEncodeStatusCode(this.statusCode);
  out.OperationResults = ec.jsonEncodeArray(this.operationResults, ec.jsonEncodeStatusCode);
  out.DiagnosticInfos = this.diagnosticInfos;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.statusCode = ec.jsonDecodeStatusCode(inp.StatusCode);
  this.operationResults = ec.jsonDecodeArray( inp.OperationResults, ec.jsonDecodeStatusCode);
  this.diagnosticInfos = ec.jsonDecodeStructArray( inp.DiagnosticInfos,DiagnosticInfo);

 }


 clone( target?: HistoryUpdateResult): HistoryUpdateResult {
  if (!target) {
   target = new HistoryUpdateResult();
  }
  target.statusCode = this.statusCode;
  target.operationResults = ec.cloneArray(this.operationResults);
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeHistoryUpdateResult( inp: DataStream): HistoryUpdateResult {
  const obj = new HistoryUpdateResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryUpdateResult', HistoryUpdateResult, new ExpandedNodeId(2 /*numeric id*/, 697, 0));
