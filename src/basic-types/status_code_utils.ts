import { StatusCode, ModifiableStatusCode } from './status_code';
import { DataStream } from './DataStream';
import { StatusCodes } from '../constants/raw_status_codes';

export function encodeStatusCode(statusCode: StatusCode | null, stream: DataStream) {
  stream.setUint32(statusCode ? statusCode.value : StatusCodes.Good.value);
}

/** @internal construct status codes fast search indexes */
const statusCodesReversedMap: { [key: number]: StatusCode } = {};

/**
 * returns the StatusCode corresponding to the provided value, if any
 * @note: if code is not known , then StatusCodes.Bad will be returned
 * @param code
 */
export function getStatusCodeFromCode(code: number) {
  const codeWithoutInfoBits = (code & 0xffff0000) >>> 0;
  const infoBits = code & 0x0000ffff;
  let sc = statusCodesReversedMap[codeWithoutInfoBits];

  /* istanbul ignore if */
  if (!sc) {
    sc = StatusCodes.Bad;
    console.log(
      'expecting a known StatusCode but got 0x' + codeWithoutInfoBits.toString(16),
      ' code was 0x' + code.toString(16)
    );
  }
  if (infoBits) {
    const tmp = new ModifiableStatusCode({ base: sc });
    tmp.set(infoBits);
    sc = tmp;
  }
  return sc;
}

export function decodeStatusCode(stream: DataStream) {
  const code = stream.getUint32();
  return getStatusCodeFromCode(code);
}

export function coerceStatusCode(statusCode: any): StatusCode {
  if (statusCode instanceof StatusCode) {
    return statusCode;
  }
  if (statusCode.hasOwnProperty('value')) {
    return getStatusCodeFromCode(statusCode.value);
  }
  if (typeof statusCode === 'number') {
    return getStatusCodeFromCode(statusCode);
  }
  const _StatusCodes = StatusCodes as any;
  if (!_StatusCodes[statusCode as string]) {
    throw new Error('Cannot find StatusCode ' + statusCode);
  }
  return _StatusCodes[statusCode as string];
}

/**
 *  returns a status code that can be modified
 */
export function makeStatusCode(
  statusCode: StatusCode | string,
  optionalBits?: string | number
): StatusCode {
  const base = coerceStatusCode(statusCode);
  const tmp = new ModifiableStatusCode({ base });
  if (optionalBits || typeof optionalBits === 'number') {
    tmp.set(optionalBits);
  }
  return tmp;
}

// eslint-disable-next-line guard-for-in
for (const code of Object.values(StatusCodes) as StatusCode[]) {
  statusCodesReversedMap[code.value] = code;
}

export function jsonDecodeStatusCode(statusCode?: number | { Code: number }) {
  if (!statusCode) {
    return StatusCodes.Good;
  }
  const code = (statusCode as any).Code !== undefined ? (statusCode as any).Code : statusCode;
  return getStatusCodeFromCode(code);
}

export function jsonEncodeStatusCode(statusCode?: StatusCode | null) {
  if (!statusCode || statusCode === StatusCodes.Good) {
    return;
  }
  return statusCode.value;
}
