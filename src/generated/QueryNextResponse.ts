/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import {QueryDataSet} from './QueryDataSet';
import {decodeQueryDataSet} from './QueryDataSet';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IQueryNextResponse {
  responseHeader?: ResponseHeader;
  queryDataSets?: QueryDataSet[];
  revisedContinuationPoint?: Uint8Array;
}

/**

*/

export class QueryNextResponse {
  responseHeader: ResponseHeader;
  queryDataSets: QueryDataSet[];
  revisedContinuationPoint: Uint8Array | null;

 constructor( options?: IQueryNextResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.queryDataSets = (options.queryDataSets != null) ? options.queryDataSets : [];
  this.revisedContinuationPoint = (options.revisedContinuationPoint != null) ? options.revisedContinuationPoint : null;

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.queryDataSets, out);
  ec.encodeByteString(this.revisedContinuationPoint, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.queryDataSets = ec.decodeArray(inp, decodeQueryDataSet);
  this.revisedContinuationPoint = ec.decodeByteString(inp);

 }


 clone( target?: QueryNextResponse): QueryNextResponse {
  if (!target) {
   target = new QueryNextResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.queryDataSets) { target.queryDataSets = ec.cloneComplexArray(this.queryDataSets); }
  target.revisedContinuationPoint = this.revisedContinuationPoint;
  return target;
 }


}
export function decodeQueryNextResponse( inp: DataStream): QueryNextResponse {
  const obj = new QueryNextResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('QueryNextResponse', QueryNextResponse, new ExpandedNodeId(2 /*numeric id*/, 624, 0));
