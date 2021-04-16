/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from '.';
import {TransferResult} from '.';
import {decodeTransferResult} from '.';
import {DiagnosticInfo} from '.';
import {decodeDiagnosticInfo} from '.';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types';

export interface ITransferSubscriptionsResponse {
  responseHeader?: ResponseHeader;
  results?: TransferResult[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class TransferSubscriptionsResponse {
  responseHeader: ResponseHeader;
  results: TransferResult[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: ITransferSubscriptionsResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.results = (options.results != null) ? options.results : [];
  this.diagnosticInfos = (options.diagnosticInfos != null) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.results, out);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.results = ec.decodeArray(inp, decodeTransferResult);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.Results = this.results;
  out.DiagnosticInfos = this.diagnosticInfos;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.results = ec.jsonDecodeStructArray( inp.Results,TransferResult);
  this.diagnosticInfos = ec.jsonDecodeStructArray( inp.DiagnosticInfos,DiagnosticInfo);

 }


 clone( target?: TransferSubscriptionsResponse): TransferSubscriptionsResponse {
  if (!target) {
   target = new TransferSubscriptionsResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.results) { target.results = ec.cloneComplexArray(this.results); }
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeTransferSubscriptionsResponse( inp: DataStream): TransferSubscriptionsResponse {
  const obj = new TransferSubscriptionsResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('TransferSubscriptionsResponse', TransferSubscriptionsResponse, new ExpandedNodeId(2 /*numeric id*/, 844, 0));
