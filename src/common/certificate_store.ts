import {
  convertPEMtoDER,
  generatePrivateKeyFromDER,
  generateSignKeyFromDER,
  PrivateKey,
  split_der,
} from '../crypto';
import { getCryptoFactory, SecurityPolicy } from '../secure-channel/security_policy';

/**
 * The certificate store holds the certificate and the private key
 * for a simple implementation take a look at @type {PEMCertificateStore}
 */

export interface CertificateStore {
  /**
   * @returns client certificate DER
   */
  getCertificate(): Uint8Array | null;

  /**
   * @returns client certificate chain DER
   */
  getCertificateChain(): Uint8Array | null;

  /**
   * @returns the crypto key
   */
  getPrivateKey(): PrivateKey | null;
}

export class NullCertificateStore implements CertificateStore {
  public getCertificate(): null {
    return null;
  }
  public getCertificateChain(): null {
    return null;
  }
  public getPrivateKey(): null {
    return null;
  }
}

class PrivateKeyImpl implements PrivateKey {
  private privateKeyDER: Uint8Array;
  constructor(privateKeyPEM: string) {
    this.privateKeyDER = convertPEMtoDER(privateKeyPEM);
  }
  getDecryptKey(hashingAlgorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<CryptoKey> {
    return generatePrivateKeyFromDER(this.privateKeyDER, hashingAlgorithm);
  }
  getSignKey(hashingAlgorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<CryptoKey> {
    return generateSignKeyFromDER(this.privateKeyDER, hashingAlgorithm);
  }
}

/**
 * A basic implementation of the certificateStore, that takes a certificate and a private key in PEM format
 * for example created by: https://certificatetools.com/
 *
 *  key usage:
 *  spec says that certificate shall include digitalSignature, nonRepudiation, keyEncipherment and dataEncipherment.
 * Other key uses are allowed.
 *
 * you also have to add a subjectAltName URI
 * be shure that the subejctAltName matches your applicationUri
 *
 */
export class PEMCertificateStore implements CertificateStore {
  protected certificateChain: Uint8Array;
  protected certificate: Uint8Array;
  protected privateKey: PrivateKeyImpl;
  public signKey?: CryptoKey;

  constructor(private certificatePEM: string, private privateKeyPEM: string) {
    this.certificateChain = convertPEMtoDER(this.certificatePEM);
    this.certificate = split_der(this.certificateChain)[0];
    this.privateKey = new PrivateKeyImpl(privateKeyPEM);
  }
  public getCertificate(): Uint8Array {
    return this.certificate;
  }
  public getCertificateChain(): Uint8Array {
    return this.certificateChain;
  }
  public getPrivateKey(): PrivateKey {
    return this.privateKey ?? null;
  }
}
