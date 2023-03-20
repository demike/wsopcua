/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRepublishRequest {
  requestHeader?: RequestHeader;
  subscriptionId?: ec.UInt32;
  retransmitSequenceNumber?: ec.UInt32;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16220}
*/

export class RepublishRequest {
  requestHeader: RequestHeader;
  subscriptionId: ec.UInt32;
  retransmitSequenceNumber: ec.UInt32;

 constructor( options?: IRepublishRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.retransmitSequenceNumber = (options.retransmitSequenceNumber != null) ? options.retransmitSequenceNumber : 0;

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


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.SubscriptionId = this.subscriptionId;
  out.RetransmitSequenceNumber = this.retransmitSequenceNumber;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.subscriptionId = inp.SubscriptionId;
  this.retransmitSequenceNumber = inp.RetransmitSequenceNumber;

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RepublishRequest', RepublishRequest, new ExpandedNodeId(2 /*numeric id*/, 830, 0));
