'use strict';

import { assert } from '../assert';
import { DataStream } from './DataStream';

export type Int8 = number;
export type SByte = number;

export type Int16 = number;
export type Int32 = number;
export type Int64 = [number, number];

export type UInt8 = number;
export type Byte = number;

export type UInt16 = number;
export type UInt32 = number;
export type UInt64 = [number, number];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isValidUInt16(value: any): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }
  return value >= 0 && value <= 0xffff;
}

export function randomUInt16(): number {
  return getRandomInt(0, 0xffff);
}

export function encodeUInt16(value: number, stream: DataStream) {
  stream.setUint16(value);
}

export function decodeUInt16(stream: DataStream): number {
  return stream.getUint16();
}

export function isValidInt16(value: any): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }
  return value >= -0x8000 && value <= 0x7fff;
}

export function randomInt16(): number {
  return getRandomInt(-0x8000, 0x7fff);
}
export function encodeInt16(value: number, stream: DataStream) {
  assert(Number.isFinite(value));
  stream.setInt16(value);
}
export function decodeInt16(stream: DataStream): number {
  return stream.getInt16();
}

export function isValidInt32(value: any): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }
  return value >= -0x80000000 && value <= 0x7fffffff;
}
export function randomInt32(): number {
  return getRandomInt(-0x80000000, 0x7fffffff);
}
export function encodeInt32(value: number, stream: DataStream) {
  assert(Number.isFinite(value), 'Number must be finite: ' + value);
  stream.setInt32(value);
}
export function decodeInt32(stream: DataStream): number {
  return stream.getInt32();
}

export function isValidUInt32(value: any): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }
  return value >= 0 && value <= 0xffffffff;
}

export function randomUInt32(): number {
  return getRandomInt(0, 0xffffffff);
}
export function encodeUInt32(value: number, stream: DataStream) {
  stream.setUint32(value);
}
export function decodeUInt32(stream: DataStream): number {
  return stream.getUint32();
}

export function isValidInt8(value: any): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }
  return value >= -0x80 && value <= 0x7f;
}

export function randomInt8(): number {
  return getRandomInt(-0x7f, 0x7e);
}
export function encodeInt8(value: number, stream: DataStream) {
  assert(isValidInt8(value));
  stream.setInt8(value);
}
export function decodeInt8(stream: DataStream) {
  return stream.getInt8();
}

export const isValidSByte = isValidInt8;
export const randomSByte = randomInt8;
export const encodeSByte = encodeInt8;
export const decodeSByte = decodeInt8;

export function isValidUInt8(value: any): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }
  return value >= 0x00 && value <= 0xff;
}
export function randomUInt8(): number {
  return getRandomInt(0x00, 0xff);
}
export function encodeUInt8(value: number, stream: DataStream) {
  stream.setUint8(value);
}
export function decodeUInt8(stream: DataStream) {
  return stream.getUint8();
}

export const isValidByte = isValidUInt8;
export const randomByte = randomUInt8;
export const encodeByte = encodeUInt8;
export const decodeByte = decodeUInt8;

export function isValidUInt64(value: any): boolean {
  return value instanceof Array && value.length === 2;
}
export function randomUInt64(): Array<number> {
  return [getRandomInt(0, 0xffffffff), getRandomInt(0, 0xffffffff)];
}
export function encodeUInt64(value: UInt64 | number, stream: DataStream) {
  if ('number' === typeof value) {
    value = coerceUInt64(value);
  }
  stream.setUint32(value[1]);
  stream.setUint32(value[0]);
}

export function decodeUInt64(stream: DataStream): UInt64 {
  const low = stream.getUint32();
  const high = stream.getUint32();
  return constructInt64(high, low);
}
export function constructInt64(high: number, low: number): UInt64 {
  if (high === 0 && low < 0) {
    high = 0xffffffff;
    low = 0xffffffff + low + 1;
  }
  assert(low >= 0 && low <= 0xffffffff);
  assert(high >= 0 && high <= 0xffffffff);
  return [high, low];
}

export function coerceUInt64(value: number | UInt64 | Int32 | string | null): UInt64 {
  let high, low, v;
  if (value === null || value === undefined) {
    return [0, 0];
  }
  if (value instanceof Array) {
    assert('number' === typeof value[0]);
    assert('number' === typeof value[1]);
    return value as [number, number];
  }
  if (typeof value === 'string') {
    v = value.split(',');
    if (v.length === 1) {
      let a = BigInt(value);
      if (a < BigInt(0)) {
        const mask = BigInt('0xFFFFFFFFFFFFFFFF');
        a = (mask + a + BigInt(1)) & mask;
      }
      high = Number(a >> BigInt(32));
      low = Number(a & BigInt(0xffffffff));
    } else {
      high = parseInt(v[0], 10);
      low = parseInt(v[1], 10);
    }
    return constructInt64(high, low);
  }
  if (value > 0xffffffff) {
    // beware : as per javascript, value is a double here !
    //          our conversion will suffer from some inacuracy

    high = Math.floor(value / 0x100000000);
    low = value - high * 0x100000000;
    return constructInt64(high, low);
  }
  return constructInt64(0, value);
}

export function randomInt64(): number[] {
  // High, low
  return [getRandomInt(0, 0xffffffff), getRandomInt(0, 0xffffffff)];
}

export function coerceInt8(value?: number | string | null): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return parseInt(value, 10);
}
export function coerceUInt8(value?: number | string | null): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return parseInt(value, 10);
}
export function coerceByte(value?: number | string | null): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return parseInt(value, 10);
}
export function coerceSByte(value?: number | string | null): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return parseInt(value, 10);
}

export function coerceUInt16(value?: number | string | null): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return parseInt(value, 10);
}
export function coerceInt16(value?: number | string | null): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return parseInt(value, 10);
}
export function coerceUInt32(value?: number | string | null): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return parseInt(value, 10);
}
export function coerceInt32(value: null | Int64 | UInt64 | number | string): number {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (value instanceof Array) {
    // Int64 as a [high,low]
    return coerceInt64toInt32(value);
  }

  return parseInt(value, 10);
}

const signMask = 1n << 31n;
const shiftHigh = 1n << 32n;
export function Int64ToBigInt(value: Int64): bigint {
  const h = BigInt(value[0]);
  const l = BigInt(value[1]);
  if ((h & signMask) === signMask) {
    const v = (h & ~signMask) * shiftHigh + l - 0x8000000000000000n;
    return v;
  } else {
    const v = h * shiftHigh + l;
    return v;
  }
}

export function UInt64ToBigInt(value: UInt64): bigint {
  const h = BigInt(value[0]);
  const l = BigInt(value[1]);
  const v = h * shiftHigh + l;
  return v;
}

export function coerceInt64toInt32(value: Int64 | Int32): Int32 {
  if (value instanceof Array) {
    const b = Int64ToBigInt(value);
    return Number(b);
  }
  return value;
}
export function coerceUInt64toInt32(value: UInt64 | UInt32): Int32 {
  if (value instanceof Array) {
    const b = UInt64ToBigInt(value);
    return Number(b);
  }
  return value;
}
