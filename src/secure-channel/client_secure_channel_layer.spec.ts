import { vi } from 'vitest';

import { ClientSecureChannelLayer } from './client_secure_channel_layer';
import { GetEndpointsRequest } from '../generated/GetEndpointsRequest';

function makeRequestMessage() {
  return {
    requestHeader: {
      timeoutHint: 0,
      requestHandle: 0,
      toString: () => 'FakeRequestHeader',
    },
  } as any;
}

/**
 * make the channel believe it is connected, without involving any transport
 */
function fakeConnectedChannel(secureChannel: ClientSecureChannelLayer) {
  vi.spyOn(secureChannel, 'isValid').mockReturnValue(true);
  (secureChannel as any)._transport = { name: 'fake transport' };
  // _sendSecureOpcUARequest is async: the caller attaches a rejection handler
  vi.spyOn(secureChannel as never, '_sendSecureOpcUARequest').mockImplementation(() =>
    Promise.resolve()
  );
}

describe('ClientSecureChannelLayer', function () {
  beforeEach(function () {
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(function () {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should time out requests without dereferencing an undefined request message', function () {
    const secureChannel = new ClientSecureChannelLayer({
      encoding: 'opcua+uacp',
      defaultTransactionTimeout: 1,
    });
    const callback = vi.fn();
    const timedOutRequest = vi.fn();
    const requestMessage = {
      requestHeader: {
        timeoutHint: 0,
        toString: () => 'FakeRequestHeader',
      },
    } as any;

    secureChannel.on('timed_out_request', timedOutRequest);

    vi.spyOn(secureChannel, 'isValid').mockReturnValue(true);
    vi.spyOn(secureChannel as never, '_internal_perform_transaction').mockImplementation(() => {});

    (secureChannel as any)._performMessageTransaction('MSG', requestMessage, callback);

    vi.advanceTimersByTime(ClientSecureChannelLayer.minTransactionTimeout);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(callback.mock.calls[0][0]?.message).toContain('Transaction has timed out');
    expect(callback.mock.calls[0][1]).toBeUndefined();
    expect(timedOutRequest).toHaveBeenCalledWith(requestMessage);
  });

  it('should report an error instead of throwing when the request message is invalid', function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    const callback = vi.fn();

    vi.spyOn(secureChannel, 'isValid').mockReturnValue(true);

    expect(() =>
      (secureChannel as any)._performMessageTransaction('MSG', undefined, callback)
    ).not.toThrow();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]?.message).toContain('invalid request message');
  });

  it('should cancel pending transaction timers when the channel is disposed', function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    const callback = vi.fn();
    const timedOutRequest = vi.fn();

    secureChannel.on('timed_out_request', timedOutRequest);
    fakeConnectedChannel(secureChannel);

    (secureChannel as any)._performMessageTransaction('MSG', makeRequestMessage(), callback);
    expect(secureChannel.isTransactionInProgress()).toBe(true);

    secureChannel.dispose();

    expect(secureChannel.isTransactionInProgress()).toBe(false);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toBeInstanceOf(Error);

    vi.advanceTimersByTime(2 * ClientSecureChannelLayer.minTransactionTimeout);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(timedOutRequest).not.toHaveBeenCalled();
  });

  it('should not re-enter transaction cancellation when a callback disposes the channel', function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    const callback = vi.fn(() => secureChannel.dispose());

    fakeConnectedChannel(secureChannel);

    (secureChannel as any)._performMessageTransaction('MSG', makeRequestMessage(), callback);

    expect(() => secureChannel.dispose()).not.toThrow();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not invoke a transaction callback twice when the transport closes after a cancellation', function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    const callback = vi.fn();

    fakeConnectedChannel(secureChannel);

    (secureChannel as any)._performMessageTransaction('MSG', makeRequestMessage(), callback);

    const done = vi.fn();
    secureChannel.cancelPendingTransactions(done);
    expect(done).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);

    (secureChannel as any)._on_transport_closed(new Error('Connection Break'));

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// chunk serialization
// ---------------------------------------------------------------------------

// MSG chunk layout (security mode None):
//   [0..2]   messageType         'MSG'
//   [3]      isFinal             'C' | 'F' | 'A'
//   [4..7]   messageSize
//   [8..11]  secureChannelId
//   [12..15] symmetric security header (tokenId)
//   [16..19] sequenceNumber
//   [20..23] requestId
const SEQUENCE_HEADER_OFFSET = 12 + 4;

interface ParsedChunk {
  msgType: string;
  isFinal: string;
  sequenceNumber: number;
  requestId: number;
}

