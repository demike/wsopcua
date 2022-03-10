import { buf2string } from '.';
import { assert } from '../assert';
import { oid_map } from './oid_map';

// https://github.com/lapo-luchini/asn1js/blob/master/asn1.js
export enum TagType {
  BOOLEAN = 0x01,
  INTEGER = 0x02,
  BIT_STRING = 0x03,
  OCTET_STRING = 0x04,
  NULL = 0x05,
  OBJECT_IDENTIFIER = 0x06,
  Enumeration = 0x0a,
  UTF8String = 0x0c,
  NumericString = 0x12,
  PrintableString = 0x13,
  TeletexString = 0x14,
  IA5String = 0x16,
  UTCTime = 0x17,
  GeneralizedTime = 0x18,
  GraphicString = 0x19,
  VisibleString = 0x1a,
  GeneralString = 0x1b,
  UniversalString = 0x1c,
  BMPString = 0x1e,

  SEQUENCE = 0x30,
  SET = 0x31,

  A3 = 0xa3,
}

export interface BlockInfo {
  tag: TagType | number;
  position: number;
  length: number;
}

export function readTag(arbuf: Uint8Array, pos: number): BlockInfo {
  assert(arbuf instanceof Uint8Array);
  assert(Number.isFinite(pos) && pos >= 0);
  if (arbuf.byteLength <= pos) {
    throw new Error('Invalid position : buf.length=' + arbuf.byteLength + ' pos =' + pos);
  }

  const tag = arbuf[pos];
  pos += 1;

  let length = arbuf[pos];
  pos += 1;

  /* eslint-disable no-bitwise */
  if (length > 127) {
    const nbBytes = length & 0x7f;
    length = 0;
    for (let i = 0; i < nbBytes; i++) {
      length = length * 256 + arbuf[pos];
      pos += 1;
    }
  }
  return { tag, position: pos, length };
}

export function _readStruct(buf: Uint8Array, block_info: BlockInfo): BlockInfo[] {
  const length = block_info.length;
  let cursor = block_info.position;
  const end = block_info.position + length;
  const blocks: BlockInfo[] = [];
  while (cursor < end) {
    const inner = readTag(buf, cursor);
    cursor = inner.position + inner.length;
    blocks.push(inner);
  }
  return blocks;
}

export function parseBitString(
  buffer: Uint8Array,
  start: number,
  end: number,
  maxLength: number
): string {
  const unusedBit = buffer[start],
    lenBit = ((end - start - 1) << 3) - unusedBit,
    intro = '(' + lenBit + ' bit)\n';

  let s = '',
    skip = unusedBit;

  for (let i = end - 1; i > start; --i) {
    const b = buffer[i];

    for (let j = skip; j < 8; ++j) {
      // noinspection JSBitwiseOperatorUsage
      s += (b >> j) & 1 ? '1' : '0';
    }
    skip = 0;
    assert(s.length <= maxLength);
  }
  return intro + s;
}

export interface BitString {
  lengthInBits: number;
  lengthInBytes: number;
  data: Uint8Array;
  debug?: any;
}

export function _readBitString(buffer: Uint8Array, block: BlockInfo): BitString {
  assert(block.tag === TagType.BIT_STRING);
  const data = _getBlock(buffer, block);
  // number of skipped bits
  const ignore_bits = data[0];

  return {
    lengthInBits: data.length * 8 - ignore_bits,
    lengthInBytes: data.length - 1,
    data: data.subarray(1),
    debug: parseBitString(buffer, block.position, block.length + block.position, 5000),
  };
}

export function formatBuffer2DigitHexWithColum(buffer: Uint8Array): string {
  const value: string[] = [];
  for (let i = 0; i < buffer.length; i++) {
    value.push(('00' + buffer[i].toString(16)).substr(-2, 2));
  }
  // remove leading 00
  return value
    .join(':')
    .toUpperCase()
    .replace(/^(00:)*/, '');
}

export function _readOctetString(buffer: Uint8Array, block: BlockInfo): Uint8Array {
  assert(block.tag === TagType.OCTET_STRING);
  const tag = readTag(buffer, block.position);
  assert(tag.tag === TagType.OCTET_STRING);

  const nbBytes = tag.length;
  const pos = tag.position;
  const b = buffer.subarray(pos, pos + nbBytes);
  return b;
}

export function _getBlock(buffer: Uint8Array, block: BlockInfo): Uint8Array {
  const start = block.position;
  const end = block.position + block.length;
  return buffer.subarray(start, end);
}

export interface AlgorithmIdentifier {
  identifier: string;
}

export function _readIntegerAsByteString(buffer: Uint8Array, block: BlockInfo): Uint8Array {
  return _getBlock(buffer, block);
}

