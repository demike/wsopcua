import { vi } from 'vitest';

import { OPCUAClient } from '../client/opcua_client';
import {
  DEFAULT_CLIENT_OPTIONS,
  E2ETestController,
  getE2ETestController,
  OPCUA_TEST_SERVER_URI,
} from './utils/test_server_controller';

/**
 * End to end coverage of the client side teardown performed by
 * OPCUAClientBase#disconnect(), against a real server.
 *
 * It records what actually reaches the wire, and what happens to the WebSocket
 * the client opened, once disconnect() has resolved. Expected, per OPC UA
 * Part 6 5.5.2 - the client closes a SecureChannel by sending a
 * CloseSecureChannelRequest and then closing the socket gracefully:
 *
 *   - a CloseSecureChannelRequest ('CLO') is written to the socket
 *   - the socket reaches CLOSED as part of disconnect()
 *   - no warning is emitted
 *
 * These used to be the exact opposite. ClientSecureChannelLayer#close() marked
 * the transport as disconnecting *before* starting the CLO transaction, which
 * makes WSTransport#isValid() false, so the isValid() guard in
 * _performMessageTransaction() rejected the CLO with
 * 'ClientSecureChannelLayer => Socket is closed !' before it ever reached the
 * wire - and nothing closed the socket either, because WSTransport#disconnect()
 * holds the only WebSocket#close() call on the normal path and was never
 * reached. Measured before the fix: the socket was still OPEN three security
 * token lifetimes after disconnect() had resolved.
 */

/** OPC UA binary messages start with a 3 byte ASCII message type: 'HEL', 'OPN', 'MSG', 'CLO', ... */
function messageTypeOf(data: unknown): string {
  if (typeof data === 'string') {
    // the 'opcua+uajson' encoding has no binary message header
    return data.includes('CloseSecureChannelRequest') ? 'CLO' : 'JSON';
  }
  const bytes = ArrayBuffer.isView(data as ArrayBufferView)
    ? new Uint8Array(
        (data as ArrayBufferView).buffer,
        (data as ArrayBufferView).byteOffset,
        (data as ArrayBufferView).byteLength
      )
    : new Uint8Array(data as ArrayBuffer);
  return String.fromCharCode(bytes[0], bytes[1], bytes[2]);
}

/**
 * the live WebSocket of a connected client.
 * has to be captured *before* disconnect(), which detaches the secure channel
 * from the client (OPCUAClientBase#_destroy_secure_channel).
 */
function getSocket(client: OPCUAClient): WebSocket {
  const socket = (client as any)._secureChannel?._transport?._socket as WebSocket | undefined;
  if (!socket) {
    throw new Error('client is not connected: there is no WebSocket to observe');
  }
  return socket;
}

/**
 * records the message type of every frame the client hands to the socket.
 * only the instance method is wrapped, so the library's send path is untouched.
 */
function recordSentMessageTypes(socket: WebSocket): string[] {
  const sent: string[] = [];
  const originalSend = socket.send.bind(socket);
  socket.send = function (data: Parameters<WebSocket['send']>[0]) {
    sent.push(messageTypeOf(data));
    return originalSend(data);
  };
  return sent;
}

/**
 * resolves with the time the socket took to reach CLOSED, or null when it was
 * still open after `windowMs`.
 * uses addEventListener so the transport's own onclose handler keeps working.
 */
function waitForClose(socket: WebSocket, windowMs: number): Promise<number | null> {
  if (socket.readyState === WebSocket.CLOSED) {
    return Promise.resolve(0);
  }
  const start = Date.now();
  return new Promise<number | null>((resolve) => {
    let timer = 0;
    const onClose = () => {
      window.clearTimeout(timer);
      socket.removeEventListener('close', onClose);
      resolve(Date.now() - start);
    };
    timer = window.setTimeout(() => {
      socket.removeEventListener('close', onClose);
      resolve(null);
    }, windowMs);
    socket.addEventListener('close', onClose);
  });
}

// short enough for the server to reclaim the abandoned channel within the test,
// long enough that the client is not busy renewing the token throughout it
const SHORT_TOKEN_LIFETIME = 2000;
const OBSERVATION_WINDOW = 3 * SHORT_TOKEN_LIFETIME;

describe('Client disconnect teardown', function () {
  let controller: E2ETestController;

  beforeEach(async () => {
    controller = getE2ETestController();
    await controller.startTestServer();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await controller.stopTestServer();
  });

  function createClient(options: Record<string, unknown> = {}) {
    return new OPCUAClient({ ...DEFAULT_CLIENT_OPTIONS, ...options });
  }

  it('TDT-1 should write a CLO and close the WebSocket on disconnect', async () => {
    const client = createClient({ defaultSecureTokenLifetime: SHORT_TOKEN_LIFETIME });
    await client.connectP(OPCUA_TEST_SERVER_URI);
    const session = await client.createSessionP(null);

    const socket = getSocket(client);
    expect(socket.readyState).toBe(WebSocket.OPEN);

    const sent = recordSentMessageTypes(socket);

    await session.closeP();
    await client.disconnectP();

    // the session level teardown reaches the server ...
    expect(sent).toContain('MSG');
    // ... and so does the channel level one
    expect(sent).toContain('CLO');
    // in that order: the channel has to stay usable until the session is closed
    expect(sent.indexOf('CLO')).toBeGreaterThan(sent.indexOf('MSG'));
    // and the CLO is the last thing written before the socket goes down
    expect(sent[sent.length - 1]).toBe('CLO');

    // disconnect() has resolved, so the socket it opened is gone
    expect(socket.readyState).toBe(WebSocket.CLOSED);

    // nothing left to wait for: closing is part of disconnect(), not something
    // the server has to time out. Phrased as a string so that a regression
    // reports the measured delay instead of a bare `false`.
    const closedAfterMs = await waitForClose(socket, OBSERVATION_WINDOW);
    expect(closedAfterMs === null ? 'still OPEN' : 'closed').toBe('closed');
  }, 25000);

  it('TDT-2 should leave no open WebSocket behind after connect/disconnect cycles', async () => {
    const CYCLES = 3;
    const sockets: WebSocket[] = [];

    for (let i = 0; i < CYCLES; i++) {
      const client = createClient();
      await client.connectP(OPCUA_TEST_SERVER_URI);
      sockets.push(getSocket(client));
      await client.disconnectP();
    }

    expect(sockets).toHaveLength(CYCLES);

    // a page that reconnects in a loop must not accumulate open connections:
    // a browser allows only a limited number of them per host.
    expect(sockets.map((socket) => socket.readyState)).toEqual(sockets.map(() => WebSocket.CLOSED));
  }, 25000);

  it('TDT-3 should not warn while disconnecting', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const client = createClient();
    await client.connectP(OPCUA_TEST_SERVER_URI);
    await client.disconnectP();

    // the reported symptom: close() used to log the rejected CLO transaction
    const warnings = warn.mock.calls.map((args) => args.join(' ')).join('\n');
    expect(warnings).not.toContain('CLO transaction terminated with error');
    expect(warnings).not.toContain('Socket is closed !');
  }, 25000);
});