function parseChunk(chunk: ArrayBufferLike | ArrayBufferView): ParsedChunk {
  const bytes = ArrayBuffer.isView(chunk)
    ? new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength)
    : new Uint8Array(chunk);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return {
    msgType: String.fromCharCode(bytes[0], bytes[1], bytes[2]),
    isFinal: String.fromCharCode(bytes[3]),
    sequenceNumber: view.getUint32(SEQUENCE_HEADER_OFFSET, true),
    requestId: view.getUint32(SEQUENCE_HEADER_OFFSET + 4, true),
  };
}

/**
 * attach a transport that records every chunk handed to it, so that the exact
 * byte order the server would observe can be asserted on.
 */
function attachRecordingTransport(secureChannel: ClientSecureChannelLayer, sendBufferSize: number) {
  const chunks: ParsedChunk[] = [];
  vi.spyOn(secureChannel, 'isValid').mockReturnValue(true);
  (secureChannel as any)._transport = {
    name: 'recording transport',
    parameters: { sendBufferSize },
    write: (chunk: ArrayBufferLike | ArrayBufferView) => {
      chunks.push(parseChunk(chunk));
    },
  };
  return chunks;
}

/** a request whose encoded size is driven by a single string field */
function makeSizedRequest(payloadSize: number) {
  return new GetEndpointsRequest({ endpointUrl: 'x'.repeat(payloadSize) }) as any;
}

