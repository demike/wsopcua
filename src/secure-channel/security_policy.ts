"use strict";
/**
 * @module opcua.miscellaneous
 */

import {assert} from '../assert';
import {MessageSecurityMode} from '../generated/MessageSecurityMode';
import {SignatureData} from '../generated/SignatureData';

import * as crypto_utils from "../crypto/crypto_utils";
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
 *   -> AsymmetricSignatureAlgorithm  -  Rsa_Sha256 -(http://www.w3.org/2000/09/xmldsig#rsa-sha256).
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
    Invalid = "invalid",
    None = "http://opcfoundation.org/UA/SecurityPolicy#None",
    Basic128 = "http://opcfoundation.org/UA/SecurityPolicy#Basic128",
    Basic128Rsa15 = "http://opcfoundation.org/UA/SecurityPolicy#Basic128Rsa15",
    Basic192 = "http://opcfoundation.org/UA/SecurityPolicy#Basic192",
    Basic192Rsa15 = "http://opcfoundation.org/UA/SecurityPolicy#Basic192Rsa15",
    Basic256 = "http://opcfoundation.org/UA/SecurityPolicy#Basic256",
    Basic256Rsa15 = "http://opcfoundation.org/UA/SecurityPolicy#Basic256Rsa15",
    Basic256Sha256 = "http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256"
};

export function fromURI(uri : String) : SecurityPolicy {
    // istanbul ignore next
    if (typeof uri !== "string") {
        return SecurityPolicy.Invalid;
    }
    var a = uri.split("#");
    // istanbul ignore next
    if (a.length < 2) {
        return SecurityPolicy.Invalid;
    }
    var v = SecurityPolicy[a[1]];
    return v || SecurityPolicy.Invalid;
};

export  function toUri(value : any) : SecurityPolicy {
    var securityPolicy : SecurityPolicy = <SecurityPolicy>SecurityPolicy[value] || SecurityPolicy.Invalid;
    if (securityPolicy === SecurityPolicy.Invalid) {
        throw new Error("trying to convert an invalid Security Policy into a URI: " + value);
    }
    return securityPolicy;
};






// --------------------
function RSAPKCS1V15_Decrypt(buffer, privateKey) {
    var block_size = crypto_utils.rsa_length(privateKey);
    return crypto_utils.privateDecrypt_long(buffer, privateKey, block_size, crypto_utils.RSA_PKCS1_PADDING);
}
function RSAOAEP_Decrypt(buffer, privateKey) {
    var block_size = crypto_utils.rsa_length(privateKey);
    return crypto_utils.privateDecrypt_long(buffer, privateKey, block_size, crypto_utils.RSA_PKCS1_OAEP_PADDING);
}
// --------------------

function asymmetricVerifyChunk(chunk : Uint8Array, certificate : Uint8Array) {

    var crypto_factory = this;
    assert(chunk instanceof Uint8Array);
    assert(certificate instanceof Uint8Array);
    // let's get the signatureLength by checking the size
    // of the certificate's public key
    var cert = crypto_utils.exploreCertificate(certificate);

    var signatureLength = cert.publicKeyLength; // 1024 bits = 128Bytes or 2048=256Bytes
    var block_to_verify = chunk.slice(0, chunk.length - signatureLength);
    var signature = chunk.slice(chunk.length - signatureLength);
    return crypto_factory.asymmetricVerify(block_to_verify, signature, certificate);

}

function RSAPKCS1V15SHA1_Verify(buffer : Uint8Array, signature, certificate : Uint8Array) {
    var options = {
        algorithm: "RSA-SHA1",
        publicKey: crypto_utils.toPem(certificate, "CERTIFICATE")
    };
    return crypto_utils.verifyMessageChunkSignature(buffer, signature, options);
}
var RSAPKCS1OAEPSHA1_Verify = RSAPKCS1V15SHA1_Verify;

function RSAPKCS1OAEPSHA256_Verify(buffer, signature, certificate : Uint8Array) {
    var options = {
        algorithm: "RSA-SHA256",
        publicKey: crypto_utils.toPem(certificate, "CERTIFICATE")
    };
    return crypto_utils.verifyMessageChunkSignature(buffer, signature, options);
}


