"use strict";
/**
 * @module opcua.client
 */
import { EventEmitter } from 'eventemitter3';
import { assert } from '../assert';
import { MonitoredItemBase } from './MonitoredItemBase';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';
import * as subscription_service from '../service-subscription';
/**
 * ClientMonitoredItemGroup
 * @class ClientMonitoredItemGroup
 * @extends EventEmitter
 *
 * @param subscription              {ClientSubscription}
 * @param itemsToMonitor             {Array<ReadValueId>}
 * @param itemsToMonitor.nodeId      {NodeId}
 * @param itemsToMonitor.attributeId {AttributeId}
 *
 * @param monitoringParameters      {MonitoringParameters}
 * @param timestampsToReturn        {TimestampsToReturn}
 * @constructor
 *
 * event:
 *    "initialized"
 *    "err"
 *    "changed"
 *
 *  note: this.monitoringMode = subscription_service.MonitoringMode.Reporting;
 */
export class MonitoredItemGroup extends EventEmitter {
    constructor(subscription, itemsToMonitor, monitoringParameters, timestampsToReturn) {
        super();
        assert(Array.isArray(itemsToMonitor));
        timestampsToReturn = timestampsToReturn || TimestampsToReturn.Neither;
        this._subscription = subscription;
        this._monitoredItems = itemsToMonitor.map(function (itemToMonitor) {
            return new MonitoredItemBase(subscription, itemToMonitor, monitoringParameters);
        });
        this._timestampsToReturn = timestampsToReturn;
        this._monitoringMode = subscription_service.MonitoringMode.Reporting;
    }
    get monitoredItems() {
        return this._monitoredItems;
    }
    toString() {
        var ret = "";
        ret += "itemsToMonitor:        " + this._monitoredItems.map((a) => {
            return a.nodeId.toString();
        }).join("\n");
        ret += "timestampsToReturn:   " + this._timestampsToReturn.toString() + "\n";
        ret += "monitoringMode        " + this._monitoringMode;
        return ret;
    }
    ;
    /**
     * remove the MonitoredItem from its subscription
     * @method terminate
     * @param  done {Function} the done callback
     * @async
     */
    terminate(done) {
        assert(!done || ('function' === typeof done));
        /**
         * Notify the observer that this monitored item has been terminated.
         * @event terminated
         */
        this.emit("terminated");
        this._subscription._delete_monitored_items(this._monitoredItems, function (err) {
            if (done) {
                done(err);
            }
        });
    }
    ;
    /**
     * @method _monitor
     * Creates the monitor item (monitoring mode = Reporting)
     * @param done {Function} callback
     * @private
     */
    _monitor(done) {
        assert(done === undefined || ('function' === typeof done));
        this._monitoredItems.forEach((monitoredItem, index) => {
            monitoredItem.on("changed", (dataValue) => {
                /**
                 * Notify the observers that a group MonitoredItem value has changed on the server side.
                 * @event changed
                 * @param monitoredItem
                 * @param value
                 * @param index
                 */
                try {
                    this.emit("changed", monitoredItem, dataValue, index);
                }
                catch (err) {
                    console.log(err);
                }
            });
        });
        MonitoredItemBase._toolbox_monitor(this._subscription, this._timestampsToReturn, this._monitoredItems, (err) => {
            if (err) {
                this.emit("terminated");
            }
            else {
                this.emit("initialized");
                // set the event handler
            }
            if (done) {
                done(err);
            }
        });
    }
    ;
    /**
     * @method modify
     * @param parameters {Object}
     * @param [timestampsToReturn=null] {TimestampsToReturn}
     * @param callback {Function}
     */
    modify(parameters, timestampsToReturn, callback) {
        this._timestampsToReturn = timestampsToReturn || this._timestampsToReturn;
        MonitoredItemBase._toolbox_modify(this._subscription, this._monitoredItems, parameters, this._timestampsToReturn, callback);
    }
    ;
    setMonitoringMode(monitoringMode, callback) {
        MonitoredItemBase._toolbox_setMonitoringMode(this._subscription, this._monitoredItems, monitoringMode, callback);
    }
    ;
    onChanged(callback) {
        this.on("changed", callback);
    }
    onTerminated(callback) {
        this.on("terminated", callback);
    }
    onInitialized(callback) {
        this.on("initialized", callback);
    }
}
//# sourceMappingURL=MonitoredItemGroup.js.map