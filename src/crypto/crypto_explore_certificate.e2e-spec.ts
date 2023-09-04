import { convertPEMtoDER, exploreCertificate } from '.';
import { PEMDERCertificateStore } from '../common';
import { writeCertificate } from './crypto_write_certificate';

describe('explore certificate', () => {
  it('should read a certificate and write it again', async () => {
    const clientCertPEM = await fetch('src/test-util/test_cert_full.pem').then((r) => r.text());
    const privateKeyPEM = await fetch('src/test-util/test_privatekey.pem').then((r) => r.text());
    const certStore = new PEMDERCertificateStore(clientCertPEM, privateKeyPEM);

    const origCert = certStore.getCertificate();
    const certInternals = await exploreCertificate(origCert);
    const resultCert = await writeCertificate(certInternals);

    const resultCertInternals = await exploreCertificate(resultCert);

    certInternals.tbsCertificate.subjectFingerPrint = undefined as any;
    resultCertInternals.tbsCertificate.subjectFingerPrint = undefined as any;
    expect(certInternals).toEqual(resultCertInternals);
  });

  xit('sign a certificate when writing it', async () => {
    const clientCertPEM = await fetch('src/test-util/test_cert.pem').then((r) => r.text());
    const privateKeyPEM = await fetch('src/test-util/test_privatekey.pem').then((r) => r.text());
    const certStore = new PEMDERCertificateStore(clientCertPEM, privateKeyPEM);

    const origCert = certStore.getCertificate();

    const signingKeyDER = convertPEMtoDER(privateKeyPEM);
    const certInternals = await exploreCertificate(origCert);
    const resultCert = await writeCertificate(certInternals, signingKeyDER);

    const resultCertInternals = await exploreCertificate(resultCert);

    certInternals.tbsCertificate.subjectFingerPrint = undefined as any;
    resultCertInternals.tbsCertificate.subjectFingerPrint = undefined as any;
    expect(certInternals).toEqual(resultCertInternals);
  });
});
