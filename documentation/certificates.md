# Certificates

wsopcua supports client certificates by means of utilizing different
[CertificateStore](../src/common/certificate_store.ts) implementations.

To be able to utilize client certificates it is necessary that `crypto/subtle` is available.
This is the case in secure contexts and therfore the application has to be served by means of **https**!

You can provide your own Store by implementing the `CertificateStore` interface or by deriving from one of the existing implementations:

## NullCertificateStore

This is the default 'dummy' store that does not provide a client certificate at all.

## PEMDERCertificateStore

This store takes certificates and private keys in string (PEM) or Uint8Array (DER) format.

<!-- add-file: ../src/examples/pemder.certificate.example.ts -->

## SelfSignedCertifcateStore

This store generates self signed certificates on the fly.
It can be used without any parameters.

<!-- add-file: ../src/examples/selfsigned.certificate.example.ts -->

``` ts markdown-add-files
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

```

And for advanced usage scenarios it is possible to customize nearly every aspect of the self-signed certificate.

<!-- add-file: ../src/examples/selfsigned.certificate.advanced.example.ts -->

``` ts markdown-add-files
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

```
