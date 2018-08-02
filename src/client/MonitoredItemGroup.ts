"use strict";
/**
 * @module opcua.client
 */

import * as _ from 'underscore';
import {EventEmitter} from 'eventemitter3';
import {assert} from '../assert'
import {MonitoredItemBase} from './MonitoredItemBase'
import { ClientSubscription } from '../client/ClientSubscription';
import { ReadValueId, IReadValueId } from '../generated/ReadValueId';
import { MonitoringParameters, IMonitoringParameters } from '../generated/MonitoringParameters';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';
import { MonitoringMode } from '../generated/MonitoringMode';

import * as subscription_service from '../service-subscription';
import * as read_service from '../service-read';
import { DataValue } from '../data-value';



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
export class MonitoredItemGroup extends EventEmitter{
    protected _monitoredItems : MonitoredItemBase[];
    protected _subscription : ClientSubscription;
    protected _timestampsToReturn : TimestampsToReturn;
    protected _monitoringMode : MonitoringMode;
constructor (subscription : ClientSubscription, itemsToMonitor : IReadValueId[], monitoringParameters : IMonitoringParameters, timestampsToReturn : TimestampsToReturn) {
    super();
    assert(_.isArray(itemsToMonitor));

    timestampsToReturn = timestampsToReturn || TimestampsToReturn.Neither;

    this._subscription = subscription;

    this._monitoredItems = itemsToMonitor.map(function (itemToMonitor) {
        return new MonitoredItemBase(subscription, itemToMonitor, monitoringParameters);
    });

    this._timestampsToReturn = timestampsToReturn;
    this._monitoringMode = subscription_service.MonitoringMode.Reporting;
}

public get monitoredItems() : MonitoredItemBase[] {
    return this._monitoredItems;
}

public toString() : string {

    
    var ret = "";
    ret += "itemsToMonitor:        " + this._monitoredItems.map( (a) => {
          return a.nodeId.toString()
      }).join("\n");

    ret += "timestampsToReturn:   " + this._timestampsToReturn.toString() + "\n";
    ret += "monitoringMode        " + this._monitoringMode;
    return ret;
};

/**
 * remove the MonitoredItem from its subscription
 * @method terminate
 * @param  done {Function} the done callback
 * @async
 */
public terminate(done : Function) : void {

    assert(!done || _.isFunction(done));
    
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
};


/**
 * @method _monitor
 * Creates the monitor item (monitoring mode = Reporting)
 * @param done {Function} callback
 * @private
 */
public _monitor(done) : void {
    assert(done === undefined || _.isFunction(done));
    

    this._monitoredItems.forEach((monitoredItem, index) => {
        monitoredItem.on("changed",  (dataValue) => {
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
        } else {
            this.emit("initialized");
            // set the event handler
        }

        if (done) {
            done(err);
        }
    });
};

/**
 * @method modify
 * @param parameters {Object}
 * @param [timestampsToReturn=null] {TimestampsToReturn}
 * @param callback {Function}
 */
public modify(parameters, timestampsToReturn?: TimestampsToReturn, callback?) : void {
    
    this._timestampsToReturn = timestampsToReturn || this._timestampsToReturn;
    MonitoredItemBase._toolbox_modify(this._subscription, this._monitoredItems, parameters, this._timestampsToReturn, callback);
};

public setMonitoringMode(monitoringMode : MonitoringMode, callback) : void {
    
    MonitoredItemBase._toolbox_setMonitoringMode(this._subscription, this._monitoredItems, monitoringMode, callback);
};


public onChanged(callback : (item : MonitoredItemBase,dataValue : DataValue,index : number) => void) {
    this.on("changed",callback);
}

public onTerminated(callback : () => void ) {
    this.on("terminated",callback);
}

public onInitialized(callback : () => void ) {
    this.on("initialized",callback);
}

}