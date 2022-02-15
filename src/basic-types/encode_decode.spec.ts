'use strict';
/* global Buffer */

import * as ec from './';
import { DataStream } from './DataStream';

import * as guid from './guid';
import { makeNodeId, NodeId } from '../nodeid/nodeid';
import { makeExpandedNodeId, ExpandedNodeId } from '../nodeid/expanded_nodeid';
import { hexDump } from '../common/debug';
import { NodeIdType } from '../generated/NodeIdType';

const crypto: Crypto = window.crypto || (<any>window).msCrypto; // for IE 11

const littleEndian = true;

beforeEach(() => {
  jasmine.addCustomEqualityTester((first, second) => {
    if (first instanceof NodeId && second instanceof NodeId) {
      return (
        first.namespace === second.namespace &&
        first.identifierType === second.identifierType &&
        jasmine.matchersUtil.equals(first.identifierType, second.identifierType)
      );
    }
  });
});

/**
 * @method test_encode_decode
 *
 * @param obj
 * @param encode_func {Function}
 * @param encode_func.obj {Object}
 * @param encode_func.binaryStream {DataStream}
 * @param decode_func {Function}
 * @param decode_func.binaryStream {DataStream}
 * @param expectedLength {Integer}
 * @param [verify_buffer_func=null] {Function}
 * @param verify_buffer_func.buffer {Buffer}
 */
function test_encode_decode(
  obj: any,
  encode_func: Function,
  decode_func: Function,
  expectedLength: number,
  verify_buffer_func?: (buf: ArrayBuffer) => void
) {
  const binaryStream = new DataStream(new ArrayBuffer(expectedLength));
  expect(binaryStream.length).toBe(0);

  encode_func(obj, binaryStream);
  expect(binaryStream.length).toBe(expectedLength);

  if (verify_buffer_func) {
    verify_buffer_func(binaryStream.view.buffer);
  }
  binaryStream.rewind();

  const obj_verif = decode_func(binaryStream);
  expect(binaryStream.length).toBe(expectedLength);

  if (obj !== undefined) {
    expect(obj_verif).toEqual(obj);
  } else {
    expect(obj_verif == null /* null or undefined */).toBeTruthy();
  }
}

