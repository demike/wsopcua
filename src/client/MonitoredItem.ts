"use strict";

import {assert} from '../assert';

import { MonitoringMode } from "../generated/MonitoringMode";
import { ClientSubscription } from "./ClientSubscription";
import { IMonitoringParameters } from "../generated/MonitoringParameters";
import { TimestampsToReturn } from "../generated/TimestampsToReturn";
import {MonitoredItemBase} from './MonitoredItemBase';

import { IReadValueId } from '../generated/ReadValueId';
import { ErrorCallback, ResponseCallback } from './client_base';
import { MonitoredItemModifyResult } from '../service-subscription';

/**
 * ClientMonitoredItem
 * @class ClientMonitoredItem
 * @extends MonitoredItemBase
 *
 * @param subscription              {ClientSubscription}
 * @param itemToMonitor             {ReadValueId}
 * @param itemToMonitor.nodeId      {NodeId}
 * @param itemToMonitor.attributeId {AttributeId}
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
export class MonitoredItem extends MonitoredItemBase {
    protected _timestampsToReturn : TimestampsToReturn;
constructor (subscription : ClientSubscription, itemToMonitor : IReadValueId, monitoringParameters : IMonitoringParameters, timestampsToReturn? : TimestampsToReturn) {

    super(subscription,itemToMonitor,monitoringParameters);
    this._timestampsToReturn = timestampsToReturn || TimestampsToReturn.Neither;
}

public toString() : string {

    var ret = "";
    ret+="itemToMonitor:        " + this._itemToMonitor.toString() + "\n";
    ret+="monitoringParameters: " + this._monitoringParameters.toString() + "\n";
    ret+="timestampsToReturn:   " + this._timestampsToReturn.toString() + "\n";
    ret+="monitoredItemId       " + this._monitoredItemId + "\n";
    ret+="statusCode:           " + this._statusCode ? this._statusCode.toString() : "";
    return ret;
};

/**
 * remove the MonitoredItem from its subscription
 * @method terminate
 * @param  done {Function} the done callback
 * @async
 */
public terminate(done: ErrorCallback) {

    assert(!done || ('function' === typeof done));
    /**
     * Notify the observer that this monitored item has been terminated.
     * @event terminated
     */
    this.emit("terminated");

    this._subscription._delete_monitored_items([this], function (err) {
        if (done) {
            done(err);
        }
    });
};

/**
 * @method _monitor
 * Creates the monitor item (monitoring mode = Reporting)
 * @param done {ErrorCallback} callback
 * @private
 */
public _monitor(done: ErrorCallback) {
    assert(done === undefined || ('function' === typeof done));
    
    MonitoredItemBase._toolbox_monitor(this._subscription, this._timestampsToReturn, [this], (err) => {
        if (err) {
            this.emit("err", err.message);
            this.emit("terminated");
        } else {
            //xx  self.emit("initialized");
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
public modify(parameters: IMonitoringParameters, 
    timestampsToReturn : TimestampsToReturn, callback: ResponseCallback<MonitoredItemModifyResult>) {
    if ('function' === typeof timestampsToReturn) {
        callback = timestampsToReturn;
        timestampsToReturn = null;
    }
    this._timestampsToReturn = timestampsToReturn || this._timestampsToReturn;
    MonitoredItemBase._toolbox_modify(this._subscription, [this], parameters, this._timestampsToReturn, function (err, results) {
        if (err) {
            return callback(err);
        }
        assert(results.length === 1);
        callback(null, results[0]);
    });
};

public setMonitoringMode(monitoringMode: MonitoringMode, callback) {
    MonitoredItemBase._toolbox_setMonitoringMode(this._subscription, [this], monitoringMode, callback);
};

}