

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISubscriptionAcknowledgement {
  subscriptionId?: ec.UInt32;
  sequenceNumber?: ec.UInt32;
}

/**

*/

export class SubscriptionAcknowledgement {
  subscriptionId: ec.UInt32;
  sequenceNumber: ec.UInt32;

 constructor( options?: ISubscriptionAcknowledgement) {
  options = options || {};
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : null;
  this.sequenceNumber = (options.sequenceNumber != null) ? options.sequenceNumber : null;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.subscriptionId, out);
  ec.encodeUInt32(this.sequenceNumber, out);

 }


 decode( inp: DataStream) {
  this.subscriptionId = ec.decodeUInt32(inp);
  this.sequenceNumber = ec.decodeUInt32(inp);

 }


 clone( target?: SubscriptionAcknowledgement): SubscriptionAcknowledgement {
  if (!target) {
   target = new SubscriptionAcknowledgement();
  }
  target.subscriptionId = this.subscriptionId;
  target.sequenceNumber = this.sequenceNumber;
  return target;
 }


}
export function decodeSubscriptionAcknowledgement( inp: DataStream): SubscriptionAcknowledgement {
  const obj = new SubscriptionAcknowledgement();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SubscriptionAcknowledgement', SubscriptionAcknowledgement, makeExpandedNodeId(823, 0));
