/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

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

 * {@link https://reference.opcfoundation.org/nodesets/4/16186}
*/

export class EventFilterResult extends MonitoringFilterResult {
  selectClauseResults: ec.StatusCode[];
  selectClauseDiagnosticInfos: DiagnosticInfo[];
  whereClauseResult: ContentFilterResult;

 constructor( options?: IEventFilterResult) {
  options = options || {};
  super();
  this.selectClauseResults = (options.selectClauseResults != null) ? options.selectClauseResults : [];
  this.selectClauseDiagnosticInfos = (options.selectClauseDiagnosticInfos != null) ? options.selectClauseDiagnosticInfos : [];
  this.whereClauseResult = (options.whereClauseResult != null) ? options.whereClauseResult : new ContentFilterResult();

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


 toJSON() {
  const out: any = {};
  out.SelectClauseResults = ec.jsonEncodeArray(this.selectClauseResults, ec.jsonEncodeStatusCode);
  out.SelectClauseDiagnosticInfos = this.selectClauseDiagnosticInfos;
  out.WhereClauseResult = this.whereClauseResult;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.selectClauseResults = ec.jsonDecodeArray( inp.SelectClauseResults, ec.jsonDecodeStatusCode);
  this.selectClauseDiagnosticInfos = ec.jsonDecodeStructArray( inp.SelectClauseDiagnosticInfos,DiagnosticInfo);
  this.whereClauseResult.fromJSON(inp.WhereClauseResult);

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EventFilterResult', EventFilterResult, new ExpandedNodeId(2 /*numeric id*/, 734, 0));
