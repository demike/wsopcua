/**
 * @module opcua.client
 */
import { EventEmitter } from 'eventemitter3';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';
import * as subscription_service from "../service-subscription";
import { ClientSession } from './client_session';
import { MonitoredItem } from './MonitoredItem';
import { ReadValueId, IReadValueId } from '../generated/ReadValueId';
import { MonitoredItemGroup } from './MonitoredItemGroup';
import { ClientSidePublishEngine } from './client_publish_engine';
import 'setimmediate';
import { IMonitoringParameters } from '../generated/MonitoringParameters';
import { ICreateSubscriptionRequest } from '../generated/CreateSubscriptionRequest';
import { MonitoredItemBase } from './MonitoredItemBase';
/**
 * a object to manage a subscription on the client side.
 *
 * @class ClientSubscription
 * @extends EventEmitter
 *
 * @param session
 * @param options {Object}
 * @param options.requestedPublishingInterval {Number}
 * @param options.requestedLifetimeCount {Number}
 * @param options.requestedMaxKeepAliveCount {Number}
 * @param options.maxNotificationsPerPublish {Number}
 * @param options.publishingEnabled {Boolean}
 * @param options.priority {Number}
 * @constructor
 *
 * events:
 *    "started",     callback(subscriptionId)  : the subscription has been initiated
 *    "terminated"                             : the subscription has been deleted
 *    "error",                                 : the subscription has received an error
 *    "keepalive",                             : the subscription has received a keep alive message from the server
 *    "received_notifications",                : the subscription has received one or more notification
 */
