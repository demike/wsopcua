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

console.log('\nDone. CPU profile written to profiles/ (when run with --cpu-prof).\n');
