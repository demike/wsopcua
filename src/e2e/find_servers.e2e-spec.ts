import { ClientSession } from '../client/client_session';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

const describeForEnv = typeof window !== 'undefined' ? describe.skip : describe;

describeForEnv('OPCUA-Service Discovery Endpoint', function () {
  let session: ClientSession;
  let controller: E2ETestController;

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    session = setup.session;
  });

  afterAll(async () => controller.stopTestServer());

  it('should answer a FindServers Request - without filters', async function () {
    // Every  Server  shall provide a  Discovery Endpoint  that supports this  Service;   however, the  Server
    // shall only return a single record that describes itself.  Gateway Servers  shall return a record for each
    // Server  that they provide access to plus (optionally) a record that allows the  Gateway Server  to be
    // accessed as an ordinary OPC UA  Server.

    const servers = await new Promise<any[]>((resolve, reject) => {
      controller.testClient.findServers({}, function (err, servers) {
        if (err || !servers) {
          reject(err || new Error('Expected servers response'));
        } else {
          resolve(servers);
        }
      });
    });

    expect(servers.length).toBe(1);
  });

  it('should answer FindServers Request and apply serverUris filter', async function () {
    const filters = {
      serverUris: ['invalid server uri'],
    };

    const servers = await new Promise<any[]>((resolve, reject) => {
      controller.testClient.findServers(filters, function (err, servers) {
        if (err || !servers) {
          reject(err || new Error('Expected servers response'));
        } else {
          resolve(servers);
        }
      });
    });

    expect(servers.length).toEqual(0);
  });
});
