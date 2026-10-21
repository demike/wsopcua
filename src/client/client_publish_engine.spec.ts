import { ClientSidePublishEngine } from './client_publish_engine';

/* global describe, it, expect */

// The publish engine normally requires a live session; the methods under test
// only touch the subscription map, so they are exercised on a bare prototype
// instance to keep this a pure unit test.
function makeEngine(subscriptionIds: number[]): ClientSidePublishEngine {
  const engine = Object.create(ClientSidePublishEngine.prototype) as ClientSidePublishEngine;
  const map: { [key: number]: any } = {};
  for (const id of subscriptionIds) {
    map[id] = { subscriptionId: id };
  }
  (engine as any).subscriptionMap = map;
  return engine;
}

describe('ClientSidePublishEngine#getSubscriptionIds', function () {
  it('should return the numeric subscription ids', function () {
    const engine = makeEngine([42]);
    expect(engine.getSubscriptionIds()).toEqual([42]);
  });

  it('should not corrupt ids through the map index (regression)', function () {
    // `Object.keys(...).map(parseInt)` used to pass the array index as radix,
    // turning every id after the first into NaN.
    const engine = makeEngine([42, 43, 44]);
    const ids = engine.getSubscriptionIds();
    expect(ids).toHaveLength(3);
    for (const id of ids) {
      expect(Number.isFinite(id)).toBe(true);
    }
    expect(ids.sort((a, b) => a - b)).toEqual([42, 43, 44]);
  });
});
