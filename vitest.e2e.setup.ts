import { readFile } from 'node:fs/promises';
import path from 'node:path';
import WebSocket from 'ws';
import { describe, vi } from 'vitest';

const g = globalThis as any;

g.WebSocket = WebSocket;
if (g.window) {
  g.window.WebSocket = WebSocket;
}

g.jasmine = g.jasmine || {
  DEFAULT_TIMEOUT_INTERVAL: 30000,
  createSpy: (_name?: string) => vi.fn(),
};

g.fail =
  g.fail ||
  ((message?: unknown) => {
    throw message instanceof Error ? message : new Error(String(message ?? 'Test failed'));
  });

g.xdescribe = g.xdescribe || describe.skip;

g.spyOn =
  g.spyOn ||
  ((target: object, methodName: string) => {
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

const originalFetch = g.fetch?.bind(g);

g.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('base/')) {
    const relativePath = input.slice('base/'.length);
    const filePath = path.resolve(process.cwd(), relativePath);
    const content = await readFile(filePath, 'utf8');
    return new Response(content, { status: 200 });
  }
  if (originalFetch) {
    return originalFetch(input as never, init as never);
  }
  throw new Error('fetch is not available in this environment');
};
