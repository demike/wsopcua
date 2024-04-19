/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {MonitoringMode, encodeMonitoringMode, decodeMonitoringMode} from './MonitoringMode';
import {DataStream} from '../basic-types/DataStream';

export type ISetMonitoringModeRequest = Partial<SetMonitoringModeRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16197}
*/

export class SetMonitoringModeRequest {
  requestHeader: RequestHeader;
  subscriptionId: ec.UInt32;
  monitoringMode: MonitoringMode;
  monitoredItemIds: (ec.UInt32)[];

 constructor( options?: ISetMonitoringModeRequest | null) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.monitoringMode = (options.monitoringMode != null) ? options.monitoringMode : MonitoringMode.Invalid;
  this.monitoredItemIds = (options.monitoredItemIds != null) ? options.monitoredItemIds : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeUInt32(this.subscriptionId, out);
  encodeMonitoringMode(this.monitoringMode, out);
  ec.encodeArray(this.monitoredItemIds, out, ec.encodeUInt32);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.subscriptionId = ec.decodeUInt32(inp);
  this.monitoringMode = decodeMonitoringMode(inp);
  this.monitoredItemIds = ec.decodeArray(inp, ec.decodeUInt32) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.SubscriptionId = this.subscriptionId;
  out.MonitoringMode = this.monitoringMode;
  out.MonitoredItemIds = this.monitoredItemIds;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.subscriptionId = inp.SubscriptionId;
  this.monitoringMode = inp.MonitoringMode;
  this.monitoredItemIds = inp.MonitoredItemIds;

 }


 clone( target?: SetMonitoringModeRequest): SetMonitoringModeRequest {
  if (!target) {
   target = new SetMonitoringModeRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.subscriptionId = this.subscriptionId;
  target.monitoringMode = this.monitoringMode;
  target.monitoredItemIds = ec.cloneArray(this.monitoredItemIds);
  return target;
 }


}
export function decodeSetMonitoringModeRequest( inp: DataStream): SetMonitoringModeRequest {
  const obj = new SetMonitoringModeRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SetMonitoringModeRequest', SetMonitoringModeRequest, new ExpandedNodeId(2 /*numeric id*/, 769, 0));
