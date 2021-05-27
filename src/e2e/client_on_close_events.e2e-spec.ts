import { OPCUAClientOptions } from '../common/client_options';
import { debugLog } from '../common/debug';

import { OPCUAClient } from '../';
import {
  E2ESetup,
  E2ETestController,
  getE2ETestController,
  OPCUA_TEST_SERVER_URI,
} from './utils/test_server_controller';

describe('testing Client-Server - Event', function () {
  const controller: E2ETestController = getE2ETestController();
  let setup: E2ESetup;

  beforeEach(async () => {
    setup = await controller.startTestServer();
    setup.client.disconnectP();
  });

  afterEach(async () => controller.stopTestServer());

  it('TSC-1 should raise a close event once on normal disconnection', async () => {
    let close_counter = 0;
    const client = new OPCUAClient({});
    debugLog('--> connection client');
    await client.connectP(OPCUA_TEST_SERVER_URI);

    client.on('close', function (err) {
      expect(err).toBeUndefined(
        'No error shall be transmitted when client initiates the disconnection'
      );
      close_counter++;
    });

    expect(close_counter).toBe(0);
    debugLog(' --> Disconnecting Client');
    await client.disconnectP();

    expect(close_counter).toBe(1);
  });
  it('TSC-2 client (not reconnecting) should raise a close event with an error when server initiates disconnection', async () => {
    // note : client is not trying to reconnect
    const options = {
      connectionStrategy: {
        maxRetry: 0, // <= no retry
        initialDelay: 10,
        maxDelay: 20,
        randomisationFactor: 0,
      },
    };
    const client = new OPCUAClient(options);

    const _client_received_close_event = jasmine.createSpy();
    client.on('close', _client_received_close_event);

    debugLog(' --> Connecting Client');
    await client.connectP(OPCUA_TEST_SERVER_URI);

    expect(_client_received_close_event.calls.count()).toBe(0);

    debugLog(' --> Stopping server');
    await controller.stopTestServer();

    // wait a little bit , to relax client

    expect(_client_received_close_event.calls.count()).toBe(1);
    expect(_client_received_close_event.calls.first().args[0].message).toMatch(
      /Connection Break/ // /disconnected by third party/
    );

    await client.disconnectP();
  });

  it('TSC-3 client (reconnecting)  should raise a close event with an error when server initiates disconnection (after reconnecting has failed)', async () => {
    // note : client will  try to reconnect and eventually fail ...
    const options: OPCUAClientOptions = {
      connectionStrategy: {
        initialDelay: 10,
        maxDelay: 20,
        maxRetry: 1, // <= RETRY
        randomisationFactor: 0,
      },
    };
    const client = new OPCUAClient(options);

    const _client_received_close_event = jasmine.createSpy();
    client.on('close', _client_received_close_event);

    const _client_backoff_event = jasmine.createSpy();
    client.on('backoff', _client_backoff_event);
    client.on('backoff', () => {
      debugLog('client attempt to connect');
    });

    debugLog(' 2--> Connecting Client');
    await client.connectP(OPCUA_TEST_SERVER_URI);

    expect(_client_received_close_event.calls.count()).toBe(0);

    client.on('close', function (err) {
      debugLog(' 8 --> client has sent "close" event', err ? err.message : null);
      // xx should.exist(err);
    });

    await new Promise<void>((resolve) => {
      client.once('connection_lost', function () {
        debugLog(' 4 or 5--> client has detected that server has shutdown abruptly');
        debugLog('           and will try to reconnect');

        window.setTimeout(() => {
          debugLog(' 6--> disconnecting client');
          client.disconnect(() => {
            debugLog(' 8 --> client has been disconnected');
            resolve();
          });
        }, 5000); // let's give client some time to attempt a reconnection
      });

      debugLog(' 3--> Stopping server');
      controller.stopTestServer();
    });

    expect(_client_backoff_event.calls.count()).toBeGreaterThan(0);
    expect(_client_received_close_event.calls.count()).toEqual(1);
    expect(_client_received_close_event.calls.first().args[0]).toBeUndefined();
  }, 10000);
});
