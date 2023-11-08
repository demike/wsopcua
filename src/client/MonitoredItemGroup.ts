'use strict';
/**
 * @module opcua.client
 */

import { EventEmitter } from '../eventemitter';
import { assert } from '../assert';
import { MonitoredItemBase } from './MonitoredItemBase';
import { ClientSubscription } from '../client/ClientSubscription';
import { IReadValueId } from '../generated/ReadValueId';
import { IMonitoringParameters } from '../generated/MonitoringParameters';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';
import { MonitoringMode } from '../generated/MonitoringMode';

import * as subscription_service from '../service-subscription';
import { DataValue } from '../data-value';
import { ErrorCallback, ResponseCallback } from './client_base';
import { StatusCode } from '../basic-types';
import { Variant } from '../variant';

export interface MonitoredItemGroupEvents {
  initialized: () => void;
  terminated: () => void;
  changed:
    | ((item: MonitoredItemBase, data: DataValue /* a value change */, index: number) => void)
    | ((item: MonitoredItemBase, data: Variant[] /* an event */, index: number) => void);
}

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
export class MonitoredItemGroup extends EventEmitter<MonitoredItemGroupEvents> {
  protected _monitoredItems: MonitoredItemBase[];
  protected _subscription: ClientSubscription;
  protected _timestampsToReturn: TimestampsToReturn;
  protected _monitoringMode: MonitoringMode;
  constructor(
    subscription: ClientSubscription,
    itemsToMonitor: IReadValueId[],
    monitoringParameters: IMonitoringParameters | IMonitoringParameters[],
    timestampsToReturn: TimestampsToReturn
  ) {
    super();
    assert(Array.isArray(itemsToMonitor));

    timestampsToReturn = timestampsToReturn || TimestampsToReturn.Neither;

    this._subscription = subscription;

    if (Array.isArray(monitoringParameters)) {
      assert(
        itemsToMonitor.length === monitoringParameters.length,
        `itemsToMonitor.length: ${itemsToMonitor.length} differs from monitoringParameters.length: ${monitoringParameters.length}`
      );
      this._monitoredItems = [];
      for (let i = 0; i < itemsToMonitor.length; i++) {
        this._monitoredItems.push(
          new MonitoredItemBase(subscription, itemsToMonitor[i], monitoringParameters[i])
        );
      }
    } else {
      this._monitoredItems = itemsToMonitor.map(function (itemToMonitor) {
        return new MonitoredItemBase(subscription, itemToMonitor, monitoringParameters);
      });
    }

    this._timestampsToReturn = timestampsToReturn;
    this._monitoringMode = subscription_service.MonitoringMode.Reporting;
  }

  public get monitoredItems(): MonitoredItemBase[] {
    return this._monitoredItems;
  }

  public get subscription(): ClientSubscription {
    return this._subscription;
  }

  public toString(): string {
    let ret = 'ClientMonitoredItemGroup : \n';
    ret +=
      'itemsToMonitor:       = [\n ' +
      this._monitoredItems
        .map(function (monitoredItem) {
          return monitoredItem.itemToMonitor.toString();
        })
        .join('\n') +
      '\n];\n';

    ret += 'timestampsToReturn:   ' + this._timestampsToReturn.toString() + '\n';
    ret += 'monitoringMode        ' + this._monitoringMode;
    return ret;
  }

  /**
   * remove the MonitoredItems from their subscription
   * @method terminate
   * @param  done {Function} the done callback
   * @async
   */
  public terminate(done: ErrorCallback): void {
    assert(!done || 'function' === typeof done);

    /**
     * Notify the observer that this monitored item has been terminated.
     * @event terminated
     */
    this.emit('terminated');
    this._subscription._delete_monitored_items(this._monitoredItems, function (err) {
      if (done) {
        done(err);
      }
    });
  }

  /**
   * remove the MonitoredItems from their subscription
   * @async
   */
  public terminateP(): Promise<void> {
    return new Promise((res, rej) => {
      this.terminate((err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  }

  /**
   * @method _monitor
   * Creates the monitor item (monitoring mode = Reporting)
   * @param done {Function} callback
   * @private
   */
  public _monitor(done: ErrorCallback): void {
    assert(done === undefined || 'function' === typeof done);

    this._monitoredItems.forEach((monitoredItem, index) => {
      monitoredItem.on('changed', (dataValue: DataValue) => {
        /**
         * Notify the observers that a group MonitoredItem value has changed on the server side.
         * @event changed
         * @param monitoredItem
         * @param value
         * @param index
         */
        try {
          this.emit('changed', monitoredItem, dataValue, index);
        } catch (err) {
          console.log(err);
        }
      });
    });

    MonitoredItemBase._toolbox_monitor(
      this._subscription,
      this._timestampsToReturn,
      this._monitoredItems,
      (err) => {
        if (err) {
          this.emit('terminated');
        } else {
          this.emit('initialized');
          // set the event handler
        }

        if (done) {
          done(err);
        }
      }
    );
  }

  /**
   * @method modify
   * @param parameters {Object}
   * @param [timestampsToReturn=null] {TimestampsToReturn}
   * @param callback {Function}
   */
  public modify(
    parameters: IMonitoringParameters,
    timestampsToReturn: TimestampsToReturn | null,
    callback: ResponseCallback<subscription_service.MonitoredItemModifyResult[]>
  ): void {
    this._timestampsToReturn = timestampsToReturn || this._timestampsToReturn;
    MonitoredItemBase._toolbox_modify(
      this._subscription,
      this._monitoredItems,
      parameters,
      this._timestampsToReturn,
      callback
    );
  }

  public modifyP(
    parameters: IMonitoringParameters,
    timestampsToReturn: TimestampsToReturn | null
  ): Promise<subscription_service.MonitoredItemModifyResult[]> {
    return new Promise((res, rej) => {
      this.modify(parameters, timestampsToReturn, (err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result!);
        }
      });
    });
  }

  public setMonitoringMode(
    monitoringMode: MonitoringMode,
    callback: ResponseCallback<StatusCode[]>
  ): void {
    MonitoredItemBase._toolbox_setMonitoringMode(
      this._subscription,
      this._monitoredItems,
      monitoringMode,
      callback
    );
  }
  public setMonitoringModeP(monitoringMode: MonitoringMode): Promise<StatusCode[]> {
    return new Promise((res, rej) => {
      this.setMonitoringMode(monitoringMode, (err, statusCodes) => {
        if (err) {
          rej(err);
        } else {
          res(statusCodes!);
        }
      });
    });
  }

  /**
   * the return type of the changed value:
   *   event:             Variant[]
   *   (value)attribute:  DataValue
   * @param callback the callback to register for the changed event
   */
  public onChanged(
    callback: (
      item: MonitoredItemBase,
      changedValue: DataValue | /* a value change */ Variant[] /* an event */,
      index: number
    ) => void
  ) {
    this.on('changed', callback);
  }

  public onTerminated(callback: () => void) {
    this.on('terminated', callback);
  }

  public onInitialized(callback: () => void) {
    this.on('initialized', callback);
  }
}
