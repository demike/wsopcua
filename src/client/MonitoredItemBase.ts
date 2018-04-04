"use strict";
/**
 * @module opcua.client
 */


import * as _ from 'underscore';
import {EventEmitter} from 'eventemitter3';
import {StatusCodes} from '../constants';
import {assert} from '../assert'

import * as subscription_service from "../service/service-subscription";

var read_service = require("node-opcua-service-read");

import {TimestampsToReturn} from '../generated/TimestampsToReturn';
import {AttributeIds, ObjectTypeIds} from '../constants';
import {ClientSubscription} from './ClientSubscription';

import {resolveNodeId} from '../nodeid/nodeid';

import {CreateMonitoredItemsRequest} from '../generated/CreateMonitoredItemsRequest';
import {ModifyMonitoredItemsRequest} from '../generated/ModifyMonitoredItemsRequest';
import { MonitoringParameters, IMonitoringParameters } from '../generated/MonitoringParameters';
import { MonitoringMode } from '../generated/MonitoringMode';
import { MonitoredItemCreateResult } from '../generated/MonitoredItemCreateResult';
import { MonitoredItem } from './MonitoredItem';
import { EventFilter } from '../generated/EventFilter';
import { ExtensionObject } from '../generated/ExtensionObject';
import { StatusCode} from '../basic-types';

//import {MonitoredItemsModifyRequest} from '../generated/MonitoredItemsModifyRequest';
var MonitoredItemModifyRequest = subscription_service.MonitoredItemModifyRequest;

export class MonitoredItemBase extends EventEmitter{

