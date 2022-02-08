'use strict';
/**
 * @module opcua.miscellaneous
 */

import { assert } from '../assert';
import { MessageSecurityMode } from '../generated/MessageSecurityMode';
import { SignatureData } from '../generated/SignatureData';

import * as crypto_utils from '../crypto';
import { DerivedKeys, generateVerifyKeyFromDER, PrivateKey } from '../crypto';
import { debugLog } from '../common/debug';

/**
 * @class SecurityPolicy
 * @static
 *
 * OPCUA Spec Release 1.02  page 15    OPC Unified Architecture, Part 7
 *
 * @property Basic128Rsa15    Security Basic 128Rsa15
 * -----------------------
 *  A suite of algorithms that uses RSA15 as
 *  Key-Wrap-algorithm and 128-Bit for  encryption algorithms.
 *    -> SymmetricSignatureAlgorithm   -   HmacSha1 -(http://www.w3.org/2000/09/xmldsig#hmac-sha1).
 *    -> SymmetricEncryptionAlgorithm  -     Aes128 -(http://www.w3.org/2001/04/xmlenc#aes128-cbc).
 *    -> AsymmetricSignatureAlgorithm  -    RsaSha1 -(http://www.w3.org/2000/09/xmldsig#rsa-sha1).
 *    -> AsymmetricKeyWrapAlgorithm    -    KwRsa15 -(http://www.w3.org/2001/04/xmlenc#rsa-1_5).
 *    -> AsymmetricEncryptionAlgorithm -      Rsa15 -(http://www.w3.org/2001/04/xmlenc#rsa-1_5).
 *    -> KeyDerivationAlgorithm        -      PSha1 -(http://docs.oasis-open.org/ws-sx/ws-secureconversation/200512/dk/p_sha1).
 *    -> DerivedSignatureKeyLength     -  128
 *    -> MinAsymmetricKeyLength        - 1024
 *    -> MaxAsymmetricKeyLength        - 2048
 *    -> CertificateSignatureAlgorithm - Sha1
 *
 * @property Basic256 Security Basic 256:
 * -------------------
 * A suite of algorithms that are for 256-Bit encryption, algorithms include:
 *    -> SymmetricSignatureAlgorithm   - HmacSha1 -(http://www.w3.org/2000/09/xmldsig#hmac-sha1).
 *    -> SymmetricEncryptionAlgorithm  -   Aes256 -(http://www.w3.org/2001/04/xmlenc#aes256-cbc).
 *    -> AsymmetricSignatureAlgorithm  -  RsaSha1 -(http://www.w3.org/2000/09/xmldsig#rsa-sha1).
 *    -> AsymmetricKeyWrapAlgorithm    - KwRsaOaep-(http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p).
 *    -> AsymmetricEncryptionAlgorithm -  RsaOaep -(http://www.w3.org/2001/04/xmlenc#rsa-oaep).
 *    -> KeyDerivationAlgorithm        -    PSha1 -(http://docs.oasis-open.org/ws-sx/ws-secureconversation/200512/dk/p_sha1).
 *    -> DerivedSignatureKeyLength     -  192.
 *    -> MinAsymmetricKeyLength        - 1024
 *    -> MaxAsymmetricKeyLength        - 2048
 *    -> CertificateSignatureAlgorithm - Sha1
 *
 * @property Basic256 Security Basic 256 Sha256
 * --------------------------------------------
 * A suite of algorithms that are for 256-Bit encryption, algorithms include.
 *   -> SymmetricSignatureAlgorithm   - Hmac_Sha256 -(http://www.w3.org/2000/09/xmldsig#hmac-sha256).
 *   -> SymmetricEncryptionAlgorithm  -  Aes256_CBC -(http://www.w3.org/2001/04/xmlenc#aes256-cbc).
 *   -> AsymmetricSignatureAlgorithm  -  Rsa_Sha256 -(http://www.w3.org/2001/04/xmldsig-more#rsa-sha256).
 *   -> AsymmetricKeyWrapAlgorithm    -   KwRsaOaep -(http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p).
 *   -> AsymmetricEncryptionAlgorithm -    Rsa_Oaep -(http://www.w3.org/2001/04/xmlenc#rsa-oaep).
 *   -> KeyDerivationAlgorithm        -     PSHA256 -(http://docs.oasis-open.org/ws-sx/ws-secureconversation/200512/dk/p_sha256).
 *   -> DerivedSignatureKeyLength     - 256
 *   -> MinAsymmetricKeyLength        - 2048
 *   -> MaxAsymmetricKeyLength        - 4096
 *   -> CertificateSignatureAlgorithm - Sha256
 *
 *  Support for this security profile may require support for a second application instance certificate, with a larger
 *  keysize. Applications shall support multiple Application Instance Certificates if required by supported Security
 *  Polices and use the certificate that is required for a given security endpoint.
 *
 *
 */
