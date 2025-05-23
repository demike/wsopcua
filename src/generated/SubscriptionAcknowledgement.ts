/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ISubscriptionAcknowledgement = Partial<SubscriptionAcknowledgement>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16217}
*/

export class SubscriptionAcknowledgement {
  subscriptionId: ec.UInt32;
  sequenceNumber: ec.UInt32;

 constructor( options?: ISubscriptionAcknowledgement | undefined) {
  options = options || {};
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.sequenceNumber = (options.sequenceNumber != null) ? options.sequenceNumber : 0;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.subscriptionId, out);
  ec.encodeUInt32(this.sequenceNumber, out);

 }


 decode( inp: DataStream) {
  this.subscriptionId = ec.decodeUInt32(inp);
  this.sequenceNumber = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.SubscriptionId = this.subscriptionId;
  out.SequenceNumber = this.sequenceNumber;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.subscriptionId = inp.SubscriptionId;
  this.sequenceNumber = inp.SequenceNumber;

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SubscriptionAcknowledgement', SubscriptionAcknowledgement, new ExpandedNodeId(2 /*numeric id*/, 823, 0));
