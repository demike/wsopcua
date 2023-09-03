/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import {DataStream} from '../basic-types/DataStream';

export interface ICloseSessionResponse {
  responseHeader?: ResponseHeader;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16067}
*/

export class CloseSessionResponse {
  responseHeader: ResponseHeader;

 constructor( options?: ICloseSessionResponse) {
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


 clone( target?: CloseSessionResponse): CloseSessionResponse {
  if (!target) {
   target = new CloseSessionResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  return target;
 }


}
export function decodeCloseSessionResponse( inp: DataStream): CloseSessionResponse {
  const obj = new CloseSessionResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CloseSessionResponse', CloseSessionResponse, new ExpandedNodeId(2 /*numeric id*/, 476, 0));