export enum SecurityPolicy {
  Invalid = 'invalid',
  None = 'http://opcfoundation.org/UA/SecurityPolicy#None',
  Basic128 = 'http://opcfoundation.org/UA/SecurityPolicy#Basic128',
  Basic128Rsa15 = 'http://opcfoundation.org/UA/SecurityPolicy#Basic128Rsa15',
  Basic192 = 'http://opcfoundation.org/UA/SecurityPolicy#Basic192',
  Basic192Rsa15 = 'http://opcfoundation.org/UA/SecurityPolicy#Basic192Rsa15',
  Basic256 = 'http://opcfoundation.org/UA/SecurityPolicy#Basic256',
  Basic256Rsa15 = 'http://opcfoundation.org/UA/SecurityPolicy#Basic256Rsa15',
  Basic256Sha256 = 'http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256',
}

export function fromURI(uri: String): SecurityPolicy {
  // istanbul ignore next
  if (typeof uri !== 'string') {
    return SecurityPolicy.Invalid;
  }
  const a = uri.split('#');
  // istanbul ignore next
  if (a.length < 2) {
    return SecurityPolicy.Invalid;
  }
  const v = SecurityPolicy[a[1] as keyof typeof SecurityPolicy];
  return v || SecurityPolicy.Invalid;
}

export function toUri(value: SecurityPolicy | string): string {
  if (typeof value === 'string') {
    const a: string[] = value.split('#');
    // istanbul ignore next
    if (a.length < 2) {
      return (SecurityPolicy as any)[value as any];
    }
    return value;
  }

  const securityPolicy = value || SecurityPolicy.Invalid;
  if (securityPolicy === SecurityPolicy.Invalid) {
    throw new Error('trying to convert an invalid Security Policy into a URI: ' + value);
  }
  return SecurityPolicy[securityPolicy];
}

export function coerceSecurityPolicy(value?: any): SecurityPolicy {
  if (value === undefined) {
    return SecurityPolicy.None;
  }
  if (
    value === 'Basic128Rsa15' ||
    value === 'Basic256' ||
    value === 'Basic192Rsa15' ||
    value === 'None' ||
    value === 'Basic256Sha256' ||
    value === 'Basic256Rsa15'
  ) {
    return (SecurityPolicy as any)[value as string] as SecurityPolicy;
  }
  if (
    !(
      value === SecurityPolicy.Basic128Rsa15 ||
      value === SecurityPolicy.Basic256 ||
      value === SecurityPolicy.Basic192Rsa15 ||
      value === SecurityPolicy.Basic256Rsa15 ||
      value === SecurityPolicy.Basic256Sha256 ||
      value === SecurityPolicy.None
    )
  ) {
    debugLog('coerceSecurityPolicy: invalid security policy ', value, SecurityPolicy);
  }
  return value as SecurityPolicy;
}

// --------------------
function RSAPKCS1V15_Decrypt(buffer: Uint8Array, privateKey: PrivateKey) {
  return privateKey
    .getDecryptKey('SHA-1')
    .then((key) =>
      crypto_utils.privateDecrypt_long(buffer, key, crypto_utils.RSA_PKCS1_OAEP_PADDING)
    );
}
function RSAOAEP_SHA1_Decrypt(buffer: Uint8Array, privateKey: PrivateKey) {
  return privateKey
    .getDecryptKey('SHA-1')
    .then((key) =>
      crypto_utils.privateDecrypt_long(buffer, key, crypto_utils.RSA_PKCS1_OAEP_PADDING)
    );
}
function RSAOAEP_SHA256_Decrypt(buffer: Uint8Array, privateKey: PrivateKey) {
  return privateKey
    .getDecryptKey('SHA-256')
    .then((key) =>
      crypto_utils.privateDecrypt_long(buffer, key, crypto_utils.RSA_PKCS1_OAEP_PADDING)
    );
}
// --------------------

async function asymmetricVerifyChunk(chunk: Uint8Array, certificate: Uint8Array): Promise<boolean> {
  const crypto_factory: ICryptoFactory = this;
  assert(chunk instanceof Uint8Array);
  assert(certificate instanceof Uint8Array);
  // let's get the signatureLength by checking the size
  // of the certificate's public key
  const cert = await crypto_utils.exploreCertificateInfo(certificate);

  const signatureLength = cert.publicKeyLength; // 1024 bits = 128Bytes or 2048=256Bytes
  const block_to_verify = chunk.slice(0, chunk.length - signatureLength);
  const signature = chunk.slice(chunk.length - signatureLength);
  return crypto_factory.asymmetricVerify(block_to_verify, signature, certificate);
}

