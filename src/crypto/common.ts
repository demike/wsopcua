export type Nonce = Uint8Array;

export type PEM = string;
export type DER = Uint8Array;
export type Certificate = DER;
export type CertificatePEM = PEM; // certificate as a PEM string
export type PrivateKey = DER;
export type PrivateKeyPEM = PEM;
export type PublicKey = DER;
export type PublicKeyPEM = PEM;

export type Signature = ArrayBuffer;
