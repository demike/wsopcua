# Certificates

wsopcua supports client certificates by means of utilizing different
[CertificateStore](../src/common/certificate_store.ts) implementations:

## NullCertificateStore

This is the default 'dummy' store that does not provide a client certificate at all.

## PEMDERCertificateStore

This store takes certificates and private keys in string (PEM) or Uint8Array (DER) form.

## SelfSignedCertifcateStore

This store generates self signed certificates on the fly.
It can be used without any parameters.

<!-- add-file: ../src/examples/selfsigned.certificate.example.ts -->

And for advanced usage scenarios it is possible to customize nearly every aspect of the self-signed certificate.

<!-- add-file: ../src/examples/selfsigned.certificate.advanced.example.ts -->
