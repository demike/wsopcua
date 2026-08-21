import { bench, describe } from 'vitest';

import { DataStream } from '../basic-types/DataStream';
import { Variant, decodeVariant } from './variant';
import { DataType } from './DataTypeEnum';
import { VariantArrayType } from './VariantArrayTypeEnum';
import { DataValue } from '../generated/DataValue';
import { StatusCodes } from '../constants/raw_status_codes';
import { StatusCode } from '../basic-types/status_code';

// Benchmarks for Variant and DataValue codecs. These are the payloads that
// dominate real OPC-UA traffic (every monitored-item notification and read
// response carries DataValues wrapping Variants), so they are prime targets for
// perf work.

const BUF = new ArrayBuffer(64 * 1024);

function freshWriteStream(): DataStream {
  const s = new DataStream(BUF);
  s.length = 0;
  return s;
}

function preparedReadStream(write: (s: DataStream) => void): DataStream {
  const s = freshWriteStream();
  write(s);
  return new DataStream(BUF);
}

const scalarUInt32 = new Variant({ dataType: DataType.UInt32, value: 42 });
const scalarDouble = new Variant({ dataType: DataType.Double, value: 3.14159 });
const scalarString = new Variant({ dataType: DataType.String, value: 'Hello OPC UA' });

const doubleArray = new Float64Array(1000).map((_, i) => i * 1.5);
const arrayVariant = new Variant({
  dataType: DataType.Double,
  arrayType: VariantArrayType.Array,
  value: doubleArray,
});

describe('variant: scalar UInt32', () => {
  bench('encode', () => {
    scalarUInt32.encode(freshWriteStream());
  });
  bench('decode', () => {
    decodeVariant(preparedReadStream((s) => scalarUInt32.encode(s)));
  });
});

describe('variant: scalar Double', () => {
  bench('encode', () => {
    scalarDouble.encode(freshWriteStream());
  });
  bench('decode', () => {
    decodeVariant(preparedReadStream((s) => scalarDouble.encode(s)));
  });
});

describe('variant: scalar String', () => {
  bench('encode', () => {
    scalarString.encode(freshWriteStream());
  });
  bench('decode', () => {
    decodeVariant(preparedReadStream((s) => scalarString.encode(s)));
  });
});

describe('variant: Double[1000] array', () => {
  bench('encode', () => {
    arrayVariant.encode(freshWriteStream());
  });
  bench('decode', () => {
    decodeVariant(preparedReadStream((s) => arrayVariant.encode(s)));
  });
});

const dataValue = new DataValue({
  value: new Variant({ dataType: DataType.Double, value: 123.456 }),
  statusCode: StatusCodes.Good as StatusCode,
  sourceTimestamp: new Date('2024-01-01T00:00:00.000Z'),
  serverTimestamp: new Date('2024-01-01T00:00:00.001Z'),
});

describe('data-value: full DataValue', () => {
  bench('encode', () => {
    dataValue.encode(freshWriteStream());
  });
  bench('decode', () => {
    const s = preparedReadStream((w) => dataValue.encode(w));
    new DataValue().decode(s);
  });
});
