export declare class DataStream {
    protected _view: DataView;
    protected _pos: number;
    constructor(data: DataView | ArrayBuffer | number);
    view: DataView;
    readonly pos: number;
    length: number;
    readonly byteLength: number;
    /**
      * Gets the Float32 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getFloat32(littleEndian?: boolean): number;
    /**
      * Gets the Float64 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getFloat64(littleEndian?: boolean): number;
    /**
      * Gets the Int8 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getInt8(): number;
    /**
      * Gets the Int16 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getInt16(littleEndian?: boolean): number;
    /**
      * Gets the Int32 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getInt32(littleEndian?: boolean): number;
    /**
      * Gets the Uint8 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getUint8(): number;
    getByte(): number;
    /**
      * Gets the Uint16 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getUint16(littleEndian?: boolean): number;
    /**
      * Gets the Uint32 value at the specified byte offset from the start of the view. There is
      * no alignment constraint; multi-byte values may be fetched from any offset.
      * @param byteOffset The place in the buffer at which the value should be retrieved.
      */
    getUint32(littleEndian?: boolean): number;
    /**
      * Stores an Float32 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      * @param littleEndian If false or undefined, a big-endian value should be written,
      * otherwise a little-endian value should be written.
      */
    setFloat32(value: number, littleEndian?: boolean): void;
    /**
      * Stores an Float64 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      * @param littleEndian If false or undefined, a big-endian value should be written,
      * otherwise a little-endian value should be written.
      */
    setFloat64(value: number, littleEndian?: boolean): void;
    /**
      * Stores an Int8 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      */
    setInt8(value: number): void;
    /**
      * Stores an Int16 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      * @param littleEndian If false or undefined, a big-endian value should be written,
      * otherwise a little-endian value should be written.
      */
    setInt16(value: number, littleEndian?: boolean): void;
    /**
      * Stores an Int32 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      * @param littleEndian If false or undefined, a big-endian value should be written,
      * otherwise a little-endian value should be written.
      */
    setInt32(value: number, littleEndian?: boolean): void;
    /**
      * Stores an Uint8 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      */
    setUint8(value: number): void;
    setByte(value: number): void;
    /**
      * Stores an Uint16 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      * @param littleEndian If false or undefined, a big-endian value should be written,
      * otherwise a little-endian value should be written.
      */
    setUint16(value: number, littleEndian?: boolean): void;
    /**
      * Stores an Uint32 value at the specified byte offset from the start of the view.
      * @param byteOffset The place in the buffer at which the value should be set.
      * @param value The value to set.
      * @param littleEndian If false or undefined, a big-endian value should be written,
      * otherwise a little-endian value should be written.
      */
    setUint32(value: number, littleEndian?: boolean): void;
    goBack(bytes: number): void;
    skip(bytes: number): void;
    rewind(): void;
    writeByteStream(buf: Uint8Array): void;
    /**
 * read a byte stream to the stream.
 * The method reads the length of the byte array from the stream as a 32 bits integer before reading the byte stream.
 *
 * @method readByteStream
 * @return {Uint8Array}
 */
    readByteStream(): Uint8Array;
    readString(): string;
    writeString(str: string): void;
    /**
 * @method writeArrayBuffer
 * @param arrayBuf {ArrayBuffer}
 * @param offset   {Number}
 * @param length   {Number}
 */
    writeArrayBuffer(arrayBuf: ArrayBuffer, offset: number, length: number): void;
    /**
    * @method readArrayBuffer
    * @param length
    * @returns {Uint8Array}
    */
    readArrayBuffer(length: number): Uint8Array;
    static binaryStoreSize(obj: any): number;
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
export declare class BinaryStreamSizeCalculator {
    length: number;
    constructor();
    rewind(): void;
    setInt8(value: any): void;
    setUint8(value: any): void;
    setInt16(value: any): void;
    setInt32(value: number): void;
    setInteger(value: any): void;
    setUint32(value: any): void;
    setUint16(value: any): void;
    setFloat32(value: any): void;
    setFloat64(value: any): void;
    setDouble(value: any): void;
    writeArrayBuffer(arrayBuf: ArrayBuffer, offset: any, byteLength: any): void;
    writeByteStream(buf: Uint8Array): void;
    writeString(str: string): void;
}
export declare function stringToUint8Array(str: string): Uint8Array;
