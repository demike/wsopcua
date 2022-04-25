import { string2buf } from '.';
import { TagType } from './asn1';

export interface WriterOptions {
  size?: number; // default 1024
  growthFactor?: number; // default 8
}

const DEFAULT_OPTS: WriterOptions = {
  size: 1024,
  growthFactor: 8,
};

export class Asn1Writer {
  private _buf: Uint8Array;
  private _size: number;
  private _offset: number;
  private _options: WriterOptions;
  private _seq: number[];

  get buffer() {
    return this.getBuffer();
  }

  constructor(options?: WriterOptions) {
    options = { ...DEFAULT_OPTS, ...options };

    this._buf = new Uint8Array(options.size || 1024);
    this._size = this._buf.length;
    this._offset = 0;
    this._options = options;

    // A list of offsets in the buffer where we need to insert
    // sequence tag/len pairs.
    this._seq = [];
  }

  public get offset() {
    return this._offset;
  }

  public getBuffer(allowOpenSequences = false) {
    if (!allowOpenSequences && this._seq.length) {
      throw new Error(this._seq.length + ' unended sequence(s)');
    }
    return this._buf.slice(0, this._offset);
  }

  public writeByte(b: number) {
    if (typeof b !== 'number') {
      throw new TypeError('argument must be a Number');
    }

    this._ensure(1);
    this._buf[this._offset++] = b;
  }

  public writeInt(i: number, tag: TagType = TagType.INTEGER) {
    if (typeof i !== 'number') {
      throw new TypeError('argument must be a Number');
    }
    if (typeof tag !== 'number') {
      tag = TagType.INTEGER;
    }

    let size = 4;

    while (((i & 0xff800000) === 0 || (i & 0xff800000) === 0xff800000 >> 0) && size > 1) {
      size--;
      i <<= 8;
    }

    if (size > 4) {
      throw new TypeError('DER ints cannot be > 0xffffffff');
    }

    this._ensure(2 + size);
    this._buf[this._offset++] = tag;
    this._buf[this._offset++] = size;

    while (size-- > 0) {
      this._buf[this._offset++] = (i & 0xff000000) >>> 24;
      i <<= 8;
    }
  }

  public writeNull() {
    this.writeByte(TagType.NULL);
    this.writeByte(0x00);
  }

  public writeEnumeration(i: number, tag?: TagType) {
    if (typeof i !== 'number') {
      throw new TypeError('argument must be a Number');
    }
    if (typeof tag !== 'number') {
      tag = TagType.Enumeration;
    }

    return this.writeInt(i, tag);
  }

  public writeBoolean(b: boolean, tag?: TagType) {
    if (typeof b !== 'boolean') {
      throw new TypeError('argument must be a Boolean');
    }
    if (typeof tag !== 'number') {
      tag = TagType.BOOLEAN;
    }

    this._ensure(3);
    this._buf[this._offset++] = tag;
    this._buf[this._offset++] = 0x01;
    this._buf[this._offset++] = b ? 0xff : 0x00;
  }

  public writeString(s: string, tag?: TagType) {
    if (typeof s !== 'string') {
      throw new TypeError('argument must be a string (was: ' + typeof s + ')');
    }
    if (typeof tag !== 'number') {
      tag = TagType.OCTET_STRING;
    }

    const byteArray = new TextEncoder().encode(s);
    const len = byteArray.byteLength;
    this.writeByte(tag);
    this.writeLength(len);
    if (len > 0) {
      this._ensure(len);
      this._buf.set(byteArray, this._offset);
      this._offset += len;
    }
  }

  public writeBuffer(buf: Uint8Array, tag?: TagType) {
    // If no tag is specified we will assume `buf` already contains tag and length
    if (typeof tag === 'number') {
      this.writeByte(tag);
      this.writeLength(buf.length);
    }

    if (buf.length > 0) {
      this._ensure(buf.length);
      this._buf.set(buf, this._offset);
      this._offset += buf.length;
    }
  }

  public writeBitString(buf: Uint8Array, tag?: TagType) {
    if (!tag) {
      tag = TagType.BIT_STRING;
    }

    this.writeByte(tag);
    this.writeLength(buf.length + 1);
    this.writeByte(0); // the ignore bits count

    if (buf.length > 0) {
      this._ensure(buf.length);
      this._buf.set(buf, this._offset);
      this._offset += buf.length;
    }
  }

  public writeStringArray(strings: string[], tag?: TagType) {
    if (!(strings instanceof Array)) {
      throw new TypeError('argument must be an Array[String]');
    }

    strings.forEach((s) => {
      this.writeString(s, tag);
    });
  }

