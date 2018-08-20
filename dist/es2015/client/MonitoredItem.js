"use strict";
import { assert } from '../assert';
import { TimestampsToReturn } from "../generated/TimestampsToReturn";
import { MonitoredItemBase } from './MonitoredItemBase';
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
    constructor(subscription, itemToMonitor, monitoringParameters, timestampsToReturn) {
        super(subscription, itemToMonitor, monitoringParameters);
        this._timestampsToReturn = timestampsToReturn || TimestampsToReturn.Neither;
    }
    toString() {
        var ret = "";
        ret += "itemToMonitor:        " + this._itemToMonitor.toString() + "\n";
        ret += "monitoringParameters: " + this._monitoringParameters.toString() + "\n";
        ret += "timestampsToReturn:   " + this._timestampsToReturn.toString() + "\n";
        ret += "monitoredItemId       " + this._monitoredItemId + "\n";
        ret += "statusCode:           " + this._statusCode ? this._statusCode.toString() : "";
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
        this._subscription._delete_monitored_items([this], function (err) {
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
        MonitoredItemBase._toolbox_monitor(this._subscription, this._timestampsToReturn, [this], (err) => {
            if (err) {
                this.emit("err", err.message);
                this.emit("terminated");
            }
            else {
                //xx  self.emit("initialized");
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
    }
    ;
    setMonitoringMode(monitoringMode, callback) {
        MonitoredItemBase._toolbox_setMonitoringMode(this._subscription, [this], monitoringMode, callback);
    }
    ;
}
//# sourceMappingURL=MonitoredItem.js.map