function RSAPKCS1V15SHA1_Sign(buffer, privateKey : Uint8Array | string) {

    if (privateKey instanceof Uint8Array) {
        privateKey = crypto_utils.toPem(privateKey, "RSA PRIVATE KEY");
    }
    var params = {
        signatureLength: crypto_utils.rsa_length(privateKey),
        algorithm: "RSA-SHA1",
        privateKey: privateKey
    };
    return crypto_utils.makeMessageChunkSignature(buffer, params);
}

function RSAPKCS1V15SHA256_Sign(buffer, privateKey : Uint8Array | string) {

    if (privateKey instanceof Uint8Array) {
        privateKey = crypto_utils.toPem(privateKey, "RSA PRIVATE KEY");
    }
    var params = {
        signatureLength: crypto_utils.rsa_length(privateKey),
        algorithm: "RSA-SHA256",
        privateKey: privateKey
    };
    return crypto_utils.makeMessageChunkSignature(buffer, params);
}

var RSAPKCS1OAEPSHA1_Sign = RSAPKCS1V15SHA1_Sign;

function RSAPKCS1V15_Encrypt(buffer, publicKey) {

    var key_length = crypto_utils.rsa_length(publicKey);
    return crypto_utils.publicEncrypt_long(buffer, publicKey, key_length, 11, crypto_utils.RSA_PKCS1_PADDING);
}

function RSAOAEP_Encrypt(buffer, publicKey) {
    var key_length = crypto_utils.rsa_length(publicKey);
    return crypto_utils.publicEncrypt_long(buffer, publicKey, key_length, 42, crypto_utils.RSA_PKCS1_OAEP_PADDING);
}



export function compute_derived_keys(serverNonce, clientNonce) {

    var self = this;

    // calculate derived keys
    var derivedKeys = {
        derivedClientKeys: null,
        derivedServerKeys: null,
        algorithm: null
    };

    if (clientNonce && serverNonce) {
        var options = {
            signingKeyLength: self.derivedSignatureKeyLength,
            encryptingKeyLength: self.derivedEncryptionKeyLength,
            encryptingBlockSize: self.encryptingBlockSize,
            signatureLength: self.signatureLength,
            algorithm: self.symmetricEncryptionAlgorithm,
            sha1or256: self.sha1or256
        };
        derivedKeys.derivedClientKeys = crypto_utils.computeDerivedKeys(serverNonce, clientNonce, options);
        derivedKeys.derivedServerKeys = crypto_utils.computeDerivedKeys(clientNonce, serverNonce, options);
    }
    return derivedKeys;
}

export interface ICryptoFactory {
    securityPolicy : SecurityPolicy;

    symmetricKeyLength : number;
    derivedEncryptionKeyLength : number;
    derivedSignatureKeyLength : number;
    encryptingBlockSize: number;
    signatureLength: number;

    minimumAsymmetricKeyLength: number,
    maximumAsymmetricKeyLength: number,

    /* asymmetric signature algorithm */
    asymmetricVerifyChunk: Function;
    asymmetricSign: Function;
    asymmetricVerify: Function;
    asymmetricSignatureAlgorithm: string;

    /* asymmetric encryption algorithm */
    asymmetricEncrypt: Function,
    asymmetricDecrypt: Function,
    asymmetricEncryptionAlgorithm: string;
    blockPaddingSize: number;
    symmetricEncryptionAlgorithm: string;
    sha1or256: string;
    compute_derived_keys: Function;


} 


var _Basic128Rsa15 = {
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
    asymmetricSignatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",

    /* asymmetric encryption algorithm */
    asymmetricEncrypt: RSAPKCS1V15_Encrypt,
    asymmetricDecrypt: RSAPKCS1V15_Decrypt,
    asymmetricEncryptionAlgorithm: "http://www.w3.org/2001/04/xmlenc#rsa-1_5",

    blockPaddingSize: 11,

    symmetricEncryptionAlgorithm: "aes-128-cbc",

    sha1or256: "SHA1",
    compute_derived_keys: compute_derived_keys

};

var _Basic256 = {
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
    asymmetricSignatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha1",

    /* asymmetric encryption algorithm */
    asymmetricEncrypt: RSAOAEP_Encrypt,
    asymmetricDecrypt: RSAOAEP_Decrypt,
    asymmetricEncryptionAlgorithm: "http://www.w3.org/2001/04/xmlenc#rsa-oaep",

    blockPaddingSize: 42,

    // "aes-256-cbc"
    symmetricEncryptionAlgorithm: "aes-256-cbc",
    sha1or256: "SHA1",
    compute_derived_keys: compute_derived_keys
};


