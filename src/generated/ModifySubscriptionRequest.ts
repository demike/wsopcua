/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IModifySubscriptionRequest = Partial<ModifySubscriptionRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16205}
*/

export class ModifySubscriptionRequest {
  requestHeader: RequestHeader;
  subscriptionId: ec.UInt32;
  requestedPublishingInterval: ec.Double;
  requestedLifetimeCount: ec.UInt32;
  requestedMaxKeepAliveCount: ec.UInt32;
  maxNotificationsPerPublish: ec.UInt32;
  priority: ec.Byte;

 constructor( options?: IModifySubscriptionRequest | undefined) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.requestedPublishingInterval = (options.requestedPublishingInterval != null) ? options.requestedPublishingInterval : 0;
  this.requestedLifetimeCount = (options.requestedLifetimeCount != null) ? options.requestedLifetimeCount : 0;
  this.requestedMaxKeepAliveCount = (options.requestedMaxKeepAliveCount != null) ? options.requestedMaxKeepAliveCount : 0;
  this.maxNotificationsPerPublish = (options.maxNotificationsPerPublish != null) ? options.maxNotificationsPerPublish : 0;
  this.priority = (options.priority != null) ? options.priority : 0;

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeUInt32(this.subscriptionId, out);
  ec.encodeDouble(this.requestedPublishingInterval, out);
  ec.encodeUInt32(this.requestedLifetimeCount, out);
  ec.encodeUInt32(this.requestedMaxKeepAliveCount, out);
  ec.encodeUInt32(this.maxNotificationsPerPublish, out);
  ec.encodeByte(this.priority, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.subscriptionId = ec.decodeUInt32(inp);
  this.requestedPublishingInterval = ec.decodeDouble(inp);
  this.requestedLifetimeCount = ec.decodeUInt32(inp);
  this.requestedMaxKeepAliveCount = ec.decodeUInt32(inp);
  this.maxNotificationsPerPublish = ec.decodeUInt32(inp);
  this.priority = ec.decodeByte(inp);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.SubscriptionId = this.subscriptionId;
  out.RequestedPublishingInterval = this.requestedPublishingInterval;
  out.RequestedLifetimeCount = this.requestedLifetimeCount;
  out.RequestedMaxKeepAliveCount = this.requestedMaxKeepAliveCount;
  out.MaxNotificationsPerPublish = this.maxNotificationsPerPublish;
  out.Priority = this.priority;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.subscriptionId = inp.SubscriptionId;
  this.requestedPublishingInterval = inp.RequestedPublishingInterval;
  this.requestedLifetimeCount = inp.RequestedLifetimeCount;
  this.requestedMaxKeepAliveCount = inp.RequestedMaxKeepAliveCount;
  this.maxNotificationsPerPublish = inp.MaxNotificationsPerPublish;
  this.priority = inp.Priority;

 }


 clone( target?: ModifySubscriptionRequest): ModifySubscriptionRequest {
  if (!target) {
   target = new ModifySubscriptionRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.subscriptionId = this.subscriptionId;
  target.requestedPublishingInterval = this.requestedPublishingInterval;
  target.requestedLifetimeCount = this.requestedLifetimeCount;
  target.requestedMaxKeepAliveCount = this.requestedMaxKeepAliveCount;
  target.maxNotificationsPerPublish = this.maxNotificationsPerPublish;
  target.priority = this.priority;
  return target;
 }


}
export function decodeModifySubscriptionRequest( inp: DataStream): ModifySubscriptionRequest {
  const obj = new ModifySubscriptionRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ModifySubscriptionRequest', ModifySubscriptionRequest, new ExpandedNodeId(2 /*numeric id*/, 793, 0));
