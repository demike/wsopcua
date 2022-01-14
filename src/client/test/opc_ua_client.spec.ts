'use strict';
import { isAnonymous, isIssued, isUserNamePassword, OPCUAClient } from '../opcua_client';
import { ClientSecureChannelLayer } from '../../secure-channel/client_secure_channel_layer';
import { timeout } from 'async';

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
        return realClearInterval(...args);
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
          console.log(err.message);
          throw err;
        }
      }
      await expectAsync(test()).toBeRejected(); // With(/The connection has been rejected/);
      console.log(
        `setIntervalCalls ${setIntervalCalls} vs. clearIntervalCalls ${clearIntervalCalls}`
      );

      expect(setIntervalCalls).toEqual(clearIntervalCalls);
    });
  });
});

describe('isAnonymous', () => {
  it('should return false if username and/or password are set', () => {
    expect(isAnonymous({ userName: 'name', password: 'pw' })).toBeFalse();
  });

  it("should return false if 'tokenData' is set", () => {
    expect(isAnonymous({ userName: 'name', password: 'pw' })).toBeFalse();
  });

  it("should return false if 'tokenData' is set", () => {
    expect(isAnonymous({ tokenData: new Uint8Array() })).toBeFalse();
  });

  it('should return true if username, password and tokenData are not set', () => {
    expect(isAnonymous({ some: 'thing' })).toBeTrue();
  });

  it('should return false if username is set', () => {
    expect(isAnonymous({ userName: 'name' })).toBeFalse();
  });
});

describe('isUsernamePassword', () => {
  it('should return true if username and password are set', () => {
    expect(isUserNamePassword({ userName: 'name', password: 'pw' })).toBeTrue();
  });

  it('should return false if just password is set', () => {
    expect(isUserNamePassword({ password: 'pw' })).toBeFalse();
  });

  it("should return false if just 'username' is set", () => {
    expect(isUserNamePassword({ userName: 'name' })).toBeFalse();
  });

  it('should return false if username and password are not set', () => {
    expect(isUserNamePassword({ some: 'thing' })).toBeFalse();
  });
});

describe('isIssued', () => {
  it('should return true if tokenData is set', () => {
    expect(isIssued({ tokenData: new Uint8Array() })).toBeTrue();
  });

  it('should return true username and password are not set', () => {
    expect(isIssued({ some: 'thing' })).toBeFalse();
  });
});
