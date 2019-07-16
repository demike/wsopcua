

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {ContentFilterResult} from './ContentFilterResult';
import {DataStream} from '../basic-types/DataStream';
import {MonitoringFilterResult} from './MonitoringFilterResult';

export interface IEventFilterResult {
  selectClauseResults?: ec.StatusCode[];
  selectClauseDiagnosticInfos?: DiagnosticInfo[];
  whereClauseResult?: ContentFilterResult;
}

/**

*/

export class EventFilterResult extends MonitoringFilterResult {
  selectClauseResults: ec.StatusCode[];
  selectClauseDiagnosticInfos: DiagnosticInfo[];
  whereClauseResult: ContentFilterResult;

 constructor( options?: IEventFilterResult) {
  options = options || {};
  super();
  this.selectClauseResults = (options.selectClauseResults !== undefined) ? options.selectClauseResults : [];
  this.selectClauseDiagnosticInfos = (options.selectClauseDiagnosticInfos !== undefined) ? options.selectClauseDiagnosticInfos : [];
  this.whereClauseResult = (options.whereClauseResult !== undefined) ? options.whereClauseResult : new ContentFilterResult();

 }


 encode( out: DataStream) {
  ec.encodeArray(this.selectClauseResults, out, ec.encodeStatusCode);
  ec.encodeArray(this.selectClauseDiagnosticInfos, out);
  this.whereClauseResult.encode(out);

 }


 decode( inp: DataStream) {
  this.selectClauseResults = ec.decodeArray(inp, ec.decodeStatusCode);
  this.selectClauseDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
  this.whereClauseResult.decode(inp);

 }


 clone( target?: EventFilterResult): EventFilterResult {
  if (!target) {
   target = new EventFilterResult();
  }
  target.selectClauseResults = ec.cloneArray(this.selectClauseResults);
  if (this.selectClauseDiagnosticInfos) { target.selectClauseDiagnosticInfos = ec.cloneComplexArray(this.selectClauseDiagnosticInfos); }
  if (this.whereClauseResult) { target.whereClauseResult = this.whereClauseResult.clone(); }
  return target;
 }


}
export function decodeEventFilterResult( inp: DataStream): EventFilterResult {
  const obj = new EventFilterResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EventFilterResult', EventFilterResult, makeExpandedNodeId(736, 0));
