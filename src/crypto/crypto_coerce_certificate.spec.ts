import { coerceCertificateInfo } from './crypto_coerce_certificate';

describe('coerceCertificateInfo', () => {
  it('OPC UA Part 6 6.2.2 subject: should default the certificate commonName to the applicationName', () => {
    const certificate = coerceCertificateInfo(undefined, {
      applicationName: 'Unit Test Client',
    });

    expect(certificate.tbsCertificate.subject.commonName).toBe('Unit Test Client');
  });

  it('OPC UA Part 6 6.2.2 subject: should preserve the organizationName supplied for the application instance', () => {
    const certificate = coerceCertificateInfo(undefined, {
      applicationName: 'Unit Test Client',
      organizationName: 'Spec Test Org',
    });

    expect(certificate.tbsCertificate.subject.organizationName).toBe('Spec Test Org');
  });

  it('OPC UA Part 6 6.2.2 subjectAltName: should include the applicationUri and not inject a client dNSName by default', () => {
    const certificate = coerceCertificateInfo(undefined, {
      applicationUri: 'urn:unit:test:client',
    });

    expect(
      certificate.tbsCertificate.extensions?.subjectAltName?.uniformResourceIdentifier
    ).toEqual(['urn:unit:test:client']);
    expect(certificate.tbsCertificate.extensions?.subjectAltName?.dNSName).toBeUndefined();
  });

  it('OPC UA Part 6 6.2.2 keyUsage and extendedKeyUsage: should default a self-signed client certificate to clientAuth and include keyCertSign', () => {
    const certificate = coerceCertificateInfo();

    expect(certificate.tbsCertificate.extensions?.keyUsage).toMatchObject({
      dataEncipherment: true,
      digitalSignature: true,
      keyCertSign: true,
      keyEncipherment: true,
      nonRepudiation: true,
    });
    expect(certificate.tbsCertificate.extensions?.extKeyUsage).toMatchObject({
      clientAuth: true,
      serverAuth: false,
    });
  });

  it('OPC UA Part 6 6.2.2 basicConstraints: should default application instance certificates to non-CA', () => {
    const certificate = coerceCertificateInfo();

    expect(certificate.tbsCertificate.extensions?.basicConstraints).toMatchObject({
      cA: false,
      critical: true,
    });
    expect(
      certificate.tbsCertificate.extensions?.basicConstraints.pathLengthConstraint
    ).toBeUndefined();
  });
});
