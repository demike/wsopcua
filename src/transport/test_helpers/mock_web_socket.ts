import { vi, Mock } from 'vitest';
import { assert } from '../../assert';

const origWS = window.WebSocket;
const WS_CONNECTING = 0;
const WS_OPEN = 1;
const WS_CLOSING = 2;
const WS_CLOSED = 3;

export interface WebSocketMock {
  _open(): void;
  _message(msg: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  _error(code?: number): void;
  _close(code?: number): void;
  addEventListener(type: string, listener: () => void): void;
  send: Mock;
  close: Mock;
  [key: string]: any;
}

export function installMockWebSocket() {
  const wsSpy = vi.fn();
  wsSpy.mockImplementation(function (url) {
    const socketMock: WebSocketMock & {
      listeners: { [key: string]: ((...args: any) => void)[] };
    } = {
      url: url,
      readyState: WS_CONNECTING,
      listeners: {},
      send: vi.fn(),
      close: vi.fn().mockImplementation(function () {
        socketMock.readyState = WS_CLOSING;
        socketMock._close();
      }),

      // methods to mock the internal behaviour of the real WebSocket
      _open: function () {
        socketMock.readyState = WS_OPEN;
        if (socketMock.onopen) {
          socketMock.onopen();
        }

        if (socketMock.listeners['open']) {
          socketMock.listeners['open'].forEach((listener) => {
            listener({});
          });
        }
      },
      _message: function (msg) {
        socketMock.onmessage?.({ data: msg });
        if (socketMock.listeners['message']) {
          socketMock.listeners['message'].forEach((listener) => {
            listener({ data: msg });
          });
        }
      },
      _error: function (code?: number) {
        socketMock.readyState = WS_CLOSED;
        socketMock.onerror?.();
        if (socketMock.listeners['error']) {
          socketMock.listeners['error'].forEach((listener) => {
            listener({ code: code });
          });
        }
      },
      _close: function (code = 1000) {
        socketMock.readyState = WS_CLOSED;
        socketMock.onclose?.({ code });
        if (socketMock.listeners['close']) {
          socketMock.listeners['close'].forEach((listener) => {
            listener({ code: code });
          });
        }
      },
      addEventListener: function (type: string, listener) {
        let arr = socketMock.listeners[type];
        if (!arr) {
          arr = [];
          socketMock.listeners[type] = arr;
        }
        arr.push(listener);
      },

      removeEventListener: function (type: string, listener: (...args: any[]) => void) {
        const arr: any[] = socketMock.listeners[type];
        if (!arr) {
          return;
        }
        const i = arr.indexOf(listener);
        if (i >= 0) {
          delete arr[i];
        }
      },
    };
    return socketMock;
  });

  (wsSpy as any).CONNECTING = WS_CONNECTING;
  (wsSpy as any).OPEN = WS_OPEN;
  (wsSpy as any).CLOSING = WS_CLOSING;
  (wsSpy as any).CLOSED = WS_CLOSED;

  window.WebSocket = wsSpy as any;
}

export function uninstallMockWebSocket() {
  window.WebSocket = origWS;
}
