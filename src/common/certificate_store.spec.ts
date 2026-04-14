import { exploreCertificate } from '../crypto';
import { SelfSignedCertificateStore } from './certificate_store';

describe('SelfSignedCertificateStore', () => {
  it('OPC UA Part 6 6.2.2: should generate a self-signed client certificate with matching SAN URI, client key usages and non-CA basicConstraints', async () => {
    const applicationUri = 'urn:spec.example:ClientApp';
    const applicationName = 'Spec Client';
    const store = new SelfSignedCertificateStore({
      spkiModulusLength: 1024,
      tbsCertificate: {
        extensions: {
          subjectAltName: {
            uniformResourceIdentifier: ['urn:stale:value'],
          },
        },
      },
    });

    await store.init({ applicationName, applicationUri });

    const certificate = store.getCertificate();
    expect(certificate).toBeDefined();

    const explored = await exploreCertificate(certificate!);
    expect(explored.tbsCertificate.extensions?.subjectAltName?.uniformResourceIdentifier).toEqual([
      applicationUri,
      'urn:stale:value',
    ]);
    expect(explored.tbsCertificate.extensions?.subjectAltName?.dNSName).toBeUndefined();
    expect(explored.tbsCertificate.subject.commonName).toBe(applicationName);
    expect(explored.tbsCertificate.extensions?.keyUsage?.keyCertSign).toBe(true);
    expect(explored.tbsCertificate.extensions?.extKeyUsage?.clientAuth).toBe(true);
    expect(explored.tbsCertificate.extensions?.extKeyUsage?.serverAuth).toBe(false);
    expect(explored.tbsCertificate.extensions?.basicConstraints.cA).toBe(false);
  }, 20000);
});
