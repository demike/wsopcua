import { IEncodable } from '../factory/factories_baseobject';
import { Int8, UInt8, Int16, UInt32, UInt16 } from './integers';

// import {assert} from '../assert';

const txtEncoder = new TextEncoder();
const txtDecoder = new TextDecoder();
export class DataStream {
  constructor(data: DataView | ArrayBuffer | number) {
    this._pos = 0;
    if (data instanceof DataView) {
      this._view = data;
    } else if (data instanceof ArrayBuffer) {
      this._view = new DataView(data);
    } else {
      this._view = new DataView(new ArrayBuffer(data));
    }
  }

  /*
  get buffer() : ArrayBuffer {
    return this._view.buffer;
  }

  set buffer(buf : ArrayBuffer) {
    this._view = new DataView(buf);
  }

  */
  get view(): DataView {
    return this._view;
  }

  set view(v: DataView) {
    this._view = v;
  }

  get pos(): number {
    return this._pos;
  }

  get length(): number {
    return this._pos;
  }

  set length(newLen: number) {
    this._pos = newLen;
  }


  get byteLength(): number {
    return this._pos;
  }


  // _buffer: any;
  protected _view: DataView;
  protected _pos: number;


  public static binaryStoreSize(obj: IEncodable): number {
    const stream = new BinaryStreamSizeCalculator();
    obj.encode(stream);
    return stream.length;
  }

  /**
    * Gets the Float32 value at the specified byte offset from the start of the view. There is
    * no alignment constraint; multi-byte values may be fetched from any offset.
    * @param byteOffset The place in the buffer at which the value should be retrieved.
    */
  getFloat32(littleEndian: boolean = true): number {
    const val = this._view.getFloat32(this._pos, littleEndian);
    this._pos += 4;
    return val;
  }

  /**
    * Gets the Float64 value at the specified byte offset from the start of the view. There is
    * no alignment constraint; multi-byte values may be fetched from any offset.
    * @param byteOffset The place in the buffer at which the value should be retrieved.
    */
  getFloat64(littleEndian: boolean = true): number {
    const val = this._view.getFloat64(this._pos, littleEndian);
    this._pos += 8;
    return val;
  }

  /**
    * Gets the Int8 value at the specified byte offset from the start of the view. There is
    * no alignment constraint; multi-byte values may be fetched from any offset.
    * @param byteOffset The place in the buffer at which the value should be retrieved.
    */
  getInt8(): number {
    const val = this._view.getInt8(this._pos);
    this._pos++;
    return val;
  }

  /**
    * Gets the Int16 value at the specified byte offset from the start of the view. There is
    * no alignment constraint; multi-byte values may be fetched from any offset.
    * @param byteOffset The place in the buffer at which the value should be retrieved.
    */
  getInt16(littleEndian: boolean = true): number {
    const val = this._view.getInt16(this._pos, littleEndian);
    this._pos += 2;
    return val;
  }
  /**
    * Gets the Int32 value at the specified byte offset from the start of the view. There is
    * no alignment constraint; multi-byte values may be fetched from any offset.
    * @param byteOffset The place in the buffer at which the value should be retrieved.
    */
  getInt32(littleEndian: boolean = true): number {
    const val = this._view.getInt32(this._pos, littleEndian);
    this._pos += 4;
    return val;
  }

  /**
    * Gets the Uint8 value at the specified byte offset from the start of the view. There is
    * no alignment constraint; multi-byte values may be fetched from any offset.
    * @param byteOffset The place in the buffer at which the value should be retrieved.
    */
  getUint8(): number {
    const val = this._view.getUint8(this._pos);
    this._pos++;
    return val;
  }

  getByte(): number {
    const val = this._view.getUint8(this._pos);
    this._pos++;
    return val;
  }


  /**
    * Gets the Uint16 value at the specified byte offset from the start of the view. There is
    * no alignment constraint; multi-byte values may be fetched from any offset.
    * @param byteOffset The place in the buffer at which the value should be retrieved.
    */
  getUint16(littleEndian: boolean = true): number {
    const val = this._view.getUint16(this._pos, littleEndian);
    this._pos += 2;
    return val;
  }

  /**
    * Gets the Uint32 value at the specified byte offset from the start of the view. There is
    * no alignment constraint; multi-byte values may be fetched from any offset.
    * @param byteOffset The place in the buffer at which the value should be retrieved.
    */
  getUint32(littleEndian: boolean = true): number {
    const val = this._view.getUint32(this._pos, littleEndian);
    this._pos += 4;
    return val;
  }

