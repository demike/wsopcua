'use strict';

import { DataStream, BinaryStreamSizeCalculator } from './DataStream';

describe('Testing DataStream', function () {
  it('should create a binary stream', function () {
    const stream = new DataStream(256);
    expect(stream.length).toEqual(0);

    stream.setFloat64(10.00234);
    expect(stream.length).toEqual(8);

    stream.setInt32(100000);
    expect(stream.length).toEqual(12);

    stream.rewind();
    expect(stream.length).toEqual(0);

    const f = stream.getFloat64();
    expect(f).toEqual(10.00234);
    expect(stream.length).toEqual(8);

    const i = stream.getInt32();
    expect(i).toEqual(100000);
    expect(stream.length).toEqual(12);
  });

  it('should create a binary stream from Uint8Array', () => {
    const arr = Uint8Array.from([5, 6, 7, 8]);

    const stream1 = new DataStream(arr);

    expect(stream1.getUint8()).toBe(5);
    expect(stream1.getUint8()).toBe(6);

    const stream2 = new DataStream(new Uint8Array(arr.buffer, 1, 2));
    expect(stream2.length).toBe(0);
    expect(stream2.getUint8()).toBe(6);
    expect(stream2.length).toBe(1);
  });

  it('readArrayBuffer should not returned a shared buffer', function () {
    const stream = new DataStream(50);

    const arr = new Int16Array(25);
    for (let i = 0; i < 25; i++) {
      arr[i] = 512 + i;
    }

    console.log(new Uint8Array(arr.buffer).join(' '));
    stream.writeArrayBuffer(arr.buffer, 0);

    // let's verify that a copy has been made
    // changing written array shall not affect inner buffer

    expect(stream.view.getUint8(2 * 3)).toEqual(3);
    stream.view.setUint8(2 * 3, 33);

    expect(arr[3]).not.toEqual(33);
    expect(arr[3]).toEqual(512 + 3);
    stream.view.setUint8(2 * 3, 3);

    stream.rewind();
    const arr2 = new Int16Array(stream.readArrayBuffer(50));
    console.log(new Uint8Array(arr2.buffer).join(' '));
    expect(arr).toEqual(arr2);

    expect(arr2 instanceof Int16Array).toBeTruthy();
    expect(arr2.length).toEqual(25);
    expect(arr2.byteLength).toEqual(50);

    expect(arr2[3]).toEqual(512 + 3);

    expect(stream.view.getUint8(2 * 3)).toEqual(3);
    stream.view.setUint8(2 * 3, 33);
    expect(arr2[3]).not.toEqual(33);
    expect(arr2[3]).toEqual(512 + 3);
    stream.view.setUint8(2 * 3, 3);
  });
});

describe('Testing BinaryStreamSizeCalculator', function () {
  it('should calculate the right size', function () {
    const stream = new BinaryStreamSizeCalculator();
    stream.setFloat32(10.00234);
    stream.setInt32(100000);
    stream.setDouble(100000.0);
    stream.writeByteStream(new TextEncoder().encode('Hello'));
    expect(stream.length).toEqual(4 + 4 + 8 + 4 + 5);
  });
});

describe('Testing DataStream#writeArrayBuffer /  DataStream#readArrayBuffer', function () {
  const n = 128;
  let largeArray: Float64Array;
  beforeEach(function () {
    largeArray = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      largeArray[i] = i * 0.14;
    }
    expect(largeArray[10]).toEqual(10 * 0.14);
    expect(largeArray[100]).toEqual(100 * 0.14);

    expect(largeArray.byteLength % 8).toEqual(0);
  });

  function isValidBuffer(buf: Float64Array) {
    if (buf.length !== n) {
      return false;
    }
    for (let i = 0; i < buf.length; i++) {
      if (buf[i] !== i * 0.14) {
        return false;
      }
    }
    return true;
  }

  function perform(
    binStream_writeArrayBuffer: (arrayBuf: ArrayBuffer, offset: number, length?: number) => void,
    binStream_readArrayBuffer: (lengthInBytes: number) => ArrayBuffer
  ) {
    expect(largeArray[10]).toEqual(10 * 0.14);
    expect(largeArray[100]).toEqual(100 * 0.14);
    const binStream = new DataStream(new ArrayBuffer(n * 8 + 20));

    expect(largeArray.length).toEqual(n);
    expect(largeArray.byteLength).toEqual(n * 8);

    binStream_writeArrayBuffer.call(binStream, largeArray.buffer, 0, largeArray.byteLength);
    // xx console.log(binStream._buffer.slice(0,100).toString("hex"));

    binStream.rewind();
    const arr = binStream_readArrayBuffer.call(binStream, largeArray.byteLength);
    expect(arr.byteLength).toEqual(largeArray.byteLength);
    const reloaded = new Float64Array(arr);

    expect(reloaded.length).toEqual(largeArray.length);

    expect(reloaded[10]).toEqual(10 * 0.14);
    expect(reloaded[100]).toEqual(100 * 0.14);
    expect(reloaded).toEqual(largeArray);
  }

  it('should provide a working writeArrayBuffer and readArrayBuffer', function () {
    // tslint:disable-next-line: no-unbound-method
    perform(DataStream.prototype.writeArrayBuffer, DataStream.prototype.readArrayBuffer);
  });

  /*
    it("should provide a working writeArrayBuffer_old", function () {

        perform(DataStream.prototype.writeArrayBuffer_old, DataStream.prototype.readArrayBuffer_old);

    });
    */
});
