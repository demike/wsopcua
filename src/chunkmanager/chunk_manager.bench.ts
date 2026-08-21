import { bench, describe } from 'vitest';

import { ChunkManager } from './chunk_manager';

// Benchmarks for the ChunkManager framing layer. Every outgoing OPC-UA message
// is split into transport chunks here (header + sequence header + body +
// optional signature), so its throughput bounds real send performance.
//
// The manager is async and driven by callbacks (header writers, signature).
// We use lightweight fakes that mirror the shapes exercised by the unit tests
// so the benchmark measures the chunking/copying work itself, not crypto.

function writeFakeHeader(
  this: ChunkManager,
  block: DataView | { setUint8: (i: number, v: number) => void },
  _isLast: boolean,
  _totalLength: number
) {
  for (let i = 0; i < this.headerSize; i++) {
    block.setUint8(i, 0xaa);
  }
}

function writeFakeSequenceHeader(this: ChunkManager, block: DataView) {
  for (let i = 0; i < this.sequenceHeaderSize; i++) {
    block.setUint8(i, 0xbb);
  }
}

function fakeSignature(_section: ArrayBuffer): Promise<ArrayBuffer> {
  return Promise.resolve(new Uint8Array(4).fill(0xcc).buffer);
}

function makePayload(byteLength: number): ArrayBuffer {
  const buf = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    buf[i] = i & 0xff;
  }
  return buf.buffer;
}

async function chunkOnce(payload: ArrayBuffer, options: ConstructorParameters<typeof ChunkManager>[0]) {
  const cm = new ChunkManager(options);
  // Drain emitted chunks so back-pressure/emit paths are exercised realistically.
  cm.on('chunk', () => {
    /* discard */
  });
  await cm.write(payload);
  await cm.end();
}

const payload64k = makePayload(64 * 1024);

describe('chunk-manager: plain (no header/sig, 8192-byte chunks)', () => {
  bench('write+end 64 KiB', async () => {
    await chunkOnce(payload64k, { chunkSize: 8192, sequenceHeaderSize: 0 });
  });
});

describe('chunk-manager: signed (header + seq header + signature, 8192-byte chunks)', () => {
  bench('write+end 64 KiB', async () => {
    await chunkOnce(payload64k, {
      chunkSize: 8192,
      headerSize: 12,
      writeHeaderFunc: writeFakeHeader,
      sequenceHeaderSize: 8,
      writeSequenceHeaderFunc: writeFakeSequenceHeader,
      signatureLength: 4,
      signBufferFunc: fakeSignature,
    });
  });
});