  /**
    * Stores an Float32 value at the specified byte offset from the start of the view.
    * @param byteOffset The place in the buffer at which the value should be set.
    * @param value The value to set.
    * @param littleEndian If false or undefined, a big-endian value should be written,
    * otherwise a little-endian value should be written.
    */
  setFloat32(value: number, littleEndian: boolean = true): void {
    this._view.setFloat32(this._pos, value, littleEndian);
    this._pos += 4;
  }

  /**
    * Stores an Float64 value at the specified byte offset from the start of the view.
    * @param byteOffset The place in the buffer at which the value should be set.
    * @param value The value to set.
    * @param littleEndian If false or undefined, a big-endian value should be written,
    * otherwise a little-endian value should be written.
    */
  setFloat64(value: number, littleEndian: boolean = true): void {
    this._view.setFloat64(this._pos, value, littleEndian);
    this._pos += 8;
  }

  /**
    * Stores an Int8 value at the specified byte offset from the start of the view.
    * @param byteOffset The place in the buffer at which the value should be set.
    * @param value The value to set.
    */
  setInt8(value: number): void {
    this._view.setInt8(this._pos, value);
    this._pos++;
  }


  /**
    * Stores an Int16 value at the specified byte offset from the start of the view.
    * @param byteOffset The place in the buffer at which the value should be set.
    * @param value The value to set.
    * @param littleEndian If false or undefined, a big-endian value should be written,
    * otherwise a little-endian value should be written.
    */
  setInt16(value: number, littleEndian: boolean = true): void {
    this._view.setInt16(this._pos, value, littleEndian);
    this._pos += 2;
  }

  /**
    * Stores an Int32 value at the specified byte offset from the start of the view.
    * @param byteOffset The place in the buffer at which the value should be set.
    * @param value The value to set.
    * @param littleEndian If false or undefined, a big-endian value should be written,
    * otherwise a little-endian value should be written.
    */
  setInt32(value: number, littleEndian: boolean = true): void {
    this._view.setInt32(this._pos, value, littleEndian);
    this._pos += 4;
  }

  /**
    * Stores an Uint8 value at the specified byte offset from the start of the view.
    * @param byteOffset The place in the buffer at which the value should be set.
    * @param value The value to set.
    */
  setUint8(value: number): void {
    this._view.setUint8(this._pos, value);
    this._pos++;
  }
  setByte(value: number): void {
    this._view.setUint8(this._pos, value);
    this._pos++;
  }

  /**
    * Stores an Uint16 value at the specified byte offset from the start of the view.
    * @param byteOffset The place in the buffer at which the value should be set.
    * @param value The value to set.
    * @param littleEndian If false or undefined, a big-endian value should be written,
    * otherwise a little-endian value should be written.
    */
  setUint16(value: number, littleEndian: boolean = true): void {
    this._view.setUint16(this._pos, value, littleEndian);
    this._pos += 2;
  }

  /**
    * Stores an Uint32 value at the specified byte offset from the start of the view.
    * @param byteOffset The place in the buffer at which the value should be set.
    * @param value The value to set.
    * @param littleEndian If false or undefined, a big-endian value should be written,
    * otherwise a little-endian value should be written.
    */
  setUint32(value: number, littleEndian: boolean = true): void {
    this._view.setUint32(this._pos, value, littleEndian);
    this._pos += 4;
  }

  goBack(bytes: number): void {
    this._pos -= bytes;
  }

  skip(bytes: number) {
    this._pos += bytes;
  }

  rewind() {
    this._pos = 0;
  }

  writeByteStream(buf: Uint8Array) {

    if (!buf) {
      this.setInt32(-1);
      return;
    }
    this.setInt32(buf.length);
    // make sure there is enough room in destination buffer
    const remaining_bytes = this._view.buffer.byteLength - this._pos;

    /* istanbul ignore next */
    if (remaining_bytes < buf.length) {
      throw new Error('DataStream.writeByteStream error : not enough bytes left in buffer :  bufferLength is ' +
        buf.length + ' but only ' + remaining_bytes + ' left');
    }
    const bytebuf = new Uint8Array(this._view.buffer);
    bytebuf.set(buf, this._pos);
    this._pos += buf.length;
  }

