'use strict';

import { ChunkManager } from './chunk_manager';
import { assert } from '../assert';
import { hexDump } from '../common/debug';
import { DataStream } from '../basic-types/DataStream';

function make_packet(packet_length: number) {
  const buf = new Uint8Array(packet_length);
  for (let i = 0; i < buf.length; i++) {
    buf[i] = i % 256;
  }
  return buf;
}

const do_debug = false;

function compute_fake_signature(section_to_sign: ArrayBuffer): Promise<ArrayBuffer> {
  const signature = new Uint8Array(4);
  for (let i = 0; i < signature.length; i++) {
    signature[i] = 0xcc;
  }
  return Promise.resolve(signature.buffer);
}

function write_fake_header(block: DataView | DataStream, isLast: boolean, total_length: number) {
  for (let i = 0; i < this.headerSize; i++) {
    block.setUint8(i, 0xaa);
  }
}

function write_fake_sequence_header(block: DataView) {
  for (let i = 0; i < this.sequenceHeaderSize; i++) {
    block.setUint8(i, 0xbb);
  }
}

function fake_encrypt_block(block: ArrayBuffer): ArrayBuffer {
  assert(this.plainBlockSize + 2 === this.cipherBlockSize);
  assert(this.plainBlockSize === block.byteLength);

  const encrypted_block = new Uint8Array(block.byteLength + 2);
  encrypted_block[0] = 0xde;
  encrypted_block.set(new Uint8Array(block), 1);
  encrypted_block[block.byteLength + 1] = 0xdf;
  return encrypted_block.buffer;
}

function fake_encrypt_buffer(buffer: ArrayBuffer) {
  this.encrypt_block = fake_encrypt_block;

  const nbBlocks = Math.ceil(buffer.byteLength / this.plainBlockSize);

  const outputBuffer = new Uint8Array(nbBlocks * this.cipherBlockSize);

  for (let i = 0; i < nbBlocks; i++) {
    const currentBlock = buffer.slice(this.plainBlockSize * i, this.plainBlockSize * (i + 1));

    const encrypted_chunk: ArrayBuffer = this.encrypt_block(currentBlock);

    assert(encrypted_chunk.byteLength === this.cipherBlockSize);

    outputBuffer.set(new Uint8Array(encrypted_chunk), i * this.cipherBlockSize);
  }
  return Promise.resolve(outputBuffer);
}

function no_encrypt_block(block: Uint8Array) {
  assert(this.plainBlockSize === this.cipherBlockSize);
  return Promise.resolve(block);
}

function make_hex_block(hex: string): ArrayBuffer {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (hex.length % 2 !== 0) {
    // prefix the string instead of throwing an error
    hex = '0' + hex;
    // throw new RangeError('Expected string to be an even number of characters');
  }

  const view = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }

  return view.buffer;
}

