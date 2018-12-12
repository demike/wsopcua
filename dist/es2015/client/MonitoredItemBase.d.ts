/**
 * @module opcua.client
 */
import { EventEmitter } from 'eventemitter3';
import * as subscription_service from "../service-subscription";
import * as read_service from '../service-read';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';
import { ClientSubscription } from './ClientSubscription';
import { MonitoringParameters, IMonitoringParameters } from '../generated/MonitoringParameters';
import { MonitoringMode } from '../generated/MonitoringMode';
import { MonitoredItemCreateResult } from '../generated/MonitoredItemCreateResult';
import { StatusCode, NodeId, ExtensionObject } from '../basic-types';
import { IReadValueId } from '../generated/ReadValueId';
export declare class MonitoredItemBase extends EventEmitter {
    protected _itemToMonitor: read_service.ReadValueId;
    protected _monitoringParameters: MonitoringParameters;
    protected _subscription: ClientSubscription;
    protected _monitoringMode: MonitoringMode;
    protected _statusCode: StatusCode;
    protected _result: MonitoredItemCreateResult;
    protected _monitoredItemId: number;
    protected _filterResult: ExtensionObject;
    constructor(subscription: ClientSubscription, itemToMonitor: IReadValueId, monitoringParameters: IMonitoringParameters);
    readonly monitoringParameters: subscription_service.MonitoringParameters;
    readonly itemToMonitor: read_service.ReadValueId;
    readonly nodeId: NodeId;
    readonly monitoringMode: subscription_service.MonitoringMode;
    readonly monitoredItemId: number;
    readonly statusCode: StatusCode;
    _notify_value_change(value: any): void;
    protected _prepare_for_monitoring(): subscription_service.MonitoredItemCreateRequest | Error;
    protected _after_create(monitoredItemResult: MonitoredItemCreateResult): void;
    static _toolbox_monitor(subscription: ClientSubscription, timestampsToReturn: any, monitoredItems: MonitoredItemBase[], done: any): any;
    static _toolbox_modify(subscription: ClientSubscription, monitoredItems: MonitoredItemBase[], parameters: IMonitoringParameters, timestampsToReturn: TimestampsToReturn, callback: any): void;
    static _toolbox_setMonitoringMode(subscription: ClientSubscription, monitoredItems: MonitoredItemBase[], monitoringMode: MonitoringMode, callback: any): void;
}
