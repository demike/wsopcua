import { Asn1Writer } from './asn1_writer';
import {
  AuthorityKeyIdentifier,
  BasicConstraints,
  CertificateExtension,
  CertificateInternals,
  SubjectPublicKey,
  SubjectPublicKeyInfo,
  TbsCertificate,
  Validity,
  X509ExtKeyUsage,
  X509KeyUsage,
} from './crypto_explore_certificate';
import { DirectoryName, SignatureValue, TagType } from './asn1';

import { oid_reverse_map } from './oid_reverse_map';
import { hex2buf } from './crypto_utils';
import { DER } from './common';

/*
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            04:7a:f7:95:47:c0:7d:0f:ef:80:a5:b2:1f:51:e3:63
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = GB, ST = Greater Manchester, L = Salford, O = COMODO CA Limited, CN = COMODO RSA Domain Validation Secure Server CA
        Validity
            Not Before: Mar 12 00:00:00 2018 GMT
            Not After : Mar 11 23:59:59 2020 GMT
        Subject: OU = Domain Control Validated, OU = PositiveSSL, CN = acs.cdroutertest.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:eb:fe:b5:1a:16:0d:49:3f:15:18:99:44:eb:63:
                    ef:e4:7e:de:f7:91:2a:2f:3c:9d:43:57:62:52:92:
                    17:a6:48:0b:de:86:43:6b:77:5c:77:9d:05:6c:64:
                    eb:96:fa:97:c8:f9:93:3e:72:3c:c4:84:f3:e2:98:
                    60:9c:17:92:bf:01:12:a3:20:69:19:16:39:1c:48:
                    0b:e0:db:e2:bc:d0:48:57:4d:a6:0d:1a:a1:3a:51:
                    25:b5:d9:1c:61:ba:34:b7:76:56:15:72:7e:69:eb:
                    07:0f:20:3e:f9:41:56:8b:1b:51:eb:55:cd:9c:61:
                    a1:c8:a1:42:1f:6e:87:5e:a1:1b:68:11:e5:4e:66:
                    36:7c:4a:2c:23:e4:98:71:31:f7:0c:28:ee:1d:65:
                    99:1d:1f:40:1e:da:b5:a4:de:5b:6d:8d:c3:35:3b:
                    06:b4:5d:82:a6:61:27:29:25:ab:71:12:71:9c:0c:
                    f6:68:c1:54:58:3a:1d:a1:ce:ea:10:a6:2d:e0:4a:
                    f5:f4:45:b4:2d:25:37:f5:0e:b2:c3:03:1f:35:73:
                    59:46:36:6a:73:a2:2c:3f:70:c8:e4:26:49:a3:20:
                    8f:38:7c:55:d0:2e:f5:8a:24:00:7b:ce:36:8d:60:
                    5a:7b:c5:4b:66:cd:49:d0:e6:51:6d:b5:9e:a8:68:
                    06:79
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Authority Key Identifier:
                keyid:90:AF:6A:3A:94:5A:0B:D8:90:EA:12:56:73:DF:43:B4:3A:28:DA:E7

            X509v3 Subject Key Identifier:
                CC:31:0F:36:85:92:91:A8:0D:61:46:9E:9C:FE:9E:23:42:B9:D6:92
            X509v3 Key Usage: critical
                Digital Signature, Key Encipherment
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Extended Key Usage:
                TLS Web Server Authentication, TLS Web Client Authentication
            X509v3 Certificate Policies:
                Policy: 1.3.6.1.4.1.6449.1.2.2.7
                  CPS: https://secure.comodo.com/CPS
                Policy: 2.23.140.1.2.1

            X509v3 CRL Distribution Points:

                Full Name:
                  URI:http://crl.comodoca.com/COMODORSADomainValidationSecureServerCA.crl

            Authority Information Access:
                CA Issuers - URI:http://crt.comodoca.com/COMODORSADomainValidationSecureServerCA.crt
                OCSP - URI:http://ocsp.comodoca.com

            X509v3 Subject Alternative Name:
                DNS:acs.cdroutertest.com, DNS:www.acs.cdroutertest.com
    Signature Algorithm: sha256WithRSAEncryption
         44:fd:29:96:b3:ca:c9:b6:10:5e:74:40:14:6a:a0:c4:41:21:
         5b:16:0b:e2:13:eb:8a:25:19:5f:30:73:0f:2b:9e:68:7b:67:
         3b:71:db:a3:72:91:52:db:02:8c:13:b3:fd:71:2e:4a:4c:d1:
         02:6e:7e:1f:0e:0a:cf:bb:29:71:91:42:8a:e8:68:8f:a2:b4:
         d6:52:e4:f4:93:df:13:98:a4:58:e6:77:e4:78:86:ae:ad:73:
         b7:6d:43:25:dd:1f:92:c0:36:97:04:2a:87:40:87:16:16:c3:
         79:13:10:a2:2e:a0:cb:27:0f:ee:c6:5a:1a:5b:55:5b:b7:9d:
         20:12:7c:8b:0d:20:32:3e:8c:c1:5a:56:31:27:0e:fb:4c:d7:
         7a:ad:c5:22:58:ad:97:c7:bd:75:14:bb:e7:58:f5:c8:f6:49:
         f8:43:68:13:2e:d4:3a:67:02:13:e8:35:50:05:df:d9:32:90:
         e1:c6:bb:b0:aa:52:fb:4f:1f:92:dd:d3:55:7a:28:67:91:be:
         c0:5c:b7:7b:74:37:0e:d8:69:36:f5:74:b9:a3:61:7c:29:31:
         3e:8b:51:a2:df:fc:f4:dc:48:93:46:c9:b2:35:30:6c:48:66:
         2a:6e:f5:6f:17:d7:2b:07:b4:c4:b9:67:65:67:1a:d8:76:80:
         8f:ff:fd:ef
-----BEGIN CERTIFICATE-----
MIIFTjCCBDagAwIBAgIQBHr3lUfAfQ/vgKWyH1HjYzANBgkqhkiG9w0BAQsFADCB
kDELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4G
A1UEBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxNjA0BgNV
BAMTLUNPTU9ETyBSU0EgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBD
QTAeFw0xODAzMTIwMDAwMDBaFw0yMDAzMTEyMzU5NTlaMFIxITAfBgNVBAsTGERv
bWFpbiBDb250cm9sIFZhbGlkYXRlZDEUMBIGA1UECxMLUG9zaXRpdmVTU0wxFzAV
BgNVBAMTDmFjcy5xYWNhZmUuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEA6/61GhYNST8VGJlE62Pv5H7e95EqLzydQ1diUpIXpkgL3oZDa3dcd50F
bGTrlvqXyPmTPnI8xITz4phgnBeSvwESoyBpGRY5HEgL4NvivNBIV02mDRqhOlEl
tdkcYbo0t3ZWFXJ+aesHDyA++UFWixtR61XNnGGhyKFCH26HXqEbaBHlTmY2fEos
I+SYcTH3DCjuHWWZHR9AHtq1pN5bbY3DNTsGtF2CpmEnKSWrcRJxnAz2aMFUWDod
oc7qEKYt4Er19EW0LSU39Q6ywwMfNXNZRjZqc6IsP3DI5CZJoyCPOHxV0C71iiQA
e842jWBae8VLZs1J0OZRbbWeqGgGeQIDAQABo4IB3zCCAdswHwYDVR0jBBgwFoAU
kK9qOpRaC9iQ6hJWc99DtDoo2ucwHQYDVR0OBBYEFMwxDzaFkpGoDWFGnpz+niNC
udaSMA4GA1UdDwEB/wQEAwIFoDAMBgNVHRMBAf8EAjAAMB0GA1UdJQQWMBQGCCsG
AQUFBwMBBggrBgEFBQcDAjBPBgNVHSAESDBGMDoGCysGAQQBsjEBAgIHMCswKQYI
KwYBBQUHAgEWHWh0dHBzOi8vc2VjdXJlLmNvbW9kby5jb20vQ1BTMAgGBmeBDAEC
ATBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3JsLmNvbW9kb2NhLmNvbS9DT01P
RE9SU0FEb21haW5WYWxpZGF0aW9uU2VjdXJlU2VydmVyQ0EuY3JsMIGFBggrBgEF
BQcBAQR5MHcwTwYIKwYBBQUHMAKGQ2h0dHA6Ly9jcnQuY29tb2RvY2EuY29tL0NP
TU9ET1JTQURvbWFpblZhbGlkYXRpb25TZWN1cmVTZXJ2ZXJDQS5jcnQwJAYIKwYB
BQUHMAGGGGh0dHA6Ly9vY3NwLmNvbW9kb2NhLmNvbTAtBgNVHREEJjAkgg5hY3Mu
cWFjYWZlLmNvbYISd3d3LmFjcy5xYWNhZmUuY29tMA0GCSqGSIb3DQEBCwUAA4IB
AQBE/SmWs8rJthBedEAUaqDEQSFbFgviE+uKJRlfMHMPK55oe2c7cdujcpFS2wKM
E7P9cS5KTNECbn4fDgrPuylxkUKK6GiPorTWUuT0k98TmKRY5nfkeIaurXO3bUMl
3R+SwDaXBCqHQIcWFsN5ExCiLqDLJw/uxloaW1Vbt50gEnyLDSAyPozBWlYxJw77
TNd6rcUiWK2Xx711FLvnWPXI9kn4Q2gTLtQ6ZwIT6DVQBd/ZMpDhxruwqlL7Tx+S
3dNVeihnkb7AXLd7dDcO2Gk29XS5o2F8KTE+i1Gi3/z03EiTRsmyNTBsSGYqbvVv
F9crB7TEuWdlZxrYdoCP//3v
-----END CERTIFICATE-----
*/

