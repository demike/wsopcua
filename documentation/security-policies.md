# Security Policies

wsopcua supports the OPC UA Client/Server SecurityPolicies below. All cryptography runs
through WebCrypto (`crypto/subtle`), so a secure context (https) is required wherever
asymmetric operations are used — see [Certificates](./certificates.md).

## RSA policies

| Policy | Symmetric | Key derivation |
| --- | --- | --- |
| `None` | — | — |
| `Basic128Rsa15` (deprecated) | AES-128-CBC, HMAC-SHA1 | P_SHA1 |
| `Basic256` (deprecated) | AES-256-CBC, HMAC-SHA1 | P_SHA1 |
| `Basic256Sha256` | AES-256-CBC, HMAC-SHA256 | P_SHA256 |
| `Aes128_Sha256_RsaOaep` | AES-128-CBC, HMAC-SHA256 | P_SHA256 |
| `Aes256_Sha256_RsaPss` | AES-256-CBC, HMAC-SHA256 | P_SHA256 |

## ECC policies (OPC UA 1.05)

| Policy | Curve | Symmetric | Key derivation |
| --- | --- | --- | --- |
| `EccNistP256` | NIST P-256 | AES-128-CBC, HMAC-SHA256 | HKDF-SHA256 (Part 6 §6.8.1) |
| `EccNistP384` | NIST P-384 | AES-256-CBC, HMAC-SHA384 | HKDF-SHA384 (Part 6 §6.8.1) |

Only the NIST curves are supported: they are the ECC curves from the 1.05 policies
that WebCrypto implements. Brainpool and Curve25519/Curve448 policies are rejected
with an explicit error, as is finite-field RSA-DH.

### How ECC channels work

- **OpenSecureChannel** messages are signed with ECDSA but *not* asymmetrically
  encrypted. Instead both sides generate a fresh ephemeral ECDH key pair per
  handshake and exchange the public keys (`x||y`) as the client/server nonces;
  the shared secret feeds the HKDF key schedule. Token renewals XOR the fresh
  secret with the previous one, per Part 6 §6.8.1.
- **Client certificates must be EC certificates on the matching curve**
  (P-256 for `EccNistP256`, P-384 for `EccNistP384`). RSA certificates are
  rejected during signing/verification.
- **User tokens** (`UserName`, `IssuedToken`) are protected as `EccEncryptedSecret`
  (Part 6 §6.8.3): the client advertises an `ECDHPolicyUri` in the session request
  `AdditionalHeader`, the server answers with a session `EphemeralKey`, and each
  secret gets a fresh sender ephemeral key plus an ECDSA signature. A server key
  is never reused once consumed.

### Example

<!-- add-file: ../src/examples/ecc.security.example.ts -->

``` ts markdown-add-files
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

```

### Developing the ECC codec

The ECC implementation is covered by unit tests plus known-answer vectors generated
independently with Python `cryptography` (`tools/gen_ecc_secret_kat.py`, fixture in
`src/crypto/ecc_secret_kat.ts`). To regenerate the fixture after changing the
`EccEncryptedSecret` construction:

```
npm run kat:regen
```

This rewrites the fixture and re-runs the KAT spec against the fresh vectors, so a
bad regen fails loudly. The committed fixture keeps `npm run test:ci` hermetic
(no Python required).