  // This is really to solve DER cases, but whatever for now
  public writeOID(s: string, tag?: TagType) {
    if (typeof s !== 'string') {
      throw new TypeError('argument must be a string');
    }
    if (typeof tag !== 'number') {
      tag = TagType.OBJECT_IDENTIFIER;
    }

    if (!/^([0-9]+\.){0,}[0-9]+$/.test(s)) {
      throw new Error('argument is not a valid OID string');
    }

    function encodeOctet(bytes: number[], octet: number) {
      if (octet < 128) {
        bytes.push(octet);
      } else if (octet < 16384) {
        bytes.push((octet >>> 7) | 0x80);
        bytes.push(octet & 0x7f);
      } else if (octet < 2097152) {
        bytes.push((octet >>> 14) | 0x80);
        bytes.push(((octet >>> 7) | 0x80) & 0xff);
        bytes.push(octet & 0x7f);
      } else if (octet < 268435456) {
        bytes.push((octet >>> 21) | 0x80);
        bytes.push(((octet >>> 14) | 0x80) & 0xff);
        bytes.push(((octet >>> 7) | 0x80) & 0xff);
        bytes.push(octet & 0x7f);
      } else {
        bytes.push(((octet >>> 28) | 0x80) & 0xff);
        bytes.push(((octet >>> 21) | 0x80) & 0xff);
        bytes.push(((octet >>> 14) | 0x80) & 0xff);
        bytes.push(((octet >>> 7) | 0x80) & 0xff);
        bytes.push(octet & 0x7f);
      }
    }

    const tmp = s.split('.');
    const bytes: number[] = [];
    bytes.push(parseInt(tmp[0], 10) * 40 + parseInt(tmp[1], 10));
    tmp.slice(2).forEach(function (b) {
      encodeOctet(bytes, parseInt(b, 10));
    });

    this._ensure(2 + bytes.length);
    this.writeByte(tag);
    this.writeLength(bytes.length);
    bytes.forEach((b) => {
      this.writeByte(b);
    });
  }

  public writeLength(len: number) {
    if (typeof len !== 'number') {
      throw new TypeError('argument must be a Number');
    }

    this._ensure(4);

    if (len <= 0x7f) {
      this._buf[this._offset++] = len;
    } else if (len <= 0xff) {
      this._buf[this._offset++] = 0x81;
      this._buf[this._offset++] = len;
    } else if (len <= 0xffff) {
      this._buf[this._offset++] = 0x82;
      this._buf[this._offset++] = len >> 8;
      this._buf[this._offset++] = len;
    } else if (len <= 0xffffff) {
      this._buf[this._offset++] = 0x83;
      this._buf[this._offset++] = len >> 16;
      this._buf[this._offset++] = len >> 8;
      this._buf[this._offset++] = len;
    } else {
      throw new Error('Length too long (> 4 bytes)');
    }
  }

  public writeTime(
    date: Date,
    tag: TagType.UTCTime | TagType.GeneralizedTime = TagType.GeneralizedTime
  ) {
    let strTime = '';
    if (tag === TagType.GeneralizedTime) {
      strTime += date.getUTCFullYear();
    } else {
      // TagType.UTCTime
      strTime += formatNumber2Digits(date.getUTCFullYear() % 100); // 2067 --> 67
    }

    strTime += formatNumber2Digits(date.getUTCMonth() + 1);
    strTime += formatNumber2Digits(date.getUTCDate());
    strTime += formatNumber2Digits(date.getUTCHours());
    strTime += formatNumber2Digits(date.getUTCMinutes());
    strTime += formatNumber2Digits(date.getUTCSeconds());

    strTime += 'Z'; // ZULU time (time is UTC), TODO: check if this is always right

    const buf = string2buf(strTime);
    this.writeBuffer(new Uint8Array(buf), tag);
  }

  public startSequence(tag?: TagType) {
    if (typeof tag !== 'number') {
      tag = TagType.SEQUENCE;
    }

    this.writeByte(tag);
    this._seq.push(this._offset);
    this._ensure(3);
    this._offset += 3;
  }

  public endSequence() {
    const seq = this._seq.pop();
    const start = seq + 3;
    const len = this._offset - start;

    if (len <= 0x7f) {
      this._shift(start, len, -2);
      this._buf[seq] = len;
    } else if (len <= 0xff) {
      this._shift(start, len, -1);
      this._buf[seq] = 0x81;
      this._buf[seq + 1] = len;
    } else if (len <= 0xffff) {
      this._buf[seq] = 0x82;
      this._buf[seq + 1] = len >> 8;
      this._buf[seq + 2] = len;
    } else if (len <= 0xffffff) {
      this._shift(start, len, 1);
      this._buf[seq] = 0x83;
      this._buf[seq + 1] = len >> 16;
      this._buf[seq + 2] = len >> 8;
      this._buf[seq + 3] = len;
    } else {
      throw new Error('Sequence too long');
    }
  }

  private _shift(start: number, len: number, shift: number) {
    this._buf.set(this._buf.subarray(start, start + len), start + shift);
    this._offset += shift;
  }

  private _ensure(len: number) {
    if (this._size - this._offset < len) {
      let sz = this._size * this._options.growthFactor;
      if (sz - this._offset < len) {
        sz += len;
      }

      const buf = new Uint8Array(sz);
      buf.set(this._buf.subarray(0, this._offset));
      // this._buf.copy(buf, 0, 0, this._offset);
      this._buf = buf;
      this._size = sz;
    }
  }
}

function formatNumber2Digits(num: number) {
  const str = num.toString();
  switch (str.length) {
    case 1:
      return '0' + str;
    case 2:
      return str;
    default:
      throw new Error('invalid Number: ' + num);
  }
}
