/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ISubscriptionDiagnosticsDataType = Partial<SubscriptionDiagnosticsDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16240}
*/

export class SubscriptionDiagnosticsDataType {
  sessionId: ec.NodeId;
  subscriptionId: ec.UInt32;
  priority: ec.Byte;
  publishingInterval: ec.Double;
  maxKeepAliveCount: ec.UInt32;
  maxLifetimeCount: ec.UInt32;
  maxNotificationsPerPublish: ec.UInt32;
  publishingEnabled: boolean;
  modifyCount: ec.UInt32;
  enableCount: ec.UInt32;
  disableCount: ec.UInt32;
  republishRequestCount: ec.UInt32;
  republishMessageRequestCount: ec.UInt32;
  republishMessageCount: ec.UInt32;
  transferRequestCount: ec.UInt32;
  transferredToAltClientCount: ec.UInt32;
  transferredToSameClientCount: ec.UInt32;
  publishRequestCount: ec.UInt32;
  dataChangeNotificationsCount: ec.UInt32;
  eventNotificationsCount: ec.UInt32;
  notificationsCount: ec.UInt32;
  latePublishRequestCount: ec.UInt32;
  currentKeepAliveCount: ec.UInt32;
  currentLifetimeCount: ec.UInt32;
  unacknowledgedMessageCount: ec.UInt32;
  discardedMessageCount: ec.UInt32;
  monitoredItemCount: ec.UInt32;
  disabledMonitoredItemCount: ec.UInt32;
  monitoringQueueOverflowCount: ec.UInt32;
  nextSequenceNumber: ec.UInt32;
  eventQueueOverFlowCount: ec.UInt32;

