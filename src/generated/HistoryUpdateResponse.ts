

import {ResponseHeader} from './ResponseHeader';
import {HistoryUpdateResult} from './HistoryUpdateResult';
import {decodeHistoryUpdateResult} from './HistoryUpdateResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryUpdateResponse {
  responseHeader?: ResponseHeader;
  results?: HistoryUpdateResult[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class HistoryUpdateResponse {
  responseHeader: ResponseHeader;
  results: HistoryUpdateResult[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IHistoryUpdateResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader !== undefined) ? options.responseHeader : new ResponseHeader();
  this.results = (options.results !== undefined) ? options.results : [];
  this.diagnosticInfos = (options.diagnosticInfos !== undefined) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.results, out);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.results = ec.decodeArray(inp, decodeHistoryUpdateResult);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 clone( target?: HistoryUpdateResponse): HistoryUpdateResponse {
  if (!target) {
   target = new HistoryUpdateResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.results) { target.results = ec.cloneComplexArray(this.results); }
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeHistoryUpdateResponse( inp: DataStream): HistoryUpdateResponse {
  const obj = new HistoryUpdateResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryUpdateResponse', HistoryUpdateResponse, makeExpandedNodeId(703, 0));
