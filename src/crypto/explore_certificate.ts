/**
 * @module node_opcua_crypto
 */

import { Certificate, CertificatePEM } from './common';
import { exploreCertificate } from './crypto_explore_certificate';
import { convertPEMtoDER } from './crypto_explore_certificate';

import { assert } from '../assert';
import { DirectoryName } from './asn1';

export type PublicKeyLength = 128 | 256 | 384 | 512;

/**
 * A structure exposing useful information about a certificate
 */
export interface CertificateInfo {
  /** the public key length in bits */
  publicKeyLength: PublicKeyLength;
  /** the date at which the certificate starts to be valid */
  notBefore: Date;
  /** the date after which the certificate is not valid any more */
  notAfter: Date;
  /** info about certificate owner */
  subject: DirectoryName;
}

export function coerceCertificate(certificate: Certificate | CertificatePEM): Certificate {
  if (typeof certificate === 'string') {
    certificate = convertPEMtoDER(certificate);
  }
  assert(certificate instanceof Uint8Array);
  return certificate;
}

/**
 * @method exploreCertificateInfo
 * returns useful information about the certificate such as public key length, start date and end of validity date,
 * and CN
 * @param certificate the certificate to explore
 */
export async function exploreCertificateInfo(
  certificate: Certificate | CertificatePEM
): Promise<CertificateInfo> {
  certificate = coerceCertificate(certificate);

  const certInfo = await exploreCertificate(certificate);
  const data: CertificateInfo = {
    publicKeyLength: certInfo.tbsCertificate.subjectPublicKeyInfo.keyLength,
    notBefore: certInfo.tbsCertificate.validity.notBefore,
    notAfter: certInfo.tbsCertificate.validity.notAfter,
    subject: certInfo.tbsCertificate.subject,
  };
  if (
    !(
      data.publicKeyLength === 512 ||
      data.publicKeyLength === 384 ||
      data.publicKeyLength === 256 ||
      data.publicKeyLength === 128
    )
  ) {
    throw new Error(
      'Invalid public key length (expecting 128,256,384 or 512)' + data.publicKeyLength
    );
  }
  return data;
}
