export type Nonce = Uint8Array;

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
  getSignKey(hashingAlgorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<CryptoKey>;
}