function RSAPKCS1V15SHA1_Verify(
  buffer: Uint8Array,
  signature: Uint8Array,
  certificate: Uint8Array
): PromiseLike<boolean> {
  return generateVerifyKeyFromDER(certificate, 'SHA-1')
    .then((pubKey) => {
      return {
        algorithm: 'RSASSA-PKCS1-v1_5', //'RSA-SHA1',
        publicKey: pubKey,
      };
    })
    .then((opts) => crypto_utils.verifyMessageChunkSignature(buffer, signature, opts));
}
const RSAPKCS1OAEPSHA1_Verify = RSAPKCS1V15SHA1_Verify;

function RSAPKCS1OAEPSHA256_Verify(
  buffer: Uint8Array,
  signature: Uint8Array,
  certificate: Uint8Array
): PromiseLike<boolean> {
  return generateVerifyKeyFromDER(certificate, 'SHA-256')
    .then((pubKey) => {
      return {
        algorithm: 'RSASSA-PKCS1-v1_5', // 'RSA-SHA256',
        publicKey: pubKey,
      };
    })
    .then((opts) => crypto_utils.verifyMessageChunkSignature(buffer, signature, opts));
}

function RSAPKCS1V15SHA1_Sign(buffer: Uint8Array, privateKey: PrivateKey): Promise<ArrayBuffer> {
  return privateKey.getSignKey('SHA-1').then((signKey) =>
    crypto_utils.makeMessageChunkSignature(buffer, {
      algorithm: 'RSASSA-PKCS1-v1_5', // 'RSA-SHA256',
      privateKey: signKey,
    })
  );
}

function RSAPKCS1V15SHA256_Sign(buffer: Uint8Array, privateKey: PrivateKey): Promise<ArrayBuffer> {
  return privateKey.getSignKey('SHA-256').then((signKey) =>
    crypto_utils.makeMessageChunkSignature(buffer, {
      algorithm: 'RSASSA-PKCS1-v1_5', // 'RSA-SHA256',
      privateKey: signKey,
    })
  );
}

const RSAPKCS1OAEPSHA1_Sign = RSAPKCS1V15SHA1_Sign;

function RSAPKCS1V15_Encrypt(
  buffer: Uint8Array,
  publicKey: /*Uint8Array |*/ CryptoKey
): Promise<Uint8Array> {
  return crypto_utils.publicEncrypt_long(buffer, publicKey, 11, crypto_utils.RSA_PKCS1_PADDING);
}

function RSAOAEP_Encrypt(buffer: Uint8Array, publicKey: CryptoKey): Promise<Uint8Array> {
  return crypto_utils.publicEncrypt_long(
    buffer,
    publicKey,
    getRSAOAEPPadding((publicKey.algorithm as RsaHashedKeyAlgorithm).hash.name),
    crypto_utils.RSA_PKCS1_OAEP_PADDING
  );
}

export interface DerivedKeys1 {
  derivedClientKeys: DerivedKeys | null;
  derivedServerKeys: DerivedKeys | null;
  algorithm: string | null;
}

export async function computeDerivedKeys(
  cryptoFactory: ICryptoFactory,
  serverNonce: Uint8Array,
  clientNonce: Uint8Array
): Promise<DerivedKeys1> {
  // calculate derived keys

  if (clientNonce && serverNonce) {
    const options = {
      signingKeyLength: cryptoFactory.derivedSignatureKeyLength,
      encryptingKeyLength: cryptoFactory.derivedEncryptionKeyLength,
      encryptingBlockSize: cryptoFactory.encryptingBlockSize,
      signatureLength: cryptoFactory.signatureLength,
      algorithm: cryptoFactory.symmetricEncryptionAlgorithm,
      sha1or256: cryptoFactory.sha1or256,
    };

    const derived = {
      algorithm: null as any,
      derivedClientKeys: await crypto_utils.computeDerivedKeys(serverNonce, clientNonce, options),
      derivedServerKeys: await crypto_utils.computeDerivedKeys(clientNonce, serverNonce, options),
    };
    return derived;
  }
  return {
    derivedClientKeys: null,
    derivedServerKeys: null,
    algorithm: null,
  };
}

export interface ICryptoFactory {
  securityPolicy: SecurityPolicy;

  symmetricKeyLength: number;
  derivedEncryptionKeyLength: number;
  derivedSignatureKeyLength: number;
  encryptingBlockSize: number;
  signatureLength: number;

