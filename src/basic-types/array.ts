'use strict';
import { assert } from '../assert';
import { DataStream } from './DataStream';
import { IEncodable } from '../factory/factories_baseobject';
/**
 * @method encodeArray
 * @param arr {Array} the array to encode.
 * @param stream {DataStream}  the stream.
 * @param encode_element_func  {(obj: any, stream: DataStream) => void}  The  function to encode a single array element.
 * @param encode_element_func.element {object}
 * @param encode_element_func.stream  {DataStream}  the stream.
 */
export function encodeArray(
  arr: Array<any>,
  stream: DataStream,
  encode_element_func?: (obj: any, stream: DataStream) => void
): void {
  if (arr == null) {
    stream.setUint32(0xffffffff);
    return;
  }
  assert(Array.isArray(arr));
  stream.setUint32(arr.length);

  if (encode_element_func) {
    for (let i = 0; i < arr.length; ++i) {
      encode_element_func(arr[i], stream);
    }
  } else {
    for (let i = 0; i < arr.length; ++i) {
      arr[i].encode(stream);
    }
  }
}
/**
 * @method decodeArray
 * @param stream {DataStream}  the stream.
 * @param decode_element_func {Function}
 *                      The  function to decode a single array element. This function returns the element decoded from the stream
 * @param decode_element_func.stream {DataStream}  the stream.
 */
export function decodeArray<T>(
  stream: DataStream,
  decode_element_func: (stream: DataStream) => T
): T[] | undefined {
  const length = stream.getInt32();
  if (length === -1) {
    return;
  }

  const arr: T[] = [];
  for (let i = 0; i < length; i++) {
    arr.push(decode_element_func(stream));
  }

  return arr;
}

export function cloneArray(arr: any[]) {
  const out: any[] = [];

  if (arr && arr.length > 0) {
    for (const item of arr) {
      out.push(item);
    }
  }

  return out;
}

export function cloneComplexArray(arr: any[]) {
  const out: any[] = [];

  if (arr && arr.length > 0) {
    for (const item of arr) {
      out.push(item.clone());
    }
  }

  return out;
}

export function concatTypedArrays<
  T extends
    | Uint16Array
    | Uint8Array
    | Uint32Array
    | Int16Array
    | Int8Array
    | Int32Array
    | Float32Array
    | Float64Array
>(arrays: T[]): T {
  let len = 0;
  for (const ar of arrays) {
    len += ar.length;
  }

  const buf = new (<any>arrays[0].constructor)(len); // new (<any>T.constructor)(len);
  let offset = 0;
  for (const ar of arrays) {
    buf.set(ar, offset);
    offset += ar.length;
  }
  return buf;
}

export function concatDataViews(views: DataView[]) {
  if (views.length === 1) {
    return views[0];
  }
  let len = 0;
  for (const ar of views) {
    len += ar.byteLength;
  }

  const buf = new Uint8Array(len);

  let offset = 0;
  for (const v of views) {
    buf.set(new Uint8Array(v.buffer), offset);
    offset += v.byteLength;
  }
  return new DataView(buf.buffer);
}

export function concatArrayBuffers(arrays: ArrayBuffer[]): ArrayBuffer {
  if (arrays.length === 1) {
    return arrays[0];
  }
  let len = 0;
  for (const ar of arrays) {
    len += ar.byteLength;
  }

  const buf = new Uint8Array(len);

  let offset = 0;
  for (const ar of arrays) {
    buf.set(new Uint8Array(ar), offset);
    offset += ar.byteLength;
  }
  return buf.buffer;
}

export function jsonDecodeArray<T>(
  array: any[] | undefined,
  decode_element_func: (obj: any) => T
): T[] {
  if (!array) {
    return [];
  }
  return array.map((el) => {
    const retVal = decode_element_func(el);
    return retVal === undefined ? null : retVal;
  }) as T[];
}

export function jsonEncodeArray<T>(
  array: any[] | undefined,
  encode_element_func: (obj: any) => T
): T[] | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }
  // every undefined / null value in the array shall be encoded as null
  return array.map((el) => {
    const retVal = encode_element_func(el);
    return retVal === undefined ? null : retVal;
  }) as T[];
}

export function jsonDecodeStructArray<T extends IEncodable>(
  array: any[] | undefined,
  struct: new () => T
): T[] {
  if (!array) {
    return [];
  }
  return array.map((obj) => {
    const s = new struct();
    s.fromJSON(obj);
    return s;
  });
}

/**
 * utility function to create a multi dimension array from a flat array
 * i.e.: to revers a array.flat(n) operation
 *
 *  2*3*2 matrix:
 * [0,1,2,3,4,5,6,7,8,9,10,11] ==>
 * [[[0,1],[2,3],[4,5]] , [[6,7], [8,9], [10,11]]];
 *
 * @param array a one dimensional array
 * @param dim array of dimensions i.e. [2,3,2]
 */
export function unFlattenArray(array: any[], dim: number[]): any[] {
  if (dim.length <= 1) {
    // just return a clone;
    return array.slice(0);
  }

  const subArrays: any[] = [];
  const currentDim = dim[0];
  let currentArray: any[];

  for (let i = 0; i < array.length; i++) {
    const subArrayIndex = i % currentDim;
    if (subArrayIndex === 0) {
      currentArray = [];
      subArrays.push(currentArray);
    }
    currentArray!.push(array[i]);
  }

  if (dim.length === 2) {
    return subArrays;
  } else {
    return unFlattenArray(subArrays, dim.slice(1));
  }
}