export function _readListOfInteger(buffer: Uint8Array): Uint8Array[] {
  const block = readTag(buffer, 0);
  const inner_blocks = _readStruct(buffer, block);
  return inner_blocks.map((bblock: BlockInfo) => _readIntegerAsByteString(buffer, bblock));
}

export function parseOID(buffer: Uint8Array, start: number, end: number): string {
  // ASN.1 JavaScript decoder
  // Copyright (c) 2008-2014 Lapo Luchini <lapo@lapo.it>
  let s = '',
    n = 0,
    bits = 0;
  for (let i = start; i < end; ++i) {
    const v = buffer[i];

    // eslint-disable-next-line no-bitwise
    n = n * 128 + (v & 0x7f);
    bits += 7;

    // noinspection JSBitwiseOperatorUsage
    // eslint-disable-next-line no-bitwise
    if (!(v & 0x80)) {
      // finished
      if (s === '') {
        const m = n < 80 ? (n < 40 ? 0 : 1) : 2;
        s = m + '.' + (n - m * 40);
      } else {
        s += '.' + n.toString();
      }
      n = 0;
      bits = 0;
    }
  }
  assert(bits === 0); // if (bits > 0) { s += ".incomplete"; }
  return s;
}

export function _readObjectIdentifier(
  buffer: Uint8Array,
  block: BlockInfo
): { oid: string; name: string } {
  assert(block.tag === TagType.OBJECT_IDENTIFIER);
  const b = buffer.subarray(block.position, block.position + block.length);
  const oid = parseOID(b, 0, block.length);
  return {
    oid,
    name: oid_map[oid] ? oid_map[oid].d : oid,
  };
}

export function _readAlgorithmIdentifier(
  buffer: Uint8Array,
  block: BlockInfo
): AlgorithmIdentifier {
  const inner_blocks = _readStruct(buffer, block);
  return {
    identifier: _readObjectIdentifier(buffer, inner_blocks[0]).name,
  };
}

export function _readECCAlgorithmIdentifier(
  buffer: Uint8Array,
  block: BlockInfo
): AlgorithmIdentifier {
  const inner_blocks = _readStruct(buffer, block);
  return {
    identifier: _readObjectIdentifier(buffer, inner_blocks[1]).name, // difference with RSA as algorithm is second element of nested block
  };
}

export type SignatureValue = string;

export function _readSignatureValueBin(buffer: Uint8Array, block: BlockInfo): Uint8Array {
  return _readBitString(buffer, block).data;
}

