/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteMonitoredItemsRequest {
  requestHeader?: RequestHeader;
  subscriptionId?: ec.UInt32;
  monitoredItemIds?: ec.UInt32[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16201}
*/

export class DeleteMonitoredItemsRequest {
  requestHeader: RequestHeader;
  subscriptionId: ec.UInt32;
  monitoredItemIds: ec.UInt32[];

 constructor( options?: IDeleteMonitoredItemsRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.monitoredItemIds = (options.monitoredItemIds != null) ? options.monitoredItemIds : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeUInt32(this.subscriptionId, out);
  ec.encodeArray(this.monitoredItemIds, out, ec.encodeUInt32);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.subscriptionId = ec.decodeUInt32(inp);
  this.monitoredItemIds = ec.decodeArray(inp, ec.decodeUInt32);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.SubscriptionId = this.subscriptionId;
  out.MonitoredItemIds = this.monitoredItemIds;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.subscriptionId = inp.SubscriptionId;
  this.monitoredItemIds = inp.MonitoredItemIds;

 }


 clone( target?: DeleteMonitoredItemsRequest): DeleteMonitoredItemsRequest {
  if (!target) {
   target = new DeleteMonitoredItemsRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.subscriptionId = this.subscriptionId;
  target.monitoredItemIds = ec.cloneArray(this.monitoredItemIds);
  return target;
 }


}
export function decodeDeleteMonitoredItemsRequest( inp: DataStream): DeleteMonitoredItemsRequest {
  const obj = new DeleteMonitoredItemsRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DeleteMonitoredItemsRequest', DeleteMonitoredItemsRequest, new ExpandedNodeId(2 /*numeric id*/, 779, 0));
