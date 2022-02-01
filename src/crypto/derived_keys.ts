/**
 * @module node_opcua_crypto
 */

import { Nonce } from './common';
import { verifyMessageChunkSignature, VerifyMessageChunkSignatureOptions } from './crypto_utils';
import { assert } from '../assert';

const crypto: SubtleCrypto = window.crypto.subtle;

async function HMAC_KEY(sha1or256: 'SHA-1' | 'SHA-256', secret: BufferSource) {
  return await crypto.importKey(
    'raw', // raw format of the key - should be Uint8Array
    secret as any,
    {
      // algorithm details
      name: 'HMAC',
      hash: { name: sha1or256 },
    },
    false, // export = false
    ['sign', 'verify'] // what this key can do
  );
}

function HMAC_HASH(hmacKey: CryptoKey, message: ArrayBuffer) {
  return crypto.sign('HMAC', hmacKey, message);
}

function plus(buf1: ArrayBuffer, buf2: ArrayBuffer): ArrayBuffer {
  const tmp = new Uint8Array(buf1.byteLength + buf2.byteLength);
  tmp.set(new Uint8Array(buf1), 0);
  tmp.set(new Uint8Array(buf2), buf1.byteLength);
  return tmp;
}

// OPC-UA Spec 1.02 part 6 - 6.7.5  Deriving Keys page 42
// Once the  SecureChannel  is established the  Messages  are signed and encrypted with keys derived
// from the  Nonces  exchanged in t he  OpenSecureChannel  call. These keys are derived by passing the
// Nonces  to a pseudo - random function which produces a sequence of bytes from a set of inputs.   A
// pseudo- random function  is represented by the following function declaration:
// Byte[] PRF(
//     Byte[] secret,
//     Byte[] seed,
//     Int32 length,
//     Int32 offset
// )
// Where length   is the number of bytes to return and  offset  is a number of bytes from the beginning of
// the sequence.
// The lengths of the keys that need to be generated depend on the  SecurityPolicy  used for the
//    channel. The following information is specified by the  SecurityPolicy:
//    a)  SigningKeyLength  (from the  DerivedSignatureKeyLength);
//    b)  EncryptingKeyLength  (implied by the  SymmetricEncryptionAlgorithm);
//    c)  EncryptingBlockSize  (implied by the  SymmetricEncryptionAlgorithm).
//  The parameters  passed to the pseudo random function are specified in  Table 36.
//  Table 36  - Cryptography Key Generation Parameters
//
// Key                         Secret       Seed         Length               Offset
// ClientSigningKey            ServerNonce  ClientNonce  SigningKeyLength     0
// ClientEncryptingKey         ServerNonce  ClientNonce  EncryptingKeyLength  SigningKeyLength
// ClientInitializationVector  ServerNonce  ClientNonce  EncryptingBlockSize  SigningKeyLength+ EncryptingKeyLength
// ServerSigningKey            ClientNonce  ServerNonce  SigningKeyLength     0
// ServerEncryptingKey         ClientNonce  ServerNonce  EncryptingKeyLength  SigningKeyLength
// ServerInitializationVector  ClientNonce  ServerNonce  EncryptingBlockSize  SigningKeyLength+ EncryptingKeyLength
//
// The  Client  keys are used to secure  Messages  sent by the  Client. The  Server  keys are used to
// secure Messages  sent by the  Server.
// The SSL/TLS  specification  defines a pseudo random function called P_HASH which is used for this purpose.
//
// The P_HASH  algorithm is defined as follows:
//
//    P_HASH(secret, seed) = HMAC_HASH(secret, A(1) + seed) +
//                            HMAC_HASH(secret, A(2) + seed) +
//                            HMAC_HASH(secret, A(3) + seed) + ...
// Where A(n) is defined as:
//       A(0) = seed
//       A(n) = HMAC_HASH(secret, A(n-1))
//            + indicates that the results are appended to previous results.
// Where HASH is a hash function such as SHA1 or SHA256. The hash function to use depends on the SecurityPolicyUri.
//
//
// see also http://docs.oasis-open.org/ws-sx/ws-secureconversation/200512/ws-secureconversation-1.3-os.html
//          http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
export async function makePseudoRandomBuffer(
  secret: Nonce,
  seed: Nonce,
  minLength: number,
  sha1or256: 'SHA-1' | 'SHA-256'
) {
  assert(seed instanceof Uint8Array);
  assert(sha1or256 === 'SHA-1' || sha1or256 === 'SHA-256');

  const a = [];
  a[0] = seed;
  let index = 1;
  let p_hash = new ArrayBuffer(0);
  const hmacKey = await HMAC_KEY(sha1or256, secret);
  while (p_hash.byteLength <= minLength) {
    /* eslint  new-cap:0 */
    a[index] = await HMAC_HASH(hmacKey, a[index - 1]);
    const hash2 = await HMAC_HASH(hmacKey, plus(a[index], seed));
    p_hash = plus(p_hash, hash2);
    index += 1;
  }

  return p_hash.slice(0, minLength);
}

