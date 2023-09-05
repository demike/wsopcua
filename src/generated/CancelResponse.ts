/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ICancelResponse = Partial<CancelResponse>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16069}
*/

export class CancelResponse {
  responseHeader: ResponseHeader;
  cancelCount: ec.UInt32;

 constructor( options?: ICancelResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.cancelCount = (options.cancelCount != null) ? options.cancelCount : 0;

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeUInt32(this.cancelCount, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.cancelCount = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.CancelCount = this.cancelCount;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.cancelCount = inp.CancelCount;

 }


 clone( target?: CancelResponse): CancelResponse {
  if (!target) {
   target = new CancelResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.cancelCount = this.cancelCount;
  return target;
 }


}
export function decodeCancelResponse( inp: DataStream): CancelResponse {
  const obj = new CancelResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CancelResponse', CancelResponse, new ExpandedNodeId(2 /*numeric id*/, 482, 0));
