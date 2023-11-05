import { AlgorithmIdentifier, DirectoryName } from './asn1';
import {
  BasicConstraints,
  CertificateExtension,
  CertificateInternals,
  SubjectPublicKeyInfo,
  TbsCertificate,
  Validity,
} from './crypto_explore_certificate';

export function coerceCertificateInfo(info?: {
  tbsCertificate?: Partial<TbsCertificate>;
  signatureAlgorithm?: AlgorithmIdentifier;
}): CertificateInternals {
  info = info ?? {};
  info.signatureAlgorithm = coerceSignatureAlgorithm(info?.signatureAlgorithm);
  (info as CertificateInternals).signatureValue =
    (info as CertificateInternals)?.signatureValue ?? '';
  info.tbsCertificate = coerceTbsCertificate(info?.tbsCertificate);
  return info as CertificateInternals;
}

function coerceSignatureAlgorithm(identifier?: AlgorithmIdentifier): AlgorithmIdentifier {
  return identifier ?? { identifier: 'sha256WithRSAEncryption' };
}

function coerceTbsCertificate(cert?: Partial<TbsCertificate>): TbsCertificate {
  let subject = coerceTbsCertificateSubject(cert?.subject);
  let issuer = coerceTbsCertificateSubject(cert?.subject);

  if (!cert?.subject) {
    subject = issuer;
  }
  if (!cert?.issuer) {
    issuer = subject;
  }
  return {
    issuer,
    version: cert?.version ?? 3,
    serialNumber:
      cert?.serialNumber ?? '01:8A:76:CD:56:F8:A4:D8:15:37:CD:7C:62:D0:17:E9:65:E7:0E:1B',
    signature: coerceSignatureAlgorithm(cert?.signature), // TODO check this
    subject,
    subjectFingerPrint: cert?.subjectFingerPrint ?? '',
    subjectPublicKeyInfo: coerceSPKI(cert?.subjectPublicKeyInfo),
    validity: coerceValidity(cert?.validity),
    extensions: coerceTbsCertificateExtensions(cert?.extensions),
  };
}

function coerceTbsCertificateExtensions(
  extensions?: CertificateExtension | null
): CertificateExtension | null {
  return {
    ...extensions,
    keyUsage: {
      dataEncipherment: true,
      keyEncipherment: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyCertSign: false,
      cRLSign: false,
      decipherOnly: false,
      encipherOnly: false,
      keyAgreement: false,
      ...extensions?.keyUsage,
    },
    extKeyUsage: {
      serverAuth: true,
      clientAuth: true,
      codeSigning: false,
      emailProtection: false,
      timeStamping: false,
      ipsecEndSystem: false,
      ipsecTunnel: false,
      ipsecUser: false,
      ocspSigning: false,
      ...extensions?.extKeyUsage,
    },
    subjectAltName: {
      uniformResourceIdentifier: ['www.wsopcua.com'],
      dNSName: ['www.wsopcua.com'],
      /*
      iPAddress: ['c0a8650a'],
      rfc822Name: ['testemail'],
      registeredID: ['1.2.3.4.5.5'],
      */
      ...extensions?.subjectAltName,
    },
    subjectKeyIdentifier: '3F:B1:C3:54:00:9F:D4:4F:F8:3C:9D:91:35:03:98:20:34:9E:EA:97',
    authorityKeyIdentifier: {
      authorityCertIssuer: null,
      authorityCertIssuerFingerPrint: '',
      serial: null,
      keyIdentifier: '3F:B1:C3:54:00:9F:D4:4F:F8:3C:9D:91:35:03:98:20:34:9E:EA:97',
    },
    basicConstraints: coerceBasicConstraints(extensions?.basicConstraints),
  };
}

function coerceTbsCertificateSubject(subject?: DirectoryName): DirectoryName {
  return {
    commonName: 'www.wsopcua.com',
    countryName: '--',
    localityName: '--',
    organizationName: 'wsopcua',
    organizationalUnitName: 'wsopcua',
    stateOrProvinceName: '--',
    ...subject,
  };
}

function coerceSPKI(spki?: SubjectPublicKeyInfo) {
  return (
    spki ?? {
      algorithm: 'rsaEncryption',
      keyLength: 256,
      subjectPublicKey: { modulus: new Uint8Array(256) },
    }
  );
}

function coerceValidity(validity?: Validity) {
  return (
    validity ?? {
      notAfter: new Date(2200, 3, 15),
      notBefore: new Date(2022, 3, 15),
    }
  );
}

function coerceBasicConstraints(constraints?: BasicConstraints): BasicConstraints {
  return {
    critical: true,
    cA: true,
    pathLengthConstraint: 0,
    ...constraints,
  };
}