  minimumAsymmetricKeyLength: number;
  maximumAsymmetricKeyLength: number;

  /* asymmetric signature algorithm */
  asymmetricVerifyChunk: (chunk: Uint8Array, certificate: Uint8Array) => PromiseLike<boolean>;
  asymmetricSign: (chunk: BufferSource, key: PrivateKey) => Promise<ArrayBuffer>;
  asymmetricVerify: (
    block_to_verify: Uint8Array,
    signature: Uint8Array,
    certificate: Uint8Array
  ) => PromiseLike<boolean>;
  asymmetricSignatureAlgorithm: string;

  /* asymmetric encryption algorithm */
  asymmetricEncrypt: (block: Uint8Array, publicKey: CryptoKey) => PromiseLike<Uint8Array>;
  asymmetricDecrypt: (block: Uint8Array, privateKey: PrivateKey) => Promise<Uint8Array>;
  asymmetricEncryptionAlgorithm: string;
  blockPaddingSize: number;
  symmetricEncryptionAlgorithm: string;
  sha1or256: 'SHA-1' | 'SHA-256'; //string;
}

const _Basic128Rsa15: ICryptoFactory = {
  securityPolicy: SecurityPolicy.Basic128Rsa15,

  symmetricKeyLength: 16,
  derivedEncryptionKeyLength: 16,
  derivedSignatureKeyLength: 16,
  encryptingBlockSize: 16,
  signatureLength: 20,

  minimumAsymmetricKeyLength: 128,
  maximumAsymmetricKeyLength: 512,

  /* asymmetric signature algorithm */
  asymmetricVerifyChunk: asymmetricVerifyChunk,
  asymmetricSign: RSAPKCS1V15SHA1_Sign,
  asymmetricVerify: RSAPKCS1V15SHA1_Verify,
  asymmetricSignatureAlgorithm: 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',

  /* asymmetric encryption algorithm */
  asymmetricEncrypt: RSAPKCS1V15_Encrypt,
  asymmetricDecrypt: RSAPKCS1V15_Decrypt,
  asymmetricEncryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#rsa-1_5',

  blockPaddingSize: 11,

  symmetricEncryptionAlgorithm: 'AES-128-CBC',

  sha1or256: 'SHA-1',
};

const _Basic256: ICryptoFactory = {
  securityPolicy: SecurityPolicy.Basic256,
  symmetricKeyLength: 32,
  derivedEncryptionKeyLength: 32,
  derivedSignatureKeyLength: 24,
  encryptingBlockSize: 16,
  signatureLength: 20,

  minimumAsymmetricKeyLength: 128,
  maximumAsymmetricKeyLength: 512,

  asymmetricVerifyChunk: asymmetricVerifyChunk,
  asymmetricSign: RSAPKCS1OAEPSHA1_Sign,
  asymmetricVerify: RSAPKCS1OAEPSHA1_Verify,
  asymmetricSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig#rsa-sha1',

  /* asymmetric encryption algorithm */
  asymmetricEncrypt: RSAOAEP_Encrypt,
  asymmetricDecrypt: RSAOAEP_SHA1_Decrypt,
  asymmetricEncryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#rsa-oaep',

  blockPaddingSize: getRSAOAEPPadding('SHA-1'),

  // "aes-256-cbc"
  symmetricEncryptionAlgorithm: 'AES-256-CBC',
  sha1or256: 'SHA-1',
};

const _Basic256Sha256: ICryptoFactory = {
  securityPolicy: SecurityPolicy.Basic256Sha256,

  symmetricKeyLength: 32,
  derivedEncryptionKeyLength: 32,
  derivedSignatureKeyLength: 32,
  encryptingBlockSize: 16,
  signatureLength: 32,

  minimumAsymmetricKeyLength: 2048,
  maximumAsymmetricKeyLength: 4096,

  asymmetricVerifyChunk: asymmetricVerifyChunk,
  asymmetricSign: RSAPKCS1V15SHA256_Sign,
  asymmetricVerify: RSAPKCS1OAEPSHA256_Verify,
  asymmetricSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',

  /* asymmetric encryption algorithm */
  asymmetricEncrypt: RSAOAEP_Encrypt,
  asymmetricDecrypt: RSAOAEP_SHA256_Decrypt,
  asymmetricEncryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#rsa-oaep',

  blockPaddingSize: getRSAOAEPPadding('SHA-256'),

  // "aes-256-cbc"
  symmetricEncryptionAlgorithm: 'AES-256-CBC',
  sha1or256: 'SHA-256',
};

