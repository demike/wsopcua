'use strict';

import { DataValue, extractRange } from '.';
import { DataType, Variant, VariantArrayType } from '../variant';
import { StatusCodes } from '../constants/raw_status_codes';
import { StatusCode } from '../basic-types/status_code';
import { NumericRange } from '../numeric-range/numeric_range';
import { ExtensionObject } from '../basic-types/extension_object';
import { BinaryStreamSizeCalculator, DataStream } from '../basic-types/DataStream';
import { IEncodable } from '../factory/factories_baseobject';
import { constructObject } from '../factory';
import { NodeId } from '../nodeid/nodeid';
import { decodeTimestampsToReturn, TimestampsToReturn } from '../generated';
import { apply_timestamps } from './datavalue';
import { getFunctionParameterNames } from '../utils';
import { getCurrentClock } from '../date-time/date_time';
import { assert } from '../assert';
import { call } from '../backoff';

function encode_decode_round_trip_test(
  obj: IEncodable,
  callback_buffer?: (buf: ArrayBuffer, encodingDefaultBinary: NodeId) => void
) {
  const bsc = new BinaryStreamSizeCalculator();
  obj.encode(bsc);
  const size = bsc.length;

  const stream = new DataStream(new ArrayBuffer(size));

  obj.encode(stream);

  if (callback_buffer) {
    assert(obj.encodingDefaultBinary);
    callback_buffer(stream.view.buffer, obj.encodingDefaultBinary);
  }

  stream.rewind();

  // reconstruct a object ( some object may not have a default Binary and should be recreated
  const expandedNodeId = obj.encodingDefaultBinary;
  const objReloaded = expandedNodeId ? constructObject(expandedNodeId) : obj.constructor();

  objReloaded.decode(stream);

  expect(objReloaded).toEqual(obj);
  return objReloaded;
}