 constructor( options?: ISubscriptionDiagnosticsDataType | undefined) {
  options = options || {};
  this.sessionId = (options.sessionId != null) ? options.sessionId : ec.NodeId.NullNodeId;
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.priority = (options.priority != null) ? options.priority : 0;
  this.publishingInterval = (options.publishingInterval != null) ? options.publishingInterval : 0;
  this.maxKeepAliveCount = (options.maxKeepAliveCount != null) ? options.maxKeepAliveCount : 0;
  this.maxLifetimeCount = (options.maxLifetimeCount != null) ? options.maxLifetimeCount : 0;
  this.maxNotificationsPerPublish = (options.maxNotificationsPerPublish != null) ? options.maxNotificationsPerPublish : 0;
  this.publishingEnabled = (options.publishingEnabled != null) ? options.publishingEnabled : false;
  this.modifyCount = (options.modifyCount != null) ? options.modifyCount : 0;
  this.enableCount = (options.enableCount != null) ? options.enableCount : 0;
  this.disableCount = (options.disableCount != null) ? options.disableCount : 0;
  this.republishRequestCount = (options.republishRequestCount != null) ? options.republishRequestCount : 0;
  this.republishMessageRequestCount = (options.republishMessageRequestCount != null) ? options.republishMessageRequestCount : 0;
  this.republishMessageCount = (options.republishMessageCount != null) ? options.republishMessageCount : 0;
  this.transferRequestCount = (options.transferRequestCount != null) ? options.transferRequestCount : 0;
  this.transferredToAltClientCount = (options.transferredToAltClientCount != null) ? options.transferredToAltClientCount : 0;
  this.transferredToSameClientCount = (options.transferredToSameClientCount != null) ? options.transferredToSameClientCount : 0;
  this.publishRequestCount = (options.publishRequestCount != null) ? options.publishRequestCount : 0;
  this.dataChangeNotificationsCount = (options.dataChangeNotificationsCount != null) ? options.dataChangeNotificationsCount : 0;
  this.eventNotificationsCount = (options.eventNotificationsCount != null) ? options.eventNotificationsCount : 0;
  this.notificationsCount = (options.notificationsCount != null) ? options.notificationsCount : 0;
  this.latePublishRequestCount = (options.latePublishRequestCount != null) ? options.latePublishRequestCount : 0;
  this.currentKeepAliveCount = (options.currentKeepAliveCount != null) ? options.currentKeepAliveCount : 0;
  this.currentLifetimeCount = (options.currentLifetimeCount != null) ? options.currentLifetimeCount : 0;
  this.unacknowledgedMessageCount = (options.unacknowledgedMessageCount != null) ? options.unacknowledgedMessageCount : 0;
  this.discardedMessageCount = (options.discardedMessageCount != null) ? options.discardedMessageCount : 0;
  this.monitoredItemCount = (options.monitoredItemCount != null) ? options.monitoredItemCount : 0;
  this.disabledMonitoredItemCount = (options.disabledMonitoredItemCount != null) ? options.disabledMonitoredItemCount : 0;
  this.monitoringQueueOverflowCount = (options.monitoringQueueOverflowCount != null) ? options.monitoringQueueOverflowCount : 0;
  this.nextSequenceNumber = (options.nextSequenceNumber != null) ? options.nextSequenceNumber : 0;
  this.eventQueueOverFlowCount = (options.eventQueueOverFlowCount != null) ? options.eventQueueOverFlowCount : 0;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.sessionId, out);
  ec.encodeUInt32(this.subscriptionId, out);
  ec.encodeByte(this.priority, out);
  ec.encodeDouble(this.publishingInterval, out);
  ec.encodeUInt32(this.maxKeepAliveCount, out);
  ec.encodeUInt32(this.maxLifetimeCount, out);
  ec.encodeUInt32(this.maxNotificationsPerPublish, out);
  ec.encodeBoolean(this.publishingEnabled, out);
  ec.encodeUInt32(this.modifyCount, out);
  ec.encodeUInt32(this.enableCount, out);
  ec.encodeUInt32(this.disableCount, out);
  ec.encodeUInt32(this.republishRequestCount, out);
  ec.encodeUInt32(this.republishMessageRequestCount, out);
  ec.encodeUInt32(this.republishMessageCount, out);
  ec.encodeUInt32(this.transferRequestCount, out);
  ec.encodeUInt32(this.transferredToAltClientCount, out);
  ec.encodeUInt32(this.transferredToSameClientCount, out);
  ec.encodeUInt32(this.publishRequestCount, out);
  ec.encodeUInt32(this.dataChangeNotificationsCount, out);
  ec.encodeUInt32(this.eventNotificationsCount, out);
  ec.encodeUInt32(this.notificationsCount, out);
  ec.encodeUInt32(this.latePublishRequestCount, out);
  ec.encodeUInt32(this.currentKeepAliveCount, out);
  ec.encodeUInt32(this.currentLifetimeCount, out);
  ec.encodeUInt32(this.unacknowledgedMessageCount, out);
  ec.encodeUInt32(this.discardedMessageCount, out);
  ec.encodeUInt32(this.monitoredItemCount, out);
  ec.encodeUInt32(this.disabledMonitoredItemCount, out);
  ec.encodeUInt32(this.monitoringQueueOverflowCount, out);
  ec.encodeUInt32(this.nextSequenceNumber, out);
  ec.encodeUInt32(this.eventQueueOverFlowCount, out);

 }


 decode( inp: DataStream) {
  this.sessionId = ec.decodeNodeId(inp);
  this.subscriptionId = ec.decodeUInt32(inp);
  this.priority = ec.decodeByte(inp);
  this.publishingInterval = ec.decodeDouble(inp);
  this.maxKeepAliveCount = ec.decodeUInt32(inp);
  this.maxLifetimeCount = ec.decodeUInt32(inp);
  this.maxNotificationsPerPublish = ec.decodeUInt32(inp);
  this.publishingEnabled = ec.decodeBoolean(inp);
  this.modifyCount = ec.decodeUInt32(inp);
  this.enableCount = ec.decodeUInt32(inp);
  this.disableCount = ec.decodeUInt32(inp);
  this.republishRequestCount = ec.decodeUInt32(inp);
  this.republishMessageRequestCount = ec.decodeUInt32(inp);
  this.republishMessageCount = ec.decodeUInt32(inp);
  this.transferRequestCount = ec.decodeUInt32(inp);
  this.transferredToAltClientCount = ec.decodeUInt32(inp);
  this.transferredToSameClientCount = ec.decodeUInt32(inp);
  this.publishRequestCount = ec.decodeUInt32(inp);
  this.dataChangeNotificationsCount = ec.decodeUInt32(inp);
  this.eventNotificationsCount = ec.decodeUInt32(inp);
  this.notificationsCount = ec.decodeUInt32(inp);
  this.latePublishRequestCount = ec.decodeUInt32(inp);
  this.currentKeepAliveCount = ec.decodeUInt32(inp);
  this.currentLifetimeCount = ec.decodeUInt32(inp);
  this.unacknowledgedMessageCount = ec.decodeUInt32(inp);
  this.discardedMessageCount = ec.decodeUInt32(inp);
  this.monitoredItemCount = ec.decodeUInt32(inp);
  this.disabledMonitoredItemCount = ec.decodeUInt32(inp);
  this.monitoringQueueOverflowCount = ec.decodeUInt32(inp);
  this.nextSequenceNumber = ec.decodeUInt32(inp);
  this.eventQueueOverFlowCount = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.SessionId = ec.jsonEncodeNodeId(this.sessionId);
  out.SubscriptionId = this.subscriptionId;
  out.Priority = this.priority;
  out.PublishingInterval = this.publishingInterval;
  out.MaxKeepAliveCount = this.maxKeepAliveCount;
  out.MaxLifetimeCount = this.maxLifetimeCount;
  out.MaxNotificationsPerPublish = this.maxNotificationsPerPublish;
  out.PublishingEnabled = this.publishingEnabled;
  out.ModifyCount = this.modifyCount;
  out.EnableCount = this.enableCount;
  out.DisableCount = this.disableCount;
  out.RepublishRequestCount = this.republishRequestCount;
  out.RepublishMessageRequestCount = this.republishMessageRequestCount;
  out.RepublishMessageCount = this.republishMessageCount;
  out.TransferRequestCount = this.transferRequestCount;
  out.TransferredToAltClientCount = this.transferredToAltClientCount;
  out.TransferredToSameClientCount = this.transferredToSameClientCount;
  out.PublishRequestCount = this.publishRequestCount;
  out.DataChangeNotificationsCount = this.dataChangeNotificationsCount;
  out.EventNotificationsCount = this.eventNotificationsCount;
  out.NotificationsCount = this.notificationsCount;
  out.LatePublishRequestCount = this.latePublishRequestCount;
  out.CurrentKeepAliveCount = this.currentKeepAliveCount;
  out.CurrentLifetimeCount = this.currentLifetimeCount;
  out.UnacknowledgedMessageCount = this.unacknowledgedMessageCount;
  out.DiscardedMessageCount = this.discardedMessageCount;
  out.MonitoredItemCount = this.monitoredItemCount;
  out.DisabledMonitoredItemCount = this.disabledMonitoredItemCount;
  out.MonitoringQueueOverflowCount = this.monitoringQueueOverflowCount;
  out.NextSequenceNumber = this.nextSequenceNumber;
  out.EventQueueOverFlowCount = this.eventQueueOverFlowCount;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.sessionId = ec.jsonDecodeNodeId(inp.SessionId);
  this.subscriptionId = inp.SubscriptionId;
  this.priority = inp.Priority;
  this.publishingInterval = inp.PublishingInterval;
  this.maxKeepAliveCount = inp.MaxKeepAliveCount;
  this.maxLifetimeCount = inp.MaxLifetimeCount;
  this.maxNotificationsPerPublish = inp.MaxNotificationsPerPublish;
  this.publishingEnabled = inp.PublishingEnabled;
  this.modifyCount = inp.ModifyCount;
  this.enableCount = inp.EnableCount;
  this.disableCount = inp.DisableCount;
  this.republishRequestCount = inp.RepublishRequestCount;
  this.republishMessageRequestCount = inp.RepublishMessageRequestCount;
  this.republishMessageCount = inp.RepublishMessageCount;
  this.transferRequestCount = inp.TransferRequestCount;
  this.transferredToAltClientCount = inp.TransferredToAltClientCount;
  this.transferredToSameClientCount = inp.TransferredToSameClientCount;
  this.publishRequestCount = inp.PublishRequestCount;
  this.dataChangeNotificationsCount = inp.DataChangeNotificationsCount;
  this.eventNotificationsCount = inp.EventNotificationsCount;
  this.notificationsCount = inp.NotificationsCount;
  this.latePublishRequestCount = inp.LatePublishRequestCount;
  this.currentKeepAliveCount = inp.CurrentKeepAliveCount;
  this.currentLifetimeCount = inp.CurrentLifetimeCount;
  this.unacknowledgedMessageCount = inp.UnacknowledgedMessageCount;
  this.discardedMessageCount = inp.DiscardedMessageCount;
  this.monitoredItemCount = inp.MonitoredItemCount;
  this.disabledMonitoredItemCount = inp.DisabledMonitoredItemCount;
  this.monitoringQueueOverflowCount = inp.MonitoringQueueOverflowCount;
  this.nextSequenceNumber = inp.NextSequenceNumber;
  this.eventQueueOverFlowCount = inp.EventQueueOverFlowCount;

 }


 clone( target?: SubscriptionDiagnosticsDataType): SubscriptionDiagnosticsDataType {
  if (!target) {
   target = new SubscriptionDiagnosticsDataType();
  }
  target.sessionId = this.sessionId;
  target.subscriptionId = this.subscriptionId;
  target.priority = this.priority;
  target.publishingInterval = this.publishingInterval;
  target.maxKeepAliveCount = this.maxKeepAliveCount;
  target.maxLifetimeCount = this.maxLifetimeCount;
  target.maxNotificationsPerPublish = this.maxNotificationsPerPublish;
  target.publishingEnabled = this.publishingEnabled;
  target.modifyCount = this.modifyCount;
  target.enableCount = this.enableCount;
  target.disableCount = this.disableCount;
  target.republishRequestCount = this.republishRequestCount;
  target.republishMessageRequestCount = this.republishMessageRequestCount;
  target.republishMessageCount = this.republishMessageCount;
  target.transferRequestCount = this.transferRequestCount;
  target.transferredToAltClientCount = this.transferredToAltClientCount;
  target.transferredToSameClientCount = this.transferredToSameClientCount;
  target.publishRequestCount = this.publishRequestCount;
  target.dataChangeNotificationsCount = this.dataChangeNotificationsCount;
  target.eventNotificationsCount = this.eventNotificationsCount;
  target.notificationsCount = this.notificationsCount;
  target.latePublishRequestCount = this.latePublishRequestCount;
  target.currentKeepAliveCount = this.currentKeepAliveCount;
  target.currentLifetimeCount = this.currentLifetimeCount;
  target.unacknowledgedMessageCount = this.unacknowledgedMessageCount;
  target.discardedMessageCount = this.discardedMessageCount;
  target.monitoredItemCount = this.monitoredItemCount;
  target.disabledMonitoredItemCount = this.disabledMonitoredItemCount;
  target.monitoringQueueOverflowCount = this.monitoringQueueOverflowCount;
  target.nextSequenceNumber = this.nextSequenceNumber;
  target.eventQueueOverFlowCount = this.eventQueueOverFlowCount;
  return target;
 }


}
export function decodeSubscriptionDiagnosticsDataType( inp: DataStream): SubscriptionDiagnosticsDataType {
  const obj = new SubscriptionDiagnosticsDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SubscriptionDiagnosticsDataType', SubscriptionDiagnosticsDataType, new ExpandedNodeId(2 /*numeric id*/, 876, 0));
