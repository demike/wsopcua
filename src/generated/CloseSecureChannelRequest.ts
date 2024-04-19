/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {DataStream} from '../basic-types/DataStream';

export type ICloseSecureChannelRequest = Partial<CloseSecureChannelRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16050}
*/

export class CloseSecureChannelRequest {
  requestHeader: RequestHeader;

 constructor( options?: ICloseSecureChannelRequest | null) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);

 }


 clone( target?: CloseSecureChannelRequest): CloseSecureChannelRequest {
  if (!target) {
   target = new CloseSecureChannelRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  return target;
 }


}
export function decodeCloseSecureChannelRequest( inp: DataStream): CloseSecureChannelRequest {
  const obj = new CloseSecureChannelRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CloseSecureChannelRequest', CloseSecureChannelRequest, new ExpandedNodeId(2 /*numeric id*/, 452, 0));
