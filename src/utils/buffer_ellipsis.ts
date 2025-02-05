'use strict';

import { buf2hex } from '../crypto';

export function buffer_ellipsis(buffer: ArrayBufferLike, start?: number, end?: number) {
  start = start || 0;
  end = end || buffer.byteLength;
  if (end - start < 40) {
    return buf2hex(buffer);
  }
  return buf2hex(buffer.slice(start, start + 10)) + ' ... ' + buf2hex(buffer.slice(end - 10, end));
}
