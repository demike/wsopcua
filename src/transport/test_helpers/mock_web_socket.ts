import { assert } from '../../assert';

const origWS = window.WebSocket;

export interface WebSocketMock {
  _open(): void;
  _message(msg: string | ArrayBufferLike | Blob | ArrayBufferView): void;
  _error(): void;
  _close(): void;
  addEventListener(type: string, listener: () => void): void;
  send: jasmine.Spy;
  close: jasmine.Spy;
  [key: string]: any;
}

export function installMockWebSocket() {
  const wsSpy = jasmine.createSpy();
  wsSpy.and.callFake(function (url) {
    const socketMock: WebSocketMock & {
      listeners: { [key: string]: ((...args: any) => void)[] };
    } = {
      url: url,
      readyState: WebSocket.CONNECTING,
      listeners: {},
      send: jasmine.createSpy(),
      close: jasmine.createSpy().and.callFake(function () {
        socketMock.readyState = 2; //WebSocket.CLOSING;
        socketMock._close();
      }),

      // methods to mock the internal behaviour of the real WebSocket
      _open: function () {
        socketMock.readyState = WebSocket.OPEN;
        assert(socketMock.onopen && socketMock.onopen());
        if (socketMock.listeners['open']) {
          socketMock.listeners['open'].forEach((listener) => {
            listener({});
          });
        }
      },
      _message: function (msg) {
        socketMock?.onmessage && socketMock.onmessage({ data: msg });
        if (socketMock.listeners['message']) {
          socketMock.listeners['message'].forEach((listener) => {
            listener({ data: msg });
          });
        }
      },
      _error: function (code?: string) {
        socketMock.readyState = WebSocket.CLOSED;
        socketMock.onerror && socketMock.onerror();
        if (socketMock.listeners['error']) {
          socketMock.listeners['error'].forEach((listener) => {
            listener({ code: code });
          });
        }
      },
      _close: function (code = 1000) {
        socketMock.readyState = WebSocket.CLOSED;
        socketMock.onclose && socketMock.onclose({ code });
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
        let arr: any[] = socketMock.listeners[type];
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

  (wsSpy as any).CONNECTING = 0;
  (wsSpy as any).OPEN = 1;
  (wsSpy as any).CLOSING = 2;
  (wsSpy as any).CLOSED = 3;

  window.WebSocket = wsSpy as any;
}

export function uninstallMockWebSocket() {
  window.WebSocket = origWS;
}