/*
Structured DER file content:
Lines 4, 5, 6 is the HEX encoding of OID.
Lines 13 to 20 is the modulus (n).
Line 22 is the public exponent.


 1:30 81 9F          // Type: 30 (SEQUENCE)          Length: 0x9F
 2:|  30 0D          // Type: 30 (SEQUENCE)          Length: 0x0D
 3:|  |  06 09       // Type: 06 (OBJECT_IDENTIFIER) Length: 0x09
 4:|  |  -  2A 86 48 // 9 bytes OID value. HEX encoding of
 5:|  |  -  86 F7 0D //     1.2.840.113549.1.1.1
 6:|  |  -  01 01 01
 7:|  |  05 00       // Type: 05 (NULL)              Length: 0x00
 8:|  03 81 8D       // Type: 03 (BIT STRING)        Length: 0x8D
 9:|  |  -  00       // Number of unused bits in last content byte
10:|  |  30 81 89    // Type: 30 (SEQUENCE)          Length: 0x89
11:|  |  |  02 81 81 // Type: 02 (INTEGER)           Length: 0x81
12:|  |  |  -  00    // Leading ZERO of integer
13:|  |  |  -  D1 14 D5 3E FB DD DA 12 FC F7 71 5F 0B 49 43 FD
14:|  |  |  -  89 BD E2 53 14 FB 4A E7 DD 55 77 20 54 52 BD 33
15:|  |  |  -  70 58 CE FA E8 03 5B 8E FE 96 AB 14 E2 40 05 39
16:|  |  |  -  0D 85 33 CF 3F FE A6 8E B5 36 08 F1 19 27 5C C8
17:|  |  |  -  92 96 92 34 9A EB 86 9A 7F AC D3 0E F6 7C 8B 60
18:|  |  |  -  F1 AC F4 C7 DD 06 25 94 3E 61 D6 E6 66 35 A0 3D
19:|  |  |  -  32 7B 89 B2 D2 D1 2C 1C E9 60 1C 2F 00 84 0F 0E
20:|  |  |  -  B6 21 EB E8 86 34 6A 05 E6 1F FC B9 62 64 96 6F
21:|  |  |  02 03          // Type: 02 (INTEGER)     Length: 0x3
22:|  |  |  -  01 00 01    // Public Exponent. Hex for 65537

extension are following

*/

