import { ClientSessionKeepAliveManager } from './client_session_keepalive_manager';
import { StatusCodes } from '../constants';

describe('ClientSessionKeepAliveManager.isSessionStillAlive', () => {
  it('should treat a BadInvalidTimestamp service fault as still alive', () => {
    const err = Object.assign(new Error('serviceResult = BadInvalidTimestamp'), {
      response: { responseHeader: { serviceResult: StatusCodes.BadInvalidTimestamp } },
    });
    expect(ClientSessionKeepAliveManager.isSessionStillAlive(err)).toBe(true);
  });

  it('should treat a BadInvalidTimestamp mentioned only in the message as still alive', () => {
    const err = new Error(' serviceResult = BadInvalidTimestamp (0x80230000) returned by server');
    expect(ClientSessionKeepAliveManager.isSessionStillAlive(err)).toBe(true);
  });

  it('should NOT treat a genuine connection failure as still alive', () => {
    const err = new Error('Transport disconnected');
    expect(ClientSessionKeepAliveManager.isSessionStillAlive(err)).toBe(false);
  });

  it('should NOT treat other service faults as still alive', () => {
    const err = Object.assign(new Error('serviceResult = BadSessionIdInvalid'), {
      response: { responseHeader: { serviceResult: StatusCodes.BadSessionIdInvalid } },
    });
    expect(ClientSessionKeepAliveManager.isSessionStillAlive(err)).toBe(false);
  });
});
