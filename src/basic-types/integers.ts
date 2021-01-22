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

export function isValidInt16(value: unknown): boolean {
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

export function isValidInt32(value: unknown): boolean {
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

export function isValidUInt32(value: unknown): boolean {
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

export function isValidInt8(value: unknown): boolean {
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

export function isValidUInt8(value: unknown): boolean {
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

export function isValidUInt64(value: unknown): boolean {
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
    high = parseInt(v[0], 10);
    low = parseInt(v[1], 10);
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

/*
export var coerceInt64 = coerceUInt64;
export var isValidInt64 = isValidUInt64;
export var encodeInt64 = encodeUInt64;
export var decodeInt64 = decodeUInt64;
*/

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
export function coerceInt32(value?: number | string | null): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return parseInt(value, 10);
}
