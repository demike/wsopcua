import { describe, vi } from 'vitest';
import testCertPem from './src/test-util/test_cert.pem?raw';
import testCertFullPem from './src/test-util/test_cert_full.pem?raw';
import testPrivateKeyPem from './src/test-util/test_privatekey.pem?raw';

const g = globalThis as any;

// Setup WebSocket for browser tests
// Note: In real browser environment, WebSocket is already available
if (!g.WebSocket) {
  // Browser will use native WebSocket
  console.warn('WebSocket not found in global scope');
}

g.jasmine = g.jasmine || {
  DEFAULT_TIMEOUT_INTERVAL: 30000,
  createSpy: (_name?: string) => vi.fn(),
};

g.fail = g.fail || ((message?: unknown) => {
  throw message instanceof Error ? message : new Error(String(message ?? 'Test failed'));
});

g.xdescribe = g.xdescribe || describe.skip;

const originalFetch = g.fetch?.bind(g);

const fixtureFiles: Record<string, string> = {
  'src/test-util/test_cert.pem': testCertPem,
  'src/test-util/test_cert_full.pem': testCertFullPem,
  'src/test-util/test_privatekey.pem': testPrivateKeyPem,
};

g.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('base/')) {
    const relativePath = input.slice('base/'.length);
    const fixture = fixtureFiles[relativePath];
    if (fixture !== undefined) {
      return new Response(fixture, { status: 200 });
    }
    const browserPath = `/${relativePath}`;

    if (originalFetch) {
      return originalFetch(browserPath as never, init as never);
    }
  }

  if (originalFetch) {
    return originalFetch(input as never, init as never);
  }

  throw new Error('fetch is not available in this environment');
};

g.spyOn = g.spyOn || ((target: object, methodName: string) => {
  const spy = vi.spyOn(target as never, methodName as never);
  return {
    and: {
      callThrough: () => spy,
      returnValue: (value: unknown) => {
        spy.mockReturnValue(value as never);
        return spy;
      },
    },
    calls: {
      count: () => spy.mock.calls.length,
    },
  };
});

// In browser environment, fetch works natively with URLs
// No need for special file:// handling
