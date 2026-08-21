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
