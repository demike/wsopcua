

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ICloseSessionRequest {
  requestHeader?: RequestHeader;
  deleteSubscriptions?: boolean;
}

/**
Closes a session with the server.
*/

export class CloseSessionRequest {
  requestHeader: RequestHeader;
  deleteSubscriptions: boolean;

 constructor( options?: ICloseSessionRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
  this.deleteSubscriptions = (options.deleteSubscriptions) ? options.deleteSubscriptions : null;

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeBoolean(this.deleteSubscriptions, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.deleteSubscriptions = ec.decodeBoolean(inp);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CloseSessionRequest', CloseSessionRequest, makeExpandedNodeId(473, 0));
