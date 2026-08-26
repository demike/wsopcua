import { vi } from 'vitest';

import { OPCUAClient, UserIdentityInfo } from './opcua_client';
import { ClientSession } from './client_session';
import { repair_client_session } from './reconnection';
import { ActivateSessionResponse } from '../generated/ActivateSessionResponse';
import { ResponseHeader } from '../generated/ResponseHeader';
import { AnonymousIdentityToken } from '../service-session';
import { SignatureData } from '../generated/SignatureData';
import { StatusCodes } from '../constants/raw_status_codes';

const JOHN: UserIdentityInfo = { userName: 'john', password: 'john_pw' };

/**
 * an OPCUAClient wired up just far enough to run _activateSession without a
 * transport: token creation and the client signature are stubbed out so that
 * the test only observes *which* identity the client decides to activate with.
 */
function makeClient() {
  const client = new OPCUAClient({});
  (client as any)._secureChannel = { messageBuilder: { _securityPolicy: 'None' } };
  vi.spyOn(client as any, 'computeClientSignature').mockResolvedValue(new SignatureData({}));

  const createUserIdentityToken = vi
    .spyOn(client as any, 'createUserIdentityToken')
    .mockImplementation((...args: any[]) => {
      const callback = args[2] as (err: Error | null, token: unknown) => void;
      callback(null, new AnonymousIdentityToken({}));
    });

  return { client, createUserIdentityToken };
}

function makeSession(client: OPCUAClient, serviceResult = StatusCodes.Good) {
  const session = new ClientSession(client);
  vi.spyOn(session, 'performMessageTransaction').mockImplementation((...args: any[]) => {
    const callback = args[1] as (err: Error | null, response: unknown) => void;
    callback(
      null,
      new ActivateSessionResponse({
        responseHeader: new ResponseHeader({ serviceResult }),
        serverNonce: new Uint8Array(32),
      })
    );
  });
  return session;
}

function activate(client: OPCUAClient, session: ClientSession, options: any) {
  return new Promise<Error | null>((resolve) => {
    (client as any)._activateSession(session, options, (err: Error | null) => resolve(err));
  });
}

/** the identity handed to createUserIdentityToken on the nth activation */
function identityOfCall(spy: ReturnType<typeof vi.spyOn>, index: number) {
  return (spy.mock.calls[index] as unknown[])[1];
}

describe('session identity across re-activation', function () {
  afterEach(function () {
    vi.restoreAllMocks();
  });

  it('should remember the identity a session was activated with', async function () {
    const { client } = makeClient();
    const session = makeSession(client);

    expect(session.userIdentityInfo).toBeUndefined();

    const err = await activate(client, session, { userIdentityInfo: JOHN });

    expect(err).toBeNull();
    expect(session.userIdentityInfo).toEqual(JOHN);
  });

  it('should record an anonymous activation as null rather than leaving it unset', async function () {
    const { client } = makeClient();
    const session = makeSession(client);

    await activate(client, session, null);

    expect(session.userIdentityInfo).toBeNull();
  });

  // A server refuses to move an existing session to a new SecureChannel while
  // the UserTokenType changes:
  //   "Activating a session on a new SecureChannel not allowed with different
  //    UserTokenType"
  // Re-activation therefore has to replay the original identity instead of
  // silently falling back to Anonymous.
  it('should replay the remembered identity when re-activating without an explicit one', async function () {
    const { client, createUserIdentityToken } = makeClient();
    const session = makeSession(client);

    await activate(client, session, { userIdentityInfo: JOHN });
    await activate(client, session, null);

    expect(createUserIdentityToken).toHaveBeenCalledTimes(2);
    expect(identityOfCall(createUserIdentityToken, 1)).toEqual(JOHN);
    expect(session.userIdentityInfo).toEqual(JOHN);
  });

  it('should replay the remembered identity when options carry no userIdentityInfo', async function () {
    const { client, createUserIdentityToken } = makeClient();
    const session = makeSession(client);

    await activate(client, session, { userIdentityInfo: JOHN });
    await activate(client, session, { localeIds: ['en'] });

    expect(identityOfCall(createUserIdentityToken, 1)).toEqual(JOHN);
  });

  it('should go back to anonymous when the identity is explicitly null', async function () {
    const { client, createUserIdentityToken } = makeClient();
    const session = makeSession(client);

    await activate(client, session, { userIdentityInfo: JOHN });
    await activate(client, session, { userIdentityInfo: null });

    expect(identityOfCall(createUserIdentityToken, 1)).toBeNull();
    expect(session.userIdentityInfo).toBeNull();
  });

  it('should keep the previous identity when an activation fails', async function () {
    const { client } = makeClient();
    const session = makeSession(client);

    await activate(client, session, { userIdentityInfo: JOHN });

    // the next activation is rejected by the server
    vi.spyOn(session, 'performMessageTransaction').mockImplementation((...args: any[]) => {
      const callback = args[1] as (err: Error | null, response: unknown) => void;
      callback(
        null,
        new ActivateSessionResponse({
          responseHeader: new ResponseHeader({
            serviceResult: StatusCodes.BadIdentityTokenRejected,
          }),
        })
      );
    });

    const err = await activate(client, session, { userIdentityInfo: null });

    expect(err).toBeInstanceOf(Error);
    expect(session.userIdentityInfo).toEqual(JOHN);
  });
});

describe('reconnection re-activation', function () {
  afterEach(function () {
    vi.restoreAllMocks();
  });

  // _activateSession(session, options, callback): passing the callback as the
  // second argument left `callback` undefined, which tripped the
  // `assert(typeof callback === 'function')` guard and aborted the reconnect
  // before any ActivateSession was sent.
  it('should call _activateSession with an options argument and a callback', function () {
    const { client } = makeClient();
    const session = makeSession(client);
    session.userIdentityInfo = JOHN;

    // record the arguments without running the activation itself
    const activateSession = vi
      .spyOn(client as any, '_activateSession')
      .mockImplementation(() => undefined);

    expect(() => repair_client_session(client, session, vi.fn())).not.toThrow();

    expect(activateSession).toHaveBeenCalledTimes(1);
    const [passedSession, options, callback] = activateSession.mock.calls[0];
    expect(passedSession).toBe(session);
    expect(options == null).toBe(true); // "no override": replay the session identity
    expect(typeof callback).toBe('function');
  });

  it('should re-activate a session with the identity it was created with', async function () {
    const { client, createUserIdentityToken } = makeClient();
    const session = makeSession(client);

    // original activation, e.g. at createSession time
    await activate(client, session, { userIdentityInfo: JOHN });

    // the channel broke and the session is repaired on a new SecureChannel
    await new Promise<void>((resolve) => {
      vi.spyOn(client as any, '_activateSession').mockImplementation((...args: any[]) => {
        const [aSession, options] = args;
        // delegate to the real implementation to observe the chosen identity,
        // but swallow its callback: what repair_client_session does afterwards
        // (republish / recreate the session) is out of scope here
        (OPCUAClient.prototype as any)._activateSession.call(client, aSession, options, () =>
          resolve()
        );
      });
      repair_client_session(client, session, vi.fn());
    });

    expect(createUserIdentityToken).toHaveBeenCalledTimes(2);
    expect(identityOfCall(createUserIdentityToken, 1)).toEqual(JOHN);
  });
});