export async function writeCertificate(cert: CertificateInternals, signingKeyDer?: DER) {
  const writer = new Asn1Writer({ size: 4096 });
  writer.startSequence();
  writeTbsCertificate(writer, cert.tbsCertificate);
  let signedCertBuf: Uint8Array | undefined;
  if (signingKeyDer) {
    const tbsCertBuf = writer.getBuffer(true).subarray(4, writer.offset);
    const key = await createSigningKey(signingKeyDer, cert.signatureAlgorithm.identifier);
    signedCertBuf = await signCertificate(key, tbsCertBuf);
  }
  writeAlgorithmIdentifier(writer, cert.signatureAlgorithm.identifier);
  writeSignatureValue(writer, signedCertBuf ?? cert.signatureValue);
  writer.endSequence();
  return writer.buffer;
}

function writeTbsCertificate(writer: Asn1Writer, tbsCert: TbsCertificate) {
  writer.startSequence();

  if (tbsCert.version > 1) {
    // write version value: version 3 (0x02)
    writeVersion(writer, tbsCert.version);
  }
  // write the serial number:  (tag: 0x2 (integer))
  writer.writeBuffer(
    bufferFromFormated2DigitHexWithColumString(tbsCert.serialNumber),
    TagType.INTEGER
  );
  // write signature identifier
  writeAlgorithmIdentifier(writer, tbsCert.signature.identifier);

  // write the issuer
  writeName(writer, tbsCert.issuer);
  // write validity
  writeValidity(writer, tbsCert.validity);
  // write the subject
  writeName(writer, tbsCert.subject);

  if (tbsCert.version === 1) {
    writeSubjectPublicKeyInfo(writer, tbsCert.subjectPublicKeyInfo);
  } else {
    // version 3
    switch (tbsCert.subjectPublicKeyInfo.algorithm) {
      case 'rsaEncryption': {
        writeSubjectPublicKeyInfo(writer, tbsCert.subjectPublicKeyInfo);
        break;
      }
      case 'ecPublicKey':
      default: {
        throw new Error('NOT IMPLEMENTED');
        // writeSubjectECCPublicKeyInfo(writer, tbsCert.subjectPublicKeyInfo);
        break;
      }
    }

    // write extensions

    if (tbsCert.extensions) {
      writeExtensions(writer, tbsCert.extensions);
    }
  }

  writer.endSequence();
}

