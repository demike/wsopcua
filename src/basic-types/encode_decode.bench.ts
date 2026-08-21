import { bench, describe } from 'vitest';

import { DataStream } from './DataStream';
import { encodeUInt32, decodeUInt32 } from './integers';
import { encodeDouble, decodeDouble } from './floats';
import { encodeString, decodeString } from './string';
import { encodeByteString, decodeByteString } from './byte_string';
import { encodeGuid, decodeGuid } from './guid';
import { encodeDateTime, decodeDateTime } from './date_time';
import { encodeNodeId, decodeNodeId } from './nodeid';
import { makeNodeId } from '../nodeid/nodeid';

// Micro-benchmarks for the primitive encode/decode functions.
// These sit on the hottest path of the binary protocol: every message is
// (de)serialised through them. Each bench pre-allocates a buffer and resets the
// stream position between iterations so we measure the codec, not allocation.

const BUF = new ArrayBuffer(1024);

function freshWriteStream(): DataStream {
  const s = new DataStream(BUF);
  s.length = 0;
  return s;
}

function preparedReadStream(write: (s: DataStream) => void): DataStream {
  const s = freshWriteStream();
  write(s);
  const r = new DataStream(BUF);
  return r;
}

describe('basic-types: UInt32', () => {
  bench('encodeUInt32', () => {
    const s = freshWriteStream();
    encodeUInt32(0xdeadbeef, s);
  });
  bench('decodeUInt32', () => {
    const s = preparedReadStream((w) => encodeUInt32(0xdeadbeef, w));
    decodeUInt32(s);
  });
});

describe('basic-types: Double', () => {
  bench('encodeDouble', () => {
    const s = freshWriteStream();
    encodeDouble(3.14159265358979, s);
  });
  bench('decodeDouble', () => {
    const s = preparedReadStream((w) => encodeDouble(3.14159265358979, w));
    decodeDouble(s);
  });
});

describe('basic-types: String', () => {
  const str = 'Temperature.Sensor.Value.Channel.001';
  bench('encodeString', () => {
    const s = freshWriteStream();
    encodeString(str, s);
  });
  bench('decodeString', () => {
    const s = preparedReadStream((w) => encodeString(str, w));
    decodeString(s);
  });
});

describe('basic-types: ByteString', () => {
  const bytes = new Uint8Array(64).map((_, i) => i & 0xff);
  bench('encodeByteString', () => {
    const s = freshWriteStream();
    encodeByteString(bytes, s);
  });
  bench('decodeByteString', () => {
    const s = preparedReadStream((w) => encodeByteString(bytes, w));
    decodeByteString(s);
  });
});

describe('basic-types: Guid', () => {
  const guid = '72962B91-FA75-4AE6-8D28-B404DC7DAF63';
  bench('encodeGuid', () => {
    const s = freshWriteStream();
    encodeGuid(guid, s);
  });
  bench('decodeGuid', () => {
    const s = preparedReadStream((w) => encodeGuid(guid, w));
    decodeGuid(s);
  });
});

describe('basic-types: DateTime', () => {
  const date = new Date('2024-01-01T00:00:00.000Z');
  bench('encodeDateTime', () => {
    const s = freshWriteStream();
    encodeDateTime(date, s);
  });
  bench('decodeDateTime', () => {
    const s = preparedReadStream((w) => encodeDateTime(date, w));
    decodeDateTime(s);
  });
});

describe('basic-types: NodeId', () => {
  const numericNodeId = makeNodeId(2258, 0);
  const stringNodeId = makeNodeId('Temperature.Sensor.001', 2);
  bench('encodeNodeId (numeric)', () => {
    const s = freshWriteStream();
    encodeNodeId(numericNodeId, s);
  });
  bench('decodeNodeId (numeric)', () => {
    const s = preparedReadStream((w) => encodeNodeId(numericNodeId, w));
    decodeNodeId(s);
  });
  bench('encodeNodeId (string)', () => {
    const s = freshWriteStream();
    encodeNodeId(stringNodeId, s);
  });
  bench('decodeNodeId (string)', () => {
    const s = preparedReadStream((w) => encodeNodeId(stringNodeId, w));
    decodeNodeId(s);
  });
});
