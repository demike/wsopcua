

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IQueryNextRequest {
  requestHeader?: RequestHeader;
  releaseContinuationPoint?: boolean;
  continuationPoint?: Uint8Array;
}

/**

*/

export class QueryNextRequest {
  requestHeader: RequestHeader;
  releaseContinuationPoint: boolean;
  continuationPoint: Uint8Array;

 constructor( options?: IQueryNextRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.releaseContinuationPoint = (options.releaseContinuationPoint != null) ? options.releaseContinuationPoint : null;
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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('QueryNextRequest', QueryNextRequest, makeExpandedNodeId(621, 0));
