'use strict';
/* eslint-disable no-console */

// Standalone CPU-profiling harness for the wsopcua encode/decode hot paths.
//
// Why a separate harness (and not the Vitest benches)?
//   Vitest runs benchmarks inside a worker_thread, and Node's `--cpu-prof`
//   flag only profiles the main thread. Running the codec loops directly in
//   this process gives a reliable, self-contained `.cpuprofile`.
//
// Usage:
//   npm run compile            # ensure dist/_cjs is up to date
//   node --cpu-prof --cpu-prof-dir=profiles tools/profile.cjs
//   # or simply:
//   npm run profile:cpu
//
// Open the generated profiles/*.cpuprofile in Chrome DevTools
// (Performance -> Load profile) or at https://www.speedscope.app.

// --- Minimal browser-ish globals so the browser-oriented modules load in Node.
const { webcrypto } = require('crypto');
if (typeof globalThis.window === 'undefined') {
  globalThis.window = globalThis;
}
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = webcrypto;
}

const DIST = '../dist/_cjs';
const bt = require(`${DIST}/basic-types/index.js`);
const { DataStream } = require(`${DIST}/basic-types/DataStream.js`);
const { makeNodeId } = require(`${DIST}/nodeid/nodeid.js`);
const variant = require(`${DIST}/variant/index.js`);
const { ReadRequest } = require(`${DIST}/generated/ReadRequest.js`);
const { ReadValueId } = require(`${DIST}/generated/ReadValueId.js`);
const { TimestampsToReturn } = require(`${DIST}/generated/TimestampsToReturn.js`);
const { ChunkManager } = require(`${DIST}/chunkmanager/chunk_manager.js`);

const { Variant, DataType, VariantArrayType } = variant;

// Number of iterations per workload. Override with the first CLI argument.
const ITER = parseInt(process.argv[2] || '2000000', 10);

const BUF = new ArrayBuffer(1024 * 1024);

function run(label, iter, fn) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iter; i++) {
    fn(i);
  }
  const ns = Number(process.hrtime.bigint() - start);
  const opsPerSec = (iter / ns) * 1e9;
  console.log(
    `${label.padEnd(34)} ${iter.toLocaleString().padStart(12)} iters  ` +
      `${(ns / 1e6).toFixed(1).padStart(8)} ms  ` +
      `${Math.round(opsPerSec).toLocaleString().padStart(14)} ops/s`
  );
}

async function runAsync(label, iter, fn) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iter; i++) {
    await fn(i);
  }
  const ns = Number(process.hrtime.bigint() - start);
  const opsPerSec = (iter / ns) * 1e9;
  console.log(
    `${label.padEnd(34)} ${iter.toLocaleString().padStart(12)} iters  ` +
      `${(ns / 1e6).toFixed(1).padStart(8)} ms  ` +
      `${Math.round(opsPerSec).toLocaleString().padStart(14)} ops/s`
  );
}

console.log(`\nProfiling wsopcua codecs (ITER=${ITER.toLocaleString()})\n`);

// --- basic-types ----------------------------------------------------------
run('encodeUInt32', ITER, () => {
  const s = new DataStream(BUF);
  s.length = 0;
  bt.encodeUInt32(0xdeadbeef, s);
});
run('encodeDouble', ITER, () => {
  const s = new DataStream(BUF);
  s.length = 0;
  bt.encodeDouble(3.14159265358979, s);
});
run('encodeString', ITER, () => {
  const s = new DataStream(BUF);
  s.length = 0;
  bt.encodeString('Temperature.Sensor.Value.Channel.001', s);
});
const numericNodeId = makeNodeId(2258, 0);
const stringNodeId = makeNodeId('Temperature.Sensor.001', 2);
run('encodeNodeId (numeric)', ITER, () => {
  const s = new DataStream(BUF);
  s.length = 0;
  bt.encodeNodeId(numericNodeId, s);
});
run('encodeNodeId (string)', ITER, () => {
  const s = new DataStream(BUF);
  s.length = 0;
  bt.encodeNodeId(stringNodeId, s);
});