describe('testing built-in type encoding', function () {
  it('should encode and decode a boolean as a single byte', function () {
    test_encode_decode(true, ec.encodeBoolean, ec.decodeBoolean, 1);
    test_encode_decode(false, ec.encodeBoolean, ec.decodeBoolean, 1);
  });

  it('should encode and decode a Int16 (2 bytes)', function () {
    test_encode_decode(255, ec.encodeInt16, ec.decodeInt16, 2, function (buf) {
      const buffer = new Uint8Array(buf);
      // should be little endian
      expect(buffer[0]).toEqual(0xff);
      expect(buffer[1]).toEqual(0x00);
    });
    test_encode_decode(-32000, ec.encodeInt16, ec.decodeInt16, 2);
  });

  it('should encode and decode a Int16 (2 bytes)', function () {
    test_encode_decode(0xfffe, ec.encodeUInt16, ec.decodeUInt16, 2, function (buf) {
      const buffer = new Uint8Array(buf);
      // should be little endian
      expect(buffer[0]).toEqual(0xfe);
      expect(buffer[1]).toEqual(0xff);
    });
  });

  it('should encode and decode a Integer (4 bytes)', function () {
    test_encode_decode(1000000000, ec.encodeInt32, ec.decodeInt32, 4, function (buf) {
      const buffer = new Uint8Array(buf);
      // should be little endian
      expect(buffer[0]).toEqual(0x00);
      expect(buffer[1]).toEqual(0xca);
      expect(buffer[2]).toEqual(0x9a);
      expect(buffer[3]).toEqual(0x3b);
    });
    test_encode_decode(-100000000, ec.encodeInt32, ec.decodeInt32, 4);
  });

  it('should encode and decode a Floating Point (4 bytes)', function () {
    const value = -6.5;
    // I EEE-754
    test_encode_decode(value, ec.encodeFloat, ec.decodeFloat, 4, function (buf) {
      const buffer = new Uint8Array(buf);
      // should be little endian
      expect(buffer[0]).toEqual(0x00);
      expect(buffer[1]).toEqual(0x00);
      expect(buffer[2]).toEqual(0xd0);
      expect(buffer[3]).toEqual(0xc0);
    });
  });

  it('should encode and decode a Double Point (8 bytes)', function () {
    // I EEE-754

    const value = -6.5;
    // I EEE-754
    test_encode_decode(value, ec.encodeDouble, ec.decodeDouble, 8, function (buf) {
      const buffer = new Uint8Array(buf);
      // should be little endian
      expect(buffer[0]).toEqual(0x00);
      expect(buffer[1]).toEqual(0x00);
      expect(buffer[2]).toEqual(0x00);
      expect(buffer[3]).toEqual(0x00);
      expect(buffer[4]).toEqual(0x00);
      expect(buffer[5]).toEqual(0x00);
      expect(buffer[6]).toEqual(0x1a);
      expect(buffer[7]).toEqual(0xc0);
    });
  });

  it('should encode and decode a null string', function () {
    // tslint:disable-next-line: prefer-const
    let value: string;

    test_encode_decode(value, ec.encodeString, ec.decodeString, 4, function (buf) {
      const buffer = new Uint8Array(buf);
      // should be little endian
      expect(buffer[0]).toEqual(0xff);
      expect(buffer[1]).toEqual(0xff);
      expect(buffer[2]).toEqual(0xff);
      expect(buffer[3]).toEqual(0xff);
    });
  });

  it('should encode and decode a normal string', function () {
    const value = 'Hello';

    test_encode_decode(value, ec.encodeString, ec.decodeString, 9, function (buf) {
      const buffer = new Uint8Array(buf);
      // should be little endian
      expect(buffer[0]).toEqual(0x05);
      expect(buffer[1]).toEqual(0x00);
      expect(buffer[2]).toEqual(0x00);
      expect(buffer[3]).toEqual(0x00);
      expect(buffer[4]).toEqual('H'.charCodeAt(0));
      expect(buffer[5]).toEqual('e'.charCodeAt(0));
      expect(buffer[6]).toEqual('l'.charCodeAt(0));
      expect(buffer[7]).toEqual('l'.charCodeAt(0));
      expect(buffer[8]).toEqual('o'.charCodeAt(0));
    });
  });

  it('should encode and decode a DateTime - origin', function () {
    const value = new Date(Date.UTC(1601, 0, 1, 0, 0, 0));
    test_encode_decode(value, ec.encodeDateTime, ec.decodeDateTime, 8, function (buf) {
      // todo
    });
  });
  it('should encode and decode a DateTime', function () {
    const value = new Date(Date.UTC(2014, 0, 2, 15, 0));
    test_encode_decode(value, ec.encodeDateTime, ec.decodeDateTime, 8, function (buf) {
      // todo
    });
  });

  it('should encode and decode a GUID', function () {
    const value = guid.emptyGuid;
    expect(value).toBeDefined();

    test_encode_decode(value, ec.encodeGuid, ec.decodeGuid, 16, function (buf) {
      const buffer = new Uint8Array(buf);
      expect(buffer[0]).toEqual(0x00);
      expect(buffer[1]).toEqual(0x00);
      expect(buffer[2]).toEqual(0x00);
      expect(buffer[3]).toEqual(0x00);

      expect(buffer[4]).toEqual(0x00);
      expect(buffer[5]).toEqual(0x00);

      expect(buffer[6]).toEqual(0x00);
      expect(buffer[7]).toEqual(0x00);

      expect(buffer[8]).toEqual(0x00);
      expect(buffer[9]).toEqual(0x00);

      expect(buffer[10]).toEqual(0x00);
      expect(buffer[11]).toEqual(0x00);
      expect(buffer[12]).toEqual(0x00);
      expect(buffer[13]).toEqual(0x00);
      expect(buffer[14]).toEqual(0x00);
      expect(buffer[15]).toEqual(0x00);
    });
  });

  it('should encode and decode a GUID', function () {
    const value = '72962B91-FA75-4AE6-8D28-B404DC7DAF63';

    test_encode_decode(value, ec.encodeGuid, ec.decodeGuid, 16, function (buf) {
      const buffer = new Uint8Array(buf);
      expect(buffer[0]).toEqual(0x91);
      expect(buffer[1]).toEqual(0x2b);
      expect(buffer[2]).toEqual(0x96);
      expect(buffer[3]).toEqual(0x72);

      expect(buffer[4]).toEqual(0x75);
      expect(buffer[5]).toEqual(0xfa);

      expect(buffer[6]).toEqual(0xe6);
      expect(buffer[7]).toEqual(0x4a);

      expect(buffer[8]).toEqual(0x8d);
      expect(buffer[9]).toEqual(0x28);

      expect(buffer[10]).toEqual(0xb4);
      expect(buffer[11]).toEqual(0x04);
      expect(buffer[12]).toEqual(0xdc);
      expect(buffer[13]).toEqual(0x7d);
      expect(buffer[14]).toEqual(0xaf);
      expect(buffer[15]).toEqual(0x63);
    });
  });

  it('should encode and decode a ByteString', function () {
    const str = 'THIS IS MY BUFFER';
    const ba = new Uint8Array(new ArrayBuffer(256));
    const txtEncoder = new TextEncoder();
    ba.set(txtEncoder.encode(str));

    test_encode_decode(ba, ec.encodeByteString, ec.decodeByteString, 256 + 4, function (buf) {
      const buffer = new DataView(buf);
      expect(buffer.getUint32(0, littleEndian)).toEqual(256);
      const stream = new DataStream(buf);
      expect(stream.readByteStream()).toEqual(ba);
    });
    // xx check_buf.toString('hex').should.equal(buf.toString('hex'));
  });

  it('should encode and decode a two byte NodeId', function () {
    const nodeId = makeNodeId(25);
    expect(nodeId.identifierType).toEqual(NodeIdType.Numeric);

    test_encode_decode(nodeId, ec.encodeNodeId, ec.decodeNodeId, 2, function verify_buffer(buf) {
      const buffer = new Uint8Array(buf);
      expect(buffer[0]).toEqual(0);
      expect(buffer[1]).toEqual(25); // namespace
    });
  });

  it('should encode and decode a four byte NodeId', function () {
    const nodeId = makeNodeId(258);
    expect(nodeId.identifierType).toEqual(NodeIdType.Numeric);
    test_encode_decode(nodeId, ec.encodeNodeId, ec.decodeNodeId, 4, function verify_buffer(buf) {
      const buffer = new DataView(buf);
      expect(buffer.getInt8(0)).toBe(1);
      expect(buffer.getInt8(1)).toBe(0); // namespace
      expect(buffer.getUint16(2, littleEndian)).toEqual(258);
    });
  });

  it('should encode and decode a Numeric NodeId', function () {
    const nodeId = makeNodeId(545889, 2500);
    expect(nodeId.identifierType).toEqual(NodeIdType.Numeric);
    test_encode_decode(nodeId, ec.encodeNodeId, ec.decodeNodeId, 7);
  });
  it('should encode and decode a byte NodeId (bug reported by Mika)', function () {
    const nodeId = makeNodeId(129, 129);
    test_encode_decode(
      nodeId,
      ec.encodeNodeId,
      ec.decodeNodeId,
      4 // nb bytes
    );
  });

  it('should encode and decode any small numeric NodeId', function () {
    for (let i = 0; i <= 255; i++) {
      const nodeId = makeNodeId(/* value*/ i, /* namespace*/ 2);
      test_encode_decode(nodeId, ec.encodeNodeId, ec.decodeNodeId, 4);
    }
  });

  it('should encode and decode a String NodeId', function () {
    const nodeId = makeNodeId('SomeStuff', 2500);
    expect(nodeId.identifierType).toEqual(NodeIdType.String);

    test_encode_decode(nodeId, ec.encodeNodeId, ec.decodeNodeId, 4 + 9 + 2 + 1);
  });

  it('should encode and decode a Guid NodeId', function () {
    const nodeId = makeNodeId('72962B91-FA75-4AE6-8D28-B404DC7DAF63', 2500);
    expect(nodeId.identifierType).toEqual(NodeIdType.Guid);
    test_encode_decode(nodeId, ec.encodeNodeId, ec.decodeNodeId, 16 + 2 + 1);
  });
  it('should encode and decode a String NodeId that looks like a GUID (issue#377)', function () {
    const nodeId = new NodeId(NodeIdType.String, '72962B91-FA75-4AE6-8D28-B404DC7DAF63', 2500);
    expect(nodeId.identifierType).toEqual(NodeIdType.String);
    test_encode_decode(nodeId, ec.encodeNodeId, ec.decodeNodeId, 43);
  });

  it('should encode and decode a Opaque NodeId', function () {
    const value = new Uint8Array(new ArrayBuffer(32));
    for (let i = 0; i < 32; i++) {
      value[i] = i;
    }
    const nodeId = makeNodeId(value, 0x1bcd);
    expect(nodeId.identifierType).toEqual(NodeIdType.ByteString);
    const expectedLength = 1 + 2 + 4 + 32;
    test_encode_decode(nodeId, ec.encodeNodeId, ec.decodeNodeId, expectedLength, function (buf) {
      const buffer = new DataView(buf);
      // cod
      expect(buffer.getUint8(0)).toEqual(0x05);
      // namespace
      expect(buffer.getUint8(1)).toEqual(0xcd);
      expect(buffer.getUint8(2)).toEqual(0x1b);
      // size
      expect(buffer.getUint32(3, littleEndian)).toEqual(32);

      expect(buffer.getUint8(7)).toEqual(0x00);
      expect(buffer.getUint8(8)).toEqual(0x01);
      expect(buffer.getUint8(9)).toEqual(0x02);
      expect(buffer.getUint8(10)).toEqual(0x03);
      expect(buffer.getUint8(11)).toEqual(0x04);
      expect(buffer.getUint8(12)).toEqual(0x05);
      // ...
      expect(buffer.getUint8(38)).toEqual(31);
    });
  });

  it('should encode and decode a BYTESTRING NodeId', function () {
    const nodeId = new NodeId(NodeIdType.ByteString, crypto.getRandomValues(new Uint8Array(16)));

    const expectedLength = 1 + 2 + 4 + 16;
    test_encode_decode(
      nodeId,
      ec.encodeNodeId,
      ec.decodeNodeId,
      expectedLength,
      function (buffer) {}
    );
  });

  it('should encode and decode a Expanded NodeId  - TwoBytes', function () {
    test_encode_decode(makeExpandedNodeId(10), ec.encodeExpandedNodeId, ec.decodeExpandedNodeId, 2);
  });

  it('should encode and decode a Expanded NodeId  - FourBytes', function () {
    test_encode_decode(
      makeExpandedNodeId(32000),
      ec.encodeExpandedNodeId,
      ec.decodeExpandedNodeId,
      4
    );
  });

  it('should encode and decode a Expanded NodeId with namespaceUri', function () {
    const serverIndex = 2;
    const namespaceUri = 'some:namespace:uri';
    const expandedNodeId = new ExpandedNodeId(
      NodeIdType.Numeric,
      4123,
      4,
      namespaceUri,
      serverIndex
    );
    test_encode_decode(expandedNodeId, ec.encodeExpandedNodeId, ec.decodeExpandedNodeId, 33);
  });

  it('should encode and decode a UInt64 EightBytes', function () {
    test_encode_decode([356, 234], ec.encodeUInt64, ec.decodeUInt64, 8);
  });

  it('should encode and decode a Int64 EightBytes', function () {
    test_encode_decode([356, 234], ec.encodeInt64, ec.decodeInt64, 8);
  });
});

