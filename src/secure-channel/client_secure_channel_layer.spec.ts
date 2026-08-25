import { vi } from 'vitest';

import { ClientSecureChannelLayer } from './client_secure_channel_layer';

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
  vi.spyOn(secureChannel as never, '_sendSecureOpcUARequest').mockImplementation(() => {});
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