describe('Chunk manager - no header - no signature - no encryption', function () {
  it('should decompose a large single write in small chunks', async function () {
    const chunkManager = new ChunkManager({
      chunkSize: 48,
      sequenceHeaderSize: 0,
    });
    expect(chunkManager.chunkSize).toEqual(48);
    expect(chunkManager.sequenceHeaderSize).toEqual(0);
    expect(chunkManager.maxBodySize).toEqual(48);

    let chunk_counter = 0;
    chunkManager.on('chunk', function (chunk: ArrayBuffer) {
      if (chunk_counter < 2) {
        // all packets shall be 48 byte long, except last
        expect(chunk.byteLength).toEqual(48);
      } else {
        // last packet is smaller
        expect(chunk.byteLength).toEqual(12);
      }

      chunk_counter += 1;
    });

    // create a large buffer ( 2.3 time bigger than chunksize)
    const n = 48 * 2 + 12;
    const buf = make_packet(n);

    // write this single buffer
    await chunkManager.write(buf.buffer, buf.length);
    await chunkManager.end();

    expect(chunk_counter).toEqual(3);
  });

  it('should decompose many small writes in small "sequential" chunks', async () => {
    const chunkManager = new ChunkManager({
      chunkSize: 48,
      sequenceHeaderSize: 0,
    });
    expect(chunkManager.chunkSize).toEqual(48);
    expect(chunkManager.maxBodySize).toEqual(48);

    let chunk_counter = 0;
    chunkManager.on('chunk', (chunk: ArrayBuffer) => {
      // console.log(" chunk "+ chunk_counter + " " + chunk.toString("hex"));
      if (chunk_counter < 2) {
        // all packets shall be 48 byte long, except last
        expect(chunk.byteLength).toEqual(48);
      } else {
        // last packet is smaller
        expect(chunk.byteLength).toEqual(12);
      }
      chunk_counter += 1;
    });

    // feed chunk-manager one byte at a time
    const n = 48 * 2 + 12;
    const buf = new Uint8Array(1);
    // let promises = [];
    for (let i = 0; i < n; i += 1) {
      buf[i] = 0;
      // promises.push(chunkManager.write(buf.buffer, 1));
      await chunkManager.write(buf.buffer, 1);
    }

    // await Promise.all(promises);

    // write this single buffer
    chunkManager.end();
    expect(chunk_counter).toEqual(3);
  });

  it('should decompose many small writes in small "parallel" chunks', async () => {
    const chunkManager = new ChunkManager({
      chunkSize: 48,
      sequenceHeaderSize: 0,
    });
    expect(chunkManager.chunkSize).toEqual(48);
    expect(chunkManager.maxBodySize).toEqual(48);

    let chunk_counter = 0;
    chunkManager.on('chunk', (chunk: ArrayBuffer) => {
      // console.log(" chunk "+ chunk_counter + " " + chunk.toString("hex"));
      if (chunk_counter < 2) {
        // all packets shall be 48 byte long, except last
        expect(chunk.byteLength).toEqual(48);
      } else {
        // last packet is smaller
        expect(chunk.byteLength).toEqual(12);
      }
      chunk_counter += 1;
    });

    // feed chunk-manager one byte at a time
    const n = 48 * 2 + 12;
    const buf = new Uint8Array(1);
    for (let i = 0; i < n; i += 1) {
      buf[i] = 0;
      chunkManager.write(buf.buffer, 1);
    }

    // write this single buffer
    await chunkManager.end();
    expect(chunk_counter).toEqual(3);
  });
});

function perform_test(
  chunkManager: ChunkManager,
  packet_length: number,
  expected_chunk_lengths: string[] | number[],
  done: () => void
) {
  let expected_chunks: ArrayBuffer[] = null;
  if (typeof expected_chunk_lengths[0] === 'string') {
    expected_chunks = (expected_chunk_lengths as string[]).map(make_hex_block);
    expected_chunk_lengths = expected_chunks.map(function (b: ArrayBuffer) {
      return b.byteLength;
    });
  }
  let chunk_counter = 0;

  chunkManager.on('chunk', function (chunk, is_last) {
    if (do_debug) {
      console.log('chunk = ', make_hex_block(chunk.toString()));
    }
    expect(chunk).toBeDefined();

    expect(chunk_counter).not.toBeGreaterThan(expected_chunk_lengths.length);

    expect(chunk.byteLength).toEqual(
      expected_chunk_lengths[chunk_counter],
      ' testing chunk ' + chunk_counter
    );

    if (expected_chunks) {
      if (do_debug) {
        console.log(hexDump(chunk));
        console.log(hexDump(expected_chunks[chunk_counter]));
      }

      expect(chunk).toEqual(new Uint8Array(expected_chunks[chunk_counter]));
    }
    chunk_counter += 1;
    if (chunk_counter === expected_chunk_lengths.length) {
      expect(is_last).toBeTruthy();
      done();
    } else {
      expect(is_last).toBeFalsy();
    }
  });

  const buf = make_packet(packet_length);

  chunkManager.write(buf.buffer).then(() => chunkManager.end());
}