export interface ComputeDerivedKeysOptions {
  signatureLength: number;
  signingKeyLength: number;
  encryptingKeyLength: number;

  encryptingBlockSize: number;
  algorithm: string;
  sha1or256?: 'SHA-1' | 'SHA-256';
}

export interface DerivedKeys extends ComputeDerivedKeysOptions {
  signatureLength: number;
  signingKeyLength: number;
  encryptingKeyLength: number;

  encryptingBlockSize: number;
  algorithm: string;
  sha1or256: 'SHA-1' | 'SHA-256';

  signingKey: BufferSource;
  encryptingKey: BufferSource;
  initializationVector: ArrayBuffer;
}

export async function computeDerivedKeys(
  secret: Nonce,
  seed: Nonce,
  options: ComputeDerivedKeysOptions
): Promise<DerivedKeys> {
  assert(Number.isFinite(options.signatureLength));
  assert(Number.isFinite(options.encryptingKeyLength));
  assert(Number.isFinite(options.encryptingBlockSize));
  assert(typeof options.algorithm === 'string');
  options.sha1or256 = options.sha1or256 || 'SHA-1';
  assert(typeof options.sha1or256 === 'string');

  const offset1 = options.signingKeyLength;
  const offset2 = offset1 + options.encryptingKeyLength;
  const minLength = offset2 + options.encryptingBlockSize;

  const buf = await makePseudoRandomBuffer(secret, seed, minLength, options.sha1or256);

  return {
    signatureLength: options.signatureLength,
    signingKeyLength: options.signingKeyLength,
    encryptingKeyLength: options.encryptingKeyLength,

    encryptingBlockSize: options.encryptingBlockSize,
    algorithm: options.algorithm,
    sha1or256: options.sha1or256,

    signingKey: buf.slice(0, offset1),
    encryptingKey: buf.slice(offset1, offset2),
    initializationVector: buf.slice(offset2, minLength),
  };
}

/**
 * @method reduceLength
 * @param buffer
 * @param byteToRemove
 * @return buffer
 */
export function reduceLength(buffer: ArrayBuffer, byteToRemove: number): ArrayBuffer {
  return buffer.slice(0, buffer.byteLength - byteToRemove);
}

/**
 * @method removePadding
 * @param buffer
 * @return buffer with padding removed
 */
export function removePadding(buffer: ArrayBuffer): ArrayBuffer {
  const buf8 = new Uint8Array(buffer);
  const nbPaddingBytes = buf8[buffer.byteLength - 1] + 1;
  return reduceLength(buffer, nbPaddingBytes);
}

export interface VerifyChunkSignatureOptions extends VerifyMessageChunkSignatureOptions {
  signatureLength: number;
}

/**
 * @method verifyChunkSignature
 *
 *     const signer = {
 *           signatureLength : 128,
 *           algorithm : "RSA-SHA256",
 *           public_key: "qsdqsdqsd"
 *     };
 *
 * @param chunk  The message chunk to verify.
 * @param options
 * @param options.signatureLength
 * @param options.algorithm  the algorithm.
 * @param options.publicKey
 * @return {*}
 */
export function verifyChunkSignature(
  chunk: ArrayBuffer,
  options: VerifyChunkSignatureOptions
): PromiseLike<boolean> {
  assert(chunk instanceof ArrayBuffer);
  let signatureLength = options.signatureLength || 0;
  if (signatureLength === 0) {
    // let's get the signatureLength by checking the size
    // of the certificate's public key
    signatureLength = (options.publicKey.algorithm as RsaHashedKeyGenParams).modulusLength / 8; // 1024 bits = 128Bytes or 2048=256Bytes
  }
  const block_to_verify = chunk.slice(0, chunk.byteLength - signatureLength);
  const signature = chunk.slice(chunk.byteLength - signatureLength);
  return verifyMessageChunkSignature(block_to_verify, signature, options);
}

// /**
//  * extract the public key from a certificate - using the pem module
//  *
//  * @method extractPublicKeyFromCertificate_WithPem
//  * @async
//  * @param certificate
//  * @param callback {Function}
//  * @param callback.err
//  * @param callback.publicKey as pem
//  */
// exports.extractPublicKeyFromCertificate_WithPem = function (certificate, callback) {
//
//     const err1 = new Error();
//     const cert_pem = crypto_utils.toPem(certificate, "CERTIFICATE");
//     require("pem").getPublicKey(cert_pem, function (err, data) {
//         if (err) {
//             console.log(err1.stack);
//             console.log(" CANNOT EXTRAT PUBLIC KEY from Certificate".red, certificate);
//             return callback(err);
//         }
//         callback(err, data.publicKey);
//     });
// };
//