function writeAlgorithmIdentifier(writer: Asn1Writer, identiferName: string) {
  /*
   tag: 0x30 length ...
        tag: 0x6 OID, length: xxx
        tag: 0x5 NULL
  */

  writer.startSequence();
  writer.writeOID(oid_reverse_map.getOidByName(identiferName));
  writer.writeNull();
  writer.endSequence();
}

function writeSignatureValue(writer: Asn1Writer, signature: SignatureValue | Uint8Array) {
  if (typeof signature === 'string') {
    const val = signature.match(/.{1,2}/g)?.map((str) => parseInt(str, 16));
    signature = new Uint8Array(val || []);
  }
  return writer.writeBitString(signature);
}

async function signCertificate(signingKey: CryptoKey, tbsCert: Uint8Array): Promise<Uint8Array> {
  const signed = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', signingKey, tbsCert);
  return new Uint8Array(signed);
}

async function createSigningKey(
  signingKeyDer: DER,
  signatureAlgorithmIdentifier: string
): Promise<CryptoKey> {
  // example: sha256WithRSAEncryption
  const arIdentifier = signatureAlgorithmIdentifier.split('With');
  if (arIdentifier.length < 2) {
    throw new Error(`malformed signature algorithm identifier: ${signatureAlgorithmIdentifier}
    , should be something like "sha256WithRSAEncryption"`);
  }

  let hash = 'SHA-256';
  switch (arIdentifier[0]) {
    case 'sha256':
      hash = 'SHA-256';
      break;
    case 'sha1':
      hash = 'SHA-1';
      break;
    case 'sha512':
      hash = 'SHA-512';
      break;
    case 'sha384':
      hash = 'SHA-384';
      break;
  }

  const signingKey = await crypto.subtle.importKey(
    'pkcs8',
    signingKeyDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash,
    },
    false,
    ['sign']
  );

  return signingKey;
}

function writeSubjectPublicKeyInfo(writer: Asn1Writer, spki: SubjectPublicKeyInfo) {
  writer.startSequence();
  // algorithm identifier
  writeAlgorithmIdentifier(writer, spki.algorithm);
  writeSubjectPublicKey(writer, spki.subjectPublicKey);
  writer.endSequence();
}

