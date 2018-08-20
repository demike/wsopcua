export declare const RSA_PKCS1_PADDING = 1;
export declare const RSA_PKCS1_OAEP_PADDING = 4;
export declare function privateDecrypt_long(buffer: any, key: any, block_size: any, algorithm: any): any;
export declare function rsa_length(key: string): number;
export declare function exploreCertificate(certificate: any): any;
/**
 * @method toPem
 * @param raw_key {string}
 * @param pem {String}
 * @return {String}
 */
export declare function toPem(raw_key: any, pem: string): string;
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
export declare function verifyMessageChunkSignature(block_to_verify: any, signature: any, options: any): boolean;
export declare function publicEncrypt_long(buffer: any, key: any, block_size: any, padding: any, algorithm: any): void;
/**
 * @method makeMessageChunkSignature
 * @param chunk
 * @param options {Object}
 * @param options.signatureLength {Number}
 * @param options.algorithm {String}   for example "RSA-SHA256"
 * @param options.privateKey {Buffer}
 * @return {Buffer} - the signature
 */
export declare function makeMessageChunkSignature(chunk: any, options: any): any;
export declare function computeDerivedKeys(secret: any, seed: any, options: any): void;
/**
 * @method makeMessageChunkSignatureWithDerivedKeys
 * @param message {Buffer}
 * @param derivedKeys
 * @return {Buffer}
 */
export declare function makeMessageChunkSignatureWithDerivedKeys(message: any, derivedKeys: any): void;
export declare function encryptBufferWithDerivedKeys(buffer: any, derivedKeys: any): void;
