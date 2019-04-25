
import { Signature } from './common';
import { assert } from '../assert';

export function buf2base64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function buf2base64url(buffer: ArrayBuffer) {
    let str = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    str = unescape(encodeURIComponent(str));
    return str;
}

export function base64ToBuf(base64: string) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
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
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

export function buf2string(buffer: ArrayBuffer) {
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
    algorithm: string;
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
export async function makeMessageChunkSignature(chunk: ArrayBuffer, options: MakeMessageChunkSignatureOptions): Promise<ArrayBuffer> {
    assert(chunk instanceof ArrayBuffer);
    return crypto.subtle.sign(options.algorithm, options.privateKey, chunk);
}


export interface VerifyMessageChunkSignatureOptions {
    algorithm: string;
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
export function verifyMessageChunkSignature(blockToVerify: ArrayBuffer, signature: Signature, options: VerifyMessageChunkSignatureOptions) : PromiseLike<boolean> {

    assert(blockToVerify instanceof ArrayBuffer);
    assert(signature instanceof ArrayBuffer);

    return crypto.subtle.verify(options.algorithm, options.publicKey , signature, blockToVerify)
}

export function makeSHA1Thumbprint(buffer: ArrayBuffer): PromiseLike<Signature> {
    return crypto.subtle.digest('SHA-1', buffer);
}


// Basically when you =encrypt something using an RSA key (whether public or private), the encrypted value must
// be smaller than the key (due to the maths used to do the actual encryption). So if you have a 1024-bit key,
// in theory you could encrypt any 1023-bit value (or a 1024-bit value smaller than the key) with that key.
// However, the PKCS#1 standard, which OpenSSL uses, specifies a padding scheme (so you can encrypt smaller
// quantities without losing security), and that padding scheme takes a minimum of 11 bytes (it will be longer
// if the value you're encrypting is smaller). So the highest number of bits you can encrypt with a 1024-bit
// key is 936 bits because of this (unless you disable the padding by adding the OPENSSL_NO_PADDING flag,
// in which case you can go up to 1023-1024 bits). With a 2048-bit key it's 1960 bits instead.


export const RSA_PKCS1_PADDING =  1;
export const RSA_PKCS1_OAEP_PADDING = 4;

export enum PaddingAlgorithm {
    RSA_PKCS1_OAEP_PADDING = 4,
    RSA_PKCS1_PADDING = 1
}

export async function publicEncrypt_long(buffer: ArrayBuffer, publicKey: CryptoKey,
    padding: number, algorithm?: PaddingAlgorithm): Promise<Uint8Array> {
    if (algorithm === undefined) {
        algorithm = PaddingAlgorithm.RSA_PKCS1_PADDING;
    }
    assert(algorithm === RSA_PKCS1_PADDING || algorithm === RSA_PKCS1_OAEP_PADDING);

    return crypto.subtle.encrypt({name: 'RSA-OAEP'}, publicKey, buffer).then((encrypted) => new Uint8Array(encrypted));

}

export async function privateDecrypt_long(buffer: ArrayBuffer, privateKey: CryptoKey, algorithm?: number):
            Promise<Uint8Array> {

    algorithm = algorithm || RSA_PKCS1_PADDING;
    assert(algorithm === RSA_PKCS1_PADDING || algorithm === RSA_PKCS1_OAEP_PADDING);

    return crypto.subtle.decrypt('RSA-OAEP', privateKey, buffer).then( (decrypted) => new Uint8Array(decrypted) );
}