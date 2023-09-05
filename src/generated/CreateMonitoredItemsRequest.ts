/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {TimestampsToReturn, encodeTimestampsToReturn, decodeTimestampsToReturn} from './TimestampsToReturn';
import {MonitoredItemCreateRequest} from './MonitoredItemCreateRequest';
import {decodeMonitoredItemCreateRequest} from './MonitoredItemCreateRequest';
import {DataStream} from '../basic-types/DataStream';

export type ICreateMonitoredItemsRequest = Partial<CreateMonitoredItemsRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16191}
*/

export class CreateMonitoredItemsRequest {
  requestHeader: RequestHeader;
  subscriptionId: ec.UInt32;
  timestampsToReturn: TimestampsToReturn;
  itemsToCreate: MonitoredItemCreateRequest[];

 constructor( options?: ICreateMonitoredItemsRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.timestampsToReturn = (options.timestampsToReturn != null) ? options.timestampsToReturn : null;
  this.itemsToCreate = (options.itemsToCreate != null) ? options.itemsToCreate : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeUInt32(this.subscriptionId, out);
  encodeTimestampsToReturn(this.timestampsToReturn, out);
  ec.encodeArray(this.itemsToCreate, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.subscriptionId = ec.decodeUInt32(inp);
  this.timestampsToReturn = decodeTimestampsToReturn(inp);
  this.itemsToCreate = ec.decodeArray(inp, decodeMonitoredItemCreateRequest) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.SubscriptionId = this.subscriptionId;
  out.TimestampsToReturn = this.timestampsToReturn;
  out.ItemsToCreate = this.itemsToCreate;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.subscriptionId = inp.SubscriptionId;
  this.timestampsToReturn = inp.TimestampsToReturn;
  this.itemsToCreate = ec.jsonDecodeStructArray( inp.ItemsToCreate,MonitoredItemCreateRequest);

 }


 clone( target?: CreateMonitoredItemsRequest): CreateMonitoredItemsRequest {
  if (!target) {
   target = new CreateMonitoredItemsRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.subscriptionId = this.subscriptionId;
  target.timestampsToReturn = this.timestampsToReturn;
  if (this.itemsToCreate) { target.itemsToCreate = ec.cloneComplexArray(this.itemsToCreate); }
  return target;
 }


}
export function decodeCreateMonitoredItemsRequest( inp: DataStream): CreateMonitoredItemsRequest {
  const obj = new CreateMonitoredItemsRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CreateMonitoredItemsRequest', CreateMonitoredItemsRequest, new ExpandedNodeId(2 /*numeric id*/, 751, 0));
