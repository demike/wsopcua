

import * as ec from '../basic-types';
import {ApplicationDescription} from './ApplicationDescription';
import {ServiceCounterDataType} from './ServiceCounterDataType';
import {DataStream} from '../basic-types/DataStream';

export interface ISessionDiagnosticsDataType {
  sessionId?: ec.NodeId;
  sessionName?: string;
  clientDescription?: ApplicationDescription;
  serverUri?: string;
  endpointUrl?: string;
  localeIds?: string[];
  actualSessionTimeout?: ec.Double;
  maxResponseMessageSize?: ec.UInt32;
  clientConnectionTime?: Date;
  clientLastContactTime?: Date;
  currentSubscriptionsCount?: ec.UInt32;
  currentMonitoredItemsCount?: ec.UInt32;
  currentPublishRequestsInQueue?: ec.UInt32;
  totalRequestCount?: ServiceCounterDataType;
  unauthorizedRequestCount?: ec.UInt32;
  readCount?: ServiceCounterDataType;
  historyReadCount?: ServiceCounterDataType;
  writeCount?: ServiceCounterDataType;
  historyUpdateCount?: ServiceCounterDataType;
  callCount?: ServiceCounterDataType;
  createMonitoredItemsCount?: ServiceCounterDataType;
  modifyMonitoredItemsCount?: ServiceCounterDataType;
  setMonitoringModeCount?: ServiceCounterDataType;
  setTriggeringCount?: ServiceCounterDataType;
  deleteMonitoredItemsCount?: ServiceCounterDataType;
  createSubscriptionCount?: ServiceCounterDataType;
  modifySubscriptionCount?: ServiceCounterDataType;
  setPublishingModeCount?: ServiceCounterDataType;
  publishCount?: ServiceCounterDataType;
  republishCount?: ServiceCounterDataType;
  transferSubscriptionsCount?: ServiceCounterDataType;
  deleteSubscriptionsCount?: ServiceCounterDataType;
  addNodesCount?: ServiceCounterDataType;
  addReferencesCount?: ServiceCounterDataType;
  deleteNodesCount?: ServiceCounterDataType;
  deleteReferencesCount?: ServiceCounterDataType;
  browseCount?: ServiceCounterDataType;
  browseNextCount?: ServiceCounterDataType;
  translateBrowsePathsToNodeIdsCount?: ServiceCounterDataType;
  queryFirstCount?: ServiceCounterDataType;
  queryNextCount?: ServiceCounterDataType;
  registerNodesCount?: ServiceCounterDataType;
  unregisterNodesCount?: ServiceCounterDataType;
}

/**

*/

export class SessionDiagnosticsDataType {
  sessionId: ec.NodeId;
  sessionName: string;
  clientDescription: ApplicationDescription;
  serverUri: string;
  endpointUrl: string;
  localeIds: string[];
  actualSessionTimeout: ec.Double;
  maxResponseMessageSize: ec.UInt32;
  clientConnectionTime: Date;
  clientLastContactTime: Date;
  currentSubscriptionsCount: ec.UInt32;
  currentMonitoredItemsCount: ec.UInt32;
  currentPublishRequestsInQueue: ec.UInt32;
  totalRequestCount: ServiceCounterDataType;
  unauthorizedRequestCount: ec.UInt32;
  readCount: ServiceCounterDataType;
  historyReadCount: ServiceCounterDataType;
  writeCount: ServiceCounterDataType;
  historyUpdateCount: ServiceCounterDataType;
  callCount: ServiceCounterDataType;
  createMonitoredItemsCount: ServiceCounterDataType;
  modifyMonitoredItemsCount: ServiceCounterDataType;
  setMonitoringModeCount: ServiceCounterDataType;
  setTriggeringCount: ServiceCounterDataType;
  deleteMonitoredItemsCount: ServiceCounterDataType;
  createSubscriptionCount: ServiceCounterDataType;
  modifySubscriptionCount: ServiceCounterDataType;
  setPublishingModeCount: ServiceCounterDataType;
  publishCount: ServiceCounterDataType;
  republishCount: ServiceCounterDataType;
  transferSubscriptionsCount: ServiceCounterDataType;
  deleteSubscriptionsCount: ServiceCounterDataType;
  addNodesCount: ServiceCounterDataType;
  addReferencesCount: ServiceCounterDataType;
  deleteNodesCount: ServiceCounterDataType;
  deleteReferencesCount: ServiceCounterDataType;
  browseCount: ServiceCounterDataType;
  browseNextCount: ServiceCounterDataType;
  translateBrowsePathsToNodeIdsCount: ServiceCounterDataType;
  queryFirstCount: ServiceCounterDataType;
  queryNextCount: ServiceCounterDataType;
  registerNodesCount: ServiceCounterDataType;
  unregisterNodesCount: ServiceCounterDataType;

