import { MessageSecurityMode, OPCUAClient, SecurityPolicy } from '../';
import { SelfSignedCertificateStore } from '../common';
import { OPCUA_TEST_SERVER_URI } from '../e2e/utils/test_server_controller';

export async function usingASelfSignedCertificate() {
  const client = new OPCUAClient({
    securityMode: MessageSecurityMode.SignAndEncrypt,
    securityPolicy: SecurityPolicy.Basic256Sha256,
    endpoint_must_exist: false,
    // !!!!!!!!!!!!!!! creates the self signed certificate !!!!!!!!!!!!!!!!!!
    clientCertificateStore: new SelfSignedCertificateStore(),
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