export function _readSignatureValue(buffer: Uint8Array, block: BlockInfo): SignatureValue {
  return Array.prototype.map
    .call(_readSignatureValueBin(buffer, block), (x: number) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

export function _readLongIntegerValue(buffer: Uint8Array, block: BlockInfo): Uint8Array {
  assert(block.tag === TagType.INTEGER, 'expecting a INTEGER tag');
  const pos = block.position;
  const nbBytes = block.length;
  const buf = buffer.subarray(pos, pos + nbBytes);
  return buf;
}

export function _readIntegerValue(buffer: Uint8Array, block: BlockInfo): number {
  assert(block.tag === TagType.INTEGER, 'expecting a INTEGER tag');
  let pos = block.position;
  const nbBytes = block.length;
  assert(nbBytes < 4);
  let value = 0;
  for (let i = 0; i < nbBytes; i++) {
    value = value * 256 + buffer[pos];
    pos += 1;
  }
  return value;
}

export function _readBooleanValue(buffer: Uint8Array, block: BlockInfo): boolean {
  assert(block.tag === TagType.BOOLEAN, 'expecting a BOOLEAN tag. got ' + TagType[block.tag]);
  const pos = block.position;
  const nbBytes = block.length;
  assert(nbBytes < 4);
  const value = buffer[pos] ? true : false;
  return value;
}

export function _readVersionValue(buffer: Uint8Array, block: BlockInfo): number {
  block = readTag(buffer, block.position);
  return _readIntegerValue(buffer, block);
}

/*
 4.1.2.5.2  GeneralizedTime

 The generalized time type, GeneralizedTime, is a standard ASN.1 type
 for variable precision representation of time.  Optionally, the
 GeneralizedTime field can include a representation of the time
 differential between local and Greenwich Mean Time.

 For the purposes of this profile, GeneralizedTime values MUST be
 expressed Greenwich Mean Time (Zulu) and MUST include seconds (i.e.,
 times are YYYYMMDDHHMMSSZ), even where the number of seconds is zero.
 GeneralizedTime values MUST NOT include fractional seconds.

 */
function convertGeneralizedTime(str: string): Date {
  const year = parseInt(str.substring(0, 4), 10);
  const month = parseInt(str.substring(4, 6), 10) - 1;
  const day = parseInt(str.substring(6, 8), 10);
  const hours = parseInt(str.substring(8, 10), 10);
  const mins = parseInt(str.substring(10, 12), 10);
  const secs = parseInt(str.substring(12, 14), 10);

  return new Date(Date.UTC(year, month, day, hours, mins, secs));
}

function _readBMPString(buffer: Uint8Array, block: BlockInfo): string {
  const strBuff = new DataView(_getBlock(buffer, block));

  let str = '';
  for (let i = 0; i < strBuff.byteLength; i += 2) {
    const word = strBuff.getUint16(i, false); // big endian
    str += String.fromCharCode(word);
  }
  return str;
}

/*
 http://tools.ietf.org/html/rfc5280

 4.1.2.5. Validity
 [...]
 As conforming to this profile MUST always encode certificate
 validity dates through the year 2049 as UTCTime; certificate validity
 dates in 2050 or later MUST be encoded as GeneralizedTime.
 Conforming applications MUST be able to process validity dates that
 are encoded in either UTCTime or GeneralizedTime.
 [...]

 4.1.2.5.1  UTCTime

 The universal time type, UTCTime, is a standard ASN.1 type intended
 for representation of dates and time.  UTCTime specifies the year
 through the two low order digits and time is specified to the
 precision of one minute or one second.  UTCTime includes either Z
 (for Zulu, or Greenwich Mean Time) or a time differential.

 For the purposes of this profile, UTCTime values MUST be expressed
 Greenwich Mean Time (Zulu) and MUST include seconds (i.e., times are
 YYMMDDHHMMSSZ), even where the number of seconds is zero.  Conforming
 systems MUST interpret the year field (YY) as follows:

 Where YY is greater than or equal to 50, the year SHALL be
 interpreted as 19YY; and

 Where YY is less than 50, the year SHALL be interpreted as 20YY.
 */
function convertUTCTime(str: string): Date {
  let year = parseInt(str.substring(0, 2), 10);
  const month = parseInt(str.substring(2, 4), 10) - 1;
  const day = parseInt(str.substring(4, 6), 10);
  const hours = parseInt(str.substring(6, 8), 10);
  const mins = parseInt(str.substring(8, 10), 10);
  const secs = parseInt(str.substring(10, 12), 10);

  year += year >= 50 ? 1900 : 2000;
  return new Date(Date.UTC(year, month, day, hours, mins, secs));
}

export function _readValue(buffer: Uint8Array, block: BlockInfo): any {
  switch (block.tag) {
    case TagType.BOOLEAN:
      return _readBooleanValue(buffer, block);
    case TagType.BMPString:
      return _readBMPString(buffer, block);
    case TagType.PrintableString:
    case TagType.TeletexString:
    case TagType.UTF8String:
    case TagType.NumericString:
    case TagType.IA5String:
      return buf2string(_getBlock(buffer, block));
    case TagType.UTCTime:
      return convertUTCTime(buf2string(_getBlock(buffer, block)));
    case TagType.GeneralizedTime:
      return convertGeneralizedTime(buf2string(_getBlock(buffer, block)));
    default:
      throw new Error('Invalid tag 0x' + block.tag.toString(16) + '');
    // xx return " ??? <" + block.tag + ">";
  }
}

export interface DirectoryName {
  stateOrProvinceName?: string;
  localityName?: string;
  organizationName?: string;
  organizationUnitName?: string;
  commonName?: string;
  countryName?: string;
}
export function compactDirectoryName(d: DirectoryName): string {
  return JSON.stringify(d);
}

export function _readDirectoryName(buffer: Uint8Array, block: BlockInfo): DirectoryName {
  // AttributeTypeAndValue ::= SEQUENCE {
  //    type   ATTRIBUTE.&id({SupportedAttributes}),
  //    value  ATTRIBUTE.&Type({SupportedAttributes}{@type}),
  const set_blocks = _readStruct(buffer, block);
  const names: DirectoryName = {};
  for (const set_block of set_blocks) {
    assert(set_block.tag === 0x31);
    const blocks = _readStruct(buffer, set_block);
    assert(blocks.length === 1);
    assert(blocks[0].tag === 0x30);

    const sequenceBlock = _readStruct(buffer, blocks[0]);
    assert(sequenceBlock.length === 2);

    const type = _readObjectIdentifier(buffer, sequenceBlock[0]);
    (names as any)[type.name] = _readValue(buffer, sequenceBlock[1]);
  }
  return names;
}

export function _findBlockAtIndex(blocks: BlockInfo[], index: number): BlockInfo | null {
  const tmp = blocks.filter((b: BlockInfo) => b.tag === 0xa0 + index || b.tag === 0x80 + index);
  if (tmp.length === 0) {
    return null;
  }
  return tmp[0];
}

export function _readTime(buffer: Uint8Array, block: BlockInfo): any {
  return _readValue(buffer, block);
}
