import { ClientSession, OPCUAClient } from '../client';
import { browseExample } from '../examples/browse.example';
import { createSubscriptionExample } from '../examples/create.subscription.example';
import { monitorMultipleItemsExample } from '../examples/monitoring.multiple.items.example';
import { monitorSingleItemExample } from '../examples/monitoring.single.item.example';
import { readExample } from '../examples/read.example';
import { connectToServerExample } from '../examples/simple.connect.example';
import { translateBrowsePathExample } from '../examples/translate.browse.path.example';
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

  it('should browse the root folder', async () => {
    await browseExample(session);
  });

  it('should translate a browse path', async () => {
    await translateBrowsePathExample(session);
  });

  it('should monitor multiple items', async () => {
    const subscription = await createSubscriptionExample(session);
    await monitorMultipleItemsExample(subscription);
  });

  it('should monitor an item', async () => {
    const subscription = await createSubscriptionExample(session);
    await monitorSingleItemExample(subscription);
  });
});