export function bufferFromFormated2DigitHexWithColumString(formated: string): Uint8Array {
  const hexvalues: string[] = formated.split(':');
  const buffer = new Uint8Array(hexvalues.length);

  for (let i = 0; i < hexvalues.length; i++) {
    buffer[i] = parseInt(hexvalues[i], 16);
  }

  return buffer;
}

function writeVersion(writer: Asn1Writer, version: number) {
  /*
    tag: 0xa0  length: 3
        tag: 0x2 (Integer) length: 1 value: 3
  */
  writer.writeByte(0xa0); // context specific
  writer.writeLength(3);
  writer.writeInt(version - 1);
}

function writeSubjectPublicKey(writer: Asn1Writer, subjectPublicKey: SubjectPublicKey) {
  //  writer.startSequence(/* TODO */);
  // write modulus
  writer.startSequence(TagType.BIT_STRING);
  writer.writeByte(0);
  writer.startSequence();
  writer.writeBitString(subjectPublicKey.modulus, TagType.INTEGER);
  // TODO: check how to write exponent
  writer.writeInt(0x010001 /* 65537 */);
  writer.endSequence();
  writer.endSequence(); // end bit string

  //  writer.endSequence();
}

function writeName(writer: Asn1Writer, nameMap: { [key: string]: string } | DirectoryName) {
  /*
  tag: 48 (sequence), length: xxx
      tag: 49: length: xx
          tag: 48 (sequence)
              tag: 6 (OID)
              tag: 12 (UTF8String)
      tag: 49: length: yy
          tag: 48 (sequence)
              tag: 6 (OID)
              tag: 12 (UTF8String)
      tag: 49: length: yy
          tag: 48 (sequence)
              tag: 6 (OID)
              tag: 12 (UTF8String)
      tag: 49: length: yy
          tag: 48 (sequence)
              tag: 6 (OID)
              tag: 12 (UTF8String)
      tag: 49: length: zz
          tag: 48 (sequence)
              tag: 6 (OID)
              tag: 12 (UTF8String)
  */

  writer.startSequence(TagType.SEQUENCE); /* tag 48 start sequence */
  for (const [key, value] of Object.entries(nameMap)) {
    writer.startSequence(TagType.SET); // tag 49
    {
      writer.startSequence(TagType.SEQUENCE); // tag 48
      {
        const oid = oid_reverse_map.getOidByName(key) ?? key;
        writer.writeOID(oid); // tag 6

        // TODO: find a generic solution for types
        const tagType = key === 'countryName' ? TagType.PrintableString : TagType.UTF8String;
        writer.writeString(value, tagType); // tag 12 (or in case of countryName 19)
      }
      writer.endSequence(); // end tag 48
    }
    writer.endSequence(); // end tag 49
  }
  writer.endSequence(); // end sequence
}

function writeValidity(writer: Asn1Writer, validity: Validity) {
  /*
  tag: 48
    tag:23
    tag:24
  end tag: 48
  */
  writer.startSequence();
  writer.writeTime(validity.notBefore, TagType.UTCTime);
  writer.writeTime(validity.notAfter, TagType.GeneralizedTime);
  writer.endSequence();
}

function writeExtensions(writer: Asn1Writer, extensions: CertificateExtension) {
  writer.startSequence(0xa3);
  writer.startSequence(); // tag: 48

  if (extensions.basicConstraints) {
    writeBasicConstraint2_5_29_19(writer, extensions.basicConstraints);
  }

  // subject key identifier
  if (extensions.subjectKeyIdentifier) {
    writeSubjectKeyIdentifier(writer, extensions.subjectKeyIdentifier);
  }

  if (extensions.authorityKeyIdentifier) {
    writeAuthorityKeyIdentifier(writer, extensions.authorityKeyIdentifier);
  }

  // certExtension: NOT IMPLEMENTED YET

  if (extensions.keyUsage) {
    writeKeyUsage(writer, extensions.keyUsage);
  }

  if (extensions.extKeyUsage) {
    writeExtKeyUsage(writer, extensions.extKeyUsage);
  }

  if (extensions.subjectAltName) {
    writeSubjectAltName(writer, extensions.subjectAltName);
  }

  writer.endSequence(); // end tag: 48
  writer.endSequence(); // end tag: 163 (0xa3)
}

