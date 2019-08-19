

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
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : null;
  this.revisedPublishingInterval = (options.revisedPublishingInterval != null) ? options.revisedPublishingInterval : null;
  this.revisedLifetimeCount = (options.revisedLifetimeCount != null) ? options.revisedLifetimeCount : null;
  this.revisedMaxKeepAliveCount = (options.revisedMaxKeepAliveCount != null) ? options.revisedMaxKeepAliveCount : null;

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CreateSubscriptionResponse', CreateSubscriptionResponse, makeExpandedNodeId(790, 0));
