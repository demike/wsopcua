

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISubscriptionDiagnosticsDataType {
  sessionId?: ec.NodeId;
  subscriptionId?: ec.UInt32;
  priority?: ec.Byte;
  publishingInterval?: ec.Double;
  maxKeepAliveCount?: ec.UInt32;
  maxLifetimeCount?: ec.UInt32;
  maxNotificationsPerPublish?: ec.UInt32;
  publishingEnabled?: boolean;
  modifyCount?: ec.UInt32;
  enableCount?: ec.UInt32;
  disableCount?: ec.UInt32;
  republishRequestCount?: ec.UInt32;
  republishMessageRequestCount?: ec.UInt32;
  republishMessageCount?: ec.UInt32;
  transferRequestCount?: ec.UInt32;
  transferredToAltClientCount?: ec.UInt32;
  transferredToSameClientCount?: ec.UInt32;
  publishRequestCount?: ec.UInt32;
  dataChangeNotificationsCount?: ec.UInt32;
  eventNotificationsCount?: ec.UInt32;
  notificationsCount?: ec.UInt32;
  latePublishRequestCount?: ec.UInt32;
  currentKeepAliveCount?: ec.UInt32;
  currentLifetimeCount?: ec.UInt32;
  unacknowledgedMessageCount?: ec.UInt32;
  discardedMessageCount?: ec.UInt32;
  monitoredItemCount?: ec.UInt32;
  disabledMonitoredItemCount?: ec.UInt32;
  monitoringQueueOverflowCount?: ec.UInt32;
  nextSequenceNumber?: ec.UInt32;
  eventQueueOverFlowCount?: ec.UInt32;
}

/**

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

 constructor( options?: ISubscriptionDiagnosticsDataType) {
  options = options || {};
  this.sessionId = (options.sessionId != null) ? options.sessionId : null;
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : null;
  this.priority = (options.priority != null) ? options.priority : null;
  this.publishingInterval = (options.publishingInterval != null) ? options.publishingInterval : null;
  this.maxKeepAliveCount = (options.maxKeepAliveCount != null) ? options.maxKeepAliveCount : null;
  this.maxLifetimeCount = (options.maxLifetimeCount != null) ? options.maxLifetimeCount : null;
  this.maxNotificationsPerPublish = (options.maxNotificationsPerPublish != null) ? options.maxNotificationsPerPublish : null;
  this.publishingEnabled = (options.publishingEnabled != null) ? options.publishingEnabled : null;
  this.modifyCount = (options.modifyCount != null) ? options.modifyCount : null;
  this.enableCount = (options.enableCount != null) ? options.enableCount : null;
  this.disableCount = (options.disableCount != null) ? options.disableCount : null;
  this.republishRequestCount = (options.republishRequestCount != null) ? options.republishRequestCount : null;
  this.republishMessageRequestCount = (options.republishMessageRequestCount != null) ? options.republishMessageRequestCount : null;
  this.republishMessageCount = (options.republishMessageCount != null) ? options.republishMessageCount : null;
  this.transferRequestCount = (options.transferRequestCount != null) ? options.transferRequestCount : null;
  this.transferredToAltClientCount = (options.transferredToAltClientCount != null) ? options.transferredToAltClientCount : null;
  this.transferredToSameClientCount = (options.transferredToSameClientCount != null) ? options.transferredToSameClientCount : null;
  this.publishRequestCount = (options.publishRequestCount != null) ? options.publishRequestCount : null;
  this.dataChangeNotificationsCount = (options.dataChangeNotificationsCount != null) ? options.dataChangeNotificationsCount : null;
  this.eventNotificationsCount = (options.eventNotificationsCount != null) ? options.eventNotificationsCount : null;
  this.notificationsCount = (options.notificationsCount != null) ? options.notificationsCount : null;
  this.latePublishRequestCount = (options.latePublishRequestCount != null) ? options.latePublishRequestCount : null;
  this.currentKeepAliveCount = (options.currentKeepAliveCount != null) ? options.currentKeepAliveCount : null;
  this.currentLifetimeCount = (options.currentLifetimeCount != null) ? options.currentLifetimeCount : null;
  this.unacknowledgedMessageCount = (options.unacknowledgedMessageCount != null) ? options.unacknowledgedMessageCount : null;
  this.discardedMessageCount = (options.discardedMessageCount != null) ? options.discardedMessageCount : null;
  this.monitoredItemCount = (options.monitoredItemCount != null) ? options.monitoredItemCount : null;
  this.disabledMonitoredItemCount = (options.disabledMonitoredItemCount != null) ? options.disabledMonitoredItemCount : null;
  this.monitoringQueueOverflowCount = (options.monitoringQueueOverflowCount != null) ? options.monitoringQueueOverflowCount : null;
  this.nextSequenceNumber = (options.nextSequenceNumber != null) ? options.nextSequenceNumber : null;
  this.eventQueueOverFlowCount = (options.eventQueueOverFlowCount != null) ? options.eventQueueOverFlowCount : null;

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SubscriptionDiagnosticsDataType', SubscriptionDiagnosticsDataType, makeExpandedNodeId(876, 0));
