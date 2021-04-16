/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from '.';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types';

export interface ITransferSubscriptionsRequest {
  requestHeader?: RequestHeader;
  subscriptionIds?: ec.UInt32[];
  sendInitialValues?: boolean;
}

/**

*/

export class TransferSubscriptionsRequest {
  requestHeader: RequestHeader;
  subscriptionIds: ec.UInt32[];
  sendInitialValues: boolean;

 constructor( options?: ITransferSubscriptionsRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.subscriptionIds = (options.subscriptionIds != null) ? options.subscriptionIds : [];
  this.sendInitialValues = (options.sendInitialValues != null) ? options.sendInitialValues : false;

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeArray(this.subscriptionIds, out, ec.encodeUInt32);
  ec.encodeBoolean(this.sendInitialValues, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.subscriptionIds = ec.decodeArray(inp, ec.decodeUInt32);
  this.sendInitialValues = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.SubscriptionIds = this.subscriptionIds;
  out.SendInitialValues = this.sendInitialValues;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.subscriptionIds = inp.SubscriptionIds;
  this.sendInitialValues = inp.SendInitialValues;

 }


 clone( target?: TransferSubscriptionsRequest): TransferSubscriptionsRequest {
  if (!target) {
   target = new TransferSubscriptionsRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.subscriptionIds = ec.cloneArray(this.subscriptionIds);
  target.sendInitialValues = this.sendInitialValues;
  return target;
 }


}
export function decodeTransferSubscriptionsRequest( inp: DataStream): TransferSubscriptionsRequest {
  const obj = new TransferSubscriptionsRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('TransferSubscriptionsRequest', TransferSubscriptionsRequest, new ExpandedNodeId(2 /*numeric id*/, 841, 0));
