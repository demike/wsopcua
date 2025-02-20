/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {TimestampsToReturn, encodeTimestampsToReturn, decodeTimestampsToReturn} from './TimestampsToReturn';
import {MonitoredItemModifyRequest} from './MonitoredItemModifyRequest';
import {decodeMonitoredItemModifyRequest} from './MonitoredItemModifyRequest';
import {DataStream} from '../basic-types/DataStream';

export type IModifyMonitoredItemsRequest = Partial<ModifyMonitoredItemsRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16195}
*/

export class ModifyMonitoredItemsRequest {
  requestHeader: RequestHeader;
  subscriptionId: ec.UInt32;
  timestampsToReturn: TimestampsToReturn;
  itemsToModify: (MonitoredItemModifyRequest)[];

 constructor( options?: IModifyMonitoredItemsRequest | undefined) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.timestampsToReturn = (options.timestampsToReturn != null) ? options.timestampsToReturn : TimestampsToReturn.Invalid;
  this.itemsToModify = (options.itemsToModify != null) ? options.itemsToModify : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeUInt32(this.subscriptionId, out);
  encodeTimestampsToReturn(this.timestampsToReturn, out);
  ec.encodeArray(this.itemsToModify, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.subscriptionId = ec.decodeUInt32(inp);
  this.timestampsToReturn = decodeTimestampsToReturn(inp);
  this.itemsToModify = ec.decodeArray(inp, decodeMonitoredItemModifyRequest) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.SubscriptionId = this.subscriptionId;
  out.TimestampsToReturn = this.timestampsToReturn;
  out.ItemsToModify = this.itemsToModify;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.subscriptionId = inp.SubscriptionId;
  this.timestampsToReturn = inp.TimestampsToReturn;
  this.itemsToModify = ec.jsonDecodeStructArray( inp.ItemsToModify,MonitoredItemModifyRequest);

 }


 clone( target?: ModifyMonitoredItemsRequest): ModifyMonitoredItemsRequest {
  if (!target) {
   target = new ModifyMonitoredItemsRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.subscriptionId = this.subscriptionId;
  target.timestampsToReturn = this.timestampsToReturn;
  if (this.itemsToModify) { target.itemsToModify = ec.cloneComplexArray(this.itemsToModify); }
  return target;
 }


}
export function decodeModifyMonitoredItemsRequest( inp: DataStream): ModifyMonitoredItemsRequest {
  const obj = new ModifyMonitoredItemsRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ModifyMonitoredItemsRequest', ModifyMonitoredItemsRequest, new ExpandedNodeId(2 /*numeric id*/, 763, 0));
