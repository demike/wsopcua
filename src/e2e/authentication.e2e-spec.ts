import { ClientSession } from '../client/client_session';
import { OPCUAClient } from '../client/opcua_client';
import { PEMCertificateStore } from '../common/certificate_store';
import { MessageSecurityMode } from '../generated';
import { getCryptoFactory, SecurityPolicy } from '../secure-channel';
import { generatePublicKeyFromDER } from '../crypto/';

import {
  DEFAULT_CLIENT_OPTIONS,
  E2ETestController,
  getE2ETestController,
  OPCUA_TEST_SERVER_URI,
} from './utils/test_server_controller';

describe('OPCUA-Session Activation', function () {
  let session: ClientSession;
  let controller: E2ETestController;

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    session = setup.session;
  });

  afterAll(async () => controller.stopTestServer());
  describe('securitynone', () => {
    it('should do username password authentication', async () => {
      const client = new OPCUAClient(DEFAULT_CLIENT_OPTIONS);
      await client.connectP(OPCUA_TEST_SERVER_URI /* 'ws://sjuticd.engel.int:4444' */);
      const sesssion = await client.createSessionP({
        userIdentityInfo: { userName: 'john', password: 'john_pw' },
      });
      expect(session).toBeTruthy();
    });

    it('should fail authentication with wrong username / password', async () => {
      const client = new OPCUAClient(DEFAULT_CLIENT_OPTIONS);
      await client.connectP(OPCUA_TEST_SERVER_URI);
      try {
        const sesssion = await client.createSessionP({
          userIdentityInfo: { userName: 'wrong_user', password: 'wrong_pw' },
        });
        fail('authentication with wrong username/password should have failed');
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
  describe('security: sign', () => {
    fit('should do username password authentication', async () => {
      const clientCertPEM = await fetch('base/src/test-util/test_cert.pem').then((r) => r.text());
      const privateKeyPEM = await fetch('base/src/test-util/test_privatekey.pem').then((r) =>
        r.text()
      );

      const client = new OPCUAClient({
        ...DEFAULT_CLIENT_OPTIONS,
        securityMode: MessageSecurityMode.Sign,
        securityPolicy: SecurityPolicy.Basic256,
        clientCertificateStore: new PEMCertificateStore(clientCertPEM, privateKeyPEM),
      });

      await client.connectP(OPCUA_TEST_SERVER_URI);

      try {
        const session = await client.createSessionP({
          userIdentityInfo: { userName: 'john', password: 'john_pw' },
        });
        expect(session.isChannelValid()).toBeTrue();
      } catch (err) {
        fail(err);
      }
    });
  });
  describe('security: sign and encrypt', () => {
    xit('should do username password authentication', async () => {
      const clientCertPEM = await fetch('base/src/test-util/test_cert.pem').then((r) => r.text());
      const privateKeyPEM = await fetch('base/src/test-util/test_privatekey.pem').then((r) =>
        r.text()
      );

      const client = new OPCUAClient({
        ...DEFAULT_CLIENT_OPTIONS,
        securityMode: MessageSecurityMode.SignAndEncrypt,
        securityPolicy: SecurityPolicy.Basic256,
        clientCertificateStore: new PEMCertificateStore(clientCertPEM, privateKeyPEM),
      });

      await client.connectP(OPCUA_TEST_SERVER_URI /*'ws://sjuticd.engel.int:4444'*/);

      try {
        const session = await client.createSessionP({
          userIdentityInfo: { userName: 'john', password: 'john_pw' },
        });
        expect(session.isChannelValid()).toBeTrue();
      } catch (err) {
        fail(err);
      }
    });
  });
});

describe('asymmetric encrypt decrypt', () => {
  it('should encrypt decrypt with a PEM certificate and private key', async () => {
    const clientCertPEM = await fetch('base/src/test-util/test_cert.pem').then((r) => r.text());
    const privateKeyPEM = await fetch('base/src/test-util/test_privatekey.pem').then((r) =>
      r.text()
    );

    const store = new PEMCertificateStore(clientCertPEM, privateKeyPEM);

    const publicKey = await generatePublicKeyFromDER(store.getCertificate(), 'SHA-256');
    const privateKey = store.getPrivateKey();

    const factory = getCryptoFactory(SecurityPolicy.Basic256Sha256);

    const block = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      block[i] = i;
    }

    const encrypted = await factory.asymmetricEncrypt(block, publicKey);
    const decrypted = await factory.asymmetricDecrypt(encrypted, privateKey);

    expect(block).toEqual(new Uint8Array(decrypted));
  });

  fit('SHA-256: should sign and verify with a PEM certificate and private key', async () => {
    const clientCertPEM = await fetch('base/src/test-util/test_cert.pem').then((r) => r.text());
    const privateKeyPEM = await fetch('base/src/test-util/test_privatekey.pem').then((r) =>
      r.text()
    );

    const store = new PEMCertificateStore(clientCertPEM, privateKeyPEM);

    const factory = getCryptoFactory(SecurityPolicy.Basic256Sha256);

    const block = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      block[i] = i;
    }

    const signature = await factory.asymmetricSign(block, store.getPrivateKey());
    const isVerified = await factory.asymmetricVerify(
      block,
      new Uint8Array(signature),
      store.getCertificate()
    );

    expect(isVerified).toBeTrue();
  });

  fit('SHA-1: should sign and verify with a PEM certificate and private key', async () => {
    const clientCertPEM = await fetch('base/src/test-util/test_cert.pem').then((r) => r.text());
    const privateKeyPEM = await fetch('base/src/test-util/test_privatekey.pem').then((r) =>
      r.text()
    );

    const store = new PEMCertificateStore(clientCertPEM, privateKeyPEM);

    const factory = getCryptoFactory(SecurityPolicy.Basic256);

    const block = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      block[i] = i;
    }

    const signature = await factory.asymmetricSign(block, store.getPrivateKey());
    const isVerified = await factory.asymmetricVerify(
      block,
      new Uint8Array(signature),
      store.getCertificate()
    );

    expect(isVerified).toBeTrue();
  });
});