// --- variant --------------------------------------------------------------
const arrayVariant = new Variant({
  dataType: DataType.Double,
  arrayType: VariantArrayType.Array,
  value: new Float64Array(1000).map((_, i) => i * 1.5),
});
run('variant encode Double[1000]', Math.max(1, Math.floor(ITER / 100)), () => {
  const s = new DataStream(BUF);
  s.length = 0;
  arrayVariant.encode(s);
});
run('variant decode Double[1000]', Math.max(1, Math.floor(ITER / 100)), () => {
  const w = new DataStream(BUF);
  w.length = 0;
  arrayVariant.encode(w);
  variant.decodeVariant(new DataStream(BUF));
});

// --- message round-trip ---------------------------------------------------
function makeReadRequest(n) {
  const nodesToRead = [];
  for (let i = 0; i < n; i++) {
    nodesToRead.push(new ReadValueId({ nodeId: makeNodeId('Sensor.Channel.' + i, 2), attributeId: 13 }));
  }
  return new ReadRequest({ maxAge: 0, timestampsToReturn: TimestampsToReturn.Both, nodesToRead });
}
const request = makeReadRequest(50);
run('ReadRequest[50] encode', Math.max(1, Math.floor(ITER / 200)), () => {
  const s = new DataStream(BUF);
  s.length = 0;
  request.encode(s);
});
run('ReadRequest[50] round-trip', Math.max(1, Math.floor(ITER / 200)), () => {
  const w = new DataStream(BUF);
  w.length = 0;
  request.encode(w);
  new ReadRequest().decode(new DataStream(BUF));
});

// --- ReadResponse decode (realistic subscription/read payload) ------------
// An array of DataValues, each wrapping a mixed-type scalar Variant plus a
// status code and source/server timestamps. This is the payload that dominates
// real client decode throughput (PublishResponse notifications look the same).
const { ReadResponse } = require(`${DIST}/generated/ReadResponse.js`);
const { ResponseHeader } = require(`${DIST}/generated/ResponseHeader.js`);
const { DataValue } = require(`${DIST}/generated/DataValue.js`);
const { StatusCodes } = require(`${DIST}/constants/raw_status_codes.js`);

function makeReadResponse(n) {
  const results = [];
  for (let i = 0; i < n; i++) {
    const sourceTimestamp = new Date(Date.UTC(2024, 0, 1, 0, 0, i % 60, i % 1000));
    const serverTimestamp = new Date(sourceTimestamp.getTime() + 1);
    let value;
    switch (i % 5) {
      case 0: value = new Variant({ dataType: DataType.Double, value: i * 1.5 }); break;
      case 1: value = new Variant({ dataType: DataType.UInt32, value: i * 7 }); break;
      case 2: value = new Variant({ dataType: DataType.String, value: 'Sensor.Channel.' + i }); break;
      case 3: value = new Variant({ dataType: DataType.Boolean, value: (i & 1) === 0 }); break;
      default: value = new Variant({ dataType: DataType.Int16, value: (i % 100) - 50 });
    }
    results.push(new DataValue({ value, statusCode: StatusCodes.Good, sourceTimestamp, serverTimestamp }));
  }
  return new ReadResponse({ responseHeader: new ResponseHeader(), results, diagnosticInfos: [] });
}
const readResponse = makeReadResponse(100);
{
  const w = new DataStream(BUF);
  w.length = 0;
  readResponse.encode(w);
}
run('ReadResponse[100] decode', Math.max(1, Math.floor(ITER / 200)), () => {
  new ReadResponse().decode(new DataStream(BUF));
});

