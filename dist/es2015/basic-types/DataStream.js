// import {assert} from '../assert';
var txtEncoder = new TextEncoder();
var txtDecoder = new TextDecoder();
export class DataStream {
    constructor(data) {
        this._pos = 0;
        if (data instanceof DataView) {
            this._view = data;
        }
        else if (data instanceof ArrayBuffer) {
            this._view = new DataView(data);
        }
        else {
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
    get view() {
        return this._view;
    }
    set view(v) {
        this._view = v;
    }
    get pos() {
        return this._pos;
    }
    get length() {
        return this._pos;
    }
    set length(newLen) {
        this._pos = newLen;
    }
    get byteLength() {
        return this._pos;
    }
    /**
      * Gets the Float32 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getFloat32(littleEndian = true) {
        var val = this._view.getFloat32(this._pos, littleEndian);
        this._pos += 4;
        return val;
    }
    /**
      * Gets the Float64 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getFloat64(littleEndian = true) {
        var val = this._view.getFloat64(this._pos, littleEndian);
        this._pos += 8;
        return val;
    }
    /**
      * Gets the Int8 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getInt8() {
        var val = this._view.getInt8(this._pos);
        this._pos++;
        return val;
    }
    /**
      * Gets the Int16 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getInt16(littleEndian = true) {
        var val = this._view.getInt16(this._pos, littleEndian);
        this._pos += 2;
        return val;
    }
    /**
      * Gets the Int32 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getInt32(littleEndian = true) {
        var val = this._view.getInt32(this._pos, littleEndian);
        this._pos += 4;
        return val;
    }
    /**
      * Gets the Uint8 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getUint8() {
        var val = this._view.getUint8(this._pos);
        this._pos++;
        return val;
    }
    getByte() {
        var val = this._view.getUint8(this._pos);
        this._pos++;
        return val;
    }
    /**
      * Gets the Uint16 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getUint16(littleEndian = true) {
        var val = this._view.getUint16(this._pos, littleEndian);
        this._pos += 2;
        return val;
    }
    /**
      * Gets the Uint32 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getUint32(littleEndian = true) {
        var val = this._view.getUint32(this._pos, littleEndian);
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
    setFloat32(value, littleEndian = true) {
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
    setFloat64(value, littleEndian = true) {
        this._view.setFloat64(this._pos, value, littleEndian);
        this._pos += 8;
    }
    /**
      * Stores an Int8 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      */
    setInt8(value) {
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
    setInt16(value, littleEndian = true) {
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
    setInt32(value, littleEndian = true) {
        this._view.setInt32(this._pos, value, littleEndian);
        this._pos += 4;
    }
    /**
      * Stores an Uint8 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      */
    setUint8(value) {
        this._view.setUint8(this._pos, value);
        this._pos++;
    }
    setByte(value) {
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
    setUint16(value, littleEndian = true) {
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
    setUint32(value, littleEndian = true) {
        this._view.setUint32(this._pos, value, littleEndian);
        this._pos += 4;
    }
    goBack(bytes) {
        this._pos -= bytes;
    }
    skip(bytes) {
        this._pos += bytes;
    }
    rewind() {
        this._pos = 0;
    }
    writeByteStream(buf) {
        if (!buf) {
            this.setInt32(-1);
            return;
        }
        this.setInt32(buf.length);
        // make sure there is enough room in destination buffer
        var remaining_bytes = this._view.buffer.byteLength - this._pos;
        /* istanbul ignore next */
        if (remaining_bytes < buf.length) {
            throw new Error("DataStream.writeByteStream error : not enough bytes left in buffer :  bufferLength is " + buf.length + " but only " + remaining_bytes + " left");
        }
        var bytebuf = new Uint8Array(this._view.buffer);
        bytebuf.set(buf, this._pos);
        this._pos += buf.length;
    }
    ;
    /**
 * read a byte stream to the stream.
 * The method reads the length of the byte array from the stream as a 32 bits integer before reading the byte stream.
 *
 * @method readByteStream
 * @return {Uint8Array}
 */
    readByteStream() {
        var bufLen = this.getInt32();
        if (bufLen === -1) {
            return null;
        }
        if (bufLen === 0) {
            return new Uint8Array(0);
        }
        // check that there is enough space in the buffer
        var remaining_bytes = this._view.buffer.byteLength - this._pos;
        if (remaining_bytes < bufLen) {
            throw new Error("BinaryStream.readByteStream error : not enough bytes left in buffer :  bufferLength is " + bufLen + " but only " + remaining_bytes + " left");
        }
        var buf = new Uint8Array(this._view.buffer.slice(this._pos, this._pos + bufLen));
        this._pos += bufLen;
        return buf;
    }
    ;
    readString() {
        var buff = this.readByteStream();
        //        var encodedString = String.fromCharCode.apply(null, buff),
        //        decodedString = decodeURIComponent(encodedString);
        //        return decodedString;
        if (buff == null) {
            return null;
        }
        return txtDecoder.decode(buff);
    }
    ;
    writeString(str) {
        if (str === undefined || str === null) {
            this.setInt32(-1);
            return;
        }
        return this.writeByteStream(txtEncoder.encode(str));
    }
    ;
    /**
 * @method writeArrayBuffer
 * @param arrayBuf {ArrayBuffer}
 * @param offset   {Number}
 * @param length   {Number}
 */
    writeArrayBuffer(arrayBuf, offset, length) {
        offset = offset || 0;
        var byteArr = new Uint8Array(arrayBuf);
        var n = (length || byteArr.length) + offset;
        for (var i = offset; i < n; i++) {
            this._view[this._pos++] = byteArr[i];
        }
    }
    ;
    /**
    * @method readArrayBuffer
    * @param length
    * @returns {Uint8Array}
    */
    readArrayBuffer(length) {
        var arr = new Uint8Array(this._view.buffer, this._pos, length);
        this._pos += length;
        return arr;
    }
    static binaryStoreSize(obj) {
        let stream = new BinaryStreamSizeCalculator();
        obj.encode(stream);
        return stream.length;
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
    constructor() {
        this.length = 0;
    }
    rewind() {
        this.length = 0;
    }
    ;
    setInt8(value) {
        this.length += 1;
    }
    ;
    setUint8(value) {
        this.length += 1;
    }
    ;
    setInt16(value) {
        this.length += 2;
    }
    ;
    setInt32(value) {
        this.length += 4;
    }
    setInteger(value) {
        this.length += 4;
    }
    ;
    setUint32(value) {
        this.length += 4;
    }
    ;
    setUint16(value) {
        this.length += 2;
    }
    ;
    setFloat32(value) {
        this.length += 4;
    }
    ;
    setFloat64(value) {
        this.length += 8;
    }
    setDouble(value) {
        this.length += 8;
    }
    ;
    writeArrayBuffer(arrayBuf, offset, byteLength) {
        offset = offset || 0;
        //assert(arrayBuf instanceof ArrayBuffer);
        this.length += (byteLength || arrayBuf.byteLength /*new Uint8Array(arrayBuf).length*/);
    }
    ;
    writeByteStream(buf) {
        if (!buf) {
            this.setInt32(0);
        }
        else {
            this.setInt32(buf.length);
            this.length += buf.length;
        }
    }
    ;
    writeString(str) {
        if (str === undefined || str === null) {
            this.setInt32(-1);
            return;
        }
        return this.writeByteStream(txtEncoder.encode(str));
    }
    ;
}
//utility functions
export function stringToUint8Array(str) {
    return txtEncoder.encode(str);
}
//# sourceMappingURL=DataStream.js.map