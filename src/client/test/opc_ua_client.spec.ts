'use strict';
import { isAnonymous, isIssued, isUserNamePassword, OPCUAClient } from '../opcua_client';
import { ClientSecureChannelLayer } from '../../secure-channel/client_secure_channel_layer';

describe('OPCUA Client', function () {
  it('it should create a client', function () {
    const client = new OPCUAClient({});
    expect(client).toBeDefined();
  });
  it('should create a ClientSecureChannerLayer', function () {
    const secLayer = new ClientSecureChannelLayer({});
    expect(secLayer).toBeDefined();
  });

  describe('issue 696: https://github.com/node-opcua/node-opcua/issues/696', function () {
    let setIntervalCalls = 0;
    const realSetInterval = window.setInterval;
    let clearIntervalCalls = 0;
    const realClearInterval = window.clearInterval;

    beforeEach(() => {
      window.setInterval = (...args: any[]) => {
        setIntervalCalls++;
        return (<any>realSetInterval)(...args);
      };
      window.clearInterval = (...args: any[]) => {
        clearIntervalCalls++;
        return (<any>realClearInterval)(...args);
      };
    });
    afterEach(() => {
      window.setInterval = realSetInterval;
      window.clearInterval = realClearInterval;
    });
    it('should not leak interval if connection failed', async () => {
      async function test() {
        try {
          const client = new OPCUAClient({ connectionStrategy: { maxRetry: 0 } });
          await client.connectP('invalid-proto://test-host');
        } catch (err) {
          console.log((err as Error).message);
          throw err;
        }
      }
      await expect(test()).rejects.toThrow(); // With(/The connection has been rejected/);
      console.log(
        `setIntervalCalls ${setIntervalCalls} vs. clearIntervalCalls ${clearIntervalCalls}`
      );

      expect(setIntervalCalls).toEqual(clearIntervalCalls);
    });
  });
});

describe('isAnonymous', () => {
  it('should return false if username and/or password are set', () => {
    expect(isAnonymous({ userName: 'name', password: 'pw' })).toBe(false);
  });

  it("should return false if 'tokenData' is set", () => {
    expect(isAnonymous({ userName: 'name', password: 'pw' })).toBe(false);
  });

  it("should return false if 'tokenData' is set", () => {
    expect(isAnonymous({ tokenData: new Uint8Array() })).toBe(false);
  });

  it('should return true if username, password and tokenData are not set', () => {
    expect(isAnonymous({ some: 'thing' })).toBe(true);
  });

  it('should return false if username is set', () => {
    expect(isAnonymous({ userName: 'name' })).toBe(false);
  });
});

describe('isUsernamePassword', () => {
  it('should return true if username and password are set', () => {
    expect(isUserNamePassword({ userName: 'name', password: 'pw' })).toBe(true);
  });

  it('should return false if just password is set', () => {
    expect(isUserNamePassword({ password: 'pw' })).toBe(false);
  });

  it("should return false if just 'username' is set", () => {
    expect(isUserNamePassword({ userName: 'name' })).toBe(false);
  });

  it('should return false if username and password are not set', () => {
    expect(isUserNamePassword({ some: 'thing' })).toBe(false);
  });
});

describe('isIssued', () => {
  it('should return true if tokenData is set', () => {
    expect(isIssued({ tokenData: new Uint8Array() })).toBe(true);
  });

  it('should return true username and password are not set', () => {
    expect(isIssued({ some: 'thing' })).toBe(false);
  });
});
