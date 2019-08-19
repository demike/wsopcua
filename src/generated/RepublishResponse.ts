

import {ResponseHeader} from './ResponseHeader';
import {NotificationMessage} from './NotificationMessage';
import {DataStream} from '../basic-types/DataStream';

export interface IRepublishResponse {
  responseHeader?: ResponseHeader;
  notificationMessage?: NotificationMessage;
}

/**

*/

export class RepublishResponse {
  responseHeader: ResponseHeader;
  notificationMessage: NotificationMessage;

 constructor( options?: IRepublishResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.notificationMessage = (options.notificationMessage != null) ? options.notificationMessage : new NotificationMessage();

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  this.notificationMessage.encode(out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.notificationMessage.decode(inp);

 }


 clone( target?: RepublishResponse): RepublishResponse {
  if (!target) {
   target = new RepublishResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.notificationMessage) { target.notificationMessage = this.notificationMessage.clone(); }
  return target;
 }


}
export function decodeRepublishResponse( inp: DataStream): RepublishResponse {
  const obj = new RepublishResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RepublishResponse', RepublishResponse, makeExpandedNodeId(835, 0));