describe('Chunk Manager (chunk size 32 bytes, sequenceHeaderSize: 8 bytes)\n', function () {
  let chunkManager: ChunkManager;

  beforeEach(function () {
    chunkManager = new ChunkManager({
      chunkSize: 32,
      sequenceHeaderSize: 8,
      writeSequenceHeaderFunc: write_fake_sequence_header,
    });
    expect(chunkManager.chunkSize).toEqual(32);
    expect(chunkManager.sequenceHeaderSize).toEqual(8);
    expect(chunkManager.maxBodySize).toEqual(24);
  });

  it('should transform a 32 bytes message into a chunk of 32 bytes and 16 bytes', function (done) {
    // block 1 : [ 0  +  8 +  24 ] = 32
    // block 2 : [ 0  +  8 +   8 ] = 16
    //                      ------
    //                        32
    perform_test(chunkManager, 32, [32, 16], done);
  });
  it('should transform a 33 bytes message into a chunk of 32 bytes and 17 bytes', function (done) {
    // block 1 : [ 0  +  8 +  24 ] = 32
    // block 2 : [ 0  +  8 +   9 ] = 17
    //                      ------
    //                        33
    perform_test(chunkManager, 33, [32, 17], done);
  });
});
describe('Chunk Manager (chunk size 32 bytes, sequenceHeaderSize: 8 bytes ,signatureLength: 4 )\n', function () {
  let chunkManager: ChunkManager;

  beforeEach(function () {
    chunkManager = new ChunkManager({
      chunkSize: 32,

      sequenceHeaderSize: 8,
      writeSequenceHeaderFunc: write_fake_sequence_header,

      signatureLength: 4,
      signBufferFunc: compute_fake_signature,
    });
    expect(chunkManager.chunkSize).toEqual(32);
    expect(chunkManager.sequenceHeaderSize).toEqual(8);
    expect(chunkManager.signatureLength).toEqual(4);
    expect(chunkManager.maxBodySize).toEqual(20);
  });

  it('should transform a 32 bytes message into a chunk of 32 bytes and 24 bytes', function (done) {
    // C1 = [ 8 + 20 + 4] = 32
    // C2 = [ 8 + 12 + 4] = 24
    //           ----
    //            32
    perform_test(chunkManager, 32, [32, 24], done);
  });

  it('should transform a 33 bytes message into a chunk of 32 bytes and 25 bytes', function (done) {
    // C1 = [ 8 + 20 + 4] = 32
    // C2 = [ 8 + 13 + 4] = 25
    //           ----
    //            33
    perform_test(chunkManager, 33, [32, 25], done);
  });
});

