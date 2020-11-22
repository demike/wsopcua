import { IFindServersOptions } from '../client/client_base';
import { ClientSession } from '../client/client_session';
import {
  E2ETestController,
  getE2ETestController,
} from './utils/test_server_controller';

describe('OPCUA-Service Discovery Endpoint', function () {
  let session: ClientSession;
  let controller: E2ETestController;

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    session = setup.session;
  });

  afterAll(async () => controller.stopTestServer());

  it('should answer a FindServers Request - without filters', function (done) {
    // Every  Server  shall provide a  Discovery Endpoint  that supports this  Service;   however, the  Server
    // shall only return a single record that describes itself.  Gateway Servers  shall return a record for each
    // Server  that they provide access to plus (optionally) a record that allows the  Gateway Server  to be
    // accessed as an ordinary OPC UA  Server.

    controller.testClient.findServers({}, function (err, servers) {
      if (!err) {
        expect(servers.length).toBe(1);
      }
      done();
    });
  });

  it('should answer FindServers Request and apply serverUris filter', function (done) {
    const filters = {
      serverUris: ['invalid server uri'],
    };

    controller.testClient.findServers(filters, function (err, servers) {
      expect(servers.length).toEqual(0);
      done();
    });
  });
});
