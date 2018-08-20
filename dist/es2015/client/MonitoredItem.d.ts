import { MonitoringMode } from "../generated/MonitoringMode";
import { ClientSubscription } from "./ClientSubscription";
import { IMonitoringParameters } from "../generated/MonitoringParameters";
import { TimestampsToReturn } from "../generated/TimestampsToReturn";
import { MonitoredItemBase } from './MonitoredItemBase';
import { IReadValueId } from '../generated/ReadValueId';
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
export declare class MonitoredItem extends MonitoredItemBase {
    protected _timestampsToReturn: TimestampsToReturn;
    constructor(subscription: ClientSubscription, itemToMonitor: IReadValueId, monitoringParameters: IMonitoringParameters, timestampsToReturn?: TimestampsToReturn);
    toString(): string;
    /**
     * remove the MonitoredItem from its subscription
     * @method terminate
     * @param  done {Function} the done callback
     * @async
     */
    terminate(done: Function): void;
    /**
     * @method _monitor
     * Creates the monitor item (monitoring mode = Reporting)
     * @param done {Function} callback
     * @private
     */
    _monitor(done: any): void;
    /**
     * @method modify
     * @param parameters {Object}
     * @param [timestampsToReturn=null] {TimestampsToReturn}
     * @param callback {Function}
     */
    modify(parameters: any, timestampsToReturn: TimestampsToReturn, callback: any): void;
    setMonitoringMode(monitoringMode: MonitoringMode, callback: any): void;
}