function writeSubjectKeyIdentifier(writer: Asn1Writer, subjectKeyIdentifier: string) {
  /* from https://tools.ietf.org/html/rfc3280#section-4.1 :
        For CA certificates, subject key identifiers SHOULD be derived from
        the public key or a method that generates unique values.  Two common
        methods for generating key identifiers from the public key are:
          (1) The keyIdentifier is composed of the 160-bit SHA-1 hash of the
          value of the BIT STRING subjectPublicKey (excluding the tag,
          length, and number of unused bits).
          (2) The keyIdentifier is composed of a four bit type field with
          the value 0100 followed by the least significant 60 bits of the
          SHA-1 hash of the value of the BIT STRING subjectPublicKey
          (excluding the tag, length, and number of unused bit string bits).
      */
  const buf = bufferFromFormated2DigitHexWithColumString(subjectKeyIdentifier);

  writer.startSequence();
  writer.writeOID(oid_reverse_map.getOidByName('subjectKeyIdentifier'));
  writer.startSequence(TagType.OCTET_STRING); // tag 4 (yes these are nested octect string tags)
  writer.writeBuffer(buf, TagType.OCTET_STRING); // TODO check if this works
  writer.endSequence(); // end tag 4
  writer.endSequence();
}

function writeSubjectAltName(writer: Asn1Writer, subjectAltNames: { [key: string]: string[] }) {
  writer.startSequence(); // tag 48
  writer.writeOID(oid_reverse_map.getOidByName('subjectAltName')); // tag 6
  writer.startSequence(TagType.OCTET_STRING); // tag 4
  writer.startSequence(); // tag 48
  writeGeneralNames(writer, subjectAltNames);
  writer.endSequence(); // end tag 48
  writer.endSequence(); // end tag 4
  writer.endSequence(); // end tag 48
}

async function writeAuthorityKeyIdentifier(writer: Asn1Writer, identifier: AuthorityKeyIdentifier) {
  writer.startSequence(); // start tag 48
  writer.writeOID(oid_reverse_map.getOidByName('authorityKeyIdentifier')); // tag 6
  writer.startSequence(TagType.OCTET_STRING); // tag 4
  writer.startSequence(); // tag 48

  if (identifier.keyIdentifier) {
    writer.writeBuffer(
      bufferFromFormated2DigitHexWithColumString(identifier.keyIdentifier),
      128 as TagType
    );
  }

  if (identifier.serial) {
    writer.writeBuffer(
      bufferFromFormated2DigitHexWithColumString(identifier.serial),
      130 as TagType
    );
  }

  // TODO: implement authorityCertIssuer writing
  writer.endSequence(); // end tag 48
  writer.endSequence(); // end tag 4
  writer.endSequence(); // end tag 48
}

function writeBasicConstraint2_5_29_19(writer: Asn1Writer, constraints: BasicConstraints) {
  // TODO: further investiage basic constraints
  writer.startSequence(); // start tag 48
  writer.writeOID('2.5.29.19'); // tag 6

  // critical
  writer.writeBoolean(constraints.critical);

  writer.startSequence(TagType.OCTET_STRING); // tag 4
  writer.startSequence();

  if (constraints.cA !== undefined) {
    writer.writeBoolean(constraints.cA);
  }

  if (constraints.pathLengthConstraint !== undefined) {
    writer.writeInt(constraints.pathLengthConstraint);
  }

  writer.endSequence(); // end tag 48
  writer.endSequence(); // end tag 4
  writer.endSequence(); // end tag 48
}

function writeKeyUsage(writer: Asn1Writer, usage: X509KeyUsage) {
  let bitSet1 = 0;
  let bitSet2 = 0;
  if (usage.digitalSignature) {
    bitSet1 += 0x80;
  }
  if (usage.nonRepudiation) {
    bitSet1 += 0x40;
  }

  if (usage.keyEncipherment) {
    bitSet1 += 0x20;
  }

  if (usage.dataEncipherment) {
    bitSet1 += 0x10;
  }

  if (usage.keyAgreement) {
    bitSet1 += 0x08;
  }

  if (usage.keyCertSign) {
    bitSet1 += 0x04;
  }

  if (usage.cRLSign) {
    bitSet1 += 0x02;
  }

  if (usage.encipherOnly) {
    bitSet1 += 0x01;
  }

  if (usage.decipherOnly) {
    bitSet2 += 0x80;
  }

  const buf = bitSet2 > 0 ? new Uint8Array([bitSet1, bitSet2]) : new Uint8Array([bitSet1]);

  writer.startSequence(); // tag:48
  writer.writeOID(oid_reverse_map.getOidByName('keyUsage')); // tag 6

  writer.writeBoolean(true); // write the critical flag

  writer.startSequence(TagType.OCTET_STRING); // tag 4
  writer.writeBitString(buf);
  writer.endSequence(); // end tag 4
  writer.endSequence(); // end tag 48
}

