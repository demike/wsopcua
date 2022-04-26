import { MessageSecurityMode, OPCUAClient, SecurityPolicy } from '../';
import { SelfSignedCertificateStore } from '../common';
import { OPCUA_TEST_SERVER_URI } from '../e2e/utils/test_server_controller';

export async function usingASelfSignedCertificateAdvanced() {
  const client = new OPCUAClient({
    securityMode: MessageSecurityMode.SignAndEncrypt,
    securityPolicy: SecurityPolicy.Basic256Sha256,
    endpoint_must_exist: false,
    // !!!!!!!!!!!!!!! creates the self signed certificate !!!!!!!!!!!!!!!!!!
    clientCertificateStore: new SelfSignedCertificateStore({
      signatureAlgorithm: {
        identifier: 'sha256WithRSAEncryption',
      },
      tbsCertificate: {
        issuer: {
          commonName: 'www.test.com',
          countryName: 'AT',
          organizationName: 'Test',
        },
        validity: {
          notAfter: new Date(2200, 2, 2, 2, 2),
          notBefore: new Date(2022, 1, 1, 1),
        },
      },
    }),
    // ----------------------------------------------------------------------
  });

  // connection
  await client.connectP(OPCUA_TEST_SERVER_URI);
  console.log('connected');

  // create session
  const session = await client.createSessionP({
    userIdentityInfo: { userName: 'john', password: 'john_pw' },
  });
  console.log('session created');

  return { client, session };
}
