/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from '.';
import {DataStream} from '../basic-types';

export interface IUnregisterNodesResponse {
  responseHeader?: ResponseHeader;
}

/**

*/

export class UnregisterNodesResponse {
  responseHeader: ResponseHeader;

 constructor( options?: IUnregisterNodesResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);

 }


 clone( target?: UnregisterNodesResponse): UnregisterNodesResponse {
  if (!target) {
   target = new UnregisterNodesResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  return target;
 }


}
export function decodeUnregisterNodesResponse( inp: DataStream): UnregisterNodesResponse {
  const obj = new UnregisterNodesResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('UnregisterNodesResponse', UnregisterNodesResponse, new ExpandedNodeId(2 /*numeric id*/, 569, 0));