describe('DataValue', function () {
  it('should create a empty DataValue and encode it as a 1-Byte length block', function () {
    const dataValue = new DataValue();

    encode_decode_round_trip_test(dataValue, function (buffer /* , id*/) {
      expect(buffer.byteLength).toBe(1);
    });
  });

  it('should create a DataValue with string variant and encode/decode it nicely ', function () {
    const dataValue = new DataValue({
      value: new Variant({ dataType: DataType.String, value: 'Hello' }),
    });
    encode_decode_round_trip_test(dataValue, function (buffer /* , id*/) {
      expect(buffer.byteLength).toBe(1 + 1 + 4 + 5);
    });
  });

  it('should create a DataValue with string variant and some date and encode/decode it nicely', function () {
    const dataValue = new DataValue({
      value: new Variant({ dataType: DataType.String, value: 'Hello' }),
      serverTimestamp: new Date(Date.UTC(1601, 0, 1, 0, 0, 1)),
      serverPicoseconds: 50000,
      sourceTimestamp: new Date(Date.UTC(1601, 0, 1, 0, 0, 2)),
      sourcePicoseconds: 25000, // 25 nano
    });
    // xx var str = dataValue.toString();
    encode_decode_round_trip_test(dataValue, function (/* buffer, id*/) {});
  });

  it('should create a DataValue with string variant and all dates and encode/decode it nicely', function () {
    const dataValue = new DataValue({
      value: new Variant({ dataType: DataType.String, value: 'Hello' }),
      statusCode: StatusCodes.BadCertificateHostNameInvalid as StatusCode,
      serverTimestamp: new Date(Date.UTC(2018, 1, 23, 12, 34, 56, 789)),
      serverPicoseconds: 12345, // 987654320,
      sourceTimestamp: new Date(Date.UTC(2018, 1, 23, 18, 54, 12, 345)),
      sourcePicoseconds: 12345, // 670
    });
    encode_decode_round_trip_test(dataValue, function (/* buffer, id*/) {});
  });
  /*
    it("DataValue#toString", function () {

        let dataValue = new DataValue({
            value: new Variant({dataType: DataType.String, value: "Hello"}),
            statusCode: new StatusCode(StatusCodes.BadCertificateHostNameInvalid),
            serverTimestamp: new Date(Date.UTC(1789, 6, 14)),
            serverPicoseconds: 1000,
            sourceTimestamp: new Date(Date.UTC(2089, 6, 14)),
            sourcePicoseconds: 2000
        });
        let str = dataValue.toString();
        expect(str.split(/\n/)).toEqual([
            "DataValue:",
            "   value:           Variant(Scalar<String>, value: Hello)",
            "   statusCode:      BadCertificateHostNameInvalid (0x80160000)",
            "   serverTimestamp: 1789-07-14T00:00:00.000Z $ 000.001.000",
            "   sourceTimestamp: 2089-07-14T00:00:00.000Z $ 000.002.000"
        ]);

        dataValue = new DataValue({
            value: new Variant({dataType: DataType.String, value: "Hello"}),
            statusCode: new StatusCode(StatusCodes.BadCertificateHostNameInvalid),
            serverTimestamp: null,
            serverPicoseconds: null,
            sourceTimestamp: new Date(Date.UTC(2089, 6, 14)),
            sourcePicoseconds: 2000
        });
        str = dataValue.toString();
        expect(str.split(/\n/)).toEqual([
            "DataValue:",
            "   value:           Variant(Scalar<String>, value: Hello)",
            "   statusCode:      BadCertificateHostNameInvalid (0x80160000)",
            "   serverTimestamp: null",
            "   sourceTimestamp: 2089-07-14T00:00:00.000Z $ 000.002.000"
        ]);
    });
*/

  it('DataValue - extractRange on a Float Array', function () {
    const dataValue = new DataValue({
      value: new Variant({
        dataType: DataType.Double,
        arrayType: VariantArrayType.Array,
        value: new Float64Array([1, 2, 3, 4, 5, 6, 7]),
      }),
    });
    const dataValue1 = extractRange(dataValue, new NumericRange('2:3'));
    assert(dataValue1.value);
    expect(dataValue1.value.value.length).toBe(2);
    expect(dataValue1.value.value[0]).toBe(3.0);
    expect(dataValue1.value.value[1]).toBe(4.0);
    expect(dataValue1.value.dataType).toBe(DataType.Double);
    expect(dataValue1.value.arrayType).toBe(VariantArrayType.Array);
  });
  it('DataValue - extractRange on a String', function () {
    const dataValue = new DataValue({
      value: new Variant({
        dataType: DataType.String,
        arrayType: VariantArrayType.Scalar,
        value: '1234567890',
      }),
    });
    const dataValue1 = extractRange(dataValue, new NumericRange('2:3'));
    assert(dataValue1.value);
    expect(dataValue1.value.value.length).toBe(2);
    expect(dataValue1.value.value).toBe('34');
    expect(dataValue1.value.dataType).toBe(DataType.String);
    expect(dataValue1.value.arrayType).toBe(VariantArrayType.Scalar);
  });

  it('DataValue - extractRange on a String with StatusCode != Good - issue #635', function () {
    const dataValue = new DataValue({
      statusCode: StatusCodes.BadEntryExists as StatusCode,
      value: new Variant({
        dataType: DataType.String,
        arrayType: VariantArrayType.Scalar,
        value: '1234567890',
      }),
    });
    const dataValue1 = extractRange(dataValue, new NumericRange('2:3'));
    assert(dataValue1.value);
    expect(dataValue1.value.value.length).toEqual(2);
    expect(dataValue1.value.value).toEqual('34');
    expect(dataValue1.value.dataType).toEqual(DataType.String);
    expect(dataValue1.value.arrayType).toEqual(VariantArrayType.Scalar);

    expect(dataValue1.statusCode).toEqual(StatusCodes.BadEntryExists);
  });
  it('DataValue - extractRange on a String with StatusCode != Good and invalid range - issue #635', function () {
    const dataValue = new DataValue({
      statusCode: StatusCodes.BadEntryExists as StatusCode,
      value: new Variant({
        dataType: DataType.String,
        arrayType: VariantArrayType.Scalar,
        value: '1234567890',
      }),
    });
    const dataValue1 = extractRange(dataValue, new NumericRange('20:30'));
    assert(dataValue1.value);
    expect(dataValue1.value.value.length).toEqual(0);
    expect(dataValue1.value.value).toEqual('');
    expect(dataValue1.value.dataType).toEqual(DataType.String);
    expect(dataValue1.value.arrayType).toEqual(VariantArrayType.Scalar);

    expect(dataValue1.statusCode).toEqual(StatusCodes.BadIndexRangeNoData);
  });

  it('DataValue - extractRange on a ByteString', function () {
    const dataValue = new DataValue({
      value: new Variant({
        dataType: DataType.ByteString,
        arrayType: VariantArrayType.Scalar,
        value: Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      }),
    });
    const dataValue1 = extractRange(dataValue, new NumericRange('2:3'));
    assert(dataValue1.value);
    expect(dataValue1.value.value.length).toBe(2);
    expect(dataValue1.value.value[0]).toBe(3.0);
    expect(dataValue1.value.value[1]).toBe(4.0);
    expect(dataValue1.value.dataType).toBe(DataType.ByteString);
    expect(dataValue1.value.arrayType).toBe(VariantArrayType.Scalar);
  });

  it('DataValue - extractRange on a ByteString (null value)', function () {
    const dataValue = new DataValue({
      value: new Variant({
        dataType: DataType.ByteString,
        arrayType: VariantArrayType.Scalar,
        value: null,
      }),
    });
    const dataValue1 = extractRange(dataValue, new NumericRange('2:3'));
    assert(dataValue1.value);
    expect(dataValue1.value.dataType).toBe(DataType.ByteString);
    expect(dataValue1.value.arrayType).toBe(VariantArrayType.Scalar);
    expect(dataValue1.value.value).toBeNull();
  });

  it('DataValue - extractRange on a Array of ByteString', function () {
    const enc = new TextEncoder();
    const dataValue = new DataValue({
      value: new Variant({
        dataType: DataType.ByteString,
        arrayType: VariantArrayType.Array,
        value: [enc.encode('ABC'), enc.encode('DEF'), enc.encode('GHI'), enc.encode('JKL'), null],
      }),
    });

    const dec = new TextDecoder();
    const dataValue1 = extractRange(dataValue, new NumericRange('2:3'));
    assert(dataValue1.value);
    expect(dataValue1.value.value.length).toBe(2);
    expect(dec.decode(dataValue1.value.value[0])).toBe('GHI');
    expect(dec.decode(dataValue1.value.value[1])).toBe('JKL');
    expect(dataValue1.value.dataType).toBe(DataType.ByteString);
    expect(dataValue1.value.arrayType).toBe(VariantArrayType.Array);
  });
  it('DataValue - extractRange on a Matrix of ByteString', function () {
    const enc = new TextEncoder();
    const dataValue = new DataValue({
      value: new Variant({
        dataType: DataType.ByteString,
        arrayType: VariantArrayType.Matrix,
        dimensions: [3, 3],
        value: [
          // [
          enc.encode('11'),
          enc.encode('12'),
          enc.encode('13'), // ],
          // [
          enc.encode('21'),
          enc.encode('22'),
          enc.encode('23'), // ],
          // [
          enc.encode('31'),
          enc.encode('32'),
          enc.encode('33'),
          // ]
        ],
      }),
    });
    const dec = new TextDecoder();
    const dataValue1 = extractRange(dataValue, new NumericRange('2,1:2'));
    assert(dataValue1.value);
    expect(dataValue1.value.value.length).toBe(2);
    expect(dec.decode(dataValue1.value.value[0])).toBe('32');
    expect(dec.decode(dataValue1.value.value[1])).toBe('33');
    expect(dataValue1.value.dataType).toBe(DataType.ByteString);
    expect(dataValue1.value.arrayType).toBe(VariantArrayType.Matrix);
    expect(dataValue1.value.dimensions).toEqual([1, 2]);
  });

  describe('Cloning a DataValue', function () {
    class SomeExtensionObject extends ExtensionObject {
      a: number;
      constructor(options: any) {
        super();
        this.a = options.a;
      }

      clone() {
        return new SomeExtensionObject(this);
      }
    }

    function copy_construct(v: DataValue) {
      return new DataValue(v);
    }

    function clone(v: DataValue) {
      return v.clone();
    }

    function install_test(
      copy_construct_or_clone: 'copy construct' | 'clone',
      copy_construct_or_clone_func: (v: DataValue) => DataValue
    ) {
      it('should ' + copy_construct_or_clone + ' a DataValue with a simple Variant', function () {
        const dv = new DataValue({
          value: new Variant({
            dataType: DataType.UInt32,
            value: 36,
          }),
        });
        const cloned = copy_construct_or_clone_func(dv);

        expect(cloned.value?.dataType).toBe(dv.value?.dataType);
        expect(cloned.value?.value).toBe(dv.value?.value);
      });
      it('should ' + copy_construct_or_clone + ' a DataValue with a variant array', function () {
        const dv = new DataValue({
          value: new Variant({
            dataType: DataType.UInt32,
            value: [36, 37],
          }),
        });

        const cloned = copy_construct_or_clone_func(dv);
        assert(cloned.value);
        assert(dv.value);
        expect(cloned.value.dataType).toBe(dv.value.dataType);
        expect(cloned.value.value).toEqual(dv.value.value);
        expect(cloned.value.value[0]).toBe(36);
        expect(cloned.value.value[1]).toBe(37);

        dv.value.value[0] = 136;
        dv.value.value[1] = 137;

        if (copy_construct_or_clone === 'clone') {
          expect(cloned.value.value[0]).toBe(36);
          expect(cloned.value.value[1]).toBe(37);
        } else {
          expect(cloned.value.value[0]).toBe(136);
          expect(cloned.value.value[1]).toBe(137);
        }
      });
      it(
        'should ' + copy_construct_or_clone + ' a DataValue with a variant array of ByteString',
        function () {
          const enc = new TextEncoder();
          const dv = new DataValue({
            value: new Variant({
              dataType: DataType.ByteString,
              arrayType: VariantArrayType.Array,
              value: [
                enc.encode('ABC'),
                enc.encode('DEF'),
                enc.encode('GHI'),
                enc.encode('JKL'),
                null,
              ],
            }),
          });

          const cloned = copy_construct_or_clone_func(dv);
          assert(cloned.value);
          assert(dv.value);

          expect(cloned.value.dataType).toBe(dv.value.dataType);
          expect(cloned.value.value).toEqual(dv.value.value);
          expect(cloned.value.value[0].toString()).toBe(dv.value.value[0].toString());
          expect(cloned.value.value[1].toString()).toBe(dv.value.value[1].toString());
          expect(cloned.value.value[2].toString()).toBe(dv.value.value[2].toString());
          expect(cloned.value.value[3].toString()).toBe(dv.value.value[3].toString());

          dv.value.value[0] = enc.encode('ZZZ');
          dv.value.value[1] = enc.encode('YYY');

          const dec = new TextDecoder();

          if (copy_construct_or_clone === 'clone') {
            // clone object should not have been affected !
            expect(dec.decode(cloned.value.value[0])).toBe('ABC');
            expect(dec.decode(cloned.value.value[1])).toBe('DEF');
          } else {
            expect(dec.decode(cloned.value.value[0])).toBe('ZZZ');
            expect(dec.decode(cloned.value.value[1])).toBe('YYY');
          }
        }
      );

      it(
        'should ' +
          copy_construct_or_clone +
          ' a DataValue with a variant containing a extension object',
        function () {
          const extObj = new SomeExtensionObject({ a: 36 });
          const dv = new DataValue({
            value: new Variant({
              dataType: DataType.ExtensionObject,
              value: extObj,
            }),
          });

          const cloned = copy_construct_or_clone_func(dv);
          assert(cloned.value);
          assert(dv.value);

          expect(cloned.value.dataType).toBe(dv.value.dataType);
          expect(cloned.value.value.a).toBe(dv.value.value.a);

          extObj.a = 1000;

          if (copy_construct_or_clone === 'clone') {
            expect(cloned.value.value).not.toEqual(dv.value.value);
            expect(cloned.value.value.a).toEqual(36);
          } else {
            expect(cloned.value.value).toEqual(dv.value.value);
            expect(cloned.value.value.a).toEqual(1000);
          }

          expect(dv.value.value.a).toBe(1000);
        }
      );
      it(
        'should ' +
          copy_construct_or_clone +
          ' a DataValue with a variant containing a extension object array',
        function () {
          const extObj1 = new SomeExtensionObject({ a: 36 });
          const extObj2 = new SomeExtensionObject({ a: 37 });
          const dv = new DataValue({
            value: new Variant({
              dataType: DataType.ExtensionObject,
              arrayType: VariantArrayType.Array,
              value: [extObj1, extObj2],
            }),
          });

          // copy construct;,
          const cloned = copy_construct_or_clone_func(dv);
          assert(cloned.value);
          assert(dv.value);

          expect(cloned.value.dataType).toBe(dv.value.dataType);
          expect(cloned.value.value[0].a).toBe(36);
          expect(cloned.value.value[1].a).toBe(37);

          extObj1.a = 1000;
          extObj2.a = 1001;

          if (copy_construct_or_clone === 'clone') {
            expect(cloned.value.value[0].a).toBe(36);
            expect(cloned.value.value[1].a).toBe(37);
          } else {
            expect(cloned.value.value[0].a).toBe(1000);
            expect(cloned.value.value[1].a).toBe(1001);
          }

          expect(dv.value.value[0].a).toBe(1000);
          expect(dv.value.value[1].a).toBe(1001);
        }
      );
    }

    install_test('copy construct', copy_construct);
    install_test('clone', clone);
  });
});

