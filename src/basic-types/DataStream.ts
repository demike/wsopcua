export class DataStream {
    
    protected view : DataView;
    protected pos : number;
    constructor(data : DataView|ArrayBuffer|number) {
        this.pos = 0;
        if (data instanceof DataView) {
            this.view = data;
        } else if (data instanceof ArrayBuffer) {
            this.view = new DataView(data);
        } else {
           this.view = new DataView(new ArrayBuffer(data));
        }
    }

    /**
      * Gets the Float32 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
      getFloat32(littleEndian?: boolean): number {
        var val = this.view.getFloat32(this.pos,littleEndian);
        this.pos += 4;
        return val;
      }
      
          /**
            * Gets the Float64 value at the specified byte offset from the start of the view. There is
            * no alignment constraint; multi-byte values may be fetched from any offset.
            * @param byteOffset The place in the buffer at which the value should be retrieved.
            */
          getFloat64(littleEndian?: boolean): number {
            var val = this.view.getFloat64(this.pos,littleEndian);
            this.pos += 8;
            return val;
          }
      
          /**
            * Gets the Int8 value at the specified byte offset from the start of the view. There is
            * no alignment constraint; multi-byte values may be fetched from any offset.
            * @param byteOffset The place in the buffer at which the value should be retrieved.
            */
          getInt8(): number {
            var val = this.view.getInt8(this.pos);
            this.pos++;
            return val;
          }
      
          /**
            * Gets the Int16 value at the specified byte offset from the start of the view. There is
            * no alignment constraint; multi-byte values may be fetched from any offset.
            * @param byteOffset The place in the buffer at which the value should be retrieved.
            */
          getInt16(littleEndian?: boolean): number {
            var val = this.view.getInt16(this.pos,littleEndian);
            this.pos += 2;
            return val;
          }
          /**
            * Gets the Int32 value at the specified byte offset from the start of the view. There is
            * no alignment constraint; multi-byte values may be fetched from any offset.
            * @param byteOffset The place in the buffer at which the value should be retrieved.
            */
          getInt32(littleEndian?: boolean): number {
            var val = this.view.getInt32(this.pos,littleEndian);
            this.pos += 4;
            return val;
          }
      
          /**
            * Gets the Uint8 value at the specified byte offset from the start of the view. There is
            * no alignment constraint; multi-byte values may be fetched from any offset.
            * @param byteOffset The place in the buffer at which the value should be retrieved.
            */
          getUint8(): number {
            var val = this.view.getUint8(this.pos);
            this.pos++;
            return val;
          }
      
          /**
            * Gets the Uint16 value at the specified byte offset from the start of the view. There is
            * no alignment constraint; multi-byte values may be fetched from any offset.
            * @param byteOffset The place in the buffer at which the value should be retrieved.
            */
          getUint16(littleEndian?: boolean): number {
            var val = this.view.getUint16(this.pos,littleEndian);
            this.pos += 2;
            return val;
          }
      
          /**
            * Gets the Uint32 value at the specified byte offset from the start of the view. There is
            * no alignment constraint; multi-byte values may be fetched from any offset.
            * @param byteOffset The place in the buffer at which the value should be retrieved.
            */
          getUint32(littleEndian?: boolean): number {
            var val = this.view.getUint32(this.pos,littleEndian);
            this.pos += 4;
            return val;
          }
      
          /**
            * Stores an Float32 value at the specified byte offset from the start of the view.
            * @param byteOffset The place in the buffer at which the value should be set.
            * @param value The value to set.
            * @param littleEndian If false or undefined, a big-endian value should be written,
            * otherwise a little-endian value should be written.
            */
          setFloat32(value: number, littleEndian?: boolean): void {
             this.view.setFloat32(this.pos,value,littleEndian);
             this.pos+=4; 
          }
      
          /**
            * Stores an Float64 value at the specified byte offset from the start of the view.
            * @param byteOffset The place in the buffer at which the value should be set.
            * @param value The value to set.
            * @param littleEndian If false or undefined, a big-endian value should be written,
            * otherwise a little-endian value should be written.
            */
          setFloat64(value: number, littleEndian?: boolean): void {
            this.view.setFloat64(this.pos,value,littleEndian);
            this.pos+=8; 
         }
      
          /**
            * Stores an Int8 value at the specified byte offset from the start of the view.
            * @param byteOffset The place in the buffer at which the value should be set.
            * @param value The value to set.
            */
          setInt8(value: number): void {
            this.view.setInt8(this.pos,value);
            this.pos++; 
         }
      
          /**
            * Stores an Int16 value at the specified byte offset from the start of the view.
            * @param byteOffset The place in the buffer at which the value should be set.
            * @param value The value to set.
            * @param littleEndian If false or undefined, a big-endian value should be written,
            * otherwise a little-endian value should be written.
            */
          setInt16(value: number, littleEndian?: boolean): void {
            this.view.setInt16(this.pos,value,littleEndian);
            this.pos+=2; 
         }
      
          /**
            * Stores an Int32 value at the specified byte offset from the start of the view.
            * @param byteOffset The place in the buffer at which the value should be set.
            * @param value The value to set.
            * @param littleEndian If false or undefined, a big-endian value should be written,
            * otherwise a little-endian value should be written.
            */
          setInt32(value: number, littleEndian?: boolean): void {
            this.view.setInt32(this.pos,value,littleEndian);
            this.pos+=4; 
         }
      
          /**
            * Stores an Uint8 value at the specified byte offset from the start of the view.
            * @param byteOffset The place in the buffer at which the value should be set.
            * @param value The value to set.
            */
          setUint8(value: number): void {
            this.view.setUint8(this.pos,value);
            this.pos++; 
         }
      
          /**
            * Stores an Uint16 value at the specified byte offset from the start of the view.
            * @param byteOffset The place in the buffer at which the value should be set.
            * @param value The value to set.
            * @param littleEndian If false or undefined, a big-endian value should be written,
            * otherwise a little-endian value should be written.
            */
          setUint16(value: number, littleEndian?: boolean): void {
            this.view.setUint16(this.pos,value,littleEndian);
            this.pos+=2; 
         }
      
          /**
            * Stores an Uint32 value at the specified byte offset from the start of the view.
            * @param byteOffset The place in the buffer at which the value should be set.
            * @param value The value to set.
            * @param littleEndian If false or undefined, a big-endian value should be written,
            * otherwise a little-endian value should be written.
            */
          setUint32(value: number, littleEndian?: boolean): void {
            this.view.setUint32(this.pos,value,littleEndian);
            this.pos+=4; 
         }

         goBack(bytes : number) : void {
             this.pos -= bytes;
         }

         skip(bytes : number) {
             this.pos += bytes;
         }

         rewind() {
           this.pos = 0;
         }

         writeByteStream (buf : Uint8Array) {
          
              if (!buf) {
                  this.setInt32(-1);
                  return;
              }
              this.setInt32(buf.length);
              // make sure there is enough room in destination buffer
              var remaining_bytes = this.view.buffer.byteLength - this.pos;
          
              /* istanbul ignore next */
              if (remaining_bytes < buf.length) {
                  throw new Error("DataStream.writeByteStream error : not enough bytes left in buffer :  bufferLength is " + buf.length + " but only " + remaining_bytes + " left");
              }
              var bytebuf = new Uint8Array(this.view.buffer);
              bytebuf.set(buf,this.pos);
              this.pos += buf.length;
          };

          /**
       * read a byte stream to the stream.
       * The method reads the length of the byte array from the stream as a 32 bits integer before reading the byte stream.
       *
       * @method readByteStream
       * @return {Buffer}
       */
      readByteStream() {
        var bufLen = this.getUint32();
        if (bufLen === 0xFFFFFFFF) {
            return null;
        }
        if (bufLen === 0) {
            return new Uint8Array(0);
        }

        // check that there is enough space in the buffer
        var remaining_bytes = this.view.buffer.byteLength - this.pos;
        if (remaining_bytes < bufLen) {
            throw new Error("BinaryStream.readByteStream error : not enough bytes left in buffer :  bufferLength is " + bufLen + " but only " + remaining_bytes + " left");
        }

        var buf = new Uint8Array(this.view.buffer.slice(this.pos,this.pos + bufLen));
        this.pos += bufLen;
        return buf;
      };

      readString() {
        var buff = this.readByteStream();
        var encodedString = String.fromCharCode.apply(null, buff),
        decodedString = decodeURIComponent(encodedString);
        return decodedString;

      };

      writeString(str : string) : void {
        
          let enc = encodeURIComponent(str)
          
          

          return this.writeByteStream(enc);
      };

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
  length : number;
  constructor() {
  this.length = 0;
}

rewind() : void {
  this.length = 0;
};

writeInt8(value) : void {
  this.length += 1;
};

writeUInt8(value) : void {
  this.length += 1;
};

writeInt16(value) : void {
  this.length += 2;
};

writeInteger(value) : void {
  this.length += 4;
};

writeUInt32(value) : void {
  this.length += 4;
};

writeUInt16(value) : void {
  this.length += 2;
};

writeFloat(value) : void {
  this.length += 4;
};

writeDouble(value) : void {
  this.length += 8;
};

writeArrayBuffer(arrayBuf, offset, byteLength) : void {
  offset = offset || 0;
  assert(arrayBuf instanceof ArrayBuffer);
  this.length += (byteLength || new Uint8Array(arrayBuf).length);
};

writeByteStream(buf) : void {
  if (!buf) {
      this.writeUInt32(0);
  } else {
      this.writeUInt32(buf.length);
      this.length += buf.length;

  }
};

writeString(string) : void {

  if (string === undefined || string === null) {
      this.writeInteger(-1);
      return;
  }
  var buf = Buffer.from(string);
  return this.writeByteStream(buf);
};

}