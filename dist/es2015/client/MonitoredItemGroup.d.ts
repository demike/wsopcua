/**
 * @module opcua.client
 */
import { EventEmitter } from 'eventemitter3';
import { MonitoredItemBase } from './MonitoredItemBase';
import { ClientSubscription } from '../client/ClientSubscription';
import { IReadValueId } from '../generated/ReadValueId';
import { IMonitoringParameters } from '../generated/MonitoringParameters';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';
import { MonitoringMode } from '../generated/MonitoringMode';
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
export declare class MonitoredItemGroup extends EventEmitter {
    protected _monitoredItems: MonitoredItemBase[];
    protected _subscription: ClientSubscription;
    protected _timestampsToReturn: TimestampsToReturn;
    protected _monitoringMode: MonitoringMode;
    constructor(subscription: ClientSubscription, itemsToMonitor: IReadValueId[], monitoringParameters: IMonitoringParameters, timestampsToReturn: TimestampsToReturn);
    readonly monitoredItems: MonitoredItemBase[];
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
    modify(parameters: any, timestampsToReturn?: TimestampsToReturn, callback?: any): void;
    setMonitoringMode(monitoringMode: MonitoringMode, callback: any): void;
    onChanged(callback: (item: MonitoredItemBase, dataValue: DataValue, index: number) => void): void;
    onTerminated(callback: () => void): void;
    onInitialized(callback: () => void): void;
}
