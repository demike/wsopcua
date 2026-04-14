import { AlgorithmIdentifier, readTag } from '../crypto/asn1';
import {
  CertificateCoercionOptions,
  coerceCertificateInfo,
} from '../crypto/crypto_coerce_certificate';
import {
  CertificateInternals,
  convertPEMtoDER,
  DER,
  generatePrivateKeyFromDER,
  generateSignKeyFromDER,
  PrivateKey,
  readSubjectPublicKeyInfo,
  split_der,
  SubjectPublicKeyInfo,
  TbsCertificate,
  writeCertificate,
} from '../crypto';

/**
 * The certificate store holds the certificate and the private key
 * for a simple implementation take a look at @type {PEMDERCertificateStore}
 */

export interface CertificateStore {
  /**
   * @returns client certificate DER
   */
  getCertificate(): Uint8Array | undefined;

  /**
   * @returns client certificate chain DER
   */
  getCertificateChain(): Uint8Array | undefined;

  /**
   * @returns the crypto key
   */
  getPrivateKey(): PrivateKey | undefined;

  /**
   * optional initialization method
   * if present will be called during client initialization
   */
  init?(options?: CertificateStoreInitOptions): Promise<void>;
}

export interface CertificateStoreInitOptions {
  applicationUri?: string;
  applicationName?: string;
  organizationName?: string;
}

export interface SelfSignedCertificateStoreOptions extends CertificateStoreInitOptions {
  tbsCertificate?: Partial<TbsCertificate>;
  signatureAlgorithm?: AlgorithmIdentifier;
  spkiModulusLength?: number;
}

function cloneSelfSignedCertificateStoreOptions(
  options?: SelfSignedCertificateStoreOptions
): SelfSignedCertificateStoreOptions {
  return {
    ...options,
    signatureAlgorithm: options?.signatureAlgorithm
      ? { ...options.signatureAlgorithm }
      : options?.signatureAlgorithm,
    tbsCertificate: options?.tbsCertificate ? { ...options.tbsCertificate } : undefined,
  };
}

export class NullCertificateStore implements CertificateStore {
  public getCertificate(): undefined {
    return undefined;
  }
  public getCertificateChain(): undefined {
    return undefined;
  }
  public getPrivateKey(): undefined {
    return undefined;
  }
}

class PrivateKeyImpl implements PrivateKey {
  private privateKeyDER: Uint8Array;
  constructor(privateKeyPEMOrDER: string | Uint8Array) {
    this.privateKeyDER =
      typeof privateKeyPEMOrDER === 'string'
        ? convertPEMtoDER(privateKeyPEMOrDER)
        : privateKeyPEMOrDER;
  }
  getDecryptKey(hashingAlgorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<CryptoKey> {
    return generatePrivateKeyFromDER(this.privateKeyDER, hashingAlgorithm);
  }
  getSignKey(
    hashingAlgorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512',
    algorithm:
      | 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
      | 'http://www.w3.org/2000/09/xmldsig#rsa-sha256'
      | 'http://www.w3.org/2000/09/xmldsig#rsa-pss'
  ): Promise<CryptoKey> {
    const algorithmName =
      algorithm === 'http://www.w3.org/2000/09/xmldsig#rsa-pss' ? 'RSA-PSS' : 'RSASSA-PKCS1-v1_5';
    return generateSignKeyFromDER(this.privateKeyDER, hashingAlgorithm, algorithmName);
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
export class PEMDERCertificateStore implements CertificateStore {
  protected certificateChain: Uint8Array;
  protected certificate: Uint8Array;
  protected privateKey: PrivateKey;

  constructor(certificatePEMOrDER: string | ArrayBuffer, privateKeyPEMOrDER: string | ArrayBuffer) {
    this.certificateChain =
      certificatePEMOrDER instanceof ArrayBuffer
        ? new Uint8Array(certificatePEMOrDER)
        : convertPEMtoDER(certificatePEMOrDER);
    this.certificate = split_der(this.certificateChain)[0];
    this.privateKey = new PrivateKeyImpl(
      privateKeyPEMOrDER instanceof ArrayBuffer
        ? new Uint8Array(privateKeyPEMOrDER)
        : privateKeyPEMOrDER
    );
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

export class SelfSignedCertificateStore implements CertificateStore {
  public readonly spkiModulusLength: number;
  protected certificateChain?: Uint8Array;
  protected certificate?: Uint8Array;
  protected privateKey?: PrivateKey;
  protected options: SelfSignedCertificateStoreOptions;

  constructor(options?: SelfSignedCertificateStoreOptions) {
    this.options = cloneSelfSignedCertificateStoreOptions(options);
    this.spkiModulusLength = options?.spkiModulusLength ?? 2048;
  }
  public getCertificate(): Uint8Array | undefined {
    return this.certificate;
  }
  public getCertificateChain(): Uint8Array | undefined {
    return this.certificateChain;
  }
  public getPrivateKey(): PrivateKey | undefined {
    return this.privateKey;
  }

  public async init(options?: CertificateStoreInitOptions): Promise<void> {
    const coercionOptions: CertificateCoercionOptions = {
      applicationName: options?.applicationName ?? this.options.applicationName,
      applicationUri: options?.applicationUri ?? this.options.applicationUri,
      organizationName: options?.organizationName ?? this.options.organizationName,
    };
    const certificateInfo = coerceCertificateInfo(
      cloneSelfSignedCertificateStoreOptions(this.options),
      coercionOptions
    );

    const keyPair = await this.generateKeyPair(certificateInfo.tbsCertificate.subjectPublicKeyInfo);

    const signingKeyDER = await this.generatePrivateKey(keyPair);
    await this.insertPublicKeyIntoCertificate(keyPair, certificateInfo);
    this.certificateChain = await writeCertificate(certificateInfo, signingKeyDER);
    this.certificate = split_der(this.certificateChain)[0];

    // for testing
    /*
    const file = new Blob([this.certificateChain], { type: 'application/octet-stream' });
    const a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = 'generated_certificate.der';
    document.body.appendChild(a);
    a.click();
    */
  }

  public async generateKeyPair(spki: SubjectPublicKeyInfo): Promise<CryptoKeyPair> {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: this.spkiModulusLength, // TODO: what modulus length should we use?
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256', // TODO: what hashing algorithm should we use?
      },
      true,
      ['encrypt', 'decrypt']
    );

    return keyPair;
  }

  private async insertPublicKeyIntoCertificate(
    keyPair: CryptoKeyPair,
    certificateInfo: CertificateInternals
  ) {
    const spki = new Uint8Array(await crypto.subtle.exportKey('spki', keyPair.publicKey));

    const tag = readTag(spki, 0);
    certificateInfo.tbsCertificate.subjectPublicKeyInfo = readSubjectPublicKeyInfo(spki, tag);
  }

  private async generatePrivateKey(keyPair: CryptoKeyPair): Promise<DER> {
    const pkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const der = new Uint8Array(pkcs8);
    this.privateKey = new PrivateKeyImpl(der);
    return der;
  }
}
