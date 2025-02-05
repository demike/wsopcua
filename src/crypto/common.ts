export type Nonce = Uint8Array<ArrayBufferLike>;

export type PEM = string;
export type DER = Uint8Array;
export type Certificate = DER;
export type CertificatePEM = PEM; // certificate as a PEM string
export type PrivateKeyPEM = PEM;
export type PublicKey = DER;
export type PublicKeyPEM = PEM;

export type Signature = ArrayBuffer;

/**
 * holds the
 */
export interface PrivateKey {
  getDecryptKey(hashingAlgorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<CryptoKey>;
  getSignKey(
    hashingAlgorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512',
    asymmetricSignatureAlgorithm?: // default 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
    | 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
      | 'http://www.w3.org/2000/09/xmldsig#rsa-pss'
      | 'http://www.w3.org/2000/09/xmldsig#rsa-sha256'
  ): Promise<CryptoKey>;
}
