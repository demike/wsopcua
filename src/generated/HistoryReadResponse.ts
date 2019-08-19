

import {ResponseHeader} from './ResponseHeader';
import {HistoryReadResult} from './HistoryReadResult';
import {decodeHistoryReadResult} from './HistoryReadResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryReadResponse {
  responseHeader?: ResponseHeader;
  results?: HistoryReadResult[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class HistoryReadResponse {
  responseHeader: ResponseHeader;
  results: HistoryReadResult[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IHistoryReadResponse) {
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
  this.results = ec.decodeArray(inp, decodeHistoryReadResult);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 clone( target?: HistoryReadResponse): HistoryReadResponse {
  if (!target) {
   target = new HistoryReadResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.results) { target.results = ec.cloneComplexArray(this.results); }
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeHistoryReadResponse( inp: DataStream): HistoryReadResponse {
  const obj = new HistoryReadResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryReadResponse', HistoryReadResponse, makeExpandedNodeId(667, 0));