export function getCryptoFactory(securityPolicy: SecurityPolicy): ICryptoFactory | null {
  switch (securityPolicy) {
    case SecurityPolicy.None:
      return null;
    case SecurityPolicy.Basic128Rsa15:
      return _Basic128Rsa15;
    case SecurityPolicy.Basic256:
      return _Basic256;
    case SecurityPolicy.Basic256Sha256:
      return _Basic256Sha256;
    default:
      return null;
  }
}

export function computeSignature(
  senderCertificate: Uint8Array | undefined,
  senderNonce: Uint8Array | undefined,
  receiverPrivatekey: PrivateKey,
  securityPolicy: SecurityPolicy
): Promise<SignatureData> | undefined {
  if (!senderNonce || !senderCertificate) {
    return;
  }

  const crypto_factory = getCryptoFactory(securityPolicy);
  if (!crypto_factory) {
    return;
  }
  // This parameter is calculated by appending the clientNonce to the clientCertificate
  const buffer = new Uint8Array(senderCertificate.byteLength + senderNonce.byteLength);
  // = Buffer.concat([senderCertificate, senderNonce]);
  buffer.set(senderCertificate);
  buffer.set(senderNonce, senderCertificate.byteLength);

  // ... and signing the resulting sequence of bytes.
  return crypto_factory.asymmetricSign(buffer, receiverPrivatekey).then((signature) => {
    return new SignatureData({
      // This is a signature generated with the private key associated with a Certificate
      signature: new Uint8Array(signature),
      // A string containing the URI of the algorithm.
      // The URI string values are defined as part of the security profiles specified in Part 7.
      // (The SignatureAlgorithm shall be the AsymmetricSignatureAlgorithm specified in the
      // SecurityPolicy for the Endpoint)
      algorithm: crypto_factory.asymmetricSignatureAlgorithm, // "http://www.w3.org/2000/09/xmldsig#rsa-sha1"
    });
  });
}

export function verifySignature(
  receiverCertificate: Uint8Array,
  receiverNonce: Uint8Array,
  signature: SignatureData,
  senderCertificate: Uint8Array,
  securityPolicy: SecurityPolicy
) {
  if (securityPolicy === SecurityPolicy.None) {
    return true;
  }
  const crypto_factory = getCryptoFactory(securityPolicy);
  if (!crypto_factory) {
    return false;
  }
  assert(receiverNonce instanceof Uint8Array);
  assert(receiverCertificate instanceof Uint8Array);
  assert(signature instanceof SignatureData);

  assert(senderCertificate instanceof Uint8Array);

  if (!(signature.signature instanceof Uint8Array)) {
    // no signature provided
    return false;
  }

  // This parameter is calculated by appending the clientNonce to the clientCertificate
  const buffer = new Uint8Array(receiverCertificate.byteLength + receiverNonce.byteLength); // Buffer.concat([senderCertificate, senderNonce]);
  buffer.set(receiverCertificate);
  buffer.set(receiverNonce, receiverCertificate.byteLength);

  return crypto_factory.asymmetricVerify(buffer, signature.signature, senderCertificate);
}

export function getOptionsForSymmetricSignAndEncrypt(
  securityMode: MessageSecurityMode,
  derivedKeys: DerivedKeys
) {
  assert(derivedKeys.hasOwnProperty('signatureLength'));
  assert(securityMode !== MessageSecurityMode.None && securityMode !== MessageSecurityMode.Invalid);

  let options = {
    signatureLength: derivedKeys.signatureLength,
    signBufferFunc: (chunk: Uint8Array) => {
      return crypto_utils.makeMessageChunkSignatureWithDerivedKeys(chunk, derivedKeys);
    },
  };
  if (securityMode === MessageSecurityMode.SignAndEncrypt) {
    return {
      ...options,
      plainBlockSize: derivedKeys.encryptingBlockSize,
      cipherBlockSize: derivedKeys.encryptingBlockSize,
      encryptBufferFunc: (chunk: Uint8Array) => {
        return crypto_utils.encryptBufferWithDerivedKeys(chunk, derivedKeys);
      },
    };
  }
  return options;
}

export function getRSAOAEPPadding(hash: string /* 'SHA-1' | 'SHA-256' | 'SHA-512' */): number {
  switch (hash) {
    case 'SHA-1':
      return 42; // 20*2 +2
    case 'SHA-256':
      return 66; // 256/8 * 2 + 2 = 32 * 2 + 2
    case 'SHA-512':
      return 130; // 512/8 * 2 + 2 = 64 * 2 + 2
    default:
      throw new Error('hash function not implemented');
  }
}
