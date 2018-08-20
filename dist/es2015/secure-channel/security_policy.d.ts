import { SignatureData } from '../generated/SignatureData';
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
export declare enum SecurityPolicy {
    Invalid = "invalid",
    None = "http://opcfoundation.org/UA/SecurityPolicy#None",
    Basic128 = "http://opcfoundation.org/UA/SecurityPolicy#Basic128",
    Basic128Rsa15 = "http://opcfoundation.org/UA/SecurityPolicy#Basic128Rsa15",
    Basic192 = "http://opcfoundation.org/UA/SecurityPolicy#Basic192",
    Basic192Rsa15 = "http://opcfoundation.org/UA/SecurityPolicy#Basic192Rsa15",
    Basic256 = "http://opcfoundation.org/UA/SecurityPolicy#Basic256",
    Basic256Rsa15 = "http://opcfoundation.org/UA/SecurityPolicy#Basic256Rsa15",
    Basic256Sha256 = "http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256"
}
export declare function fromURI(uri: String): SecurityPolicy;
export declare function toUri(value: any): SecurityPolicy;
export declare function compute_derived_keys(serverNonce: any, clientNonce: any): {
    derivedClientKeys: any;
    derivedServerKeys: any;
    algorithm: any;
};
export interface ICryptoFactory {
    securityPolicy: SecurityPolicy;
    symmetricKeyLength: number;
    derivedEncryptionKeyLength: number;
    derivedSignatureKeyLength: number;
    encryptingBlockSize: number;
    signatureLength: number;
    minimumAsymmetricKeyLength: number;
    maximumAsymmetricKeyLength: number;
    asymmetricVerifyChunk: Function;
    asymmetricSign: Function;
    asymmetricVerify: Function;
    asymmetricSignatureAlgorithm: string;
    asymmetricEncrypt: Function;
    asymmetricDecrypt: Function;
    asymmetricEncryptionAlgorithm: string;
    blockPaddingSize: number;
    symmetricEncryptionAlgorithm: string;
    sha1or256: string;
    compute_derived_keys: Function;
}
export declare function getCryptoFactory(securityPolicy: SecurityPolicy): ICryptoFactory;
export declare function computeSignature(senderCertificate: Uint8Array, senderNonce: Uint8Array, receiverPrivatekey: any, securityPolicy: any): SignatureData;
export declare function verifySignature(receiverCertificate: Uint8Array, receiverNonce: Uint8Array, signature: SignatureData, senderCertificate: Uint8Array, securityPolicy: any): any;
export declare function getOptionsForSymmetricSignAndEncrypt(securityMode: any, derivedKeys: any): {
    signatureLength: any;
    signingFunc: (chunk: any) => void;
};