    protected _itemToMonitor : any;
    protected _monitoringParameters : MonitoringParameters;
    protected _subscription : ClientSubscription;
    protected _monitoringMode : MonitoringMode ;
    protected _statusCode : StatusCode;
    protected _result : MonitoredItemCreateResult;
    protected _monitoredItemId : number;
    protected _filterResult : ExtensionObject;

constructor(subscription, itemToMonitor, monitoringParameters : IMonitoringParameters) {
    super();
    assert(subscription.constructor.name === "ClientSubscription");
    var self = this;
    this._itemToMonitor = new read_service.ReadValueId(itemToMonitor);
    this._monitoringParameters = new MonitoringParameters(monitoringParameters);
    this._subscription = subscription;
    this._monitoringMode = subscription_service.MonitoringMode.Reporting;
    assert(this._monitoringParameters.clientHandle === 4294967295, "should not have a client handle yet");
}

public get monitoringParameters() {
    return this._monitoringParameters;
}

public get itemToMonitor() {
    return this._itemToMonitor;
}

public get monitoringMode() {
    return this._monitoringMode;
}



protected _notify_value_change(value) {
    /**
     * Notify the observers that the MonitoredItem value has changed on the server side.
     * @event changed
     * @param value
     */
     try {
       this.emit("changed", value);
     }
     catch(err) {
       console.log("Exception raised inside the event handler called by ClientMonitoredItem.on('change')",err);
       console.log("Please verify the application using this node-opcua client");
     }
};

protected _prepare_for_monitoring () {

    assert(this._subscription.subscriptionId !== "pending");
    assert(this._monitoringParameters.clientHandle === 4294967295, "should not have a client handle yet");
    this._monitoringParameters.clientHandle = this._subscription.nextClientHandle();
    assert(this._monitoringParameters.clientHandle > 0 && this._monitoringParameters.clientHandle !== 4294967295);

    // If attributeId is EventNotifier then monitoring parameters need a filter.
    // The filter must then either be DataChangeFilter, EventFilter or AggregateFilter.
    // todo can be done in another way?
    // todo implement AggregateFilter
    // todo support DataChangeFilter
    // todo support whereClause
    if (this._itemToMonitor.AttributeId === AttributeIds.EventNotifier) {

        //
        // see OPCUA Spec 1.02 part 4 page 65 : 5.12.1.4 Filter
        // see                 part 4 page 130: 7.16.3 EventFilter
        //                     part 3 page 11 : 4.6 Event Model
        // To monitor for Events, the attributeId element of the ReadValueId structure is the
        // the id of the EventNotifierAttribute

        // OPC Unified Architecture 1.02, Part 4 5.12.1.2 Sampling interval page 64:
        // "A Client shall define a sampling interval of 0 if it subscribes for Events."
        // toDO

        // note : the EventFilter is used when monitoring Events.
        this._monitoringParameters.filter = this._monitoringParameters.filter || new subscription_service.EventFilter({});

        var filter : ExtensionObject = this._monitoringParameters.filter;
        if (!(filter instanceof EventFilter)) {
            return {
                error: "Mismatch between attributeId and filter in monitoring parameters : " +
                "An EventFilter object is required when itemToMonitor.attributeId== AttributeIds.EventNotifier"
            };
        }

    } else if (this._itemToMonitor.AttributeId === AttributeIds.Value) {
        // the DataChangeFilter and the AggregateFilter are used when monitoring Variable Values

        // The Value Attribute is used when monitoring Variables. Variable values are monitored for a change
        // in value or a change in their status. The filters defined in this standard (see 7.16.2) and in Part 8 are
        // used to determine if the value change is large enough to cause a Notification to be generated for the
        // to do : check 'DataChangeFilter'  && 'AggregateFilter'
    } else {
        if (this._monitoringParameters.filter) {
            return {
                error: "Mismatch between attributeId and filter in monitoring parameters : " +
                "no filter expected when attributeId is not Value  or  EventNotifier"
            };
        }
    }
    return {
        error: null,
        itemToMonitor: this._itemToMonitor,
        monitoringMode: this._monitoringMode,
        requestedParameters: this._monitoringParameters
    };

};

protected _after_create(monitoredItemResult : MonitoredItemCreateResult) {

    this._statusCode = monitoredItemResult.statusCode;
    /* istanbul ignore else */
    if (monitoredItemResult.statusCode === StatusCodes.Good) {


        this._result = monitoredItemResult;
        this._monitoredItemId = monitoredItemResult.monitoredItemId;
        this._monitoringParameters.samplingInterval = monitoredItemResult.revisedSamplingInterval;
        this._monitoringParameters.queueSize = monitoredItemResult.revisedQueueSize;
        this._filterResult = monitoredItemResult.filterResult;


        this._subscription._add_monitored_item(this._monitoringParameters.clientHandle, self);
        /**
         * Notify the observers that the monitored item is now fully initialized.
         * @event initialized
         */
        this.emit("initialized");

    } else {

        /**
         * Notify the observers that the monitored item has failed to initialized.
         * @event err
         * @param statusCode {StatusCode}
         */
        var err = new Error(monitoredItemResult.statusCode.toString());
        this.emit("err", err.message);
        this.emit("terminated");
    }
};

public static _toolbox_monitor(subscription, timestampsToReturn, monitoredItems, done) {
    assert(_.isFunction(done));
    var itemsToCreate = [];
    for (var i = 0; i < monitoredItems.length; i++) {

        var monitoredItem = monitoredItems[i];
        var itemToCreate = monitoredItem._prepare_for_monitoring(done);
        if (_.isString(itemToCreate.error)) {
            return done(new Error(itemToCreate.error));
        }
        itemsToCreate.push(itemToCreate);
    }

    var createMonitorItemsRequest = new subscription_service.CreateMonitoredItemsRequest({
        subscriptionId: subscription.subscriptionId,
        timestampsToReturn: timestampsToReturn,
        itemsToCreate: itemsToCreate
    });

    assert(subscription.session);
    subscription.session.createMonitoredItems(createMonitorItemsRequest, function (err, response) {

        /* istanbul ignore next */
        if (err) {
            //xx console.log("ClientMonitoredItemBase#_toolbox_monitor:  ERROR in createMonitoredItems ".red, err.message);
            //xx  console.log("ClientMonitoredItemBase#_toolbox_monitor:  ERROR in createMonitoredItems ".red, err);
            //xx  console.log(createMonitorItemsRequest.toString());
        } else {
            assert(response instanceof subscription_service.CreateMonitoredItemsResponse);

            for (var i = 0; i < response.results.length; i++) {
                var monitoredItemResult = response.results[i];
                var monitoredItem = monitoredItems[i];
                monitoredItem._after_create(monitoredItemResult);
            }
        }
        done(err);
    });

};
public static _toolbox_modify(subscription, monitoredItems, parameters, timestampsToReturn, callback) {

    assert(callback === undefined || _.isFunction(callback));

    var itemsToModify = monitoredItems.map(function (monitoredItem) {
        var clientHandle = monitoredItem.monitoringParameters.clientHandle;
        return new MonitoredItemModifyRequest({
            monitoredItemId: monitoredItem.monitoredItemId,
            requestedParameters: _.extend(_.clone(parameters), {clientHandle: clientHandle})
        });
    });
    var modifyMonitoredItemsRequest = new ModifyMonitoredItemsRequest({
        subscriptionId: subscription.subscriptionId,
        timestampsToReturn: timestampsToReturn,
        itemsToModify: itemsToModify
    });

    subscription.session.modifyMonitoredItems(modifyMonitoredItemsRequest, function (err, response) {

        /* istanbul ignore next */
        if (err) {
            return callback(err);
        }
        assert(response.results.length === monitoredItems.length);

        var res = response.results[0];

        /* istanbul ignore next */
        if (response.results.length === 1 && res.statusCode !== StatusCodes.Good) {
            return callback(new Error("Error" + res.statusCode.toString()));
        }
        callback(null, response.results);
    });
};
public static _toolbox_setMonitoringMode(subscription : ClientSubscription, monitoredItems : MonitoredItemBase[], monitoringMode : MonitoringMode, callback) {

    var monitoredItemIds = monitoredItems.map(function (monitoredItem) {
        return monitoredItem._monitoredItemId;
    });

    var setMonitoringModeRequest = {
        subscriptionId: subscription.subscriptionId,
        monitoringMode: monitoringMode,
        monitoredItemIds: monitoredItemIds
    };
    subscription.session.setMonitoringMode(setMonitoringModeRequest, (err, results) => {
        if (!err) {
            monitoredItems.forEach((monitoredItem) => {
                monitoredItem._monitoringMode = monitoringMode;
            });
        }
        if (callback) {
            callback(err, results ? results[0] : null);
        }
    });

};
}
