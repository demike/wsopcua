

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IModifySubscriptionRequest {
  requestHeader?: RequestHeader;
  subscriptionId?: ec.UInt32;
  requestedPublishingInterval?: ec.Double;
  requestedLifetimeCount?: ec.UInt32;
  requestedMaxKeepAliveCount?: ec.UInt32;
  maxNotificationsPerPublish?: ec.UInt32;
  priority?: ec.Byte;
}

/**

*/

export class ModifySubscriptionRequest {
  requestHeader: RequestHeader;
  subscriptionId: ec.UInt32;
  requestedPublishingInterval: ec.Double;
  requestedLifetimeCount: ec.UInt32;
  requestedMaxKeepAliveCount: ec.UInt32;
  maxNotificationsPerPublish: ec.UInt32;
  priority: ec.Byte;

 constructor( options?: IModifySubscriptionRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader !== undefined) ? options.requestHeader : new RequestHeader();
  this.subscriptionId = (options.subscriptionId !== undefined) ? options.subscriptionId : null;
  this.requestedPublishingInterval = (options.requestedPublishingInterval !== undefined) ? options.requestedPublishingInterval : null;
  this.requestedLifetimeCount = (options.requestedLifetimeCount !== undefined) ? options.requestedLifetimeCount : null;
  this.requestedMaxKeepAliveCount = (options.requestedMaxKeepAliveCount !== undefined) ? options.requestedMaxKeepAliveCount : null;
  this.maxNotificationsPerPublish = (options.maxNotificationsPerPublish !== undefined) ? options.maxNotificationsPerPublish : null;
  this.priority = (options.priority !== undefined) ? options.priority : null;

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ModifySubscriptionRequest', ModifySubscriptionRequest, makeExpandedNodeId(793, 0));