// --- client: node id resolution (read/browse/monitor preparation) ---------
// ClientSession#read resolves every node id before building the request; the
// 'i='/'s=' string forms are re-parsed on every call (only well-known names
// hit the name index), which matters for dashboards that poll many nodes.
const { resolveNodeId } = require(`${DIST}/nodeid/nodeid.js`);
run("resolveNodeId('ns=2;i=2258')", ITER, () => {
  resolveNodeId('ns=2;i=2258');
});
run("resolveNodeId('ns=2;s=Sensor.Channel.42')", ITER, () => {
  resolveNodeId('ns=2;s=Sensor.Channel.42');
});
run("resolveNodeId('HasComponent') name index", ITER, () => {
  resolveNodeId('HasComponent');
});
// raw parse path (bypasses the resolveNodeId cache) and raw construction cost
const { coerceNodeId, NodeId } = require(`${DIST}/nodeid/nodeid.js`);
const { NodeIdType } = require(`${DIST}/generated/NodeIdType.js`);
run("coerceNodeId('i=2258') raw parse", ITER, () => {
  coerceNodeId('i=2258');
});
run("coerceNodeId('ns=2;s=Sensor.42') raw parse", ITER, () => {
  coerceNodeId('ns=2;s=Sensor.42');
});
run('new NodeId(Numeric,1,0)', ITER, () => {
  new NodeId(NodeIdType.Numeric, 1, 0);
});

// --- client: browse decode ------------------------------------------------
// Browsing is decode-dominated: every reference is a ReferenceDescription
// (node id + browse name + display name + type definition + node class).
const { BrowseResponse } = require(`${DIST}/generated/BrowseResponse.js`);
const { BrowseResult } = require(`${DIST}/generated/BrowseResult.js`);
const { ReferenceDescription } = require(`${DIST}/generated/ReferenceDescription.js`);
const { QualifiedName } = require(`${DIST}/generated/QualifiedName.js`);
const { LocalizedText } = require(`${DIST}/generated/LocalizedText.js`);
const { NodeClass } = require(`${DIST}/generated/NodeClass.js`);
const { makeExpandedNodeId } = require(`${DIST}/nodeid/expanded_nodeid.js`);

function makeReference(i) {
  return new ReferenceDescription({
    referenceTypeId: makeNodeId(47, 0), // HasComponent
    isForward: true,
    nodeId: makeExpandedNodeId(makeNodeId('Sensor.Channel.' + i, 2)),
    browseName: new QualifiedName({ namespaceIndex: 2, name: 'Channel' + i }),
    displayName: new LocalizedText({ text: 'Channel ' + i }),
    nodeClass: NodeClass.Variable,
    typeDefinition: makeExpandedNodeId(63, 0), // BaseDataVariableType
  });
}
function makeBrowseResponse(n) {
  const references = [];
  for (let i = 0; i < n; i++) {
    references.push(makeReference(i));
  }
  return new BrowseResponse({
    responseHeader: new ResponseHeader(),
    results: [new BrowseResult({ references })],
    diagnosticInfos: [],
  });
}
const browseResponse = makeBrowseResponse(200);
{
  const w = new DataStream(BUF);
  w.length = 0;
  browseResponse.encode(w);
}
run('BrowseResponse[200 refs] decode', Math.max(1, Math.floor(ITER / 500)), () => {
  new BrowseResponse().decode(new DataStream(BUF));
});
run('BrowseResponse[200 refs] round-trip', Math.max(1, Math.floor(ITER / 1000)), () => {
  const w = new DataStream(BUF);
  w.length = 0;
  browseResponse.encode(w);
  new BrowseResponse().decode(new DataStream(BUF));
});

// --- client: monitoring (publish decode + notification fan-out) -----------
// A PublishResponse carries DataChangeNotifications; after decoding, every
// monitored item gets its value through an emitter call ('changed').
const { PublishResponse } = require(`${DIST}/generated/PublishResponse.js`);
const { NotificationMessage } = require(`${DIST}/generated/NotificationMessage.js`);
const { DataChangeNotification } = require(`${DIST}/generated/DataChangeNotification.js`);
const { MonitoredItemNotification } = require(`${DIST}/generated/MonitoredItemNotification.js`);
const { ClientSubscription } = require(`${DIST}/client/ClientSubscription.js`);
const { EventEmitter } = require(`${DIST}/eventemitter/index.js`);
const { AttributeIds } = require(`${DIST}/constants/index.js`);