describe('Chunk Manager Padding (chunk size 32 bytes, plainBlockSize 8 bytes ,cipherBlockSize 8 bytes )\n', function () {
  let chunkManager: ChunkManager;

  beforeEach(function () {
    chunkManager = new ChunkManager({
      chunkSize: 32,

      plainBlockSize: 8,
      cipherBlockSize: 8,
      encryptBufferFunc: no_encrypt_block,

      headerSize: 4,
      writeHeaderFunc: write_fake_header,

      sequenceHeaderSize: 2,
      writeSequenceHeaderFunc: write_fake_sequence_header,

      signatureLength: 4,
      signBufferFunc: compute_fake_signature,
    });
    expect(chunkManager.chunkSize).toEqual(32);
    expect(chunkManager.maxBodySize).toEqual(17);
    expect(chunkManager.signBufferFunc).toEqual(compute_fake_signature);
  });

  it('should transform a  1 bytes message into a single 12 bytes chunk', function (done) {
    //
    // +-------+---------------+---------------+-------------+-------+
    // |Header |SequenceHeader | data          | paddingByte | sign  |
    // +-------+---------------+---------------+-------------+-------+
    // |   4   |   2           |  1            | 1 +  0      |  4    |=> 4 +  ( 2+ 1 + (1 + 0) + 4 ) = 4 + 8
    // +-------+---------------+---------------+-------------+-------+
    perform_test(chunkManager, 1, [12], done);
  });

  it('should transform a  2 bytes message into a single 20 bytes chunk', function (done) {
    // +-------+---------------+---------------+-------------+-------+
    // |Header |SequenceHeader | data          | paddingByte | sign  |
    // +-------+---------------+---------------+-------------+-------+
    // |   4   |   2           |  2            | 1 + 7       |  4    | => 4 +  ( 2+ 2 + (1 + 7) + 4 ) = 4 + 16
    // +-------+---------------+---------------+-------------+-------+
    perform_test(chunkManager, 2, [20], done);
  });

  it('should transform a 10 bytes message into a single 28 bytes chunk', function (done) {
    // +-------+---------------+---------------+-------------+-------+
    // |Header |SequenceHeader | data          | paddingByte | sign  |
    // +-------+---------------+---------------+-------------+-------+
    // |   4   |   2           |  10            | 1 + 7       |  4    |
    // +-------+---------------+---------------+-------------+-------+
    //           ( 2 + 4 + 2 + 1+[p=7] ) % 8 = 0 !
    perform_test(chunkManager, 10, [28], done);
  });

  it('should transform a 32 bytes message into two 28 bytes chunks', function (done) {
    //
    // 1234567890123456890123456789012
    //       12345678901234567
    // HHHHSSDDDDDDDDDDDDDDDDDPSSSS
    //     --------++++++++--------
    // +-------+---------------+---------------+-------------+-------+
    // |Header |SequenceHeader | data          | paddingByte | sign  |
    // +-------+---------------+---------------+-------------+-------+
    // |   4   |   2           |  17           | 1 + 0       |  4    | => 4 +  ( 2+ 17 + 1 + 0 + 4 ) = 4 + 24 = 28
    // +-------+---------------+---------------+-------------+-------+                (%8=0!)
    // |   4   |   2           |  15           | 1 + 2       |  4    | => 4 +  ( 2+ 15 + 1 + 2 + 4)  = 28
    // +-------+---------------+---------------+-------------+-------+
    //                            32
    perform_test(chunkManager, 32, [28, 28], done);
  });

  it('should transform a 64 bytes message into four 28 bytes chunks ', function (done) {
    // +-------+---------------+---------------+-------------+-------+
    // |Header |SequenceHeader | data          | paddingByte | sign  |
    // +-------+---------------+---------------+-------------+-------+
    // |   4   |   2           |  17           | 1 + 0       |  4    | => 4 +  ( 2+ 17 + 1 + 0 + 4 ) = 4 + 24 = 28
    // +-------+---------------+---------------+-------------+-------+                (%8=0!)
    // |   4   |   2           |  17           | 1 + 0       |  4    | => 4 +  ( 2+ 17 + 1 + 0 + 4 ) = 4 + 24 = 28
    // +-------+---------------+---------------+-------------+-------+                (%8=0!)
    // |   4   |   2           |  17           | 1 + 0       |  4    | => 4 +  ( 2+ 17 + 1 + 0 + 4 ) = 4 + 24 = 28
    // +-------+---------------+---------------+-------------+-------+                (%8=0!)
    // |   4   |   2           |  13           | 1 + 0       |  4    | => 4 +  ( 2+ 15 + 1 + 2 + 4)  = 28
    // +-------+---------------+---------------+-------------+-------+
    //                            64
    perform_test(chunkManager, 64, [28, 28, 28, 28], done);
  });

  it('should transform a 16 bytes message into a single chunk ', function (done) {
    // +-------+---------------+---------------+-------------+-------+
    // |Header |SequenceHeader | data          | paddingByte | sign  |
    // +-------+---------------+---------------+-------------+-------+
    // |   4   |   2           |  16           | 1 + 1       |  4    | => 4 +  ( 2+ 16 + 1 + 1 + 4 ) = 4 + 24 = 28
    // +-------+---------------+---------------+-------------+-------+                (%8=0!)
    perform_test(chunkManager, 16, [28], done);
  });

  it('should transform a 17 bytes message into a single chunk ', function (done) {
    // +-------+---------------+---------------+-------------+-------+
    // |Header |SequenceHeader | data          | paddingByte | sign  |
    // +-------+---------------+---------------+-------------+-------+
    // |   4   |   2           |  17           | 1 + 0       |  4    | => 4 +  ( 2+ 17 + 1 + 0 + 4 ) = 4 + 24 = 28
    // +-------+---------------+---------------+-------------+-------+                (%8=0!)
    perform_test(chunkManager, 17, [28], done);
  });

  it('should transform a 35 bytes message into a  chunk of 32 bytes followed by a chunk of 8 bytes', function (done) {
    // +-------+---------------+---------------+-------------+-------+
    // |Header |SequenceHeader | data          | paddingByte | sign  |
    // +-------+---------------+---------------+-------------+-------+
    // |   4   |   2           |  17           | 1 + 0       |  4    | => 4 +  ( 2+ 17 + 1 + 0 + 4 ) = 4 + 24 = 28
    // +-------+---------------+---------------+-------------+-------+                (%8=0!)
    // |   4   |   2           |  17           | 1 + 0       |  4    | => 4 +  ( 2+ 17 + 1 + 0 + 4 ) = 4 + 24 = 28
    // +-------+---------------+---------------+-------------+-------+                (%8=0!)
    // |   4   |   2           |  1            | 1 +  0      |  4    |=> 4 +  ( 2+ 1 + (1 + 0) + 4 ) = 4 + 8  = 12
    // +-------+---------------+---------------+-------------+-------+
    perform_test(chunkManager, 35, [28, 28, 12], done);
  });
});

