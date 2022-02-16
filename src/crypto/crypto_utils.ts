import { Signature } from './common';
import { assert } from '../assert';
import { concatArrayBuffers } from '../basic-types/array';

export function buf2base64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function buf2base64url(buffer: ArrayBuffer) {
  let str = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  str = unescape(encodeURIComponent(str));
  return str;
}

export function base64ToBuf(base64: string) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  /*
    const binary_string =  window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
    */
}

export function buf2hex(buffer: ArrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x: number) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

export function buf2string(buffer: BufferSource) {
  const dec = new TextDecoder('utf-8');
  return dec.decode(buffer);
}

export function string2buf(str: string) {
  /*
    const enc = new TextEncoder();
    return enc.encode(str).buffer;
    */
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * !!! READ PEM FILE DERIVATES INTENTIONALLY LEFT OUT (fs operations) !!!
 */

interface MakeMessageChunkSignatureOptions {
  algorithm: AlgorithmIdentifier | RsaPssParams;
  privateKey: CryptoKey;
}

/**
 * @method makeMessageChunkSignature
 * @param chunk
 * @param options
 * @param options.signatureLength
 * @param options.algorithm   for example "RSA-SHA256"
 * @param options.privateKey
 * @return - the signature
 */
export async function makeMessageChunkSignature(
  chunk: BufferSource,
  options: MakeMessageChunkSignatureOptions
): Promise<ArrayBuffer> {
  return crypto.subtle.sign(options.algorithm, options.privateKey, chunk as any);
}

export interface VerifyMessageChunkSignatureOptions {
  algorithm: AlgorithmIdentifier | RsaPssParams;
  publicKey: CryptoKey;
}

/**
 * @method verifyMessageChunkSignature
 *
 *     var signer = {
 *           signatureLength : 128,
 *           algorithm : "RSA-SHA256",
 *           public_key: "qsdqsdqsd"
 *     };
 * @param block_to_verify {Buffer}
 * @param signature {Buffer}
 * @param options {Object}
 * @param options.signatureLength {Number}
 * @param options.algorithm {String}   for example "RSA-SHA256"
 * @param options.publicKey {Buffer}*
 * @return {Boolean} - true if the signature is valid
 */
export function verifyMessageChunkSignature(
  blockToVerify: BufferSource,
  signature: BufferSource,
  options: VerifyMessageChunkSignatureOptions
): PromiseLike<boolean> {
  return crypto.subtle.verify(
    options.algorithm,
    options.publicKey,
    signature as any,
    blockToVerify as any
  );
}

export function makeSHA1Thumbprint(buffer: BufferSource): PromiseLike<Signature> {
  return crypto.subtle.digest('SHA-1', buffer as any);
}

// Basically when you =encrypt something using an RSA key (whether public or private), the encrypted value must
// be smaller than the key (due to the maths used to do the actual encryption). So if you have a 1024-bit key,
// in theory you could encrypt any 1023-bit value (or a 1024-bit value smaller than the key) with that key.
// However, the PKCS#1 standard, which OpenSSL uses, specifies a padding scheme (so you can encrypt smaller
// quantities without losing security), and that padding scheme takes a minimum of 11 bytes (it will be longer
// if the value you're encrypting is smaller). So the highest number of bits you can encrypt with a 1024-bit
// key is 936 bits because of this (unless you disable the padding by adding the OPENSSL_NO_PADDING flag,
// in which case you can go up to 1023-1024 bits). With a 2048-bit key it's 1960 bits instead.

export enum PaddingAlgorithm {
  RSA_PKCS1_OAEP_PADDING = 4,
  RSA_PKCS1_PADDING = 1,
}

export const RSA_PKCS1_PADDING = PaddingAlgorithm.RSA_PKCS1_PADDING;
export const RSA_PKCS1_OAEP_PADDING = PaddingAlgorithm.RSA_PKCS1_OAEP_PADDING;

export async function publicEncrypt_long(
  buffer: Uint8Array,
  publicKey: CryptoKey,
  padding: number,
  algorithm?: PaddingAlgorithm
): Promise<Uint8Array> {
  if (algorithm === undefined) {
    algorithm = RSA_PKCS1_PADDING;
  }
  assert(algorithm === RSA_PKCS1_PADDING || algorithm === RSA_PKCS1_OAEP_PADDING);

  const blockSize = rsaKeyLength(publicKey);
  const chunk_size = blockSize - padding;
  const nbBlocks = Math.ceil(buffer.byteLength / chunk_size);

  if (nbBlocks <= 1) {
    // short cut: just one block avoid copying
    return crypto.subtle
      .encrypt({ name: 'RSA-OAEP' }, publicKey, buffer)
      .then((encrypted) => new Uint8Array(encrypted));
  }

  const outputBuffer = new Uint8Array(nbBlocks * blockSize);
  for (let i = 0; i < nbBlocks; i++) {
    const currentBlock = buffer.subarray(chunk_size * i, chunk_size * (i + 1));

    const encrypted_chunk: ArrayBuffer = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      currentBlock
    );
    assert(encrypted_chunk.byteLength === blockSize);
    outputBuffer.set(new Uint8Array(encrypted_chunk), i * blockSize);
  }

  return outputBuffer;
}

export async function privateDecrypt_long(
  buffer: Uint8Array,
  privateKey: CryptoKey,
  algorithm?: number
): Promise<Uint8Array> {
  algorithm = algorithm || RSA_PKCS1_PADDING;
  assert(algorithm === RSA_PKCS1_PADDING || algorithm === RSA_PKCS1_OAEP_PADDING);

  const blockSize = rsaKeyLength(privateKey);
  const nbBlocks = Math.ceil(buffer.byteLength / blockSize);

  if (nbBlocks <= 1) {
    // short cut: just one block avoid copying
    return crypto.subtle
      .decrypt('RSA-OAEP', privateKey, buffer)
      .then((decrypted) => new Uint8Array(decrypted));
  }

  const outputBuffers: ArrayBuffer[] = [];
  for (let i = 0; i < nbBlocks; i++) {
    const inputBuffer = buffer.subarray(blockSize * i, blockSize * (i + 1));

    const decrypted_chunk: ArrayBuffer = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      inputBuffer
    );

    outputBuffers.push(decrypted_chunk);
  }
  return new Uint8Array(concatArrayBuffers(outputBuffers));
}

export function rsaKeyLength(key: CryptoKey) {
  return (key.algorithm as RsaKeyAlgorithm).modulusLength / 8;
}
