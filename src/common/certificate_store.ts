import { AlgorithmIdentifier, TagType, _readObjectIdentifier, _readStruct, readTag } from '../crypto/asn1';
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
 * Detect an EC PKCS#8 private key via its AlgorithmIdentifier OID
 * (1.2.840.10045.2.1 = ecPublicKey). Falls back to a raw OID byte-scan when
 * the DER does not parse as PKCS#8 (e.g. SEC1), in which case it returns false
 * unless the ecPublicKey OID bytes are present.
 */
function isEcPrivateKeyDER(der: Uint8Array): boolean {
  try {
    // PKCS#8 PrivateKeyInfo ::= SEQUENCE { version INTEGER, algorithm
    // AlgorithmIdentifier, privateKey OCTET STRING [, attributes] }
    const outer = readTag(der, 0);
    if (outer.tag !== TagType.SEQUENCE) {
      return hasEcPublicKeyOidBytes(der);
    }
    const parts = _readStruct(der, outer);
    if (parts.length < 3 || parts[1].tag !== TagType.SEQUENCE) {
      return hasEcPublicKeyOidBytes(der);
    }
    const algParts = _readStruct(der, parts[1]);
    if (algParts.length < 1 || algParts[0].tag !== TagType.OBJECT_IDENTIFIER) {
      return hasEcPublicKeyOidBytes(der);
    }
    const { oid, name } = _readObjectIdentifier(der, algParts[0]);
    return oid === '1.2.840.10045.2.1' || name === 'ecPublicKey';
  } catch {
    return hasEcPublicKeyOidBytes(der);
  }
}

function hasEcPublicKeyOidBytes(der: Uint8Array): boolean {
  // OID 1.2.840.10045.2.1 (ecPublicKey) DER encoding
  const marker = [0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01];
  outer: for (let i = 0; i + marker.length <= der.byteLength; i++) {
    for (let j = 0; j < marker.length; j++) {
      if (der[i + j] !== marker[j]) {
        continue outer;
      }
    }
    return true;
  }
  return false;
}

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
    algorithm?:
      | 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
      | 'http://www.w3.org/2000/09/xmldsig#rsa-sha256'
      | 'http://www.w3.org/2000/09/xmldsig#rsa-pss'
      | 'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256'
      | 'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha384'
  ): Promise<CryptoKey> {
    if (
      algorithm === 'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256' ||
      (algorithm === undefined && hashingAlgorithm === 'SHA-256' && isEcPrivateKeyDER(this.privateKeyDER))
    ) {
      return generateSignKeyFromDER(this.privateKeyDER, 'SHA-256', 'ECDSA', 'P-256');
    }
    if (
      algorithm === 'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha384' ||
      (algorithm === undefined && hashingAlgorithm === 'SHA-384' && isEcPrivateKeyDER(this.privateKeyDER))
    ) {
      return generateSignKeyFromDER(this.privateKeyDER, 'SHA-384', 'ECDSA', 'P-384');
    }
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
