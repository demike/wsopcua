// just a dummy

export const RSA_PKCS1_PADDING =  1;
export const RSA_PKCS1_OAEP_PADDING = 4;

export function privateDecrypt_long(buffer: ArrayBuffer, key: string, block_size: number, algorithm: number): any {
    throw new Error('not implemented');
}

export function rsa_length(key: string): number {
    throw new Error('not implemented');
}

export function exploreCertificate(certificate: string | Uint8Array): any {
    throw new Error('not implemented');
}

/**
 * @method toPem
 * @param raw_key {string}
 * @param pem {String}
 * @return {String}
 */
export function toPem(raw_key: string|Uint8Array, pem: string): string {
    throw new Error('not implemented');
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
export function verifyMessageChunkSignature(block_to_verify: Uint8Array, signature: ArrayBuffer,
    options: { sinatureLength?: number, algorithm: string, publicKey: string} ): boolean {
    throw new Error('not implemented');
}

export function publicEncrypt_long(buffer: ArrayBuffer, key: string, block_size: number, padding: number, algorithm?) {
    throw new Error('not implemented');
}

/**
 * @method makeMessageChunkSignature
 * @param chunk
 * @param options {Object}
 * @param options.signatureLength {Number}
 * @param options.algorithm {String}   for example "RSA-SHA256"
 * @param options.privateKey {Buffer}
 * @return {Buffer} - the signature
 */
export function makeMessageChunkSignature(chunk, options): any {
    throw new Error('not implemented');
}

export function computeDerivedKeys(secret, seed, options) {
    throw new Error('not implemented');
}

/**
 * @method makeMessageChunkSignatureWithDerivedKeys
 * @param message {Buffer}
 * @param derivedKeys
 * @return {Buffer}
 */
export function makeMessageChunkSignatureWithDerivedKeys(message, derivedKeys) {
    throw new Error('not implemented');
}

export function encryptBufferWithDerivedKeys(buffer, derivedKeys) {
    throw new Error('not implemented');
}
