import { AlgorithmIdentifier, DirectoryName } from './asn1';
import {
  BasicConstraints,
  CertificateExtension,
  CertificateInternals,
  SubjectPublicKeyInfo,
  TbsCertificate,
  Validity,
} from './crypto_explore_certificate';

export interface CertificateCoercionOptions {
  applicationName?: string;
  applicationUri?: string;
  organizationName?: string;
}

export function coerceCertificateInfo(
  info?: {
    tbsCertificate?: Partial<TbsCertificate>;
    signatureAlgorithm?: AlgorithmIdentifier;
  },
  options?: CertificateCoercionOptions
): CertificateInternals {
  info = info ?? {};
  info.signatureAlgorithm = coerceSignatureAlgorithm(info?.signatureAlgorithm);
  (info as CertificateInternals).signatureValue =
    (info as CertificateInternals)?.signatureValue ?? '';
  info.tbsCertificate = coerceTbsCertificate(info?.tbsCertificate, options);
  return info as CertificateInternals;
}

function coerceSignatureAlgorithm(identifier?: AlgorithmIdentifier): AlgorithmIdentifier {
  return identifier ?? { identifier: 'sha256WithRSAEncryption' };
}

function coerceTbsCertificate(
  cert?: Partial<TbsCertificate>,
  options?: CertificateCoercionOptions
): TbsCertificate {
  let subject = coerceTbsCertificateSubject(cert?.subject, options);
  let issuer = coerceTbsCertificateSubject(cert?.issuer, options);

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
    extensions: coerceTbsCertificateExtensions(cert?.extensions, options),
  };
}

function coerceTbsCertificateExtensions(
  extensions?: CertificateExtension | null,
  options?: CertificateCoercionOptions
): CertificateExtension | null {
  const uniformResourceIdentifier = coerceSubjectAltNameUris(
    extensions?.subjectAltName?.uniformResourceIdentifier,
    options?.applicationUri
  );

  return {
    ...extensions,
    keyUsage: {
      dataEncipherment: true,
      keyEncipherment: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyCertSign: true,
      cRLSign: false,
      decipherOnly: false,
      encipherOnly: false,
      keyAgreement: false,
      ...extensions?.keyUsage,
    },
    extKeyUsage: {
      serverAuth: false,
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
      /*
      iPAddress: ['c0a8650a'],
      rfc822Name: ['testemail'],
      registeredID: ['1.2.3.4.5.5'],
      */
      ...extensions?.subjectAltName,
      uniformResourceIdentifier,
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

function coerceSubjectAltNameUris(existingUris?: string[], applicationUri?: string): string[] {
  const uniqueUris = new Set((existingUris ?? []).filter((uri) => !!uri));

  if (applicationUri) {
    uniqueUris.delete(applicationUri);
    return [applicationUri, ...uniqueUris];
  }
  if (uniqueUris.size > 0) {
    return [...uniqueUris];
  }
  return ['urn:wsopcua:application'];
}

function coerceTbsCertificateSubject(
  subject?: DirectoryName,
  options?: CertificateCoercionOptions
): DirectoryName {
  return omitUndefinedDirectoryNameFields({
    commonName: options?.applicationName ?? 'NodeOPCUA-Client',
    countryName: '--',
    localityName: '--',
    organizationName: options?.organizationName,
    organizationalUnitName: 'wsopcua',
    stateOrProvinceName: '--',
    ...subject,
  });
}

function omitUndefinedDirectoryNameFields(subject: DirectoryName): DirectoryName {
  return Object.fromEntries(
    Object.entries(subject).filter(([, value]) => value !== undefined)
  ) as DirectoryName;
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
  const basicConstraints: BasicConstraints = {
    critical: true,
    cA: false,
    ...constraints,
  };

  if (basicConstraints.cA && basicConstraints.pathLengthConstraint === undefined) {
    basicConstraints.pathLengthConstraint = 0;
  }

  return basicConstraints;
}
