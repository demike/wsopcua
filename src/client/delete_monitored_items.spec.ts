import { ClientSession } from './client_session';
import { ClientSubscription } from './ClientSubscription';
import { ClientSidePublishEngine } from './client_publish_engine';
import { MonitoredItem } from './MonitoredItem';
import { MonitoredItemBase } from './MonitoredItemBase';
import { AttributeIds } from '../constants';
import { NodeId } from '../basic-types';
import { NodeIdType } from '../generated/NodeIdType';
import { EventFieldList, EventNotificationList } from '../service-subscription';
import { RequestHeader } from '../generated/RequestHeader';

/* global describe, it, expect, beforeEach, vi */

// Session, subscription and publish engine normally need a live server connection. The code
// under test only touches the subscription's monitored item map and the request plumbing, so
// the objects are built on bare prototypes and the network request is stubbed.

const SUBSCRIPTION_ID = 7;

interface Fixture {
  session: ClientSession;
  subscription: ClientSubscription;
  items: MonitoredItemBase[];
  sentRequests: any[];
}

function monitoredItemMap(subscription: ClientSubscription): { [key: number]: MonitoredItemBase } {
  return (subscription as any).monitoredItems;
}

function makeFixture(itemCount: number): Fixture {
  const sentRequests: any[] = [];

  const session = Object.create(ClientSession.prototype) as ClientSession;
  (session as any)._defaultRequest = (
    SomeRequest: new (options: any) => any,
    _SomeResponse: unknown,
    options: any,
    callback: (err: Error | null) => void
  ) => {
    sentRequests.push(new SomeRequest(options));
    callback(null);
  };

  const engine = Object.create(ClientSidePublishEngine.prototype) as ClientSidePublishEngine;
  (engine as any)._session = session;
  (session as any)._publishEngine = engine;

  const subscription = Object.create(ClientSubscription.prototype) as ClientSubscription;
  (subscription as any)._publishEngine = engine;
  (subscription as any)._subscriptionId = SUBSCRIPTION_ID;
  (subscription as any).monitoredItems = {};
  (engine as any).subscriptionMap = { [SUBSCRIPTION_ID]: subscription };

  const items: MonitoredItemBase[] = [];
  for (let i = 1; i <= itemCount; i++) {
    const item = new MonitoredItem(
      subscription,
      { nodeId: new NodeId(NodeIdType.Numeric, 1000 + i, 1), attributeId: AttributeIds.Value },
      { samplingInterval: 100 }
    );
    item.monitoringParameters.clientHandle = i;
    item.monitoredItemId = 100 + i; // server ids deliberately differ from client handles
    item.on('changed', () => {});
    monitoredItemMap(subscription)[i] = item;
    items.push(item);
  }

  return { session, subscription, items, sentRequests };
}

describe('ClientSession#deleteMonitoredItems', function () {
  let f: Fixture;

  beforeEach(function () {
    f = makeFixture(3);
  });

  it('drops the deleted items from the owning subscription (leak regression)', function () {
    const callback = vi.fn();

    f.session.deleteMonitoredItems(
      { subscriptionId: SUBSCRIPTION_ID, monitoredItemIds: [101, 103] },
      callback
    );

    expect(Object.keys(monitoredItemMap(f.subscription))).toEqual(['2']);
    expect(f.items[0].listenerCount('changed')).toBe(0);
    expect(f.items[2].listenerCount('changed')).toBe(0);
    expect(f.items[1].listenerCount('changed')).toBe(1);
    expect(callback).toHaveBeenCalledWith(null);
  });

  it('still sends the same DeleteMonitoredItems request to the server', function () {
    f.session.deleteMonitoredItems(
      { subscriptionId: SUBSCRIPTION_ID, monitoredItemIds: [101, 103] },
      () => {}
    );

    expect(f.sentRequests).toHaveLength(1);
    expect(f.sentRequests[0].subscriptionId).toBe(SUBSCRIPTION_ID);
    expect(f.sentRequests[0].monitoredItemIds).toEqual([101, 103]);
  });

  it('ignores subscriptions this session does not know', function () {
    f.session.deleteMonitoredItems({ subscriptionId: 99, monitoredItemIds: [101] }, () => {});

    expect(Object.keys(monitoredItemMap(f.subscription))).toHaveLength(3);
    expect(f.sentRequests).toHaveLength(1);
  });

  it('ignores ids that are not monitored client-side', function () {
    f.session.deleteMonitoredItems(
      { subscriptionId: SUBSCRIPTION_ID, monitoredItemIds: [999] },
      () => {}
    );

    expect(Object.keys(monitoredItemMap(f.subscription))).toHaveLength(3);
    expect(f.sentRequests).toHaveLength(1);
  });

  it('works without a publish engine', function () {
    (f.session as any)._publishEngine = undefined;

    expect(() =>
      f.session.deleteMonitoredItems(
        { subscriptionId: SUBSCRIPTION_ID, monitoredItemIds: [101] },
        () => {}
      )
    ).not.toThrow();
    expect(f.sentRequests).toHaveLength(1);
  });

  it('hands the delete to the owning subscription, passing the request header on', function () {
    const delegate = vi.spyOn(f.subscription, 'deleteMonitoredItems');
    const requestHeader = new RequestHeader({ timeoutHint: 1234 });
    const callback = vi.fn();

    f.session.deleteMonitoredItems(
      { subscriptionId: SUBSCRIPTION_ID, monitoredItemIds: [101], requestHeader },
      callback
    );

    expect(delegate).toHaveBeenCalledWith([101], expect.any(Function), requestHeader);
    expect(f.sentRequests[0].requestHeader.timeoutHint).toBe(1234);
    expect(callback).toHaveBeenCalledWith(null);
  });
});

describe('ClientSubscription#deleteMonitoredItems', function () {
  it('drops the items client-side and deletes them on the server', async function () {
    const f = makeFixture(3);

    await f.subscription.deleteMonitoredItemsP([102]);

    expect(Object.keys(monitoredItemMap(f.subscription)).sort()).toEqual(['1', '3']);
    expect(f.items[1].listenerCount('changed')).toBe(0);
    expect(f.sentRequests).toHaveLength(1);
    expect(f.sentRequests[0].subscriptionId).toBe(SUBSCRIPTION_ID);
    expect(f.sentRequests[0].monitoredItemIds).toEqual([102]);
  });

  it('rejects when the server request fails', async function () {
    const f = makeFixture(1);
    (f.session as any)._defaultRequest = (
      _req: unknown,
      _res: unknown,
      _options: unknown,
      callback: (err: Error | null) => void
    ) => callback(new Error('BadSubscriptionIdInvalid'));

    await expect(f.subscription.deleteMonitoredItemsP([101])).rejects.toThrow(
      'BadSubscriptionIdInvalid'
    );
  });
});

describe('ClientSubscription#_delete_monitored_items', function () {
  it('removes the given items and sends a single request', function () {
    const f = makeFixture(3);

    f.subscription._delete_monitored_items([f.items[1]], () => {});

    expect(Object.keys(monitoredItemMap(f.subscription)).sort()).toEqual(['1', '3']);
    expect(f.sentRequests).toHaveLength(1);
    expect(f.sentRequests[0].monitoredItemIds).toEqual([102]);
  });
});

describe('ClientSubscription event notifications', function () {
  it('skips events for monitored items that were already deleted', function () {
    const f = makeFixture(1);
    const notification = new EventNotificationList({
      events: [new EventFieldList({ clientHandle: 42, eventFields: [] })],
    });

    expect(() =>
      (f.subscription as any).__on_publish_response_EventNotificationList(notification)
    ).not.toThrow();
  });
});
