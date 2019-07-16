

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ICreateSubscriptionRequest {
  requestHeader?: RequestHeader;
  requestedPublishingInterval?: ec.Double;
  requestedLifetimeCount?: ec.UInt32;
  requestedMaxKeepAliveCount?: ec.UInt32;
  maxNotificationsPerPublish?: ec.UInt32;
  publishingEnabled?: boolean;
  priority?: ec.Byte;
}

/**

*/

export class CreateSubscriptionRequest {
  requestHeader: RequestHeader;
  requestedPublishingInterval: ec.Double;
  requestedLifetimeCount: ec.UInt32;
  requestedMaxKeepAliveCount: ec.UInt32;
  maxNotificationsPerPublish: ec.UInt32;
  publishingEnabled: boolean;
  priority: ec.Byte;

 constructor( options?: ICreateSubscriptionRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader !== undefined) ? options.requestHeader : new RequestHeader();
  this.requestedPublishingInterval = (options.requestedPublishingInterval !== undefined) ? options.requestedPublishingInterval : null;
  this.requestedLifetimeCount = (options.requestedLifetimeCount !== undefined) ? options.requestedLifetimeCount : null;
  this.requestedMaxKeepAliveCount = (options.requestedMaxKeepAliveCount !== undefined) ? options.requestedMaxKeepAliveCount : null;
  this.maxNotificationsPerPublish = (options.maxNotificationsPerPublish !== undefined) ? options.maxNotificationsPerPublish : null;
  this.publishingEnabled = (options.publishingEnabled !== undefined) ? options.publishingEnabled : null;
  this.priority = (options.priority !== undefined) ? options.priority : null;

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeDouble(this.requestedPublishingInterval, out);
  ec.encodeUInt32(this.requestedLifetimeCount, out);
  ec.encodeUInt32(this.requestedMaxKeepAliveCount, out);
  ec.encodeUInt32(this.maxNotificationsPerPublish, out);
  ec.encodeBoolean(this.publishingEnabled, out);
  ec.encodeByte(this.priority, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.requestedPublishingInterval = ec.decodeDouble(inp);
  this.requestedLifetimeCount = ec.decodeUInt32(inp);
  this.requestedMaxKeepAliveCount = ec.decodeUInt32(inp);
  this.maxNotificationsPerPublish = ec.decodeUInt32(inp);
  this.publishingEnabled = ec.decodeBoolean(inp);
  this.priority = ec.decodeByte(inp);

 }


 clone( target?: CreateSubscriptionRequest): CreateSubscriptionRequest {
  if (!target) {
   target = new CreateSubscriptionRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.requestedPublishingInterval = this.requestedPublishingInterval;
  target.requestedLifetimeCount = this.requestedLifetimeCount;
  target.requestedMaxKeepAliveCount = this.requestedMaxKeepAliveCount;
  target.maxNotificationsPerPublish = this.maxNotificationsPerPublish;
  target.publishingEnabled = this.publishingEnabled;
  target.priority = this.priority;
  return target;
 }


}
export function decodeCreateSubscriptionRequest( inp: DataStream): CreateSubscriptionRequest {
  const obj = new CreateSubscriptionRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CreateSubscriptionRequest', CreateSubscriptionRequest, makeExpandedNodeId(787, 0));
