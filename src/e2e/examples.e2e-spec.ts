import { ClientSession, OPCUAClient } from '../client';
import { readExample } from '../examples/read.example';
import { connectToServerExample } from '../examples/simple.connect.example';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

describe('Examples', () => {
  let session: ClientSession;
  let controller: E2ETestController;
  let client: OPCUAClient;
  let namespace: number;
  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    namespace = await controller.addComplianceTestNamespace();

    session = setup.session;
    client = setup.client;
  });
  afterAll(async () => {
    await controller.stopTestServer();
  });
  it('should connect to the server', async () => {
    await connectToServerExample();
  });

  it('should read from the server', async () => {
    await readExample(session);
  });
});