/**
 * see https://tools.ietf.org/html/rfc5280#section-4.2.1.12
 *
 *
 *
 * @param writer
 * @param usage
 */
function writeExtKeyUsage(writer: Asn1Writer, usage: X509ExtKeyUsage) {
  /*
  id-kp OBJECT IDENTIFIER ::= { id-pkix 3 }
    id-kp-serverAuth             OBJECT IDENTIFIER ::= { id-kp 1 }
    -- TLS WWW server authentication
    -- Key usage bits that may be consistent: digitalSignature,
    -- keyEncipherment or keyAgreement
    id-kp-clientAuth             OBJECT IDENTIFIER ::= { id-kp 2 }
    -- TLS WWW client authentication
    -- Key usage bits that may be consistent: digitalSignature
    -- and/or keyAgreement
    id-kp-codeSigning             OBJECT IDENTIFIER ::= { id-kp 3 }
    -- Signing of downloadable executable code
    -- Key usage bits that may be consistent: digitalSignature
    id-kp-emailProtection         OBJECT IDENTIFIER ::= { id-kp 4 }
    -- Email protection
    -- Key usage bits that may be consistent: digitalSignature,
    -- nonRepudiation, and/or (keyEncipherment or keyAgreement)
    id-kp-timeStamping            OBJECT IDENTIFIER ::= { id-kp 8 }
    -- Binding the hash of an object to a time
    -- Key usage bits that may be consistent: digitalSignature
    -- and/or nonRepudiation
    id-kp-OCSPSigning            OBJECT IDENTIFIER ::= { id-kp 9 }
    -- Signing OCSP responses
    -- Key usage bits that may be consistent: digitalSignature
    -- and/or nonRepudiation
   */

  /*
   tag: 48
      tag: 6
      tag: 4
          tag: 48
            tag: 6
            tag: 6
            ....
*/

  writer.startSequence(); // tag 48
  writer.writeOID(oid_reverse_map.getOidByName('extKeyUsage')); // tag 6
  writer.writeBoolean(true); // write the critical flag
  writer.startSequence(TagType.OCTET_STRING); // tag 4
  writer.startSequence(); // tag 48
  // iterate over all ext usages here
  for (const [key, value] of Object.entries(usage)) {
    if (value) {
      writer.writeOID(oid_reverse_map.getOidByName(key));
    }
  }
  writer.endSequence(); // end tag 48
  writer.endSequence(); // end tag 4

  writer.endSequence(); // end tag 48
}

function writeGeneralNames(writer: Asn1Writer, names: { [key: string]: string[] }) {
  const typeMap: { [key: string]: any } = {
    rfc822Name: { id: 1, type: TagType.IA5String },
    dNSName: { id: 2, type: TagType.IA5String },
    x400Address: { id: 3, type: 'ORAddress' },
    directoryName: { id: 4, type: 'Name' },
    ediPartyName: { id: 5, type: 'EDIPartyName' },
    uniformResourceIdentifier: {
      id: 6,
      type: TagType.IA5String,
    },
    iPAddress: { id: 7, name: 'iPAddress', type: TagType.OCTET_STRING },
    registeredID: { id: 8, name: 'registeredID', type: TagType.OBJECT_IDENTIFIER },
  };

  for (const [key, value] of Object.entries(names)) {
    const t = typeMap[key];
    for (const v of value) {
      switch (t.type) {
        case TagType.IA5String:
          writer.writeString(v, t.id + 128);
          break;
        case TagType.OBJECT_IDENTIFIER:
          writer.writeOID(v, t.id + 128);
          break;
        default:
          writer.writeBuffer(hex2buf(v), t.id + 128);
          break;
      }
    }
  }
}
