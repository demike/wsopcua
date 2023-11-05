import { DataStream } from './DataStream';
import { buf2base64, base64ToBuf } from '../crypto';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isValidByteString(value: any) {
  return value === null || value instanceof Uint8Array;
}
export function randomByteString(len: number) {
  len = len || getRandomInt(1, 200);
  const b = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    b[i] = getRandomInt(0, 255);
  }
  return b;
}
export function encodeByteString(
  byteString: Uint8Array | undefined | null,
  stream: DataStream
): void {
  stream.writeByteStream(byteString);
}
export function decodeByteString(stream: DataStream) {
  return stream.readByteStream();
}

export function coerceByteString(
  value: number[] | string | Uint8Array | ArrayBuffer | ArrayBufferView | null
): Uint8Array | null {
  if (value instanceof Uint8Array) {
    return value;
  }
  if (Array.isArray(value) || value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  }
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  if (typeof value === 'string') {
    const str = window.btoa(value);
    const buf = new Uint8Array(str.length);
    for (let i = 0, j = str.length; i < j; ++i) {
      buf[i] = str.charCodeAt(i);
    }
    return buf;
  }
  return value;
}

export function jsonEncodeByteString(byteString?: Uint8Array | null): string | undefined {
  if (byteString) {
    return buf2base64(byteString);
  }
}

export function jsonDecodeByteString(b64ByteString?: string) {
  if (b64ByteString) {
    return base64ToBuf(b64ByteString);
  }
  return null;
}
