import { bench, describe } from 'vitest';

import { DataStream } from '../basic-types/DataStream';
import { ReadRequest } from '../generated/ReadRequest';
import { ReadValueId } from '../generated/ReadValueId';
import { makeNodeId } from '../nodeid/nodeid';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';

// End-to-end message benchmarks: a full request object is sized, encoded and
// decoded exactly as it would be on the wire. This exercises the whole codec
// stack (structures -> arrays -> nested structures -> primitives) and is the
// closest micro-benchmark to real client throughput.

function makeReadRequest(nodeCount: number): ReadRequest {
  const nodesToRead: ReadValueId[] = [];
  for (let i = 0; i < nodeCount; i++) {
    nodesToRead.push(
      new ReadValueId({
        nodeId: makeNodeId('Sensor.Channel.' + i, 2),
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

function benchRoundTrip(label: string, nodeCount: number) {
  const request = makeReadRequest(nodeCount);
  const size = DataStream.binaryStoreSize(request);
  const buffer = new ArrayBuffer(size);

  describe(label, () => {
    bench('binaryStoreSize', () => {
      DataStream.binaryStoreSize(request);
    });
    bench('encode', () => {
      const s = new DataStream(buffer);
      s.length = 0;
      request.encode(s);
    });
    bench('decode', () => {
      const w = new DataStream(buffer);
      w.length = 0;
      request.encode(w);
      const r = new DataStream(buffer);
      new ReadRequest().decode(r);
    });
    bench('size + encode + decode (full round-trip)', () => {
      const n = DataStream.binaryStoreSize(request);
      const buf = new ArrayBuffer(n);
      const w = new DataStream(buf);
      request.encode(w);
      const r = new DataStream(buf);
      new ReadRequest().decode(r);
    });
  });
}

benchRoundTrip('message: ReadRequest (1 node)', 1);
benchRoundTrip('message: ReadRequest (50 nodes)', 50);
benchRoundTrip('message: ReadRequest (500 nodes)', 500);
