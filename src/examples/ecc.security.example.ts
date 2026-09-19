import { MessageSecurityMode, OPCUAClient, SecurityPolicy } from '../';
import { PEMDERCertificateStore } from '../common';
import { OPCUA_TEST_SERVER_URI } from '../e2e/utils/test_server_controller';

/**
 * Connecting with an ECC SecurityPolicy (OPC UA 1.05).
 *
 * Compared to the RSA policies only two things change:
 * - the policy is EccNistP256 (or EccNistP384), and
 * - the client certificate must be an EC certificate on the matching curve
 *   (P-256 for EccNistP256, P-384 for EccNistP384), e.g.:
 *     openssl ecparam -name prime256v1 -genkey -noout -out client.key.pem
 *     openssl req -new -x509 -key client.key.pem -out client.cert.pem \
 *       -days 365 -sha256 -subj "/CN=wsopcua-ecc-client"
 *
 * The ephemeral ECDH handshake, the sign-only OpenSecureChannel messages and
 * the EccEncryptedSecret user-token protection are handled internally.
 */
export async function usingAnEccSecurityPolicy(certificate: string, privateKey: string) {
  const client = new OPCUAClient({
    securityMode: MessageSecurityMode.SignAndEncrypt,
    securityPolicy: SecurityPolicy.EccNistP256,
    endpoint_must_exist: false,
    // !!!!!!!!!!!!!!! EC certificate store (P-256 key + certificate) !!!!!!!!!!!!!!!!!!
    clientCertificateStore: new PEMDERCertificateStore(certificate, privateKey),
    // --------------------------------------------------------------------------------
  });

  // connection (OpenSecureChannel uses ECDSA signatures + ECDH key agreement)
  await client.connectP(OPCUA_TEST_SERVER_URI);
  console.log('connected');

  // create session (the password is protected as EccEncryptedSecret)
  const session = await client.createSessionP({
    userIdentityInfo: { userName: 'john', password: 'john_pw' },
  });
  console.log('session created');

  return { client, session };
}
