import { OPCUAClient } from '../client/opcua_client';
import {
  DEFAULT_CLIENT_OPTIONS,
  E2ETestController,
  getE2ETestController,
  OPCUA_TEST_SERVER_URI,
} from '../e2e/utils/test_server_controller';
import { MessageSecurityMode, SecurityPolicy } from '../secure-channel';
import { SelfSignedCertificateStore } from './certificate_store';

describe('SelfSignedCertificateStore', () => {
  let controller: E2ETestController;
  beforeAll(async () => {
    controller = getE2ETestController();
    await controller.startTestServer();
  });

  afterAll(async () => {
    try {
      await controller.stopTestServer();
    } catch (e) {
      console.warn('error stopping test server', e);
    }
  });

  [
    SecurityPolicy.Basic256Sha256,
    SecurityPolicy.Basic256,
    SecurityPolicy.Aes128_Sha256_RsaOaep,
    //  SecurityPolicy.Aes256_Sha256_RsaPss, // TODO enable this policy
  ].forEach((policy) =>
    it(`should do username password authentication with default certificate options: ${policy}`, async () => {
      const clientCertPEM = await fetch('base/src/test-util/test_cert.pem').then((r) => r.text());
      const privateKeyPEM = await fetch('base/src/test-util/test_privatekey.pem').then((r) =>
        r.text()
      );

      const client = new OPCUAClient({
        ...DEFAULT_CLIENT_OPTIONS,
        securityMode: MessageSecurityMode.SignAndEncrypt,
        securityPolicy: policy,
        clientCertificateStore: new SelfSignedCertificateStore(),
      });

      await client.connectP(OPCUA_TEST_SERVER_URI /* 'ws://sjuticd.engel.int:4444'*/);

      try {
        const session = await client.createSessionP({
          userIdentityInfo: { userName: 'john', password: 'john_pw' },
        });
        expect(session.isChannelValid()).toBeTruthy();
      } catch (err) {
        fail(err);
      } finally {
        //         await client.disconnectP();
      }
    })
  );
});
