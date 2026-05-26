import { vi } from 'vitest';

import { ClientSecureChannelLayer } from './client_secure_channel_layer';

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
});