var _Basic256Sha256 = {
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
    asymmetricSignatureAlgorithm: "http://www.w3.org/2000/09/xmldsig#rsa-sha256",

    /* asymmetric encryption algorithm */
    asymmetricEncrypt: RSAOAEP_Encrypt,
    asymmetricDecrypt: RSAOAEP_Decrypt,
    asymmetricEncryptionAlgorithm: "http://www.w3.org/2001/04/xmlenc#rsa-oaep",

    blockPaddingSize: 42,

    // "aes-256-cbc"
    symmetricEncryptionAlgorithm: "aes-256-cbc",
    sha1or256: "SHA256",
    compute_derived_keys: compute_derived_keys
};

export function getCryptoFactory(securityPolicy : SecurityPolicy) : ICryptoFactory {

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

export function computeSignature(senderCertificate : Uint8Array, senderNonce : Uint8Array, receiverPrivatekey, securityPolicy) {

    if (!senderNonce || !senderCertificate) {
        return null;
    }

    var crypto_factory = getCryptoFactory(securityPolicy);
    if (!crypto_factory) {
        return null;
    }
    // This parameter is calculated by appending the clientNonce to the clientCertificate
    var buffer = new Uint8Array(senderCertificate.byteLength + senderNonce.byteLength);  //Buffer.concat([senderCertificate, senderNonce]);
    buffer.set(senderCertificate);
    buffer.set(senderNonce,senderCertificate.byteLength);

    // ... and signing the resulting sequence of bytes.
    var signature = crypto_factory.asymmetricSign(buffer, receiverPrivatekey);

    return new SignatureData({
        // This is a signature generated with the private key associated with a Certificate
        signature: signature,
        // A string containing the URI of the algorithm.
        // The URI string values are defined as part of the security profiles specified in Part 7.
        // (The SignatureAlgorithm shall be the AsymmetricSignatureAlgorithm specified in the
        // SecurityPolicy for the Endpoint)
        algorithm: crypto_factory.asymmetricSignatureAlgorithm // "http://www.w3.org/2000/09/xmldsig#rsa-sha1"
    });
}

export function verifySignature(receiverCertificate : Uint8Array, receiverNonce : Uint8Array, signature : SignatureData, senderCertificate : Uint8Array, securityPolicy) {

    if (securityPolicy === SecurityPolicy.None) {
        return true;
    }
    var crypto_factory = getCryptoFactory(securityPolicy);
    if (!crypto_factory) {
        return false;
    }
    assert(receiverNonce instanceof  Uint8Array);
    assert(receiverCertificate instanceof Uint8Array);
    assert(signature instanceof SignatureData);

    assert(senderCertificate instanceof Uint8Array);

    if (!(signature.signature instanceof Uint8Array)) {
        // no signature provided
        return false;
    }

    // This parameter is calculated by appending the clientNonce to the clientCertificate
    var buffer = new Uint8Array(receiverCertificate.byteLength + receiverNonce.byteLength);  //Buffer.concat([senderCertificate, senderNonce]);
    buffer.set(receiverCertificate);
    buffer.set(receiverNonce,receiverCertificate.byteLength);

    return crypto_factory.asymmetricVerify(buffer, signature.signature, senderCertificate);
}

export function getOptionsForSymmetricSignAndEncrypt(securityMode, derivedKeys) {
    assert(derivedKeys.hasOwnProperty("signatureLength"));
    assert(securityMode !== MessageSecurityMode.None && securityMode !== MessageSecurityMode.Invalid);

    var options = {
        signatureLength: derivedKeys.signatureLength,
        signingFunc: function (chunk) {
            return crypto_utils.makeMessageChunkSignatureWithDerivedKeys(chunk, derivedKeys);
        }
    };
    if (securityMode === MessageSecurityMode.SignAndEncrypt) {

        let ext = {
            plainBlockSize: derivedKeys.encryptingBlockSize,
            cipherBlockSize: derivedKeys.encryptingBlockSize,
            encrypt_buffer: function (chunk) {
                return crypto_utils.encryptBufferWithDerivedKeys(chunk, derivedKeys);
            }
        };
        for(let k in ext) {
            options[k] = ext[k];
        }
    }
    return options;
}
