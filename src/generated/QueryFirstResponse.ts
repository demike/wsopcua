/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import {QueryDataSet} from './QueryDataSet';
import {decodeQueryDataSet} from './QueryDataSet';
import * as ec from '../basic-types';
import {ParsingResult} from './ParsingResult';
import {decodeParsingResult} from './ParsingResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {ContentFilterResult} from './ContentFilterResult';
import {DataStream} from '../basic-types/DataStream';

export type IQueryFirstResponse = Partial<QueryFirstResponse>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16137}
*/

export class QueryFirstResponse {
  responseHeader: ResponseHeader;
  queryDataSets: (QueryDataSet)[];
  continuationPoint: Uint8Array | null;
  parsingResults: (ParsingResult)[];
  diagnosticInfos: (DiagnosticInfo)[];
  filterResult: ContentFilterResult;

 constructor( options?: IQueryFirstResponse | null) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.queryDataSets = (options.queryDataSets != null) ? options.queryDataSets : [];
  this.continuationPoint = (options.continuationPoint != null) ? options.continuationPoint : null;
  this.parsingResults = (options.parsingResults != null) ? options.parsingResults : [];
  this.diagnosticInfos = (options.diagnosticInfos != null) ? options.diagnosticInfos : [];
  this.filterResult = (options.filterResult != null) ? options.filterResult : new ContentFilterResult();

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.queryDataSets, out);
  ec.encodeByteString(this.continuationPoint, out);
  ec.encodeArray(this.parsingResults, out);
  ec.encodeArray(this.diagnosticInfos, out);
  this.filterResult.encode(out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.queryDataSets = ec.decodeArray(inp, decodeQueryDataSet) ?? [];
  this.continuationPoint = ec.decodeByteString(inp);
  this.parsingResults = ec.decodeArray(inp, decodeParsingResult) ?? [];
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo) ?? [];
  this.filterResult.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.QueryDataSets = this.queryDataSets;
  out.ContinuationPoint = ec.jsonEncodeByteString(this.continuationPoint);
  out.ParsingResults = this.parsingResults;
  out.DiagnosticInfos = this.diagnosticInfos;
  out.FilterResult = this.filterResult;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.queryDataSets = ec.jsonDecodeStructArray( inp.QueryDataSets,QueryDataSet);
  this.continuationPoint = ec.jsonDecodeByteString(inp.ContinuationPoint);
  this.parsingResults = ec.jsonDecodeStructArray( inp.ParsingResults,ParsingResult);
  this.diagnosticInfos = ec.jsonDecodeStructArray( inp.DiagnosticInfos,DiagnosticInfo);
  this.filterResult.fromJSON(inp.FilterResult);

 }


 clone( target?: QueryFirstResponse): QueryFirstResponse {
  if (!target) {
   target = new QueryFirstResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.queryDataSets) { target.queryDataSets = ec.cloneComplexArray(this.queryDataSets); }
  target.continuationPoint = this.continuationPoint;
  if (this.parsingResults) { target.parsingResults = ec.cloneComplexArray(this.parsingResults); }
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  if (this.filterResult) { target.filterResult = this.filterResult.clone(); }
  return target;
 }


}
export function decodeQueryFirstResponse( inp: DataStream): QueryFirstResponse {
  const obj = new QueryFirstResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('QueryFirstResponse', QueryFirstResponse, new ExpandedNodeId(2 /*numeric id*/, 618, 0));