/*
export function computePaddingFooter(buffer: ArrayBuffer, derivedKeys: DerivedKeys): ArrayBuffer {

    assert(derivedKeys.hasOwnProperty('encryptingBlockSize'));
    const paddingSize = derivedKeys.encryptingBlockSize - (buffer.byteLength + 1) % derivedKeys.encryptingBlockSize;
    const padding = new ArrayBuffer(paddingSize + 1);
    padding.fill(paddingSize); //  TODO: <-- this must be wrong
    return padding;
}
*/

function derivedKeys_algorithm(derivedKeys: DerivedKeys) {
  assert(derivedKeys.hasOwnProperty('algorithm'));
  const algorithm = derivedKeys.algorithm || 'AES-128-CBC';
  assert(algorithm === 'AES-128-CBC' || algorithm === 'AES-256-CBC');
  return algorithm;
}

export async function encryptBufferWithDerivedKeys(
  buffer: ArrayBuffer,
  derivedKeys: DerivedKeys
): Promise<ArrayBuffer> {
  let key: CryptoKey | undefined = (derivedKeys.encryptingKey as any)._AES_CBC_KEY;
  if (!key) {
    key = (derivedKeys.encryptingKey as any)._AES_CBC_KEY = await crypto.importKey(
      'raw',
      derivedKeys.encryptingKey as any,
      'AES-CBC',
      true,
      ['encrypt', 'decrypt']
    );
  }

  const opts = {
    name: 'AES-CBC',
    iv: derivedKeys.initializationVector,
  };

  return crypto.encrypt(opts, key, buffer);

  /*
    const cypher = crypto.createCipheriv(algorithm, key, initVector);
    cypher.setAutoPadding(false);
    const encrypted_chunks = [];
    encrypted_chunks.push(cypher.update(buffer));
    encrypted_chunks.push(cypher.final());
    return Buffer.concat(encrypted_chunks);
    */
}

export async function decryptBufferWithDerivedKeys(
  buffer: ArrayBuffer,
  derivedKeys: DerivedKeys
): Promise<ArrayBuffer> {
  let key: CryptoKey | undefined = (derivedKeys.encryptingKey as any)._AES_CBC_KEY;
  if (!key) {
    key = (derivedKeys.encryptingKey as any)._AES_CBC_KEY = await crypto.importKey(
      'raw',
      derivedKeys.encryptingKey as any,
      'AES-CBC',
      true,
      ['encrypt', 'decrypt']
    );
  }

  const opts = {
    name: 'AES-CBC',
    iv: derivedKeys.initializationVector,
  };

  return crypto.decrypt(opts, key, buffer);

  /*
    const cypher = crypto.createDecipheriv(algorithm, key, initVector);
    cypher.setAutoPadding(false);
    const decrypted_chunks = [];
    decrypted_chunks.push(cypher.update(buffer));
    decrypted_chunks.push(cypher.final());
    return Buffer.concat(decrypted_chunks);
    */
}

/**
 * @method makeMessageChunkSignatureWithDerivedKeys
 * @param message
 * @param derivedKeys
 * @return
 */
export async function makeMessageChunkSignatureWithDerivedKeys(
  message: ArrayBuffer,
  derivedKeys: DerivedKeys
): Promise<ArrayBuffer> {
  assert(message instanceof ArrayBuffer);
  // assert(derivedKeys.signingKey instanceof BufferSource);
  assert(typeof derivedKeys.sha1or256 === 'string');
  assert(derivedKeys.sha1or256 === 'SHA-1' || derivedKeys.sha1or256 === 'SHA-256');
  let hmacKey: CryptoKey | undefined = (derivedKeys.signingKey as any)._hmacCryptoKey;
  if (!hmacKey) {
    // cache hmac crypto key in signingKey
    hmacKey = (derivedKeys.signingKey as any)._hmacCryptoKey = await HMAC_KEY(
      derivedKeys.sha1or256,
      derivedKeys.signingKey
    );
  }
  return HMAC_HASH(hmacKey, message);
}

/**
 * @method verifyChunkSignatureWithDerivedKeys
 * @param chunk
 * @param derivedKeys
 * @return
 */
export async function verifyChunkSignatureWithDerivedKeys(
  chunk: ArrayBuffer,
  derivedKeys: DerivedKeys
): Promise<boolean> {
  const message = chunk.slice(0, chunk.byteLength - derivedKeys.signatureLength);
  const signature = new Uint8Array(chunk.slice(chunk.byteLength - derivedKeys.signatureLength));
  const verif = new Uint8Array(
    await makeMessageChunkSignatureWithDerivedKeys(message, derivedKeys)
  );

  if (verif.byteLength !== signature.byteLength) {
    return false;
  }
  return verif.every((val, i) => val === signature[i]);
}
