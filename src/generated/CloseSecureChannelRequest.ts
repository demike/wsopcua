/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {DataStream} from '../basic-types/DataStream';

export interface ICloseSecureChannelRequest {
  requestHeader?: RequestHeader;
}

/**

*/

export class CloseSecureChannelRequest {
  requestHeader: RequestHeader;

 constructor( options?: ICloseSecureChannelRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CloseSecureChannelRequest', CloseSecureChannelRequest, makeExpandedNodeId(452, 0));
