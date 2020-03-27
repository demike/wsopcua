/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ICloseSessionRequest {
  requestHeader?: RequestHeader;
  deleteSubscriptions?: boolean;
}

/**

*/

export class CloseSessionRequest {
  requestHeader: RequestHeader;
  deleteSubscriptions: boolean;

 constructor( options?: ICloseSessionRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.deleteSubscriptions = (options.deleteSubscriptions != null) ? options.deleteSubscriptions : false;

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeBoolean(this.deleteSubscriptions, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.deleteSubscriptions = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.DeleteSubscriptions = this.deleteSubscriptions;
 return out;
 }


 fromJSON( inp: any) {
  this.requestHeader.fromJSON(inp);
  this.deleteSubscriptions = inp.DeleteSubscriptions;

 }


 clone( target?: CloseSessionRequest): CloseSessionRequest {
  if (!target) {
   target = new CloseSessionRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.deleteSubscriptions = this.deleteSubscriptions;
  return target;
 }


}
export function decodeCloseSessionRequest( inp: DataStream): CloseSessionRequest {
  const obj = new CloseSessionRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CloseSessionRequest', CloseSessionRequest, new ExpandedNodeId(2 /*numeric id*/, 473, 0));