async function waitForFinalChunks(
  chunks: ParsedChunk[],
  expectedMessages: number,
  timeoutMs = 2000
) {
  const start = Date.now();
  while (chunks.filter((chunk) => chunk.isFinal === 'F').length < expectedMessages) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(
        `timed out waiting for ${expectedMessages} messages, got ` +
          chunks.map((chunk) => `${chunk.requestId}${chunk.isFinal}`).join(' ')
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

/** split the recorded chunk stream at every non-intermediate ('C') chunk */
function splitIntoMessages(chunks: ParsedChunk[]): ParsedChunk[][] {
  const messages: ParsedChunk[][] = [];
  let current: ParsedChunk[] = [];
  for (const chunk of chunks) {
    current.push(chunk);
    if (chunk.isFinal !== 'C') {
      messages.push(current);
      current = [];
    }
  }
  if (current.length > 0) {
    messages.push(current);
  }
  return messages;
}

describe('ClientSecureChannelLayer - chunk serialization', function () {
  beforeEach(function () {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(function () {
    vi.restoreAllMocks();
  });

  it('should not interleave the chunks of concurrent requests', async function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    // a small send buffer forces every request to be split over several chunks
    const chunks = attachRecordingTransport(secureChannel, 256);

    // two transactions started back to back, exactly as two parallel service
    // calls would do
    (secureChannel as any)._performMessageTransaction('MSG', makeSizedRequest(2000), vi.fn());
    (secureChannel as any)._performMessageTransaction('MSG', makeSizedRequest(2000), vi.fn());

    await waitForFinalChunks(chunks, 2);

    const messages = splitIntoMessages(chunks);
    expect(messages).toHaveLength(2);

    // OPC UA Part 6 6.7.2: all chunks of a Message must be sent contiguously on
    // a SecureChannel. A server assembling a single input stream per channel
    // rejects a chunk whose requestId does not match the stream in progress.
    for (const message of messages) {
      const requestIds = [...new Set(message.map((chunk) => chunk.requestId))];
      expect(requestIds).toHaveLength(1);
      expect(message.length).toBeGreaterThan(1); // otherwise the test proves nothing
      expect(message[message.length - 1].isFinal).toBe('F');
    }

    // and the two messages are distinct requests, sent in the order they were queued
    expect(messages[0][0].requestId).toBeLessThan(messages[1][0].requestId);
  });

  it('should emit strictly consecutive sequence numbers across concurrent requests', async function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    const chunks = attachRecordingTransport(secureChannel, 256);

    for (let i = 0; i < 4; i++) {
      (secureChannel as any)._performMessageTransaction('MSG', makeSizedRequest(1000), vi.fn());
    }

    await waitForFinalChunks(chunks, 4);

    const sequenceNumbers = chunks.map((chunk) => chunk.sequenceNumber);
    const expected = sequenceNumbers.map((_, index) => sequenceNumbers[0] + index);
    expect(sequenceNumbers).toEqual(expected);
  });

  it('should not write a request that was cancelled while queued behind another one', async function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    const chunks = attachRecordingTransport(secureChannel, 256);

    const cancelled = vi.fn();
    (secureChannel as any)._performMessageTransaction('MSG', makeSizedRequest(2000), vi.fn());
    (secureChannel as any)._performMessageTransaction('MSG', makeSizedRequest(2000), cancelled);

    // dispose while the first request is still being chunked
    secureChannel.dispose();

    await waitForFinalChunks(chunks, 1);
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(cancelled).toHaveBeenCalledTimes(1);
    expect(cancelled.mock.calls[0][0]).toBeInstanceOf(Error);

    const requestIds = [...new Set(chunks.map((chunk) => chunk.requestId))];
    expect(requestIds).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// close / CloseSecureChannelRequest
// ---------------------------------------------------------------------------

interface FakeTransport {
  name: string;
  parameters: { sendBufferSize: number };
  disconnecting: boolean;
  markDisconnecting(): void;
  isValid(): boolean;
  disconnect(callback: () => void): void;
  write(chunk: ArrayBufferLike | ArrayBufferView): void;
}

/**
 * a transport that reproduces the part of ClientWSTransport that matters here:
 * isValid() turns false as soon as the transport is marked as disconnecting.
 * The channel's real isValid() is therefore exercised - that is the guard which
 * used to reject the CloseSecureChannelRequest before it reached the wire.
 *
 * Every write and the transport disconnect are appended to a single list, so
 * that their relative order can be asserted.
 */
function attachFakeTransport(secureChannel: ClientSecureChannelLayer, sendBufferSize = 8192) {
  const events: string[] = [];
  const transport: FakeTransport = {
    name: 'fake transport',
    parameters: { sendBufferSize },
    disconnecting: false,
    markDisconnecting() {
      this.disconnecting = true;
    },
    isValid() {
      return !this.disconnecting;
    },
    disconnect(callback: () => void) {
      events.push('disconnect');
      this.disconnecting = true;
      callback();
    },
    write(chunk: ArrayBufferLike | ArrayBufferView) {
      events.push(parseChunk(chunk).msgType);
    },
  };
  (secureChannel as any)._transport = transport;
  return { transport, events };
}

const tick = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const GRACE = ClientSecureChannelLayer.closeSecureChannelResponseGraceTime;

describe('ClientSecureChannelLayer - close', function () {
  afterEach(function () {
    vi.restoreAllMocks();
  });

  it('should send a CloseSecureChannelRequest before taking the transport down', async function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    const { events } = attachFakeTransport(secureChannel);

    const closed = vi.fn();
    secureChannel.close(closed);
    await tick(4 * GRACE);

    // OPC UA Part 6 5.5.2: the client closes a SecureChannel by sending a
    // CloseSecureChannelRequest and then closing the socket gracefully.
    expect(events).toEqual(['CLO', 'disconnect']);
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('should complete the close transaction without waiting for a response', async function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    attachFakeTransport(secureChannel);

    const closed = vi.fn();
    secureChannel.close(closed);

    // deliberately still pending: the server is given a grace period to answer
    await tick(0);
    expect(closed).not.toHaveBeenCalled();

    // most servers never answer a CLO. Completing the transaction locally is
    // what keeps close() from stalling for minTransactionTimeout (30s).
    await tick(4 * GRACE);
    expect(closed).toHaveBeenCalledTimes(1);
    expect(secureChannel.isTransactionInProgress()).toBe(false);
  });

  it('should not warn when the channel closes normally', async function () {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    attachFakeTransport(secureChannel);

    await new Promise<void>((resolve) => secureChannel.close(() => resolve()));

    expect(warn).not.toHaveBeenCalled();
  });

  it('should invoke the close callback once when the server does answer the CLO', async function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    attachFakeTransport(secureChannel);

    const closed = vi.fn();
    secureChannel.close(closed);

    // some servers do send a CloseSecureChannelResponse, which completes the
    // transaction before the grace period elapses
    const request_data = [...(secureChannel as any)._request_data.values()][0];
    expect(request_data.msgType).toBe('CLO');
    (secureChannel as any).process_request_callback(request_data, null, null);

    await tick(4 * GRACE);
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('should report a disconnected transport instead of sending a CLO', async function () {
    const secureChannel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    const { transport, events } = attachFakeTransport(secureChannel);
    transport.markDisconnecting();

    const closed = vi.fn();
    await new Promise<void>((resolve) =>
      secureChannel.close((err) => {
        closed(err);
        resolve();
      })
    );

    expect(closed).toHaveBeenCalledTimes(1);
    expect(closed.mock.calls[0][0]?.message).toContain('Transport disconnected');
    expect(events).toEqual([]);
  });
});
