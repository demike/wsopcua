import { bench, describe } from 'vitest';

import { DataStream } from '../basic-types/DataStream';
import { ReadResponse } from '../generated/ReadResponse';
import { ResponseHeader } from '../generated/ResponseHeader';
import { DataValue } from '../generated/DataValue';
import { Variant } from '../variant/variant';
import { DataType } from '../variant/DataTypeEnum';
import { StatusCodes } from '../constants/raw_status_codes';
import { StatusCode } from '../basic-types/status_code';

// End-to-end DECODE benchmark for the payload that dominates real client
// throughput: a ReadResponse / PublishResponse carries an array of DataValues,
// each wrapping a Variant plus status code and source/server timestamps. This
// exercises the whole decode stack (structure -> array -> DataValue -> Variant
// scalar dispatch -> DateTime/StatusCode/primitive codecs) and is far more
// representative than the primitive micro-benchmarks.
//
// NOTE: these run against the source under Vitest (esbuild), so unlike the
// `dist/_cjs` profiling harness they do not incur the TypeScript CommonJS
// `__createBinding` re-export getter indirection that the browser ESM bundle
// also avoids.

function makeDataValue(i: number): DataValue {
  const sourceTimestamp = new Date(Date.UTC(2024, 0, 1, 0, 0, i % 60, i % 1000));
  const serverTimestamp = new Date(sourceTimestamp.getTime() + 1);

  let value: Variant;
  switch (i % 5) {
    case 0:
      value = new Variant({ dataType: DataType.Double, value: i * 1.5 });
      break;
    case 1:
      value = new Variant({ dataType: DataType.UInt32, value: i * 7 });
      break;
    case 2:
      value = new Variant({ dataType: DataType.String, value: 'Sensor.Channel.' + i });
      break;
    case 3:
      value = new Variant({ dataType: DataType.Boolean, value: (i & 1) === 0 });
      break;
    default:
      value = new Variant({ dataType: DataType.Int16, value: (i % 100) - 50 });
  }

  return new DataValue({
    value,
    statusCode: StatusCodes.Good,
    sourceTimestamp,
    serverTimestamp,
  });
}

function makeReadResponse(valueCount: number): ReadResponse {
  const results: DataValue[] = [];
  for (let i = 0; i < valueCount; i++) {
    results.push(makeDataValue(i));
  }
  return new ReadResponse({
    responseHeader: new ResponseHeader(),
    results,
    diagnosticInfos: [],
  });
}

function benchDecode(label: string, valueCount: number) {
  const response = makeReadResponse(valueCount);
  const size = DataStream.binaryStoreSize(response);
  const buffer = new ArrayBuffer(size);
  // pre-encode once; the decode bench resets the read position each iteration
  const w = new DataStream(buffer);
  w.length = 0;
  response.encode(w);

  describe(label, () => {
    bench('encode', () => {
      const s = new DataStream(buffer);
      s.length = 0;
      response.encode(s);
    });
    bench('decode', () => {
      const r = new DataStream(buffer);
      new ReadResponse().decode(r);
    });
  });
}

benchDecode('message: ReadResponse (10 DataValues)', 10);
benchDecode('message: ReadResponse (100 DataValues)', 100);
benchDecode('message: ReadResponse (1000 DataValues)', 1000);
