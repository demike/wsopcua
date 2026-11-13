import { vi } from 'vitest';

import { OPCUAClient } from './opcua_client';
import { ClientSession } from './client_session';
import { repair_client_session } from './reconnection';

type Cb = (err?: Error | null) => void;

/**
 * a session whose publish engine is stubbed so that the republish step of the
 * repair completes synchronously with the given error (or success).
 */
function makeSession(client: OPCUAClient, republishError: Error | null = null) {
  const session = new ClientSession(client);
  const publishEngine = session.getPublishEngine();
  vi.spyOn(publishEngine, 'republish').mockImplementation((cb: Cb) => cb(republishError));
  vi.spyOn(session, 'resumePublishEngine').mockImplementation(() => undefined);
  return session;
}

function repair(client: OPCUAClient, session: ClientSession) {
  return new Promise<Error | null | undefined>((resolve) =>
    repair_client_session(client, session, (err) => resolve(err))
  );
}

describe('session_restored event', function () {
  it('is emitted when the existing session could be re-activated', async () => {
    const client = new OPCUAClient({});
    const session = makeSession(client);
    vi.spyOn(client as any, '_activateSession').mockImplementation((...args: any[]) =>
      (args[2] as Cb)(null)
    );

    const onRestored = vi.fn();
    session.on('session_restored', onRestored);

    const err = await repair(client, session);

    expect(err).toBeFalsy();
    expect(onRestored).toHaveBeenCalledTimes(1);
  });

  it('is emitted when the session had to be re-created', async () => {
    const client = new OPCUAClient({});
    const session = makeSession(client);
    // first activation (of the old session) fails, the one after re-creation succeeds
    vi.spyOn(client as any, '_activateSession')
      .mockImplementationOnce((...args: any[]) => (args[2] as Cb)(new Error('BadSessionIdInvalid')))
      .mockImplementation((...args: any[]) => (args[2] as Cb)(null));
    vi.spyOn(client as any, '__createSession_step2').mockImplementation((...args: any[]) =>
      (args[1] as (err: Error | null, s: ClientSession) => void)(null, session)
    );

    const onRestored = vi.fn();
    session.on('session_restored', onRestored);

    const err = await repair(client, session);

    expect(err).toBeFalsy();
    expect(onRestored).toHaveBeenCalledTimes(1);
  });

  it('is not emitted when the repair fails', async () => {
    const client = new OPCUAClient({});
    const session = makeSession(client, new Error('republish failed'));
    vi.spyOn(client as any, '_activateSession').mockImplementation((...args: any[]) =>
      (args[2] as Cb)(null)
    );

    const onRestored = vi.fn();
    session.on('session_restored', onRestored);

    const err = await repair(client, session);

    expect(err).toBeTruthy();
    expect(onRestored).not.toHaveBeenCalled();
  });

  it('is not emitted when the session could not be re-created', async () => {
    const client = new OPCUAClient({});
    const session = makeSession(client);
    vi.spyOn(client as any, '_activateSession').mockImplementation((...args: any[]) =>
      (args[2] as Cb)(new Error('BadSessionIdInvalid'))
    );
    vi.spyOn(client as any, '__createSession_step2').mockImplementation((...args: any[]) =>
      (args[1] as (err: Error | null) => void)(new Error('BadTooManySessions'))
    );

    const onRestored = vi.fn();
    session.on('session_restored', onRestored);

    const err = await repair(client, session);

    expect(err?.message).toMatch(/BadTooManySessions/);
    expect(onRestored).not.toHaveBeenCalled();
  });

  it('is not emitted when the session has been closed by the time the repair completes', async () => {
    const client = new OPCUAClient({});
    const session = makeSession(client);
    vi.spyOn(client as any, '_activateSession').mockImplementation((...args: any[]) =>
      (args[2] as Cb)(null)
    );
    // the user closes the session while its publish engine is being resumed
    vi.spyOn(session, 'resumePublishEngine').mockImplementation(() => {
      (session as any)._closed = true;
    });

    const onRestored = vi.fn();
    session.on('session_restored', onRestored);

    const err = await repair(client, session);

    expect(err).toBeFalsy();
    expect(session.hasBeenClosed()).toBe(true);
    expect(onRestored).not.toHaveBeenCalled();
  });

  it('still completes the repair when a listener throws', async () => {
    const client = new OPCUAClient({});
    const session = makeSession(client);
    vi.spyOn(client as any, '_activateSession').mockImplementation((...args: any[]) =>
      (args[2] as Cb)(null)
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const listenerError = new Error('listener failure');
    session.on('session_restored', () => {
      throw listenerError;
    });

    try {
      const err = await repair(client, session);

      expect(err).toBeFalsy();
      expect(consoleError).toHaveBeenCalledWith(
        'session_restored listener has thrown',
        listenerError
      );
    } finally {
      consoleError.mockRestore();
    }
  });
});
