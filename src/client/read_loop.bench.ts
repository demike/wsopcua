import { bench, describe } from 'vitest';

import { resolveNodeId } from '../nodeid/nodeid';
import { ReadRequest } from '../generated/ReadRequest';
import { ReadValueId } from '../generated/ReadValueId';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';

// Client-side preparation work of ClientSession#read: before a ReadRequest can
// be encoded and sent, every node id has to be resolved and the request built.
// For dashboards that poll the same string-addressed nodes over and over this
// per-call work matters as much as the wire codec.
//
// NOTE: `resolveNodeId` has a name index for well-known names (e.g.
// 'ObjectsFolder') but the 'i=' / 's=' string forms are parsed each time;
// these benches pin down what that costs.

function buildReadRequest(nodeCount: number): ReadRequest {
  const nodesToRead: ReadValueId[] = [];
  for (let i = 0; i < nodeCount; i++) {
    nodesToRead.push(
      new ReadValueId({
        nodeId: resolveNodeId('ns=2;s=Sensor.Channel.' + i),
        attributeId: 13, // Value
      })
    );
  }
  return new ReadRequest({
    maxAge: 0,
    timestampsToReturn: TimestampsToReturn.Both,
    nodesToRead,
  });
}

describe('client read preparation', () => {
  bench("resolveNodeId('ns=2;i=2258')", () => {
    resolveNodeId('ns=2;i=2258');
  });
  bench("resolveNodeId('ns=2;s=Sensor.Channel.42')", () => {
    resolveNodeId('ns=2;s=Sensor.Channel.42');
  });
  bench("resolveNodeId('HasComponent') (name index)", () => {
    resolveNodeId('HasComponent');
  });
  bench('build ReadRequest from string node ids (50 nodes)', () => {
    buildReadRequest(50);
  });
  // Per-transaction overhead in the secure channel layer: every request arms
  // one timeout and disarms it on response. Measured here so a decision about
  // a shared timeout scheduler can be based on numbers: if this is a few
  // hundred nanoseconds it is irrelevant against a network round trip.
  bench('setTimeout + clearTimeout pair (per-request timer churn)', () => {
    const id = window.setTimeout(() => {}, 1000);
    window.clearTimeout(id);
  });
});
