'use strict';

function getBufferView(buffer: ArrayBufferLike, start: number, end: number) {
  return new Uint8Array(buffer, start, end - start);
}

export function buffer_ellipsis(buffer: ArrayBufferLike, start?: number, end?: number) {
  start = start || 0;
  end = end || buffer.byteLength;
  if (end - start < 40) {
    return getBufferView(buffer, start, end).toHex();
  }
  return (
    getBufferView(buffer, start, start + 10).toHex() +
    ' ... ' +
    getBufferView(buffer, end - 10, end).toHex()
  );
}
