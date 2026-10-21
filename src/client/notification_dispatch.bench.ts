import { bench, describe } from 'vitest';
import { EventEmitter } from '../eventemitter';

import { DataStream } from '../basic-types/DataStream';
import { PublishResponse } from '../generated/PublishResponse';
import { ResponseHeader } from '../generated/ResponseHeader';
import { NotificationMessage } from '../generated/NotificationMessage';
import { DataChangeNotification } from '../generated/DataChangeNotification';
import { MonitoredItemNotification } from '../generated/MonitoredItemNotification';
import { DataValue } from '../generated/DataValue';
import { Variant } from '../variant/variant';
import { DataType } from '../variant/DataTypeEnum';
import { StatusCodes } from '../constants/raw_status_codes';
import { AttributeIds } from '../constants';
import { ClientSubscription } from './ClientSubscription';

// Monitoring throughput has two distinct costs:
//  1. decoding the PublishResponse notification payload (the same DataValue
//     codec path as a ReadResponse, wrapped in a DataChangeNotification)
//  2. dispatching the decoded values to every monitored item, i.e. the fan-out
//     loop in ClientSubscription#onNotificationMessage plus one emitter call
//     per item (`emit('changed', value)`)
//
// These benches cover both halves separately so an optimization can be
// attributed to the right one.

function makeDataValue(i: number): DataValue {
  return new DataValue({
    value: new Variant({ dataType: DataType.Double, value: i * 1.5 }),
    statusCode: StatusCodes.Good,
    sourceTimestamp: new Date(Date.UTC(2024, 0, 1, 0, 0, i % 60, i % 1000)),
    serverTimestamp: new Date(Date.UTC(2024, 0, 1, 0, 0, i % 60, i % 1000)),
  });
}

function makePublishResponse(itemCount: number, sequenceNumber: number): PublishResponse {
  const monitoredItems: MonitoredItemNotification[] = [];
  for (let i = 0; i < itemCount; i++) {
    monitoredItems.push(
      new MonitoredItemNotification({ clientHandle: i + 1, value: makeDataValue(i) })
    );
  }
  return new PublishResponse({
    responseHeader: new ResponseHeader(),
    subscriptionId: 42,
    availableSequenceNumbers: [sequenceNumber],
    notificationMessage: new NotificationMessage({
      sequenceNumber,
      publishTime: new Date(Date.UTC(2024, 0, 1)),
      notificationData: [new DataChangeNotification({ monitoredItems, diagnosticInfos: [] })],
    }),
  });
}

function benchDecode(label: string, itemCount: number) {
  const response = makePublishResponse(itemCount, 1);
  const size = DataStream.binaryStoreSize(response);
  const buffer = new ArrayBuffer(size);
  const w = new DataStream(buffer);
  w.length = 0;
  response.encode(w);

  describe(label, () => {
    bench('decode', () => {
      new PublishResponse().decode(new DataStream(buffer));
    });
  });
}

/**
 * Mirrors what MonitoredItem#_notify_value_change does on the real client:
 * catch + emit to the items' `changed` listeners. Using the real
 * EventEmitter/`_notify` shape keeps the dispatch measurement faithful.
 */
class StubMonitoredItem extends EventEmitter<{ changed: (value: DataValue) => void }> {
  public itemToMonitor = { attributeId: AttributeIds.Value };

  public _notify_value_change(value: DataValue) {
    try {
      this.emit('changed', value);
    } catch {
      // mirrors the client's swallow-and-log behavior
    }
  }
}

/**
 * A ClientSubscription without running the real constructor: the constructor
 * immediately creates a server-side subscription, which requires a session.
 * Dispatch only needs the emitter internals and the monitored item map.
 */
function createBenchSubscription(): ClientSubscription {
  const subscription = Object.create(ClientSubscription.prototype) as ClientSubscription;
  const freshEmitter = new (class extends EventEmitter<Record<string, never>> {})();
  (subscription as any)._events = (freshEmitter as any)._events;
  (subscription as any)._eventsCount = 0;
  (subscription as any).monitoredItems = {};
  (subscription as any)._lastSequenceNumber = -1;
  (subscription as any).lastRequestSentTime = 0;
  return subscription;
}

function makeSubscriptionWithItems(itemCount: number): ClientSubscription {
  const subscription = createBenchSubscription();
  for (let i = 0; i < itemCount; i++) {
    const item = new StubMonitoredItem();
    item.on('changed', () => {});
    (subscription as any).monitoredItems[i + 1] = item;
  }
  return subscription;
}

function benchDispatch(label: string, itemCount: number) {
  const subscription = makeSubscriptionWithItems(itemCount);
  const response = makePublishResponse(itemCount, 1);

  describe(label, () => {
    bench('dispatch notification to monitored items', () => {
      subscription.onNotificationMessage(response.notificationMessage);
    });
  });
}

benchDecode('message: PublishResponse (100 items)', 100);
benchDecode('message: PublishResponse (1000 items)', 1000);

// isolated emitter cost: one listener, one argument - the shape of
// MonitoredItem#_notify_value_change('changed', value)
describe('emitter emit (1 listener, 1 arg)', () => {
  const emitter = new EventEmitter<{ changed: (value: DataValue) => void }>();
  const value = makeDataValue(1);
  emitter.on('changed', () => {});

  bench('emit', () => {
    emitter.emit('changed', value);
  });
});

benchDispatch('monitoring fan-out (100 items)', 100);
benchDispatch('monitoring fan-out (1000 items)', 1000);
