import { ClientSession, OPCUAClient } from '../client';
import { browseExample } from '../examples/browse.example';
import { createSubscriptionExample } from '../examples/create.subscription.example';
import { methodExample } from '../examples/method.example';
import { monitorMultipleItemsExample } from '../examples/monitoring.multiple.items.example';
import { monitorSingleItemExample } from '../examples/monitoring.single.item.example';
import { usingAPEMCertificate } from '../examples/pemder.certificate.example';
import { readExample } from '../examples/read.example';
import { usingASelfSignedCertificateAdvanced } from '../examples/selfsigned.certificate.advanced.example';
import { usingASelfSignedCertificate } from '../examples/selfsigned.certificate.example';
import { connectToServerExample } from '../examples/simple.connect.example';
import { translateBrowsePathExample } from '../examples/translate.browse.path.example';
import { writeExample } from '../examples/write.example';
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

  it('should call a method', async () => {
    await methodExample(session);
  });

  it('should write a value', async () => {
    await writeExample(session);
  });

  it('should use a self signed certificate', async () => {
    const clientAndSession = await usingASelfSignedCertificate();
    await clientAndSession.session.closeP();
    await clientAndSession.client.disconnectP();
  });

  it('should use a self signed certificate advanced', async () => {
    const clientAndSession = await usingASelfSignedCertificateAdvanced();
    await clientAndSession.session.closeP();
    await clientAndSession.client.disconnectP();
  });

  it('should use PEM certificate and private key', async () => {
    const clientCertPEM = await fetch('base/src/test-util/test_cert.pem').then((r) => r.text());
    const privateKeyPEM = await fetch('base/src/test-util/test_privatekey.pem').then((r) =>
      r.text()
    );
    const clientAndSession = await usingAPEMCertificate(clientCertPEM, privateKeyPEM);
    await clientAndSession.session.closeP();
    await clientAndSession.client.disconnectP();
  });
});
