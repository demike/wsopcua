import { coerceByteString } from './byte_string';
import { buf2base64 } from '../crypto/crypto_utils';
import { coerceInt32, coerceUInt32, coerceUInt64, Int64 } from './integers';
import { coerceBoolean, coerceInt64 } from '.';
import * as ec from '.';
describe('ByteString', () => {
  const data = new Uint8Array([1, 2, 3]);
  it('coerceByteString with an array of integer', () => {
    expect(coerceByteString([1, 2, 3])).toEqual(data);
  });
  it('coerceByteString with base64 string', () => {
    expect(coerceByteString(buf2base64(data))).toEqual(data);
  });
  it('coerceByteString with a ArrayBuffer', () => {
    expect(coerceByteString(data.buffer)).toEqual(data);
  });
});
describe('coerceUInt32', () => {
  it('coerceUInt32 number', () => {
    expect(coerceUInt32(1)).toEqual(1);
  });
  it('coerceUInt32 number from string', () => {
    expect(coerceUInt32('123')).toEqual(123);
  });
});
describe('coerceInt32', () => {
  it('coerceInt32 number', () => {
    expect(coerceInt32(1)).toEqual(1);
  });
  it('coerceInt32 number', () => {
    expect(coerceInt32('123')).toEqual(123);
  });
  it('coerceInt32 number', () => {
    expect(coerceInt32([0, 56])).toEqual(56);
  });
});

describe('coerceInt64', () => {
  it('should coerce a positive Int32 to Int64', () => {
    expect(coerceInt64(10)).toEqual([0x0, 0xa]);
  });
  it('should coerce a negative Int32 to Int64', () => {
    expect(coerceInt64(-1)).toEqual([0xffffffff, 0xffffffff]);
  });
  it('should coerce a negative Int32 to Int64', () => {
    expect(coerceInt64(-2)).toEqual([0xffffffff, 0xfffffffe]);
  });
  it('should coerce a negative Int32 to Int64', () => {
    expect(coerceInt64(-9)).toEqual([0xffffffff, 0xfffffff7]);
  });
});
describe('coerceUInt64', () => {
  it('should coerce an Int32 into UInt64', () => {
    expect(coerceUInt64(0xff1000)).toEqual([0x0, 0xff1000]);
  });
  it('should coerce an long number into UInt64', () => {
    expect(coerceUInt64(0x1020000000)).toEqual([0x10, 0x20000000]);
  });

  it('should coerce an long number into UInt64', () => {
    expect(coerceUInt64(0x100020000000)).toEqual([0x1000, 0x20000000]);
  });
  it('should coerce an long number into UInt64', () => {
    expect(coerceUInt64(0x100020000000)).toEqual([0x1000, 0x20000000]);
  });
  (
    [
      [1, [0x0, 0x1]],
      [-1, [0xffffffff, 0xffffffff]],
      [-2, [0xffffffff, 0xfffffffe]],
      ['1', [0x0, 0x1]],
      ['-1', [0xffffffff, 0xffffffff]],
      ['-2', [0xffffffff, 0xfffffffe]],
      [-32768, [0xffffffff, 0xffff8000]],
      ['0x1000000000', [0x10, 0x0]],
      ['-100000000000000', [4294944012, 4018520064]],
    ] as unknown as [[number | string, Int64]]
  ).forEach(([input, output]) =>
    it(`should coerce ${typeof input}:${input} number  into ${(output as number[])
      .map((a) => a.toString(16))
      .join(',')}`, () => {
      expect(coerceInt64(input)).toEqual(output);
    })
  );
});
describe('check coerce various types', () => {
  //
  //        "String",
  //        "Boolean",
  //        "Double",
  //        "Float",
  //        "Guid",
  //        "DateTime",
  //        "NodeId",
  //        "ByteString",

  it('should have a coerce method for boolean', () => {
    expect(coerceBoolean('false')).toEqual(false);
    expect(coerceBoolean('true')).toEqual(true);

    expect(coerceBoolean(0)).toEqual(false);
    expect(coerceBoolean(1)).toEqual(true);

    expect(coerceBoolean(false)).toEqual(false);
    expect(coerceBoolean(true)).toEqual(true);

    expect(coerceBoolean('0')).toEqual(false);
    expect(coerceBoolean('1')).toEqual(true);
  });

  const types = [
    'Byte',
    'SByte',
    'UInt8',
    'UInt16',
    'UInt32',
    'Int8',
    'Int16',
    'Int32',
    'Float',
    'Double',
    'Int64',
    'UInt64',
  ];

  types.forEach(function (type) {
    it('should have a coerce method for ' + type, () => {
      const coerceFunc: any = ec['coerce' + type];
      const randomFunc: any = ec['random' + type];

      expect(ec['coerce' + type]).toBeDefined();
      expect(ec['random' + type]).toBeDefined();
      expect(ec['isValid' + type]).toBeDefined();

      const random_value = randomFunc();

      const value1 = coerceFunc(random_value);
      value1.should.eql(random_value);

      const value2 = coerceFunc(random_value.toString());
      value2.should.eql(random_value);
    });
  });

  function w(str, l) {
    return (str + '                        ').substring(0, l);
  }

  types.forEach((type) => {
    it('coerce' + w(type, 8) + ' should preserves null or undefined values ', () => {
      const coerceFunc = ec['coerce' + type];

      expect(coerceFunc).toBeDefined();

      const value1 = coerceFunc(null);
      if (value1 instanceof Array) {
        expect(value1).toEqual([0, 0]);
      } else {
        expect(value1).toEqual(0);
      }
      const value2 = coerceFunc();
      if (value2 instanceof Array) {
        expect(value2).toEqual([0, 0]);
      } else {
        expect(value2).toEqual(0);
      }
    });
  });
});