describe('TimestampsToReturn', function () {
  it('should decode timestampsToReturn', function () {
    const buffer = new ArrayBuffer(10);
    const stream = new DataStream(buffer);
    stream.setUint32(TimestampsToReturn.Both);
    stream.rewind();
    const timestampToReturn = decodeTimestampsToReturn(stream);
    expect(timestampToReturn).toBe(TimestampsToReturn.Both);
  });
});

describe('apply_timestamps', function () {
  let dataValue: DataValue;
  beforeEach(function () {
    const now = getCurrentClock();
    dataValue = new DataValue({
      value: new Variant({ dataType: DataType.String, value: 'Hello' }),
      sourcePicoseconds: now.picoseconds,
      sourceTimestamp: now.timestamp,
    });
  });

  it('should apply both timestamps to return', function () {
    const cloneDataValue = apply_timestamps(dataValue, TimestampsToReturn.Both, 13 /* value */);
    expect(cloneDataValue.value?.value).toBe('Hello');
    expect(cloneDataValue.serverTimestamp).toBeDefined();
    expect(cloneDataValue.sourceTimestamp).toBeDefined();
  });

  it('should apply server timestamp only', function () {
    const cloneDataValue = apply_timestamps(dataValue, TimestampsToReturn.Server, 13 /* value */);
    expect(cloneDataValue.value?.value).toBe('Hello');
    expect(cloneDataValue.serverTimestamp).toBeDefined();
    expect(cloneDataValue.serverPicoseconds).toBeDefined();
    expect(cloneDataValue.sourceTimestamp).toBeUndefined();
  });

  it('should apply source timestamp only', function () {
    const now = getCurrentClock();
    dataValue.sourceTimestamp = now.timestamp;
    dataValue.sourcePicoseconds = now.picoseconds;
    const cloneDataValue = apply_timestamps(dataValue, TimestampsToReturn.Source, 13 /* value */);

    expect(cloneDataValue.value?.value).toBe('Hello');
    expect(cloneDataValue.serverTimestamp).toBeUndefined();
    expect(cloneDataValue.sourceTimestamp).toBe(now.timestamp);
    expect(cloneDataValue.sourcePicoseconds).toBe(now.picoseconds);
  });
});
