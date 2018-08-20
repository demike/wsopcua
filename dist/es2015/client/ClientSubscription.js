"use strict";
/**
 * @module opcua.client
 */
import { EventEmitter } from 'eventemitter3';
import { StatusCodes } from '../constants';
import { assert } from '../assert';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';
import { AttributeIds } from '../constants';
import { resolveNodeId } from '../nodeid/nodeid';
import * as subscription_service from "../service-subscription";
import { ClientSession } from './client_session';
import { MonitoredItem } from './MonitoredItem';
import { MonitoredItemGroup } from './MonitoredItemGroup';
import { doDebug, debugLog } from '../common/debug';
import 'setimmediate';
import series from 'async-es/series';
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
export class ClientSubscription extends EventEmitter {
    constructor(session, options) {
        super();
        this.hasTimedOut = false;
        assert(session instanceof ClientSession);
        this._publishEngine = session.getPublishEngine();
        //// options should have
        //var allowedProperties = [
        //    'requestedPublishingInterval',
        //    'requestedLifetimeCount',
        //    'requestedMaxKeepAliveCount',
        //    'maxNotificationsPerPublish',
        //    'publishingEnabled',
        //    'priority'
        //];
        options = options || {};
        options.requestedPublishingInterval = options.requestedPublishingInterval || 100;
        options.requestedLifetimeCount = options.requestedLifetimeCount || 60;
        options.requestedMaxKeepAliveCount = options.requestedMaxKeepAliveCount || 10;
        options.maxNotificationsPerPublish = (options.maxNotificationsPerPublish == null || options.maxNotificationsPerPublish == undefined) ? 0 : options.maxNotificationsPerPublish;
        options.publishingEnabled = options.publishingEnabled ? true : false;
        options.priority = options.priority || 1;
        this._publishingInterval = options.requestedPublishingInterval;
        this.lifetimeCount = options.requestedLifetimeCount;
        this.maxKeepAliveCount = options.requestedMaxKeepAliveCount;
        this.maxNotificationsPerPublish = options.maxNotificationsPerPublish;
        this._publishingEnabled = options.publishingEnabled;
        this.priority = options.priority;
        this._subscriptionId = "pending";
        this._next_client_handle = 0;
        this.monitoredItems = {};
        /**
         * set to True when the server has notified us that this sbuscription has timed out
         * ( maxLifeCounter x published interval without being able to process a PublishRequest
         * @property hasTimedOut
         * @type {boolean}
         */
        this.hasTimedOut = false;
        setImmediate(() => {
            this.__create_subscription((err) => {
                if (!err) {
                    setImmediate(() => {
                        /**
                         * notify the observers that the subscription has now started
                         * @event started
                         */
                        this.emit("started", this.subscriptionId);
                    });
                }
            });
        });
    }
    /**
     * the associated session
     * @property session
     * @type {ClientSession}
     */
    get session() {
        return this._publishEngine.session;
    }
    get subscriptionId() {
        return this._subscriptionId;
    }
    get timeoutHint() {
        return this._timeoutHint;
    }
    __create_subscription(callback) {
        assert('function' === typeof callback);
        var session = this._publishEngine.session;
        debugLog("ClientSubscription created ");
        var request = new subscription_service.CreateSubscriptionRequest({
            requestedPublishingInterval: this._publishingInterval,
            requestedLifetimeCount: this.lifetimeCount,
            requestedMaxKeepAliveCount: this.maxKeepAliveCount,
            maxNotificationsPerPublish: this.maxNotificationsPerPublish,
            publishingEnabled: this._publishingEnabled,
            priority: this.priority
        });
        session.createSubscription(request, (err, response) => {
            if (err) {
                /* istanbul ignore next */
                this.emit("internal_error", err);
                if (callback) {
                    return callback(err);
                }
            }
            else {
                this._subscriptionId = response.subscriptionId;
                this._publishingInterval = response.revisedPublishingInterval;
                this.lifetimeCount = response.revisedLifetimeCount;
                this.maxKeepAliveCount = response.revisedMaxKeepAliveCount;
                this._timeoutHint = (this.maxKeepAliveCount + 10) * this._publishingInterval;
                if (doDebug) {
                    debugLog("registering callback");
                    debugLog("publishingInterval               " + this._publishingInterval);
                    debugLog("lifetimeCount                    " + this.lifetimeCount);
                    debugLog("maxKeepAliveCount                " + this.maxKeepAliveCount);
                    debugLog("publish request timeout hint =   " + this._timeoutHint);
                }
                this._publishEngine.registerSubscription(this);
                if (callback) {
                    callback(err);
                }
            }
        });
    }
    ;
    __on_publish_response_DataChangeNotification(notification) {
        assert(notification instanceof subscription_service.DataChangeNotification);
        var monitoredItems = notification.monitoredItems;
        monitoredItems.forEach((monitoredItem) => {
            var monitorItemObj = this.monitoredItems[monitoredItem.clientHandle];
            if (monitorItemObj) {
                if (monitorItemObj.itemToMonitor.attributeId === AttributeIds.EventNotifier) {
                    console.log("Warning: Server send a DataChangeNotification for an EventNotifier. EventNotificationList was expected");
                    console.log("         the Server may not be fully OPCUA compliant. This notification will be ignored.");
                }
                else {
                    monitorItemObj._notify_value_change(monitoredItem.value);
                }
            }
        });
    }
    ;
    __on_publish_response_StatusChangeNotification(notification) {
        assert(notification instanceof subscription_service.StatusChangeNotification);
        debugLog("Client has received a Status Change Notification " + notification.status.toString());
        //TODO !!!! what is this supposed to do --> this notification has no subscriptionId !!!!
        this._publishEngine.cleanup_acknowledgment_for_subscription(notification.subscriptionId);
        if (notification.status === StatusCodes.GoodSubscriptionTransferred) {
            // OPCUA UA Spec 1.0.3 : part 3 - page 82 - 5.13.7 TransferSubscriptions:
            // If the Server transfers the Subscription to the new Session, the Server shall issue a StatusChangeNotification
            // notificationMessage with the status code Good_SubscriptionTransferred to the old Session.
            console.log("ClientSubscription#__on_publish_response_StatusChangeNotification : GoodSubscriptionTransferred");
            this.hasTimedOut = true;
            this.terminate(() => { });
        }
        if (notification.status === StatusCodes.BadTimeout) {
            // the server tells use that the subscription has timed out ..
            // this mean that this subscription has been closed on the server side and cannot process any
            // new PublishRequest.
            //
            // from Spec OPCUA Version 1.03 Part 4 - 5.13.1.1 Description : Page 69:
            //
            // h. Subscriptions have a lifetime counter that counts the number of consecutive publishing cycles in
            //    which there have been no Publish requests available to send a Publish response for the
            //    Subscription. Any Service call that uses the SubscriptionId or the processing of a Publish
            //    response resets the lifetime counter of this Subscription. When this counter reaches the value
            //    calculated for the lifetime of a Subscription based on the MaxKeepAliveCount parameter in the
            //    CreateSubscription Service (5.13.2), the Subscription is closed. Closing the Subscription causes
            //    its MonitoredItems to be deleted. In addition the Server shall issue a StatusChangeNotification
            //    notificationMessage with the status code Bad_Timeout.
            //
            this.hasTimedOut = true;
            this.terminate(() => { });
        }
        /**
         * notify the observers that the server has send a status changed notification (such as BadTimeout )
         * @event status_changed
         */
        this.emit("status_changed", notification.status, notification.diagnosticInfo);
    }
    ;
    __on_publish_response_EventNotificationList(notification) {
        assert(notification instanceof subscription_service.EventNotificationList);
        notification.events.forEach((event) => {
            var monitorItemObj = this.monitoredItems[event.clientHandle];
            assert(monitorItemObj, "Expecting a monitored item");
            monitorItemObj._notify_value_change(event.eventFields);
        });
    }
    ;
    onNotificationMessage(notificationMessage) {
        assert(notificationMessage.hasOwnProperty("sequenceNumber"));
        this.lastSequenceNumber = notificationMessage.sequenceNumber;
        this.emit("raw_notification", notificationMessage);
        var notificationData = notificationMessage.notificationData;
        if (notificationData.length === 0) {
            // this is a keep alive message
            debugLog("Client : received a keep alive notification from client");
            /**
             * notify the observers that a keep alive Publish Response has been received from the server.
             * @event keepalive
             */
            this.emit("keepalive");
        }
        else {
            /**
             * notify the observers that some notifications has been received from the server in  a PublishResponse
             * each modified monitored Item
             * @event  received_notifications
             */
            this.emit("received_notifications", notificationMessage);
            // let publish a global event
            // now process all notifications
            notificationData.forEach((notification) => {
                // DataChangeNotification / StatusChangeNotification / EventNotification
                switch (notification.constructor) {
                    case subscription_service.DataChangeNotification:
                        // now inform each individual monitored item
                        this.__on_publish_response_DataChangeNotification(notification);
                        break;
                    case subscription_service.StatusChangeNotification:
                        this.__on_publish_response_StatusChangeNotification(notification);
                        break;
                    case subscription_service.EventNotificationList:
                        this.__on_publish_response_EventNotificationList(notification);
                        break;
                    default:
                        console.log(" Invalid notification :", notification.toString());
                }
            });
        }
    }
    ;
    _terminate_step2(callback) {
        setImmediate(() => {
            /**
             * notify the observers tha the client subscription has terminated
             * @event  terminated
             */
            this._subscriptionId = "terminated";
            this.emit("terminated");
            callback();
        });
    }
    ;
    /**
     * @method terminate
     * @param callback
     *
     */
    terminate(callback) {
        assert('function' === typeof callback, "expecting a callback function");
        if (this._subscriptionId === "terminated") {
            // already terminated... just ignore
            return callback(new Error("Already Terminated"));
        }
        if (Number.isFinite(this._subscriptionId)) {
            this._publishEngine.unregisterSubscription(this._subscriptionId);
            if (!this.session) {
                return this._terminate_step2(callback);
            }
            this.session.deleteSubscriptions({
                subscriptionIds: [this._subscriptionId]
            }, (err) => {
                if (err) {
                    /**
                     * notify the observers that an error has occurred
                     * @event internal_error
                     * @param {Error} err the error
                     */
                    this.emit("internal_error", err);
                }
                this._terminate_step2(callback);
            });
        }
        else {
            assert(this._subscriptionId === "pending");
            this._terminate_step2(callback);
        }
    }
    ;
    /**
     * increment and get next client handle
     * @method nextClientHandle
     */
    nextClientHandle() {
        this._next_client_handle += 1;
        return this._next_client_handle;
    }
    ;
    _add_monitored_item(clientHandle, monitoredItem) {
        assert(this.isActive(), "subscription must be active and not terminated");
        assert(monitoredItem.monitoringParameters.clientHandle === clientHandle);
        this.monitoredItems[clientHandle] = monitoredItem;
        /**
         * notify the observers that a new monitored item has been added to the subscription.
         * @event item_added
         * @param {MonitoredItem} the monitored item.
         */
        this.emit("item_added", monitoredItem);
    }
    ;
    _wait_for_subscription_to_be_ready(done) {
        var self = this;
        var _watch_dog = 0;
        function wait_for_subscription_and_monitor() {
            _watch_dog++;
            if (self._subscriptionId === "pending") {
                // the subscriptionID is not yet known because the server hasn't replied yet
                // let postpone this call, a little bit, to let things happen
                setImmediate(wait_for_subscription_and_monitor);
            }
            else if (self._subscriptionId === "terminated") {
                // the subscription has been terminated in the meantime
                // this indicates a potential issue in the code using this api.
                if ('function' === typeof done) {
                    done(new Error("subscription has been deleted"));
                }
            }
            else {
                done();
            }
        }
        setImmediate(wait_for_subscription_and_monitor);
    }
    ;
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
    monitor(itemToMonitor, requestedParameters, timestampsToReturn, done) {
        assert(done === undefined || ('function' === typeof done));
        itemToMonitor.nodeId = resolveNodeId(itemToMonitor.nodeId);
        var monitoredItem = new MonitoredItem(this, itemToMonitor, requestedParameters, timestampsToReturn);
        this._wait_for_subscription_to_be_ready((err) => {
            if (err) {
                return done && done(err);
            }
            monitoredItem._monitor(function (err) {
                if (err) {
                    return done && done(err);
                }
                done && done(err, monitoredItem);
            });
        });
        return monitoredItem;
    }
    ;
    /**
     * @method monitorItems
     * @param itemsToMonitor
     * @param requestedParameters
     * @param timestampsToReturn
     * @param done
     */
    monitorItems(itemsToMonitor, requestedParameters, timestampsToReturn, done) {
        // Try to resolve the nodeId and fail fast if we can't.
        itemsToMonitor.forEach(function (itemToMonitor) {
            itemToMonitor.nodeId = resolveNodeId(itemToMonitor.nodeId);
        });
        var monitoredItemGroup = new MonitoredItemGroup(this, itemsToMonitor, requestedParameters, timestampsToReturn);
        this._wait_for_subscription_to_be_ready(function (err) {
            if (err) {
                return done && done(err);
            }
            monitoredItemGroup._monitor(function (err) {
                if (err) {
                    return done && done(err);
                }
                done && done(err, monitoredItemGroup);
            });
        });
        return monitoredItemGroup;
    }
    ;
    // ClientSubscription.prototype.monitorOld = function (itemToMonitor, requestedParameters, timestampsToReturn, done) {
    //
    //     var self = this;
    //
    //
    //     assert(itemToMonitor.nodeId);
    //     assert(itemToMonitor.attributeId);
    //     assert(done === undefined || ('function' === typeof done));
    //     assert('function' !== typeof timestampsToReturn);
    //
    //     // Try to resolve the nodeId and fail fast if we can't.
    //     resolveNodeId(itemToMonitor.nodeId);
    //
    //     timestampsToReturn = timestampsToReturn || TimestampsToReturn.Neither;
    //
    //
    //     var monitoredItem = new ClientMonitoredItem(this, itemToMonitor, requestedParameters, timestampsToReturn);
    //
    //     var _watch_dog = 0;
    //
    //     function wait_for_subscription_and_monitor() {
    //
    //         _watch_dog++;
    //
    //         if (self.subscriptionId === "pending") {
    //             // the subscriptionID is not yet known because the server hasn't replied yet
    //             // let postpone this call, a little bit, to let things happen
    //             setImmediate(wait_for_subscription_and_monitor);
    //
    //         } else if (self.subscriptionId === "terminated") {
    //             // the subscription has been terminated in the meantime
    //             // this indicates a potential issue in the code using this api.
    //             if ('function' === typeof done) {
    //                 done(new Error("subscription has been deleted"));
    //             }
    //         } else {
    //             //xxx console.log("xxxx _watch_dog ",_watch_dog);
    //             monitoredItem._monitor(done);
    //         }
    //     }
    //
    //     setImmediate(wait_for_subscription_and_monitor);
    //     return monitoredItem;
    // };
    isActive() {
        return typeof this._subscriptionId !== "string";
    }
    ;
    _remove(monitoredItem) {
        var clientHandle = monitoredItem.monitoringParameters.clientHandle;
        assert(clientHandle);
        assert(clientHandle in this.monitoredItems);
        monitoredItem.removeAllListeners();
        delete this.monitoredItems[clientHandle];
    }
    ;
    _delete_monitored_items(monitoredItems, callback) {
        assert(Array.isArray(monitoredItems));
        assert(this.isActive());
        monitoredItems.forEach((monitoredItem) => {
            this._remove(monitoredItem);
        });
        this.session.deleteMonitoredItems({
            subscriptionId: this.subscriptionId,
            monitoredItemIds: monitoredItems.map(function (monitoredItem) {
                return monitoredItem.monitoredItemId;
            })
        }, function (err) {
            callback(err);
        });
    }
    ;
    _delete_monitored_item(monitoredItem, callback) {
        this._delete_monitored_items([monitoredItem], callback);
    }
    ;
    setPublishingMode(publishingEnabled, callback) {
        assert('function' === typeof callback);
        this.session.setPublishingMode(publishingEnabled, this._subscriptionId, (err, results) => {
            if (err) {
                return callback(err);
            }
            if (results[0] !== StatusCodes.Good) {
                return callback(new Error("Cannot setPublishingMode " + results[0].toString()));
            }
            callback();
        });
    }
    ;
    /**
     *  utility function to recreate new subscription
     *  @method recreateSubscriptionAndMonitoredItem
     */
    recreateSubscriptionAndMonitoredItem(callback) {
        debugLog("ClientSubscription#recreateSubscriptionAndMonitoredItem");
        var monitoredItems_old = this.monitoredItems;
        this._publishEngine.unregisterSubscription(this._subscriptionId);
        series([
            this.__create_subscription.bind(this),
            function (callback) {
                var test = this._publishEngine.getSubscription(this.subscriptionId);
                assert(test === this);
                // re-create monitored items
                let itemsToCreate = [];
                for (let key in monitoredItems_old) {
                    let monitoredItem = monitoredItems_old[key];
                    assert(monitoredItem.monitoringParameters.clientHandle > 0);
                    itemsToCreate.push(new subscription_service.MonitoredItemCreateRequest({
                        itemToMonitor: monitoredItem.itemToMonitor,
                        monitoringMode: monitoredItem.monitoringMode,
                        requestedParameters: monitoredItem.monitoringParameters
                    }));
                }
                var createMonitorItemsRequest = new subscription_service.CreateMonitoredItemsRequest({
                    subscriptionId: this._subscriptionId,
                    timestampsToReturn: TimestampsToReturn.Both,
                    itemsToCreate: itemsToCreate
                });
                this.session.createMonitoredItems(createMonitorItemsRequest, (err, response) => {
                    if (!err) {
                        assert(response instanceof subscription_service.CreateMonitoredItemsResponse);
                        var monitoredItemResults = response.results;
                        monitoredItemResults.forEach(function (monitoredItemResult, index) {
                            var clientHandle = itemsToCreate[index].requestedParameters.clientHandle;
                            var monitoredItem = this.monitoredItems[clientHandle];
                            if (monitoredItemResult.statusCode === StatusCodes.Good) {
                                monitoredItem.result = monitoredItemResult;
                                monitoredItem.monitoredItemId = monitoredItemResult.monitoredItemId;
                                monitoredItem.monitoringParameters.samplingInterval = monitoredItemResult.revisedSamplingInterval;
                                monitoredItem.monitoringParameters.queueSize = monitoredItemResult.revisedQueueSize;
                                monitoredItem.filterResult = monitoredItemResult.filterResult;
                                // istanbul ignore next
                                if (doDebug) {
                                    debugLog("monitoredItemResult.statusCode = " + monitoredItemResult.toString());
                                }
                            }
                            else {
                                // TODO: what should we do ?
                                debugLog("monitoredItemResult.statusCode = " + monitoredItemResult.statusCode.toString());
                            }
                        });
                    }
                    callback(err);
                });
            }
        ], callback);
    }
    ;
}
//# sourceMappingURL=ClientSubscription.js.map