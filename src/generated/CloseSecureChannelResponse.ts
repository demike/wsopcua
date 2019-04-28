

import {ResponseHeader} from './ResponseHeader';
import {DataStream} from '../basic-types/DataStream';

export interface ICloseSecureChannelResponse {
  responseHeader?: ResponseHeader;
}

/**
Closes a secure channel.
*/

export class CloseSecureChannelResponse {
  responseHeader: ResponseHeader;

 constructor( options?: ICloseSecureChannelResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);

 }


 clone( target?: CloseSecureChannelResponse): CloseSecureChannelResponse {
  if (!target) {
   target = new CloseSecureChannelResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  return target;
 }


}
export function decodeCloseSecureChannelResponse( inp: DataStream): CloseSecureChannelResponse {
  const obj = new CloseSecureChannelResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CloseSecureChannelResponse', CloseSecureChannelResponse, makeExpandedNodeId(455, 0));