function makeMonitoredDataValue(i) {
  return new DataValue({
    value: new Variant({ dataType: DataType.Double, value: i * 1.5 }),
    statusCode: StatusCodes.Good,
    sourceTimestamp: new Date(Date.UTC(2024, 0, 1, 0, 0, i % 60, i % 1000)),
    serverTimestamp: new Date(Date.UTC(2024, 0, 1, 0, 0, i % 60, i % 1000)),
  });
}
function makePublishResponse(n, sequenceNumber) {
  const monitoredItems = [];
  for (let i = 0; i < n; i++) {
    monitoredItems.push(
      new MonitoredItemNotification({ clientHandle: i + 1, value: makeMonitoredDataValue(i) })
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
const publishResponse100 = makePublishResponse(100, 1);
const publishResponse1000 = makePublishResponse(1000, 1);
{
  const w = new DataStream(BUF);
  w.length = 0;
  publishResponse100.encode(w);
}
run('PublishResponse[100 items] decode', Math.max(1, Math.floor(ITER / 200)), () => {
  new PublishResponse().decode(new DataStream(BUF));
});

// stub that mirrors MonitoredItem#_notify_value_change (catch + emit)
class StubMonitoredItem extends EventEmitter {
  constructor() {
    super();
    this.itemToMonitor = { attributeId: AttributeIds.Value };
  }
  _notify_value_change(value) {
    try {
      this.emit('changed', value);
    } catch {
      /* mirrors the client's swallow-and-log behavior */
    }
  }
}
// ClientSubscription without running its constructor (which would create a
// server-side subscription); dispatch only needs the emitter internals and
// the monitored item map.
function createBenchSubscription() {
  const subscription = Object.create(ClientSubscription.prototype);
  const freshEmitter = new EventEmitter();
  subscription._events = freshEmitter._events;
  subscription._eventsCount = 0;
  subscription.monitoredItems = {};
  subscription._lastSequenceNumber = -1;
  subscription.lastRequestSentTime = 0;
  return subscription;
}
function makeSubscriptionWithItems(n) {
  const subscription = createBenchSubscription();
  for (let i = 0; i < n; i++) {
    const item = new StubMonitoredItem();
    item.on('changed', () => {});
    subscription.monitoredItems[i + 1] = item;
  }
  return subscription;
}
const subscription100 = makeSubscriptionWithItems(100);
const subscription1000 = makeSubscriptionWithItems(1000);
run('monitor fan-out[100 items]', Math.max(1, Math.floor(ITER / 200)), () => {
  subscription100.onNotificationMessage(publishResponse100.notificationMessage);
});
run('monitor fan-out[1000 items]', Math.max(1, Math.floor(ITER / 2000)), () => {
  subscription1000.onNotificationMessage(publishResponse1000.notificationMessage);
});

// --- chunk-manager framing (async) ---------------------------------------
function writeFakeHeader(block) {
  for (let i = 0; i < this.headerSize; i++) block.setUint8(i, 0xaa);
}
function writeFakeSequenceHeader(block) {
  for (let i = 0; i < this.sequenceHeaderSize; i++) block.setUint8(i, 0xbb);
}
function fakeSignature() {
  return Promise.resolve(new Uint8Array(4).fill(0xcc).buffer);
}
const payload64k = new Uint8Array(64 * 1024).map((_, i) => i & 0xff).buffer;
async function chunkOnce(options) {
  const cm = new ChunkManager(options);
  cm.on('chunk', () => {});
  await cm.write(payload64k);
  await cm.end();
}

(async () => {
  const chunkIter = Math.max(1, Math.floor(ITER / 500));
  await runAsync('chunk plain 64 KiB', chunkIter, () =>
    chunkOnce({ chunkSize: 8192, sequenceHeaderSize: 0 })
  );
  await runAsync('chunk signed 64 KiB', chunkIter, () =>
    chunkOnce({
      chunkSize: 8192,
      headerSize: 12,
      writeHeaderFunc: writeFakeHeader,
      sequenceHeaderSize: 8,
      writeSequenceHeaderFunc: writeFakeSequenceHeader,
      signatureLength: 4,
      signBufferFunc: fakeSignature,
    })
  );

  console.log('\nDone. CPU profile written to profiles/ (when run with --cpu-prof).\n');
})();
