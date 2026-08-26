import { MessageChunker } from './message_chunker';
import { GetEndpointsRequest } from '../generated/GetEndpointsRequest';
import { SecureMessageChunkManagerOptions } from './secure_message_chunk_manager';
import { ISymmetricAlgortihmSecurityHeader } from '../service-secure-channel/SymmetricAlgorithmSecurityHeader';

function makeOptions(
  requestId: number
): SecureMessageChunkManagerOptions & ISymmetricAlgortihmSecurityHeader {
  return {
    requestId,
    secureChannelId: 1,
    tokenId: 1,
    chunkSize: 256,
    cipherBlockSize: 0,
    plainBlockSize: 0,
    sequenceHeaderSize: 0,
    signatureLength: 0,
  } as SecureMessageChunkManagerOptions & ISymmetricAlgortihmSecurityHeader;
}

describe('MessageChunker', function () {
  // ClientSecureChannelLayer relies on this promise to know when it is safe to
  // start chunking the next message on the same channel. If it settled before
  // the last chunk was handed over, chunks of consecutive messages would
  // interleave again.
  it('should resolve only after the final chunk callback has been invoked', async function () {
    const chunker = new MessageChunker({});
    const events: string[] = [];

    // 2000 bytes of payload over a 256 byte chunk size => several chunks
    await chunker.chunkSecureMessage(
      'MSG',
      makeOptions(1),
      new GetEndpointsRequest({ endpointUrl: 'x'.repeat(2000) }) as any,
      (chunk) => {
        events.push(chunk ? 'chunk' : 'end');
      }
    );

    const countAtResolution = events.length;
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(events.length).toBe(countAtResolution);
    expect(events.filter((event) => event === 'chunk').length).toBeGreaterThan(1);
    expect(events.filter((event) => event === 'end')).toEqual(['end']);
    expect(events[events.length - 1]).toBe('end');
  });

  it('should keep sequence numbers contiguous across successive messages', async function () {
    const chunker = new MessageChunker({});
    const sequenceNumbers: number[] = [];
    const readSequenceNumber = (chunk: ArrayBufferLike | ArrayBufferView) => {
      const bytes = ArrayBuffer.isView(chunk)
        ? new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength)
        : new Uint8Array(chunk);
      // 12 byte message header + 4 byte symmetric security header
      sequenceNumbers.push(new DataView(bytes.buffer, bytes.byteOffset).getUint32(16, true));
    };

    for (const requestId of [1, 2]) {
      await chunker.chunkSecureMessage(
        'MSG',
        makeOptions(requestId),
        new GetEndpointsRequest({ endpointUrl: 'x'.repeat(1000) }) as any,
        (chunk) => {
          if (chunk) {
            readSequenceNumber(chunk);
          }
        }
      );
    }

    expect(sequenceNumbers.length).toBeGreaterThan(2);
    expect(sequenceNumbers).toEqual(sequenceNumbers.map((_, index) => sequenceNumbers[0] + index));
  });
});
