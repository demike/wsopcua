import { DataStream } from './DataStream';

export type Guid = string;

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const regexGUID = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/;

// precomputed byte -> two-char uppercase hex string lookup used by decodeGuid
const HEX_BYTE = new Array<string>(256);
for (let i = 0; i < 256; i++) {
  HEX_BYTE[i] = (i < 16 ? '0' : '') + i.toString(16).toUpperCase();
}

/**
 * checks if provided string is a valid Guid
 * a valid GUID has the form  XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX
 * when X is a hexadecimal digit
 *
 * @method isValidGuid
 *
 * @param guid {String}
 * @return {Boolean} return true if the string is a valid GUID.
 */
export function isValidGuid(guid: string): Boolean {
  return regexGUID.test(guid);
}

//                             1         2         3
//                   012345678901234567890123456789012345
export const emptyGuid = '00000000-0000-0000-0000-000000000000';

export function randomGuid(): string {
  const b = new DataStream(20);
  for (let i = 0; i < 20; i++) {
    b.setUint8(getRandomInt(0, 255));
  }
  b.rewind();
  const value = decodeGuid(b);
  return value;
}

export function normalizeGuid(guid: Guid | null | undefined): Guid {
  return guid ? guid.toUpperCase() : emptyGuid;
}

export function encodeGuid(guid: string, stream: DataStream): void {
  if (!isValidGuid(guid)) {
    throw new Error(" Invalid GUID : '" + JSON.stringify(guid) + "'");
  }
  //           1         2         3
  // 012345678901234567890123456789012345
  // |        |    |    | |  | | | | | |
  // 12345678-1234-1234-ABCD-0123456789AB
  // 00000000-0000-0000-0000-000000000000";
  function write_UInt32(starts: number[]) {
    let start;
    let i;
    const n = starts.length;
    for (i = 0; i < n; i++) {
      start = starts[i];
      stream.setUint32(parseInt(guid.substr(start, 8), 16));
    }
  }

  function write_UInt16(starts: number[]) {
    let start;
    let i;
    const n = starts.length;
    for (i = 0; i < n; i++) {
      start = starts[i];
      stream.setUint16(parseInt(guid.substr(start, 4), 16));
    }
  }

  function write_UInt8(starts: number[]) {
    let start;
    let i;
    const n = starts.length;
    for (i = 0; i < n; i++) {
      start = starts[i];
      stream.setUint8(parseInt(guid.substr(start, 2), 16));
    }
  }

  write_UInt32([0]);
  write_UInt16([9, 14]);
  write_UInt8([19, 21, 24, 26, 28, 30, 32, 34]);
}

export function decodeGuid(stream: DataStream): string {
  // The GUID is 16 bytes: Data1 (UInt32 LE), Data2/Data3 (UInt16 LE) and
  // Data4 (8 bytes, big-endian). Read them as a raw byte view and assemble the
  // canonical textual form directly from a byte->hex lookup table - this avoids
  // the per-field closures, toString(16)/substr work and the trailing
  // toUpperCase() over the whole string used by the previous implementation.
  const b = stream.readByteArray(16);
  return (
    HEX_BYTE[b[3]] +
    HEX_BYTE[b[2]] +
    HEX_BYTE[b[1]] +
    HEX_BYTE[b[0]] +
    '-' +
    HEX_BYTE[b[5]] +
    HEX_BYTE[b[4]] +
    '-' +
    HEX_BYTE[b[7]] +
    HEX_BYTE[b[6]] +
    '-' +
    HEX_BYTE[b[8]] +
    HEX_BYTE[b[9]] +
    '-' +
    HEX_BYTE[b[10]] +
    HEX_BYTE[b[11]] +
    HEX_BYTE[b[12]] +
    HEX_BYTE[b[13]] +
    HEX_BYTE[b[14]] +
    HEX_BYTE[b[15]]
  );
}