export declare class ClientSubscription extends EventEmitter {
    protected hasTimedOut: boolean;
    protected _publishEngine: ClientSidePublishEngine;
    protected _subscriptionId: number | string;
    protected _publishingEnabled: boolean;
    protected _publishingInterval: number;
    protected lifetimeCount: number;
    protected maxKeepAliveCount: number;
    protected maxNotificationsPerPublish: number;
    protected priority: number;
    protected _next_client_handle: number;
    protected monitoredItems: {
        [key: number]: MonitoredItemBase;
    };
    protected _timeoutHint: number;
    protected lastSequenceNumber: number;
    /**
     * the associated session
     * @property session
     * @type {ClientSession}
     */
    readonly session: ClientSession;
    readonly subscriptionId: string | number;
    readonly timeoutHint: number;
    constructor(session: ClientSession, options: ICreateSubscriptionRequest);
    protected __create_subscription(callback: any): void;
    protected __on_publish_response_DataChangeNotification(notification: subscription_service.DataChangeNotification): void;
    protected __on_publish_response_StatusChangeNotification(notification: subscription_service.StatusChangeNotification): void;
    protected __on_publish_response_EventNotificationList(notification: subscription_service.EventNotificationList): void;
    onNotificationMessage(notificationMessage: subscription_service.NotificationMessage): void;
    protected _terminate_step2(callback: any): void;
    /**
     * @method terminate
     * @param callback
     *
     */
    terminate(callback: any): any;
    /**
     * increment and get next client handle
     * @method nextClientHandle
     */
    nextClientHandle(): number;
    _add_monitored_item(clientHandle: any, monitoredItem: any): void;
    protected _wait_for_subscription_to_be_ready(done: any): void;
    /**
     * add a monitor item to the subscription
     *
     * @method monitor
     * @async
     * @param itemToMonitor                        {ReadValueId}
     * @param itemToMonitor.nodeId                 {NodeId}
     * @param itemToMonitor.attributeId            {AttributeId}
     * @param itemToMonitor.indexRange             {null|NumericRange}
     * @param itemToMonitor.dataEncoding
     * @param requestedParameters                  {MonitoringParameters}
     * @param requestedParameters.clientHandle     {IntegerId}
     * @param requestedParameters.samplingInterval {Duration}
     * @param requestedParameters.filter           {ExtensionObject|null} EventFilter/DataChangeFilter
     * @param requestedParameters.queueSize        {Counter}
     * @param requestedParameters.discardOldest    {Boolean}
     * @param timestampsToReturn                   {TimestampsToReturn} //{TimestampsToReturnId}
     * @param  [done]                              {Function} optional done callback
     * @return {ClientMonitoredItem}
     *
     *
     * Monitoring a simple Value Change
     * ---------------------------------
     *
     * @example:
     *
     *   clientSubscription.monitor(
     *     // itemToMonitor:
     *     {
     *       nodeId: "ns=0;i=2258",
     *       attributeId: AttributeIds.Value,
     *       indexRange: null,
     *       dataEncoding: { namespaceIndex: 0, name: null }
     *     },
     *     // requestedParameters:
     *     {
     *        samplingInterval: 3000,
     *        filter: null,
     *        queueSize: 1,
     *        discardOldest: true
     *     },
     *     TimestampsToReturn.Neither
     *   );
     *
     * Monitoring a Value Change With a DataChange  Filter
     * ---------------------------------------------------
     *
     * options.trigger       {DataChangeTrigger} {Status|StatusValue|StatusValueTimestamp}
     * options.deadbandType  {DeadbandType}      {None|Absolute|Percent}
     * options.deadbandValue {Double}
    
     * @example:
     *
     *   clientSubscription.monitor(
     *     // itemToMonitor:
     *     {
     *       nodeId: "ns=0;i=2258",
     *       attributeId: AttributeIds.Value,
     *     },
     *     // requestedParameters:
     *     {
     *        samplingInterval: 3000,
     *        filter: new DataChangeFilter({
     *             trigger: DataChangeTrigger.StatusValue,
     *             deadbandType: DeadBandType.Absolute,
     *             deadbandValue: 0.1
     *        }),
     *        queueSize: 1,
     *        discardOldest: true
     *     },
     *     TimestampsToReturn.Neither
     *   );
     *
     *
     * Monitoring an Event
     * -------------------
     *
     *  If the monitor attributeId is EventNotifier then the filter must be specified
     *
     * @example:
     *
     *  var filter =  new subscription_service.EventFilter({
     *    selectClauses: [
     *             { browsePath: [ {name: 'ActiveState'  }, {name: 'id'}  ]},
     *             { browsePath: [ {name: 'ConditionName'}                ]}
     *    ],
     *    whereClause: []
     *  });
     *
     *  clientSubscription.monitor(
     *     // itemToMonitor:
     *     {
     *       nodeId: "ns=0;i=2258",
     *       attributeId: AttributeIds.EventNotifier,
     *       indexRange: null,
     *       dataEncoding: { namespaceIndex: 0, name: null }
     *     },
     *     // requestedParameters:
     *     {
     *        samplingInterval: 3000,
     *
     *        filter: filter,
     *
     *        queueSize: 1,
     *        discardOldest: true
     *     },
     *     TimestampsToReturn.Neither
     *   );
     *
     *
     *
     *
     *
     *
     */
    monitor(itemToMonitor: ReadValueId, requestedParameters: IMonitoringParameters, timestampsToReturn: TimestampsToReturn, done?: (err: Error | null, mItem?: MonitoredItem) => void): MonitoredItem;
    /**
     * @method monitorItems
     * @param itemsToMonitor
     * @param requestedParameters
     * @param timestampsToReturn
     * @param done
     */
    monitorItems(itemsToMonitor: IReadValueId[], requestedParameters: IMonitoringParameters, timestampsToReturn?: TimestampsToReturn, done?: (err: Error | null, mItemGroup?: MonitoredItemGroup) => void): MonitoredItemGroup;
    isActive(): boolean;
    protected _remove(monitoredItem: MonitoredItemBase): void;
    _delete_monitored_items(monitoredItems: MonitoredItemBase[], callback: any): void;
    protected _delete_monitored_item(monitoredItem: MonitoredItemBase, callback: any): void;
    setPublishingMode(publishingEnabled: any, callback: any): void;
    /**
     *  utility function to recreate new subscription
     *  @method recreateSubscriptionAndMonitoredItem
     */
    recreateSubscriptionAndMonitoredItem(callback: any): void;
}