describe('encoding and decoding string', function () {
  it('should encode and decode a simple ascii String', function () {
    test_encode_decode('hello world', ec.encodeString, ec.decodeString, 11 + 4);
  });

  it('should encode and decode a utf-8 containing double bytes characters', function () {
    test_encode_decode(
      '°C',
      ec.encodeString,
      ec.decodeString,
      3 + 4, // (°=2 bytes charaters + 1)
      function verify_buffer_func(buffer) {
        console.log(hexDump(buffer.slice(0, 7)));
      }
    );
  });
  it('should encode and decode a utf-8 containing chinesse characters', function () {
    test_encode_decode(
      '你好世界', // hello world
      ec.encodeString,
      ec.decodeString,
      16,
      function verify_buffer_func(buffer) {
        console.log(hexDump(buffer.slice(0, 16)));
      }
    );
  });
});
describe('encoding and decoding arrays', function () {
  it('should encode and decode an array of integer', function () {
    function encode_array_float(arr: number[], stream: DataStream) {
      ec.encodeArray(arr, stream, ec.encodeFloat);
    }

    function decode_array_float(stream: DataStream) {
      return ec.decodeArray(stream, ec.decodeFloat);
    }

    test_encode_decode([10, 20, 30, 40], encode_array_float, decode_array_float, 4 * 3 + 8);
  });

  it('should encode and decode an array of strings', function () {
    function encode_array_string(arr: string[], stream: DataStream) {
      ec.encodeArray(arr, stream, ec.encodeString);
    }

    function decode_array_string(stream: DataStream) {
      return ec.decodeArray(stream, ec.decodeString);
    }

    test_encode_decode(
      ['Hoo', 'Hello', 'World', '你好世界', 'привет мир', 'こんにちは世界'],
      encode_array_string,
      decode_array_string,
      93
    );
  });

  it('should encode and decode an array of ByteString', function () {
    function encode_array_string(arr: Uint8Array[], stream: DataStream) {
      ec.encodeArray(arr, stream, ec.encodeByteString);
    }

    function decode_array_string(stream: DataStream) {
      return ec.decodeArray(stream, ec.decodeByteString);
    }

    let data: any[] = [new TextEncoder().encode('ABCD'), null, new ArrayBuffer(0), []];
    data = data.map(ec.coerceByteString);

    test_encode_decode(
      data,
      encode_array_string,
      decode_array_string,
      24 /* 4B len=4 + (4B len=4 + 4B Data) + (4B len=-1 ) + (4B len=0) + (4B len=0)  */
    );
  });
});