describe('Chunk Manager Padding (chunk size 32 bytes, plainBlockSize 6 bytes ,cipherBlockSize 8 bytes )\n', function () {
  let chunkManager: ChunkManager;

  beforeEach(function () {
    chunkManager = new ChunkManager({
      chunkSize: 64,

      headerSize: 8,
      writeHeaderFunc: write_fake_header,

      sequenceHeaderSize: 8,
      writeSequenceHeaderFunc: write_fake_sequence_header,

      plainBlockSize: 6,
      cipherBlockSize: 8,
      encryptBufferFunc: fake_encrypt_buffer,

      signatureLength: 4,
      signBufferFunc: compute_fake_signature,
    });
    expect(chunkManager.chunkSize).toEqual(64);
    expect(chunkManager.maxBodySize).toEqual(29);
  });
  it('should transform a 1 byte message into a single chunk', function (done) {
    // +-------+---------------+---------------+-------------+-------+
    // |Header |SequenceHeader | data          | paddingByte | sign  |
    // +-------+---------------+---------------+-------------+-------+
    // |   8   |   8           |  1            | 1 +  0      |  4    |=> 8 +  ( 8 + 1 + (1 + 4) + 4 ) = 8 + 3*6
    // |       |               |               |             |       |   8 + 3*8 = 32
    // +-------+---------------+---------------+-------------+-------+
    const expected = [
      // 0102030405060708 0910111213141516 17 1819202122 23242526
      // 0102030405060708 0102030405060708 01 0102030405 01020304
      // aaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbb dd 0404040404 cccccccc"
      // 0102030405060708091011121314151617181920212223242526272829303132
      'aaaaaaaaaaaaaaaaDEbbbbbbbbbbbbDFDEbbbb00040404DFDE0404ccccccccDF',
    ];
    perform_test(chunkManager, 1, expected, done);
  });
  it('should transform a 2 byte message into a single chunk', function (done) {
    const expected = ['aaaaaaaaaaaaaaaaDEbbbbbbbbbbbbDFDEbbbb00010303DFDE0303ccccccccDF'];
    perform_test(chunkManager, 2, expected, done);
  });
  it('should transform a 3 byte message into a single chunk', function (done) {
    const expected = ['aaaaaaaaaaaaaaaaDEbbbbbbbbbbbbDFDEbbbb00010202DFDE0202ccccccccDF'];
    perform_test(chunkManager, 3, expected, done);
  });
  it('should transform a 4 byte message into a single chunk', function (done) {
    const expected = ['aaaaaaaaaaaaaaaaDEbbbbbbbbbbbbDFDEbbbb00010203DFDE0101ccccccccDF'];
    perform_test(chunkManager, 4, expected, done);
  });
  it('should transform a 5 byte message into a single chunk', function (done) {
    const expected = ['aaaaaaaaaaaaaaaaDEbbbbbbbbbbbbDFDEbbbb00010203DFDE0400ccccccccDF'];
    perform_test(chunkManager, 5, expected, done);
  });
  it('should transform a 6 byte message into a single chunk', function (done) {
    const expected = [
      'aaaaaaaaaaaaaaaaDEbbbbbbbbbbbbDFDEbbbb00010203DFDE040505050505DFDE0505ccccccccDF',
    ];
    perform_test(chunkManager, 6, expected, done);
  });
  it('should transform a 29 byte message into a single chunk', function (done) {
    const expected = [
      'aaaaaaaaaaaaaaaa' +
        'DEbbbbbbbbbbbbDF' +
        'DEbbbb00010203DF' +
        'DE040506070809DF' +
        'DE0A0B0C0D0E0FDF' +
        'DE101112131415DF' +
        'DE161718191A1BDF' +
        'DE1C00ccccccccDF',
    ];
    perform_test(chunkManager, 29, expected, done);
  });

  it('should transform a 30 byte message into a single chunk', function (done) {
    const expected = [
      'aaaaaaaaaaaaaaaa' +
        'DEbbbbbbbbbbbbDF' +
        'DEbbbb00010203DF' +
        'DE040506070809DF' +
        'DE0A0B0C0D0E0FDF' +
        'DE101112131415DF' +
        'DE161718191A1BDF' +
        'DE1C00ccccccccDF',
      'aaaaaaaaaaaaaaaa' + 'DEbbbbbbbbbbbbDF' + 'DEbbbb1d040404DF' + 'DE0404ccccccccDF',
    ];
    perform_test(chunkManager, 30, expected, done);
  });
});