 constructor( options?: ISessionDiagnosticsDataType) {
  options = options || {};
  this.sessionId = (options.sessionId !== undefined) ? options.sessionId : null;
  this.sessionName = (options.sessionName !== undefined) ? options.sessionName : null;
  this.clientDescription = (options.clientDescription !== undefined) ? options.clientDescription : new ApplicationDescription();
  this.serverUri = (options.serverUri !== undefined) ? options.serverUri : null;
  this.endpointUrl = (options.endpointUrl !== undefined) ? options.endpointUrl : null;
  this.localeIds = (options.localeIds !== undefined) ? options.localeIds : [];
  this.actualSessionTimeout = (options.actualSessionTimeout !== undefined) ? options.actualSessionTimeout : null;
  this.maxResponseMessageSize = (options.maxResponseMessageSize !== undefined) ? options.maxResponseMessageSize : null;
  this.clientConnectionTime = (options.clientConnectionTime !== undefined) ? options.clientConnectionTime : null;
  this.clientLastContactTime = (options.clientLastContactTime !== undefined) ? options.clientLastContactTime : null;
  this.currentSubscriptionsCount = (options.currentSubscriptionsCount !== undefined) ? options.currentSubscriptionsCount : null;
  this.currentMonitoredItemsCount = (options.currentMonitoredItemsCount !== undefined) ? options.currentMonitoredItemsCount : null;
  this.currentPublishRequestsInQueue = (options.currentPublishRequestsInQueue !== undefined) ? options.currentPublishRequestsInQueue : null;
  this.totalRequestCount = (options.totalRequestCount !== undefined) ? options.totalRequestCount : new ServiceCounterDataType();
  this.unauthorizedRequestCount = (options.unauthorizedRequestCount !== undefined) ? options.unauthorizedRequestCount : null;
  this.readCount = (options.readCount !== undefined) ? options.readCount : new ServiceCounterDataType();
  this.historyReadCount = (options.historyReadCount !== undefined) ? options.historyReadCount : new ServiceCounterDataType();
  this.writeCount = (options.writeCount !== undefined) ? options.writeCount : new ServiceCounterDataType();
  this.historyUpdateCount = (options.historyUpdateCount !== undefined) ? options.historyUpdateCount : new ServiceCounterDataType();
  this.callCount = (options.callCount !== undefined) ? options.callCount : new ServiceCounterDataType();
  this.createMonitoredItemsCount = (options.createMonitoredItemsCount !== undefined) ? options.createMonitoredItemsCount : new ServiceCounterDataType();
  this.modifyMonitoredItemsCount = (options.modifyMonitoredItemsCount !== undefined) ? options.modifyMonitoredItemsCount : new ServiceCounterDataType();
  this.setMonitoringModeCount = (options.setMonitoringModeCount !== undefined) ? options.setMonitoringModeCount : new ServiceCounterDataType();
  this.setTriggeringCount = (options.setTriggeringCount !== undefined) ? options.setTriggeringCount : new ServiceCounterDataType();
  this.deleteMonitoredItemsCount = (options.deleteMonitoredItemsCount !== undefined) ? options.deleteMonitoredItemsCount : new ServiceCounterDataType();
  this.createSubscriptionCount = (options.createSubscriptionCount !== undefined) ? options.createSubscriptionCount : new ServiceCounterDataType();
  this.modifySubscriptionCount = (options.modifySubscriptionCount !== undefined) ? options.modifySubscriptionCount : new ServiceCounterDataType();
  this.setPublishingModeCount = (options.setPublishingModeCount !== undefined) ? options.setPublishingModeCount : new ServiceCounterDataType();
  this.publishCount = (options.publishCount !== undefined) ? options.publishCount : new ServiceCounterDataType();
  this.republishCount = (options.republishCount !== undefined) ? options.republishCount : new ServiceCounterDataType();
  this.transferSubscriptionsCount = (options.transferSubscriptionsCount !== undefined) ? options.transferSubscriptionsCount : new ServiceCounterDataType();
  this.deleteSubscriptionsCount = (options.deleteSubscriptionsCount !== undefined) ? options.deleteSubscriptionsCount : new ServiceCounterDataType();
  this.addNodesCount = (options.addNodesCount !== undefined) ? options.addNodesCount : new ServiceCounterDataType();
  this.addReferencesCount = (options.addReferencesCount !== undefined) ? options.addReferencesCount : new ServiceCounterDataType();
  this.deleteNodesCount = (options.deleteNodesCount !== undefined) ? options.deleteNodesCount : new ServiceCounterDataType();
  this.deleteReferencesCount = (options.deleteReferencesCount !== undefined) ? options.deleteReferencesCount : new ServiceCounterDataType();
  this.browseCount = (options.browseCount !== undefined) ? options.browseCount : new ServiceCounterDataType();
  this.browseNextCount = (options.browseNextCount !== undefined) ? options.browseNextCount : new ServiceCounterDataType();
  this.translateBrowsePathsToNodeIdsCount = (options.translateBrowsePathsToNodeIdsCount !== undefined) ? options.translateBrowsePathsToNodeIdsCount : new ServiceCounterDataType();
  this.queryFirstCount = (options.queryFirstCount !== undefined) ? options.queryFirstCount : new ServiceCounterDataType();
  this.queryNextCount = (options.queryNextCount !== undefined) ? options.queryNextCount : new ServiceCounterDataType();
  this.registerNodesCount = (options.registerNodesCount !== undefined) ? options.registerNodesCount : new ServiceCounterDataType();
  this.unregisterNodesCount = (options.unregisterNodesCount !== undefined) ? options.unregisterNodesCount : new ServiceCounterDataType();

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.sessionId, out);
  ec.encodeString(this.sessionName, out);
  this.clientDescription.encode(out);
  ec.encodeString(this.serverUri, out);
  ec.encodeString(this.endpointUrl, out);
  ec.encodeArray(this.localeIds, out, ec.encodeString);
  ec.encodeDouble(this.actualSessionTimeout, out);
  ec.encodeUInt32(this.maxResponseMessageSize, out);
  ec.encodeDateTime(this.clientConnectionTime, out);
  ec.encodeDateTime(this.clientLastContactTime, out);
  ec.encodeUInt32(this.currentSubscriptionsCount, out);
  ec.encodeUInt32(this.currentMonitoredItemsCount, out);
  ec.encodeUInt32(this.currentPublishRequestsInQueue, out);
  this.totalRequestCount.encode(out);
  ec.encodeUInt32(this.unauthorizedRequestCount, out);
  this.readCount.encode(out);
  this.historyReadCount.encode(out);
  this.writeCount.encode(out);
  this.historyUpdateCount.encode(out);
  this.callCount.encode(out);
  this.createMonitoredItemsCount.encode(out);
  this.modifyMonitoredItemsCount.encode(out);
  this.setMonitoringModeCount.encode(out);
  this.setTriggeringCount.encode(out);
  this.deleteMonitoredItemsCount.encode(out);
  this.createSubscriptionCount.encode(out);
  this.modifySubscriptionCount.encode(out);
  this.setPublishingModeCount.encode(out);
  this.publishCount.encode(out);
  this.republishCount.encode(out);
  this.transferSubscriptionsCount.encode(out);
  this.deleteSubscriptionsCount.encode(out);
  this.addNodesCount.encode(out);
  this.addReferencesCount.encode(out);
  this.deleteNodesCount.encode(out);
  this.deleteReferencesCount.encode(out);
  this.browseCount.encode(out);
  this.browseNextCount.encode(out);
  this.translateBrowsePathsToNodeIdsCount.encode(out);
  this.queryFirstCount.encode(out);
  this.queryNextCount.encode(out);
  this.registerNodesCount.encode(out);
  this.unregisterNodesCount.encode(out);

 }


 decode( inp: DataStream) {
  this.sessionId = ec.decodeNodeId(inp);
  this.sessionName = ec.decodeString(inp);
  this.clientDescription.decode(inp);
  this.serverUri = ec.decodeString(inp);
  this.endpointUrl = ec.decodeString(inp);
  this.localeIds = ec.decodeArray(inp, ec.decodeString);
  this.actualSessionTimeout = ec.decodeDouble(inp);
  this.maxResponseMessageSize = ec.decodeUInt32(inp);
  this.clientConnectionTime = ec.decodeDateTime(inp);
  this.clientLastContactTime = ec.decodeDateTime(inp);
  this.currentSubscriptionsCount = ec.decodeUInt32(inp);
  this.currentMonitoredItemsCount = ec.decodeUInt32(inp);
  this.currentPublishRequestsInQueue = ec.decodeUInt32(inp);
  this.totalRequestCount.decode(inp);
  this.unauthorizedRequestCount = ec.decodeUInt32(inp);
  this.readCount.decode(inp);
  this.historyReadCount.decode(inp);
  this.writeCount.decode(inp);
  this.historyUpdateCount.decode(inp);
  this.callCount.decode(inp);
  this.createMonitoredItemsCount.decode(inp);
  this.modifyMonitoredItemsCount.decode(inp);
  this.setMonitoringModeCount.decode(inp);
  this.setTriggeringCount.decode(inp);
  this.deleteMonitoredItemsCount.decode(inp);
  this.createSubscriptionCount.decode(inp);
  this.modifySubscriptionCount.decode(inp);
  this.setPublishingModeCount.decode(inp);
  this.publishCount.decode(inp);
  this.republishCount.decode(inp);
  this.transferSubscriptionsCount.decode(inp);
  this.deleteSubscriptionsCount.decode(inp);
  this.addNodesCount.decode(inp);
  this.addReferencesCount.decode(inp);
  this.deleteNodesCount.decode(inp);
  this.deleteReferencesCount.decode(inp);
  this.browseCount.decode(inp);
  this.browseNextCount.decode(inp);
  this.translateBrowsePathsToNodeIdsCount.decode(inp);
  this.queryFirstCount.decode(inp);
  this.queryNextCount.decode(inp);
  this.registerNodesCount.decode(inp);
  this.unregisterNodesCount.decode(inp);

 }


 clone( target?: SessionDiagnosticsDataType): SessionDiagnosticsDataType {
  if (!target) {
   target = new SessionDiagnosticsDataType();
  }
  target.sessionId = this.sessionId;
  target.sessionName = this.sessionName;
  if (this.clientDescription) { target.clientDescription = this.clientDescription.clone(); }
  target.serverUri = this.serverUri;
  target.endpointUrl = this.endpointUrl;
  target.localeIds = ec.cloneArray(this.localeIds);
  target.actualSessionTimeout = this.actualSessionTimeout;
  target.maxResponseMessageSize = this.maxResponseMessageSize;
  target.clientConnectionTime = this.clientConnectionTime;
  target.clientLastContactTime = this.clientLastContactTime;
  target.currentSubscriptionsCount = this.currentSubscriptionsCount;
  target.currentMonitoredItemsCount = this.currentMonitoredItemsCount;
  target.currentPublishRequestsInQueue = this.currentPublishRequestsInQueue;
  if (this.totalRequestCount) { target.totalRequestCount = this.totalRequestCount.clone(); }
  target.unauthorizedRequestCount = this.unauthorizedRequestCount;
  if (this.readCount) { target.readCount = this.readCount.clone(); }
  if (this.historyReadCount) { target.historyReadCount = this.historyReadCount.clone(); }
  if (this.writeCount) { target.writeCount = this.writeCount.clone(); }
  if (this.historyUpdateCount) { target.historyUpdateCount = this.historyUpdateCount.clone(); }
  if (this.callCount) { target.callCount = this.callCount.clone(); }
  if (this.createMonitoredItemsCount) { target.createMonitoredItemsCount = this.createMonitoredItemsCount.clone(); }
  if (this.modifyMonitoredItemsCount) { target.modifyMonitoredItemsCount = this.modifyMonitoredItemsCount.clone(); }
  if (this.setMonitoringModeCount) { target.setMonitoringModeCount = this.setMonitoringModeCount.clone(); }
  if (this.setTriggeringCount) { target.setTriggeringCount = this.setTriggeringCount.clone(); }
  if (this.deleteMonitoredItemsCount) { target.deleteMonitoredItemsCount = this.deleteMonitoredItemsCount.clone(); }
  if (this.createSubscriptionCount) { target.createSubscriptionCount = this.createSubscriptionCount.clone(); }
  if (this.modifySubscriptionCount) { target.modifySubscriptionCount = this.modifySubscriptionCount.clone(); }
  if (this.setPublishingModeCount) { target.setPublishingModeCount = this.setPublishingModeCount.clone(); }
  if (this.publishCount) { target.publishCount = this.publishCount.clone(); }
  if (this.republishCount) { target.republishCount = this.republishCount.clone(); }
  if (this.transferSubscriptionsCount) { target.transferSubscriptionsCount = this.transferSubscriptionsCount.clone(); }
  if (this.deleteSubscriptionsCount) { target.deleteSubscriptionsCount = this.deleteSubscriptionsCount.clone(); }
  if (this.addNodesCount) { target.addNodesCount = this.addNodesCount.clone(); }
  if (this.addReferencesCount) { target.addReferencesCount = this.addReferencesCount.clone(); }
  if (this.deleteNodesCount) { target.deleteNodesCount = this.deleteNodesCount.clone(); }
  if (this.deleteReferencesCount) { target.deleteReferencesCount = this.deleteReferencesCount.clone(); }
  if (this.browseCount) { target.browseCount = this.browseCount.clone(); }
  if (this.browseNextCount) { target.browseNextCount = this.browseNextCount.clone(); }
  if (this.translateBrowsePathsToNodeIdsCount) { target.translateBrowsePathsToNodeIdsCount = this.translateBrowsePathsToNodeIdsCount.clone(); }
  if (this.queryFirstCount) { target.queryFirstCount = this.queryFirstCount.clone(); }
  if (this.queryNextCount) { target.queryNextCount = this.queryNextCount.clone(); }
  if (this.registerNodesCount) { target.registerNodesCount = this.registerNodesCount.clone(); }
  if (this.unregisterNodesCount) { target.unregisterNodesCount = this.unregisterNodesCount.clone(); }
  return target;
 }


}
export function decodeSessionDiagnosticsDataType( inp: DataStream): SessionDiagnosticsDataType {
  const obj = new SessionDiagnosticsDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SessionDiagnosticsDataType', SessionDiagnosticsDataType, makeExpandedNodeId(867, 0));
