

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRepublishRequest {
  requestHeader?: RequestHeader;
  subscriptionId?: ec.UInt32;
  retransmitSequenceNumber?: ec.UInt32;
}

/**

*/

export class RepublishRequest {
  requestHeader: RequestHeader;
  subscriptionId: ec.UInt32;
  retransmitSequenceNumber: ec.UInt32;

 constructor( options?: IRepublishRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : null;
  this.retransmitSequenceNumber = (options.retransmitSequenceNumber != null) ? options.retransmitSequenceNumber : null;

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeUInt32(this.subscriptionId, out);
  ec.encodeUInt32(this.retransmitSequenceNumber, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.subscriptionId = ec.decodeUInt32(inp);
  this.retransmitSequenceNumber = ec.decodeUInt32(inp);

 }


 clone( target?: RepublishRequest): RepublishRequest {
  if (!target) {
   target = new RepublishRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.subscriptionId = this.subscriptionId;
  target.retransmitSequenceNumber = this.retransmitSequenceNumber;
  return target;
 }


}
export function decodeRepublishRequest( inp: DataStream): RepublishRequest {
  const obj = new RepublishRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RepublishRequest', RepublishRequest, makeExpandedNodeId(832, 0));
