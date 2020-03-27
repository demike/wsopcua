/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ICreateSubscriptionResponse {
  responseHeader?: ResponseHeader;
  subscriptionId?: ec.UInt32;
  revisedPublishingInterval?: ec.Double;
  revisedLifetimeCount?: ec.UInt32;
  revisedMaxKeepAliveCount?: ec.UInt32;
}

/**

*/

export class CreateSubscriptionResponse {
  responseHeader: ResponseHeader;
  subscriptionId: ec.UInt32;
  revisedPublishingInterval: ec.Double;
  revisedLifetimeCount: ec.UInt32;
  revisedMaxKeepAliveCount: ec.UInt32;

 constructor( options?: ICreateSubscriptionResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.revisedPublishingInterval = (options.revisedPublishingInterval != null) ? options.revisedPublishingInterval : 0;
  this.revisedLifetimeCount = (options.revisedLifetimeCount != null) ? options.revisedLifetimeCount : 0;
  this.revisedMaxKeepAliveCount = (options.revisedMaxKeepAliveCount != null) ? options.revisedMaxKeepAliveCount : 0;

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeUInt32(this.subscriptionId, out);
  ec.encodeDouble(this.revisedPublishingInterval, out);
  ec.encodeUInt32(this.revisedLifetimeCount, out);
  ec.encodeUInt32(this.revisedMaxKeepAliveCount, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.subscriptionId = ec.decodeUInt32(inp);
  this.revisedPublishingInterval = ec.decodeDouble(inp);
  this.revisedLifetimeCount = ec.decodeUInt32(inp);
  this.revisedMaxKeepAliveCount = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.SubscriptionId = this.subscriptionId;
  out.RevisedPublishingInterval = this.revisedPublishingInterval;
  out.RevisedLifetimeCount = this.revisedLifetimeCount;
  out.RevisedMaxKeepAliveCount = this.revisedMaxKeepAliveCount;
 return out;
 }


 fromJSON( inp: any) {
  this.responseHeader.fromJSON(inp);
  this.subscriptionId = inp.SubscriptionId;
  this.revisedPublishingInterval = inp.RevisedPublishingInterval;
  this.revisedLifetimeCount = inp.RevisedLifetimeCount;
  this.revisedMaxKeepAliveCount = inp.RevisedMaxKeepAliveCount;

 }


 clone( target?: CreateSubscriptionResponse): CreateSubscriptionResponse {
  if (!target) {
   target = new CreateSubscriptionResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.subscriptionId = this.subscriptionId;
  target.revisedPublishingInterval = this.revisedPublishingInterval;
  target.revisedLifetimeCount = this.revisedLifetimeCount;
  target.revisedMaxKeepAliveCount = this.revisedMaxKeepAliveCount;
  return target;
 }


}
export function decodeCreateSubscriptionResponse( inp: DataStream): CreateSubscriptionResponse {
  const obj = new CreateSubscriptionResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CreateSubscriptionResponse', CreateSubscriptionResponse, new ExpandedNodeId(2 /*numeric id*/, 790, 0));
