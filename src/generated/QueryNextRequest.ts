/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IQueryNextRequest = Partial<QueryNextRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16138}
*/

export class QueryNextRequest {
  requestHeader: RequestHeader;
  releaseContinuationPoint: boolean;
  continuationPoint: Uint8Array | null;

 constructor( options?: IQueryNextRequest | null) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.releaseContinuationPoint = (options.releaseContinuationPoint != null) ? options.releaseContinuationPoint : false;
  this.continuationPoint = (options.continuationPoint != null) ? options.continuationPoint : null;

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeBoolean(this.releaseContinuationPoint, out);
  ec.encodeByteString(this.continuationPoint, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.releaseContinuationPoint = ec.decodeBoolean(inp);
  this.continuationPoint = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.ReleaseContinuationPoint = this.releaseContinuationPoint;
  out.ContinuationPoint = ec.jsonEncodeByteString(this.continuationPoint);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.releaseContinuationPoint = inp.ReleaseContinuationPoint;
  this.continuationPoint = ec.jsonDecodeByteString(inp.ContinuationPoint);

 }


 clone( target?: QueryNextRequest): QueryNextRequest {
  if (!target) {
   target = new QueryNextRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.releaseContinuationPoint = this.releaseContinuationPoint;
  target.continuationPoint = this.continuationPoint;
  return target;
 }


}
export function decodeQueryNextRequest( inp: DataStream): QueryNextRequest {
  const obj = new QueryNextRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('QueryNextRequest', QueryNextRequest, new ExpandedNodeId(2 /*numeric id*/, 621, 0));
