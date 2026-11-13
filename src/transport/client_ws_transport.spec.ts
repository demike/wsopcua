'use strict';

import { vi, Mock } from 'vitest';
import { AcknowledgeMessage } from './AcknowledgeMessage';
import { assert } from '../assert';
import { packTcpMessage } from './tools';
import { TCPErrorMessage } from './TCPErrorMessage';
import { StatusCode } from '../basic-types/status_code';
import { debugLog, hexDump } from '../common/debug';
import {
  installMockWebSocket,
  uninstallMockWebSocket,
  WebSocketMock,
} from './test_helpers/mock_web_socket';
import { ClientWSTransport } from './client_ws_transport';
import { setFakeTransport, getFakeTransport, WSTransport } from './ws_transport';
import { StatusCodes } from '../constants/raw_status_codes';

import 'setimmediate';

describe('testing ClientWS_transport', function () {
  let transport: ClientWSTransport;
  let spyOnClose: Mock, spyOnConnect: Mock, spyOnConnectionBreak: Mock;

  let fakeWS: WebSocketMock;
  const url = 'ws://localhost:3456';

  beforeEach(async function () {
    transport = new ClientWSTransport('opcua+uacp');
    installMockWebSocket();
    setFakeTransport(new WebSocket(url));
    fakeWS = getFakeTransport();

    spyOnClose = vi.fn();
    transport.on('close', spyOnClose);

    spyOnConnect = vi.fn();
    transport.on('connect', spyOnConnect);

    spyOnConnectionBreak = vi.fn();
    transport.on('connection_break', spyOnConnectionBreak);
  });

  afterEach(async function () {
    vi.useRealTimers();
    uninstallMockWebSocket();
    await new Promise<void>((resolve) => {
      transport.disconnect(function () {
        resolve();
      });
    });
  });

  const fakeAcknowledgeMessage = new AcknowledgeMessage({
    protocolVersion: 0,
    receiveBufferSize: 8192,
    sendBufferSize: 8192,
    maxMessageSize: 100000,
    maxChunkCount: 600000,
  });

  it('should create and connect to a client TCP', async function () {
    await new Promise<void>((resolve) => {
      transport.connect(url, function (err) {
        expect(spyOnConnect.mock.calls.length).toBe(1);
        expect(spyOnClose.mock.calls.length).toBe(0);
        expect(spyOnConnectionBreak.mock.calls.length).toBe(0);

        transport.disconnect(function () {
          expect(spyOnConnect.mock.calls.length).toBe(1);
          expect(spyOnClose.mock.calls.length).toBe(1);
          expect(spyOnConnectionBreak.mock.calls.length).toBe(0);
          resolve();
        });
      });

      const sock: WebSocketMock = (transport as any)._socket;
      sock._open();
      // send Fake ACK response
      sock._message(packTcpMessage('ACK', fakeAcknowledgeMessage));
    });
  });

  it('should throw an exception when specifying an invalid protocol', function () {
    let exc = null;
    //   expect( () => {
    try {
      transport.connect('invalid://hohoho', function (err) {});
    } catch (e) {
      exc = e;
    }
    expect(exc).not.toBeNull();

    try {
      transport.connect('fake://hohoho', function (err) {});
    } catch (e) {
      exc = e;
    }
    expect(exc).not.toBeNull();
  });

  it('should report a time out error if trying to connect to a non responding server', async function () {
    transport.timeout = 10; // very short timeout;

    await new Promise<void>((resolve) => {
      transport.connect(url, function (err) {
        if (err) {
          expect(err.message).toContain('Timeout');

          expect(spyOnConnect.mock.calls.length).toBe(0);
          expect(spyOnClose.mock.calls.length).toBe(0);
          expect(spyOnConnectionBreak.mock.calls.length).toBe(0);
          resolve();
        } else {
          throw new Error('Should have raised a timeout error');
          // done();
        }
      });

      (transport as any)._socket._open();
      // DO NOTHING !!
    });
  });

  function expectHelAckFailureToCloseDetachedSocket(
    mockSocket: WebSocketMock,
    connectCallback: Mock,
    spyOnSocketClosed: Mock,
    socketWhenCalledBack: WebSocketMock | null | undefined
  ) {
    expect(connectCallback).toHaveBeenCalledTimes(1);
    expect(connectCallback.mock.calls[0][0]).toBeInstanceOf(Error);
    // the client closes the socket itself ...
    expect(mockSocket.close).toHaveBeenCalledTimes(1);
    expect(mockSocket.close).toHaveBeenCalledWith(1000, 'OPC-UA: HELLO - ACK failed');
    expect(mockSocket.close.mock.invocationCallOrder[0]).toBeLessThan(
      connectCallback.mock.invocationCallOrder[0]
    );
    expect(socketWhenCalledBack).toBeNull();
    // ... after detaching it, so that close is not handled like a close by the server
    expect(spyOnSocketClosed).not.toHaveBeenCalled();
    expect(transport.disconnecting).toBe(false);
    expect(spyOnConnect).not.toHaveBeenCalled();
    expect(spyOnClose).not.toHaveBeenCalled();
    expect(spyOnConnectionBreak).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  }

  function startHelAckTransaction() {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const spyOnSocketClosed = vi.fn();
    transport.on('socket_closed', spyOnSocketClosed);
    const result = {
      spyOnSocketClosed,
      socketWhenCalledBack: undefined as WebSocketMock | null | undefined,
      connectCallback: vi.fn(() => {
        result.socketWhenCalledBack = (transport as any)._socket;
      }),
      mockSocket: undefined as unknown as WebSocketMock,
    };
    transport.connect(url, result.connectCallback);
    result.mockSocket = (transport as any)._socket;
    result.mockSocket._open();
    return result;
  }

  it('should detach the socket before closing it when the HEL/ACK transaction times out', function () {
    transport.timeout = 100;
    const hel = startHelAckTransaction();

    vi.advanceTimersByTime(transport.timeout);

    expect(hel.connectCallback.mock.calls[0]?.[0]?.message).toMatch(/Timeout/);
    expectHelAckFailureToCloseDetachedSocket(
      hel.mockSocket,
      hel.connectCallback,
      hel.spyOnSocketClosed,
      hel.socketWhenCalledBack
    );
  });

  it('should detach and close the socket when the server answers the HEL with an ERR', function () {
    const hel = startHelAckTransaction();

    hel.mockSocket._message(
      packTcpMessage('ERR', makeError(StatusCodes.BadProtocolVersionUnsupported))
    );

    expect(hel.connectCallback.mock.calls[0]?.[0]?.message).toMatch(/ACK: ERR received/);
    expectHelAckFailureToCloseDetachedSocket(
      hel.mockSocket,
      hel.connectCallback,
      hel.spyOnSocketClosed,
      hel.socketWhenCalledBack
    );
  });

  it('should detach and close the socket when the server answers the HEL with an invalid ACK', function () {
    const hel = startHelAckTransaction();

    const ack = packTcpMessage('ACK', fakeAcknowledgeMessage);
    // a non-final chunk is not a valid ACK
    new Uint8Array(ack)[3] = 'C'.charCodeAt(0);
    hel.mockSocket._message(ack);

    expect(hel.connectCallback.mock.calls[0]?.[0]?.message).toMatch(/invalid ACK message/);
    expectHelAckFailureToCloseDetachedSocket(
      hel.mockSocket,
      hel.connectCallback,
      hel.spyOnSocketClosed,
      hel.socketWhenCalledBack
    );
  });

  it('should report an error if the server close the socket unexpectedly after the websocket connection was established', function () {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const connectCallback = vi.fn();
    transport.connect(url, connectCallback);

    const mockSocket: WebSocketMock = (transport as any)._socket;
    mockSocket._open();
    // received Fake HEL Message
    // Pretend the message is malformed or that the server crashed for some reason : abort now !
    mockSocket._error(1000);
    // the close event immediately follows the error event
    mockSocket._close(1000);

    expect(connectCallback).toHaveBeenCalledTimes(1);
    expect(connectCallback.mock.calls[0][0]?.message).toMatch(
      /Connection aborted - ended by server/
    );
    expect(spyOnConnect).not.toHaveBeenCalled();
    expect(spyOnClose).not.toHaveBeenCalled();
    expect(spyOnConnectionBreak).not.toHaveBeenCalled();
    // the HEL/ACK timer must have been cancelled, not left to fire later
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should report an error if the server close the socket unexpectedly', async function () {
    transport.timeout = 100; // very short timeout;

    await new Promise<void>((resolve) => {
      transport.connect(url, function (err) {
        if (err) {
          expect(err.message).toContain('failed to connect');

          expect(spyOnConnect.mock.calls.length).toBe(0);
          expect(spyOnClose.mock.calls.length).toBe(0);
          expect(spyOnConnectionBreak.mock.calls.length).toBe(0);

          resolve();
        } else {
          throw new Error('Should have raised a connection error');
          // done();
        }
      });

      // received Fake HEL Message
      // Pretend the message is malformed or that the server crashed for some reason : abort now !
      const mockSocket: WebSocketMock = (transport as any)._socket;
      mockSocket._error(1006);
      // the close event fires immediately after the error event
      mockSocket._close(1006);
    });
  });

  it('should report an error if the server closes the socket abnormally during the HEL/ACK transaction', function () {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const spyOnSocketClosed = vi.fn();
    transport.on('socket_closed', spyOnSocketClosed);
    let socketWhenCalledBack: WebSocketMock | null | undefined;
    const connectCallback = vi.fn(() => {
      socketWhenCalledBack = (transport as any)._socket;
    });
    transport.connect(url, connectCallback);

    const mockSocket: WebSocketMock = (transport as any)._socket;
    // the websocket opens and the HEL is sent, e.g. a proxy accepts the connection ...
    mockSocket._open();
    // ... but drops it before an ACK arrives, as its upstream is down (1006: abnormal closure)
    mockSocket._error(1006);
    mockSocket._close(1006);

    expect(connectCallback).toHaveBeenCalledTimes(1);
    expect(connectCallback.mock.calls[0][0]?.message).toMatch(/ERROR IN SOCKET/);
    expect(spyOnConnect).not.toHaveBeenCalled();
    expect(spyOnClose).not.toHaveBeenCalled();
    expect(spyOnConnectionBreak).not.toHaveBeenCalled();
    // the connect callback runs last, after socket_closed, with the dead socket already detached ...
    expect(spyOnSocketClosed).toHaveBeenCalledTimes(1);
    expect(spyOnSocketClosed.mock.invocationCallOrder[0]).toBeLessThan(
      connectCallback.mock.invocationCallOrder[0]
    );
    expect(socketWhenCalledBack).toBeNull();
    // ... so the failed HEL/ACK does not try to close it again
    expect(mockSocket.close).not.toHaveBeenCalled();
    // the HEL/ACK timer must have been cancelled, not left to fire later
    expect(vi.getTimerCount()).toBe(0);
  });

  function makeError(statusCode: StatusCode) {
    assert(statusCode instanceof StatusCode);
    return new TCPErrorMessage({ statusCode: statusCode, reason: statusCode.description });
  }

  it('should report an error if the server reports a protocol version mismatch', async function () {
    transport.timeout = 1000; // very short timeout;

    await new Promise<void>((resolve) => {
      transport.connect(url, function (err) {
        if (err) {
          expect(err.message).toMatch(/The applications do not have compatible protocol versions/);

          expect(spyOnConnect.mock.calls.length).toBe(0);
          expect(spyOnClose.mock.calls.length).toBe(0);
          expect(spyOnConnectionBreak.mock.calls.length).toBe(0);

          resolve();
        } else {
          throw new Error('transport.connect should have raised a connection error');
          // done();
        }
      });

      const sock: WebSocketMock = (transport as any)._socket;
      sock._open();
      // Pretend the protocol version is wrong.
      const errorResponse = makeError(StatusCodes.BadProtocolVersionUnsupported);
      const messageChunk = packTcpMessage('ERR', errorResponse);
      sock._message(messageChunk);
    });
  });

  it('should connect and forward subsequent message chunks after a valid HEL/ACK transaction', async function () {
    // lets build the subsequent message
    const message1 = new DataView(new ArrayBuffer(10));
    message1.setUint32(0, 0xdeadbeef, false);
    message1.setUint32(4, 0xfefefefe, false);
    message1.setUint16(8, 0xffff, false);

    transport.timeout = 1000; // very short timeout;

    await new Promise<void>((resolve) => {
      transport.on('message', function (message_chunk) {
        assert(message_chunk instanceof DataView);
        debugLog(hexDump(message_chunk));
        expect(new DataView(message_chunk.buffer, 8)).toEqual(message1);

        expect(spyOnConnect.mock.calls.length).toBe(1);
        expect(spyOnClose.mock.calls.length).toBe(0);
        expect(spyOnConnectionBreak.mock.calls.length).toBe(0);

        resolve();
      });

      transport.connect(url, function (err) {
        if (err) {
          console.log(' err = ', err.message);
        }
        assert(!err);
        const buffer = transport.createChunk('MSG', 'F', message1.byteLength);
        new Uint8Array(buffer).set(new Uint8Array(message1.buffer), transport.headerSize);
        transport.write(buffer);
      });

      const sock: WebSocketMock = (transport as any)._socket;
      sock._open();

      // send Fake ACK response
      sock._message(packTcpMessage('ACK', fakeAcknowledgeMessage));

      // let's receife a message1
      const buf = transport.createChunk('MSG', 'F', message1.byteLength);
      new Uint8Array(buf).set(new Uint8Array(message1.buffer), transport.headerSize);
      sock._message(buf);
    });
  });

  it('should close the socket and emit a close event when disconnect() is called', async function () {
    const counter = 1;

    let server_confirms_that_server_socket_has_been_closed = false;
    let transport_confirms_that_close_event_has_been_processed = false;

    transport.timeout = 1000; // very short timeout;

    transport.on('close', function (err) {
      expect(
        transport_confirms_that_close_event_has_been_processed,
        'close event shall only be received once'
      ).toBe(false);
      transport_confirms_that_close_event_has_been_processed = true;
      expect(
        err,
        'close event shall have err===null, when disconnection is initiated by the client itself'
      ).toBe(null);
    });

    await new Promise<void>((resolve) => {
      transport.connect(url, function (err) {
        if (err) {
          console.log(' err = ', err.message);
        }
        assert(!err);
        expect(server_confirms_that_server_socket_has_been_closed).toBe(false);
        expect(transport_confirms_that_close_event_has_been_processed).toBe(false);
        transport.disconnect(function () {
          window.setImmediate(function () {
            expect(server_confirms_that_server_socket_has_been_closed).toBe(true);
            expect(transport_confirms_that_close_event_has_been_processed).toBe(true);
            resolve();
          });
        });
      });

      const sock: WebSocketMock = (transport as any)._socket;

      sock.addEventListener('close', () => {
        server_confirms_that_server_socket_has_been_closed = true;
      });

      sock._open();

      // send Fake ACK response
      sock._message(packTcpMessage('ACK', fakeAcknowledgeMessage));
    });
  });

  it('should dispose the socket and emit a close event when socket is closed by the other end', async function () {
    const counter = 1;

    let server_confirms_that_server_socket_has_been_closed = false;
    let transport_confirms_that_close_event_has_been_processed = false;

    transport.timeout = 1000; // very short timeout;

    await new Promise<void>((resolve) => {
      transport.on('close', function (err) {
        expect(
          transport_confirms_that_close_event_has_been_processed,
          'close event shall only be received once'
        ).toBe(false);

        transport_confirms_that_close_event_has_been_processed = true;

        expect(
          err instanceof Error,
          'the close event should pass a valid Error object because disconnection is caused by external event'
        ).toBe(true);
        expect(err?.message).toMatch(/Connection aborted - ended by server : reason=.* code=1000/);

        resolve();
      });

      transport.connect(url, function (err) {
        assert(!err);
      });

      const sock: WebSocketMock = (transport as any)._socket;

      sock.addEventListener('close', () => {
        server_confirms_that_server_socket_has_been_closed = true;
      });

      sock._open();

      // send Fake ACK response
      sock._message(packTcpMessage('ACK', fakeAcknowledgeMessage));

      // server closing
      sock._error();
      // websocket: close event is always emitted directly after error
      sock._close();
    });
  });

  // -------------------------------------------------------------------------
  // interaction between markDisconnecting() and disconnect()
  //
  // The secure channel marks the transport as disconnecting once the
  // CloseSecureChannelRequest has been written, so that the socket close which
  // follows is not reported as a connection error. That must suppress the error
  // reporting *without* preventing the socket from being closed.
  // -------------------------------------------------------------------------

  async function connectTransport(): Promise<WebSocketMock> {
    const connected = new Promise<void>((resolve, reject) => {
      transport.connect(url, (err) => (err ? reject(err) : resolve()));
    });
    const sock: WebSocketMock = (transport as any)._socket;
    sock._open();
    sock._message(packTcpMessage('ACK', fakeAcknowledgeMessage));
    await connected;
    return sock;
  }

  const WS_CLOSED = 3;

  it('should still close the socket when disconnect() follows markDisconnecting()', async function () {
    const sock = await connectTransport();

    transport.markDisconnecting();
    expect(transport.isValid()).toBeFalsy();

    await new Promise<void>((resolve) => transport.disconnect(resolve));

    expect(sock.close).toHaveBeenCalledTimes(1);
    expect(sock.close.mock.calls[0][0]).toBe(1000);
    expect(sock.readyState).toBe(WS_CLOSED);
  });

  it('should close the socket only once when disconnect() is called twice', async function () {
    const sock = await connectTransport();

    await new Promise<void>((resolve) => transport.disconnect(resolve));
    await new Promise<void>((resolve) => transport.disconnect(resolve));

    expect(sock.close).toHaveBeenCalledTimes(1);
  });

  it('should not report an error when the socket closes abnormally after markDisconnecting()', async function () {
    const sock = await connectTransport();

    const spyOnSocketError = vi.fn();
    transport.on('socket_error', spyOnSocketError);

    transport.markDisconnecting();
    // the server drops the connection right after receiving the CLO: a browser
    // reports that as 1006 (abnormal closure)
    sock._close(1006);

    expect(spyOnSocketError).not.toHaveBeenCalled();
    expect(spyOnConnectionBreak).not.toHaveBeenCalled();
    expect(spyOnClose).not.toHaveBeenCalled();
  });

  it('should report an abnormal close that was not initiated by the client', async function () {
    const sock = await connectTransport();

    const spyOnSocketError = vi.fn();
    transport.on('socket_error', spyOnSocketError);

    // same close, but this time the client did not ask for it
    sock._close(1006);

    expect(spyOnSocketError).toHaveBeenCalledTimes(1);
  });

  it('should fail a pending HEL/ACK transaction when disconnect() is called', async function () {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const connectCallback = vi.fn();
    transport.connect(url, connectCallback);
    (transport as any)._socket._open();

    await new Promise<void>((resolve) => transport.disconnect(resolve));

    expect(connectCallback).toHaveBeenCalledTimes(1);
    expect(connectCallback.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should fail a pending HEL/ACK transaction when the socket closes after markDisconnecting()', function () {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const connectCallback = vi.fn();
    transport.connect(url, connectCallback);
    const sock: WebSocketMock = (transport as any)._socket;
    sock._open();

    transport.markDisconnecting();
    sock._close(1006);

    expect(connectCallback).toHaveBeenCalledTimes(1);
    expect(connectCallback.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should start a reconnect attempt on the same transport from a clean state', async function () {
    // attempt 1: the server closes the socket normally during HEL/ACK
    const firstAttempt = vi.fn();
    transport.connect(url, firstAttempt);
    const firstSocket: WebSocketMock = (transport as any)._socket;
    firstSocket._open();
    firstSocket._close(1000);
    expect(firstAttempt).toHaveBeenCalledTimes(1);
    expect(firstAttempt.mock.calls[0][0]).toBeInstanceOf(Error);

    // attempt 2 (the backoff retry reuses the transport) succeeds ...
    const sock = await connectTransport();
    expect(transport.disconnecting).toBe(false);
    expect(transport.isValid()).toBeTruthy();

    const spyOnSocketError = vi.fn();
    transport.on('socket_error', spyOnSocketError);
    const spyOnSocketClosed = vi.fn();
    transport.on('socket_closed', spyOnSocketClosed);

    // ... so a later abnormal close must still be reported as a connection break
    sock._close(1006);
    expect(spyOnSocketError).toHaveBeenCalledTimes(1);
    expect(spyOnConnectionBreak).toHaveBeenCalledTimes(1);
    expect(spyOnSocketClosed).toHaveBeenCalledTimes(1);
  });

  it('should report each server close when the backoff reuses a transport that was connected', async function () {
    const spyOnSocketClosed = vi.fn();
    transport.on('socket_closed', spyOnSocketClosed);

    // attempt 1 connects, then the server ends the connection
    const firstSocket = await connectTransport();
    firstSocket._close(1000);
    expect(spyOnClose).toHaveBeenCalledTimes(1);
    expect(spyOnSocketClosed).toHaveBeenCalledTimes(1);

    // attempt 2 (same transport) connects, then the server ends it again
    const secondSocket = await connectTransport();
    secondSocket._close(1000);
    expect(spyOnClose).toHaveBeenCalledTimes(2);
    expect(spyOnClose.mock.calls[1][0]?.message).toMatch(/Connection aborted - ended by server/);
    expect(spyOnSocketClosed).toHaveBeenCalledTimes(2);
  });

  it('should not report a close for a retry that was never connected', async function () {
    // attempt 1 connects, then the server ends the connection
    const firstSocket = await connectTransport();
    firstSocket._close(1000);
    expect(spyOnClose).toHaveBeenCalledTimes(1);

    // attempt 2 (same transport): the server closes the socket during HEL/ACK
    const secondAttempt = vi.fn();
    transport.connect(url, secondAttempt);
    expect(transport.connected).toBe(false);
    expect(transport.parameters).toBeUndefined();
    const secondSocket: WebSocketMock = (transport as any)._socket;
    secondSocket._open();
    secondSocket._close(1000);

    // reported once, on the connect callback: no close event for a connection never established
    expect(secondAttempt).toHaveBeenCalledTimes(1);
    expect(secondAttempt.mock.calls[0][0]?.message).toMatch(/Connection aborted - ended by server/);
    expect(spyOnClose).toHaveBeenCalledTimes(1);
  });

  it('should remove the connection_break listener before a pending callback is failed', async function () {
    const sock = await connectTransport();
    const afterConnectionListener = (transport as any)._on_socket_error_after_connection;
    expect(transport.listeners('socket_error')).toContain(afterConnectionListener);

    let listenersWhenCalledBack: unknown[] | undefined;
    const pendingCallback = vi.fn(() => {
      listenersWhenCalledBack = transport.listeners('socket_error');
    });
    (transport as any)._install_one_time_message_receiver(pendingCallback);
    sock._close(1000);

    expect(pendingCallback).toHaveBeenCalledTimes(1);
    expect(listenersWhenCalledBack).not.toContain(afterConnectionListener);
  });

  function isRegistered() {
    const registry = (WSTransport as any).registry;
    return registry._cache[(transport as any)._____hash] === transport;
  }

  it('should register the transport again for a reconnect attempt', async function () {
    const firstSocket = await connectTransport();
    firstSocket._close(1006);
    expect(isRegistered()).toBe(false);

    await connectTransport();
    expect(isRegistered()).toBe(true);
  });

  it('should warn only when connect() replaces the socket of a connected transport', async function () {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      // a reconnect after the server ended the connection is the normal case
      const firstSocket = await connectTransport();
      firstSocket._close(1000);
      await connectTransport();
      expect(warn).not.toHaveBeenCalled();

      // the connection is still alive
      await connectTransport();
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toMatch(/connect\(\) called on a connected transport/);
    } finally {
      warn.mockRestore();
    }
  });

  it('should ignore a late close of the previous attempt socket', async function () {
    transport.timeout = 100;
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    // attempt 1: HEL times out, the client detaches and closes the socket ...
    const firstAttempt = vi.fn();
    transport.connect(url, firstAttempt);
    const firstSocket: WebSocketMock = (transport as any)._socket;
    firstSocket.close = vi.fn(); // ... but, like a browser, the close event comes later
    firstSocket._open();
    vi.advanceTimersByTime(transport.timeout);
    expect(firstAttempt).toHaveBeenCalledTimes(1);
    expect(firstAttempt.mock.calls[0][0]?.message).toMatch(/Timeout/);
    expect(firstSocket.close).toHaveBeenCalledWith(1000, 'OPC-UA: HELLO - ACK failed');
    expect((transport as any)._socket).toBeNull();

    // attempt 2 (backoff retry on the same transport) is in its HEL/ACK ...
    const secondAttempt = vi.fn();
    transport.connect(url, secondAttempt);
    const secondSocket: WebSocketMock = (transport as any)._socket;
    secondSocket._open();

    // ... when the close of the first socket arrives
    firstSocket._close(1000);
    expect(secondAttempt).not.toHaveBeenCalled();
    expect((transport as any)._socket).toBe(secondSocket);

    secondSocket._message(packTcpMessage('ACK', fakeAcknowledgeMessage));
    expect(secondAttempt).toHaveBeenCalledTimes(1);
    expect(secondAttempt.mock.calls[0][0]).toBeFalsy();
  });

  it('should detach and close a still attached socket before connect() creates the next one', function () {
    const firstAttempt = vi.fn();
    transport.connect(url, firstAttempt);
    const firstSocket: WebSocketMock = (transport as any)._socket;
    firstSocket.close = vi.fn(); // like a browser, the close event comes later

    const secondAttempt = vi.fn();
    transport.connect(url, secondAttempt);
    const secondSocket: WebSocketMock = (transport as any)._socket;

    const createSocket = window.WebSocket as unknown as Mock;
    expect(firstSocket.close).toHaveBeenCalledWith(1000);
    expect(firstSocket.close.mock.invocationCallOrder[0]).toBeLessThan(
      createSocket.mock.invocationCallOrder.at(-1)!
    );

    firstSocket._close(1006);
    expect((transport as any)._socket).toBe(secondSocket);

    secondSocket._open();
    secondSocket._message(packTcpMessage('ACK', fakeAcknowledgeMessage));
    expect(secondAttempt).toHaveBeenCalledTimes(1);
    expect(secondAttempt.mock.calls[0][0]).toBeFalsy();
    // the replaced attempt was failed once, not left pending
    expect(firstAttempt).toHaveBeenCalledTimes(1);
    expect(firstAttempt.mock.calls[0][0]?.message).toMatch(/failed to connect/);
  });

  // -------------------------------------------------------------------------
  // a connect that is still waiting for the socket to open
  // -------------------------------------------------------------------------

  it('should fail a connect whose socket is still connecting when disconnect() is called', async function () {
    const connectCallback = vi.fn();
    transport.connect(url, connectCallback);

    await new Promise<void>((resolve) => transport.disconnect(resolve));

    expect(connectCallback).toHaveBeenCalledTimes(1);
    expect(connectCallback.mock.calls[0][0]?.message).toMatch(
      /failed to connect: Transport disconnected/
    );
  });

  it('should fail a connect whose socket is still connecting when it closes after markDisconnecting()', function () {
    const connectCallback = vi.fn();
    transport.connect(url, connectCallback);
    const sock: WebSocketMock = (transport as any)._socket;

    transport.markDisconnecting();
    sock._error(1006);
    sock._close(1006);

    expect(connectCallback).toHaveBeenCalledTimes(1);
    expect(connectCallback.mock.calls[0][0]?.message).toMatch(/failed to connect/);
  });

  it('should fail a connect whose socket never opens after the socket is detached', function () {
    const spyOnSocketClosed = vi.fn();
    transport.on('socket_closed', spyOnSocketClosed);
    let socketWhenCalledBack: WebSocketMock | null | undefined;
    const connectCallback = vi.fn(() => {
      socketWhenCalledBack = (transport as any)._socket;
    });
    transport.connect(url, connectCallback);
    const sock: WebSocketMock = (transport as any)._socket;

    sock._error(1006);
    sock._close(1006);

    expect(connectCallback).toHaveBeenCalledTimes(1);
    expect(connectCallback.mock.calls[0][0]?.message).toMatch(
      /failed to connect: ERROR IN SOCKET.*code=1006/
    );
    expect(spyOnSocketClosed.mock.invocationCallOrder[0]).toBeLessThan(
      connectCallback.mock.invocationCallOrder[0]
    );
    expect(socketWhenCalledBack).toBeNull();
  });

  it('should not call a replaced connect back again when the next socket fails', function () {
    const firstAttempt = vi.fn();
    transport.connect(url, firstAttempt);
    expect(firstAttempt).not.toHaveBeenCalled();

    const secondAttempt = vi.fn();
    transport.connect(url, secondAttempt);
    expect(firstAttempt).toHaveBeenCalledTimes(1);

    const secondSocket: WebSocketMock = (transport as any)._socket;
    secondSocket._error(1006);
    secondSocket._close(1006);

    expect(firstAttempt).toHaveBeenCalledTimes(1);
    expect(secondAttempt).toHaveBeenCalledTimes(1);
    expect(secondAttempt.mock.calls[0][0]?.message).toMatch(/failed to connect/);
  });

  it('should not call a replaced connect back when the next connection breaks', async function () {
    const firstAttempt = vi.fn();
    transport.connect(url, firstAttempt);
    expect(firstAttempt).not.toHaveBeenCalled();

    // the next attempt connects ...
    const sock = await connectTransport();
    expect(firstAttempt).toHaveBeenCalledTimes(1);
    expect(firstAttempt.mock.calls[0][0]?.message).toMatch(/failed to connect: Connection aborted/);

    // ... and its connection breaks later
    sock._close(1006);
    expect(spyOnConnectionBreak).toHaveBeenCalledTimes(1);
    expect(firstAttempt).toHaveBeenCalledTimes(1);
  });

  it('should keep the new socket when a pre-open failure retries synchronously', function () {
    let retrySocket: WebSocketMock | undefined;
    const retryAttempt = vi.fn();
    const firstAttempt = vi.fn(() => {
      transport.connect(url, retryAttempt);
      retrySocket = (transport as any)._socket;
    });
    transport.connect(url, firstAttempt);

    (transport as any)._socket._close(1006);

    expect(firstAttempt).toHaveBeenCalledTimes(1);
    expect(retrySocket).toBeDefined();
    expect((transport as any)._socket).toBe(retrySocket);
    expect(retryAttempt).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // opcua+uajson: no HEL/ACK, but the same connection break detection
  // -------------------------------------------------------------------------

  describe('with opcua+uajson', function () {
    let jsonTransport: ClientWSTransport;
    let spyOnJsonClose: Mock, spyOnJsonConnectionBreak: Mock;

    beforeEach(function () {
      jsonTransport = new ClientWSTransport('opcua+uajson');
      spyOnJsonClose = vi.fn();
      jsonTransport.on('close', spyOnJsonClose);
      spyOnJsonConnectionBreak = vi.fn();
      jsonTransport.on('connection_break', spyOnJsonConnectionBreak);
    });

    afterEach(async function () {
      await new Promise<void>((resolve) => jsonTransport.disconnect(resolve));
    });

    function connectJsonTransport(): WebSocketMock {
      const connectCallback = vi.fn();
      jsonTransport.connect(url, connectCallback);
      const sock: WebSocketMock = (jsonTransport as any)._socket;
      sock._open();
      expect(connectCallback).toHaveBeenCalledTimes(1);
      expect(connectCallback.mock.calls[0][0]).toBeFalsy();
      return sock;
    }

    it('should emit connection_break when the connection drops', function () {
      const sock = connectJsonTransport();

      sock._error(1006);
      sock._close(1006);

      expect(spyOnJsonConnectionBreak).toHaveBeenCalledTimes(1);
    });

    it('should emit close, but no connection_break, when the server ends the connection', function () {
      const sock = connectJsonTransport();

      sock._close(1000);

      expect(spyOnJsonClose).toHaveBeenCalledTimes(1);
      expect(spyOnJsonConnectionBreak).not.toHaveBeenCalled();
    });
  });
  /*

    it('should returns an error if url has invalid port', function (done) {

        transport.connect('ws://localhost:XXXXX/SomeAddress', function (err) {
            if (err) {
                console.log(err);
                const regexp_1 = /EADDRNOTAVAIL|ECONNREFUSED/; // node v0.10
                const regexp_2 = /port(" option)* should be/; // node >v0.10 < 9.000
                const regexp_3 = /Port should be > 0 and < 65536. Received NaN/; // node >= 9.00
                const regexp_4 = /ERR_SOCKET_BAD_PORT|Port should be >= 0 and < 65536. Received NaN./; // node > 10.20
                const test1 = !!err.message.match(regexp_1);
                const test2 = !!err.message.match(regexp_2);
                const test3 = !!err.message.match(regexp_3);
                const test4 = !!err.message.match(regexp_4);
                expect(test1 || test2 || test3 || test4, 'expecting one of those error message. got: ' + err.message).toBe(true);
                done();
            } else {
                throw new Error('Should have raised a connection error');
                // done();
            }
        });
    });
*/
});
