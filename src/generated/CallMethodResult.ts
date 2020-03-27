/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {Variant} from '../variant';
import {decodeVariant} from '../variant';
import {DataStream} from '../basic-types/DataStream';

export interface ICallMethodResult {
  statusCode?: ec.StatusCode;
  inputArgumentResults?: ec.StatusCode[];
  inputArgumentDiagnosticInfos?: DiagnosticInfo[];
  outputArguments?: Variant[];
}

/**

*/

export class CallMethodResult {
  statusCode: ec.StatusCode | null;
  inputArgumentResults: ec.StatusCode[];
  inputArgumentDiagnosticInfos: DiagnosticInfo[];
  outputArguments: Variant[];

 constructor( options?: ICallMethodResult) {
  options = options || {};
  this.statusCode = (options.statusCode != null) ? options.statusCode : null;
  this.inputArgumentResults = (options.inputArgumentResults != null) ? options.inputArgumentResults : [];
  this.inputArgumentDiagnosticInfos = (options.inputArgumentDiagnosticInfos != null) ? options.inputArgumentDiagnosticInfos : [];
  this.outputArguments = (options.outputArguments != null) ? options.outputArguments : [];

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.statusCode, out);
  ec.encodeArray(this.inputArgumentResults, out, ec.encodeStatusCode);
  ec.encodeArray(this.inputArgumentDiagnosticInfos, out);
  ec.encodeArray(this.outputArguments, out);

 }


 decode( inp: DataStream) {
  this.statusCode = ec.decodeStatusCode(inp);
  this.inputArgumentResults = ec.decodeArray(inp, ec.decodeStatusCode);
  this.inputArgumentDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
  this.outputArguments = ec.decodeArray(inp, decodeVariant);

 }


 toJSON() {
  const out: any = {};
  out.StatusCode = ec.jsonEncodeStatusCode(this.statusCode);
  out.InputArgumentResults = this.inputArgumentResults.map(m => ec.jsonEncodeStatusCode);
  out.InputArgumentDiagnosticInfos = this.inputArgumentDiagnosticInfos;
  out.OutputArguments = this.outputArguments;
 return out;
 }


 fromJSON( inp: any) {
  this.statusCode  = ec.jsonDecodeStatusCode(inp.StatusCode);
  this.inputArgumentResults = inp.InputArgumentResults.map(m => ec.jsonDecodeStatusCode);
  this.inputArgumentDiagnosticInfos = inp.InputArgumentDiagnosticInfos.map(m => { const mem = new DiagnosticInfo(); mem.fromJSON(m); return mem;});
  this.outputArguments = inp.OutputArguments.map(m => { const mem = new Variant(); mem.fromJSON(m); return mem;});

 }


 clone( target?: CallMethodResult): CallMethodResult {
  if (!target) {
   target = new CallMethodResult();
  }
  target.statusCode = this.statusCode;
  target.inputArgumentResults = ec.cloneArray(this.inputArgumentResults);
  if (this.inputArgumentDiagnosticInfos) { target.inputArgumentDiagnosticInfos = ec.cloneComplexArray(this.inputArgumentDiagnosticInfos); }
  if (this.outputArguments) { target.outputArguments = ec.cloneComplexArray(this.outputArguments); }
  return target;
 }


}
export function decodeCallMethodResult( inp: DataStream): CallMethodResult {
  const obj = new CallMethodResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CallMethodResult', CallMethodResult, new ExpandedNodeId(2 /*numeric id*/, 709, 0));