  /**
* read a byte stream to the stream.
* The method reads the length of the byte array from the stream as a 32 bits integer before reading the byte stream.
*
* @method readByteStream
* @return {Uint8Array}
*/
  readByteStream(): Uint8Array {
    const bufLen = this.getInt32();
    if (bufLen === -1) {
      return null;
    }
    if (bufLen === 0) {
      return new Uint8Array(0);
    }

    // check that there is enough space in the buffer
    const remaining_bytes = this._view.buffer.byteLength - this._pos;
    if (remaining_bytes < bufLen) {
      throw new Error('BinaryStream.readByteStream error : not enough bytes left in buffer :  bufferLength is ' +
        bufLen + ' but only ' + remaining_bytes + ' left');
    }

    const buf = new Uint8Array(this._view.buffer.slice(this._pos, this._pos + bufLen));
    this._pos += bufLen;
    return buf;
  }

  readString() {
    const buff = this.readByteStream();
    //        const encodedString = String.fromCharCode.apply(null, buff),
    //        decodedString = decodeURIComponent(encodedString);
    //        return decodedString;
    if (buff == null) {
      return null;
    }
    return txtDecoder.decode(buff);

  }

  writeString(str: string): void {
    if (str === undefined || str === null) {
      this.setInt32(-1);
      return;
    }
    return this.writeByteStream(txtEncoder.encode(str));
  }

  /**
* @method writeArrayBuffer
* @param arrayBuf {ArrayBuffer}
* @param offset   {Number}
* @param length   {Number}
*/
  public writeArrayBuffer(arrayBuf: ArrayBuffer, offset: number, length?: number) {
    offset = offset || 0;

    /*
    const byteArr = new Uint8Array(arrayBuf);
    const n = (length || byteArr.length) + offset;

    let i: number;
    for (i = offset; i < n; i++) {
      this._view[this._pos++] = byteArr[i];
    }
    */
   const byteArr = new Uint8Array(arrayBuf, offset, length);
   const viewBuffer = new Uint8Array(this._view.buffer);
   viewBuffer.set(byteArr, this._pos);
   this._pos += length;
  }

  /**
  * @method readByteArray
  * @param length
  * @returns {Uint8Array}
  */
  public readByteArray(length: number): Uint8Array {
    const arr = new Uint8Array(this._view.buffer, this._pos, length);
    this._pos += length;
    return arr;
  }

  /**
   *
   * @param length
   * @param constructorFn
   */
  public readArrayBuffer(lengthInBytes: number): ArrayBuffer {
    const arr = this._view.buffer.slice(this._pos, this._pos + lengthInBytes);
    this._pos += lengthInBytes;
    return arr;
  }

}



/**
 * a BinaryStreamSizeCalculator can be used to quickly evaluate the required size
 * of a buffer by performing the same sequence of write operation.
 *
 * a BinaryStreamSizeCalculator has the same writeXXX methods as the BinaryStream stream
 * object.
 *
 * @class BinaryStreamSizeCalculator
 * @extends BinaryStream
 * @constructor
 *
 */
export class BinaryStreamSizeCalculator {
  length: number;
  constructor() {
    this.length = 0;
  }

  rewind(): void {
    this.length = 0;
  }

  setInt8(value: Int8): void {
    this.length += 1;
  }

  setUint8(value: UInt8): void {
    this.length += 1;
  }

  setInt16(value: Int16): void {
    this.length += 2;
  }

  setInt32(value: number): void {
    this.length += 4;
  }

  setInteger(value: number): void {
    this.length += 4;
  }

  setUint32(value: UInt32): void {
    this.length += 4;
  }

  setUint16(value: UInt16): void {
    this.length += 2;
  }


  setFloat32(value: number): void {
    this.length += 4;
  }

  setFloat64(value: number|[number, number]): void {
    this.length += 8;
  }

  setDouble(value: number|[number, number]): void {
    this.length += 8;
  }

  writeArrayBuffer(arrayBuf: ArrayBuffer, offset: number, byteLength: number): void {
    offset = offset || 0;
    // assert(arrayBuf instanceof ArrayBuffer);
    this.length += (byteLength || arrayBuf.byteLength/*new Uint8Array(arrayBuf).length*/);
  }

  writeByteStream(buf: Uint8Array): void {
    if (!buf) {
      this.setInt32(0);
    } else {
      this.setInt32(buf.length);
      this.length += buf.length;

    }
  }

  writeString(str: string): void {

    if (str === undefined || str === null) {
      this.setInt32(-1);
      return;
    }
    return this.writeByteStream(txtEncoder.encode(str));
  }

}

// utility functions
export function stringToUint8Array(str: string): Uint8Array {
  return txtEncoder.encode(str);
}