describe('check isValid and random for various types', function () {
  it('should test isValid on Int32', function () {
    expect(ec.isValidInt32(0)).toBeTruthy();
    expect(ec.isValidInt32(-10)).toBeTruthy();
  });
  it('should test isValid on UInt16', function () {
    expect(ec.isValidUInt16(0)).toBeTruthy(true);
    expect(ec.isValidUInt16(0xffffff)).toBeFalsy(false);
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
    'String',
    'Boolean',
    'Double',
    'Float',
    'Guid',
    'DateTime',
    'NodeId',
    'ByteString',
    'Int64',
    'UInt64',
  ];

  types.forEach(function (type) {
    it('should have a random and isValid method for type ' + type, function () {
      const randomFunc = (ec as any)['random' + type];
      const isValidFunc = (ec as any)['isValid' + type];

      expect((ec as any)['encode' + type]).toBeDefined();
      expect((ec as any)['decode' + type]).toBeDefined();
      expect((ec as any)['random' + type]).toBeDefined();
      expect((ec as any)['isValid' + type]).toBeDefined();

      const random_value = randomFunc();
      expect(isValidFunc(random_value)).toEqual(true);
    });
  });
});
describe('check coerce various types', function () {
  //
  //        "String",
  //        "Boolean",
  //        "Double",
  //        "Float",
  //        "Guid",
  //        "DateTime",
  //        "NodeId",
  //        "ByteString",

  it('should have a coerce method for boolean', function () {
    expect(ec.coerceBoolean('false')).toEqual(false);
    expect(ec.coerceBoolean('true')).toEqual(true);

    expect(ec.coerceBoolean(0)).toEqual(false);
    expect(ec.coerceBoolean(1)).toEqual(true);

    expect(ec.coerceBoolean(false)).toEqual(false);
    expect(ec.coerceBoolean(true)).toEqual(true);

    expect(ec.coerceBoolean('0')).toEqual(false);
    expect(ec.coerceBoolean('1')).toEqual(true);
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
    it('should have a coerce method for ' + type, function () {
      const coerceFunc = (ec as any)['coerce' + type];
      const randomFunc = (ec as any)['random' + type];
      // xx var isValidFunc = ec["isValid" + type];

      expect((ec as any)['coerce' + type]).toBeDefined();
      expect((ec as any)['random' + type]).toBeDefined();
      expect((ec as any)['isValid' + type]).toBeDefined();

      const random_value = randomFunc();

      const value1 = coerceFunc(random_value);
      expect(value1).toEqual(random_value);

      const value2 = coerceFunc(random_value.toString());
      expect(value2).toEqual(random_value);
    });
  });

  function w(str: string, l: number) {
    return (str + '                        ').substring(0, l);
  }

  types.forEach(function (type) {
    it('coerce' + w(type, 8) + ' should coerce null or undefined values to 0', function () {
      const coerceFunc = (ec as any)['coerce' + type];

      expect((ec as any)['coerce' + type]).toBeDefined();

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

describe('UInt64', function () {
  it('should coerce an Int32 into Int64', function () {
    expect(ec.coerceUInt64(0xff1000)).toEqual([0x0, 0xff1000]);
  });
  it('should coerce an long number into Int64', function () {
    expect(ec.coerceUInt64(0x1020000000)).toEqual([0x10, 0x20000000]);
  });
  it('should coerce an long number into Int64', function () {
    expect(ec.coerceUInt64(0x100020000000)).toEqual([0x1000, 0x20000000]);
  });
});

describe('DateTime', function () {
  it('converting 1491684476245', function () {
    function check_date(t: number) {
      const date1 = new Date();
      date1.setTime(t);

      const stream = new DataStream(10);
      ec.encodeDateTime(date1, stream);
      // xx console.log(stream.buffer.toString("hex"));

      stream.rewind();
      const date2 = ec.decodeDateTime(stream);

      expect(date1.getTime()).toEqual(date2.getTime());
    }

    // -1491685621859
    // +1491685621853
    check_date(1491685621859);
    check_date(1491685621853);
  });
});

describe('Float', function () {
  it('should encode float (0)', function () {
    const stream = new DataStream(4);
    ec.encodeFloat(0.0, stream);

    // console.log(stream.buffer.toString("hex"));

    stream.rewind();
    const value = ec.decodeFloat(stream);
    expect(value).toEqual(0.0);
  });

  it('should decode zero from a buffer with 4 bytes set to zero', function () {
    const buf = new DataView(new ArrayBuffer(4));
    buf.setUint32(0, 0);
    const stream = new DataStream(buf);

    const value = ec.decodeFloat(stream);
    expect(value).toEqual(0.0);
  });
});
