/**
 * @module node_opcua_crypto
 */
// ---------------------------------------------------------------------------------------------------------------------
// crypto_explore_certificate
// ---------------------------------------------------------------------------------------------------------------------
// Copyright (c) 2014-2018 - Etienne Rossignon
// ---------------------------------------------------------------------------------------------------------------------
//
// This  project is licensed under the terms of the MIT license.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so,  subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
// Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//
// ---------------------------------------------------------------------------------------------------------------------
// ASN.1 JavaScript decoder Copyright (c) 2008-2014 Lapo Luchini lapo@lapo.it
// Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby
// granted, provided that the above copyright notice and this permission notice appear in all copies.
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
// AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.
// ---------------------------------------------------------------------------------------------------------------------
/*jslint bitwise: true */
// tslint:disable:no-shadowed-variable

// references:
//  - http://tools.ietf.org/html/rfc5280
//  - http://www-lor.int-evry.fr/~michel/Supports/presentation.pdf
//  - ftp://ftp.rsa.com/pub/pkcs/ascii/layman.asc
//  - pubs.opengroup.org/onlinepubs/009609799/7a_nch02.htm#tagcjh_49_03
//  - https://github.com/lapo-luchini/asn1js/blob/master/asn1.js
//  - http://lapo.it/asn1js
//  - https://www.cs.auckland.ac.nz/~pgut001/dumpasn1.cfg
//  - http://pubs.opengroup.org/onlinepubs/009609799/7a_nch02.htm
//  - http://stackoverflow.com/questions/5929050/how-does-asn-1-encode-an-object-identifier
//  - http://luca.ntop.org/Teaching/Appunti/asn1.html

// note:
//  - http://commandlinefanatic.com/cgi-bin/showarticle.cgi?article=art030
//  openssl can be also used to discover the content of a DER file
//  $ openssl asn1parse -in cert.pem
import { Certificate, PEM, DER } from './common';
import { PublicKeyLength } from './explore_certificate';
import { buf2hex, buf2string, base64ToBuf, makeSHA1Thumbprint } from './crypto_utils';
import { assert } from '../assert';
import { concatTypedArrays } from '../basic-types/array';

import {
  AlgorithmIdentifier,
  BlockInfo,
  DirectoryName,
  formatBuffer2DigitHexWithColum,
  readTag,
  SignatureValue,
  TagType,
  _getBlock,
  _readAlgorithmIdentifier,
  _readBitString,
  _readBooleanValue,
  _readDirectoryName,
  _readECCAlgorithmIdentifier,
  _readIntegerValue,
  _readListOfInteger,
  _readLongIntegerValue,
  _readObjectIdentifier,
  _readOctetString,
  _readSignatureValue,
  _readStruct,
  _readTime,
  _readValue,
  _readVersionValue,
} from './asn1';

const PEM_REGEX = /^(-----BEGIN (.*)-----\r?\n([/+=a-zA-Z0-9\r\n]*)\r?\n-----END \2-----\r?\n)/gm;
const PEM_TYPE_REGEX = /^(-----BEGIN (.*)-----)/m;

export interface AttributeTypeAndValue {
  [key: string]: any;
}

function _readAttributeTypeAndValue(buffer: Uint8Array, block: BlockInfo): AttributeTypeAndValue {
  let inner_blocks = _readStruct(buffer, block);
  inner_blocks = _readStruct(buffer, inner_blocks[0]);

  const data = {
    identifier: _readObjectIdentifier(buffer, inner_blocks[0]).name,
    value: _readValue(buffer, inner_blocks[1]),
  };

  const result: AttributeTypeAndValue = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = value;
  }

  return result;
}

interface RelativeDistinguishedName {
  [prop: string]: any;
}

function _readRelativeDistinguishedName(
  buffer: Uint8Array,
  block: BlockInfo
): RelativeDistinguishedName {
  const inner_blocks = _readStruct(buffer, block);
  const data = inner_blocks.map((block) => _readAttributeTypeAndValue(buffer, block));
  const result: any = {};
  for (const e of data) {
    result[e.identifier] = e.value;
  }
  return result;
}

function _readName(buffer: Uint8Array, block: BlockInfo): RelativeDistinguishedName {
  return _readRelativeDistinguishedName(buffer, block);
}

export interface Validity {
  notBefore: Date;
  notAfter: Date;
}

function _readValidity(buffer: Uint8Array, block: BlockInfo): Validity {
  const inner_blocks = _readStruct(buffer, block);
  return {
    notBefore: _readTime(buffer, inner_blocks[0]),
    notAfter: _readTime(buffer, inner_blocks[1]),
  };
}

async function _readAuthorityKeyIdentifier(buffer: Uint8Array): Promise<AuthorityKeyIdentifier> {
  /**
   *  where a CA distributes its public key in the form of a "self-signed"
   *  certificate, the authority key identifier MAY be omitted.  Th
   *  signature on a self-signed certificate is generated with the private
   * key associated with the certificate's subject public key.  (This
   * proves that the issuer possesses both the public and private keys.)
   * In this case, the subject and authority key identifiers would be
   * identical, but only the subject key identifier is needed for
   * certification path building.
   */
  // see: https://www.ietf.org/rfc/rfc3280.txt page 25
  // AuthorityKeyIdentifier ::= SEQUENCE {
  //      keyIdentifier             [0] KeyIdentifier           OPTIONAL,
  //      authorityCertIssuer       [1] GeneralNames            OPTIONAL,
  //      authorityCertSerialNumber [2] CertificateSerialNumber OPTIONAL  }
  // KeyIdentifier ::= OCTET STRING

  const block_info = readTag(buffer, 0);
  const blocks = _readStruct(buffer, block_info);

  const keyIdentifier_block = _findBlockAtIndex(blocks, 0);
  const authorityCertIssuer_block = _findBlockAtIndex(blocks, 1);
  const authorityCertSerialNumber_block = _findBlockAtIndex(blocks, 2);

  function _readAuthorityCertIssuer(block: BlockInfo): DirectoryName {
    const inner_blocks = _readStruct(buffer, block);
    const directoryName_block = _findBlockAtIndex(inner_blocks, 4);
    if (directoryName_block) {
      const a = _readStruct(buffer, directoryName_block);
      return _readDirectoryName(buffer, a[0]);
    } else {
      throw new Error('Invalid _readAuthorityCertIssuer');
    }
  }
  async function _readAuthorityCertIssuerFingerPrint(block: BlockInfo): Promise<string> {
    const inner_blocks = _readStruct(buffer, block);
    const directoryName_block = _findBlockAtIndex(inner_blocks, 4)!;
    if (!directoryName_block) {
      return '';
    }
    const a = _readStruct(buffer, directoryName_block);
    if (a.length < 1) {
      return '';
    }
    return directoryName_block
      ? formatBuffer2DigitHexWithColum(
          new Uint8Array(await makeSHA1Thumbprint(_getBlock(buffer, a[0])))
        )
      : '';
  }

  const authorityCertIssuer = authorityCertIssuer_block
    ? _readAuthorityCertIssuer(authorityCertIssuer_block)
    : null;
  const authorityCertIssuerFingerPrint = authorityCertIssuer_block
    ? await _readAuthorityCertIssuerFingerPrint(authorityCertIssuer_block)
    : '';

  return {
    authorityCertIssuer,
    authorityCertIssuerFingerPrint,
    serial: authorityCertSerialNumber_block
      ? formatBuffer2DigitHexWithColum(_getBlock(buffer, authorityCertSerialNumber_block!))
      : null, // can be null for self-signed cert
    keyIdentifier: keyIdentifier_block
      ? formatBuffer2DigitHexWithColum(_getBlock(buffer, keyIdentifier_block!))
      : null, // can be null for self-signed certf
  };
}

/*
 Extension  ::=  SEQUENCE  {
        extnID      OBJECT IDENTIFIER,
        critical    BOOLEAN DEFAULT FALSE,
        extnValue   OCTET STRING
                    -- contains the DER encoding of an ASN.1 value
                    -- corresponding to the extension type identified
                    -- by extnID
        }
      id-ce-keyUsage OBJECT IDENTIFIER ::=  { id-ce 15 }
      KeyUsage ::= BIT STRING {
           digitalSignature        (0),
           nonRepudiation          (1), -- recent editions of X.509 have
                                -- renamed this bit to contentCommitment
           keyEncipherment         (2),
           dataEncipherment        (3),
           keyAgreement            (4),
           keyCertSign             (5),
           cRLSign                 (6),
           encipherOnly            (7),
           decipherOnly            (8) }
extKeyUsage
*/

function readBasicConstraint2_5_29_19(buffer: Uint8Array, block: BlockInfo): BasicConstraints {
  const block_info = readTag(buffer, 0);
  const inner_blocks = _readStruct(buffer, block_info);
  const cA = inner_blocks.length > 0 ? _readBooleanValue(buffer, inner_blocks[0]) : false;

  //    console.log("buffer[block_info.position] = ", buffer[block_info.position]);
  // const cA = buffer[block_info.position] ? true : false;

  let pathLengthConstraint = 0;
  if (inner_blocks.length > 1) {
    pathLengthConstraint = _readIntegerValue(buffer, inner_blocks[1]);
  }
  return { critical: true, cA, pathLengthConstraint };
}

// function read_GeneralNames
// GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName
// GeneralName ::= CHOICE {
//        otherName                 [0]  AnotherName,
//        rfc822Name                [1]  IA5String,
//        dNSName                   [2]  IA5String,
//        x400Address               [3]  ORAddress,
//        directoryName             [4]  Name,
//        ediPartyName              [5]  EDIPartyName,
//        uniformResourceIdentifier [6]  IA5String,
//        iPAddress                 [7]  OCTET STRING,
//        registeredID              [8]  OBJECT IDENTIFIER }
function _readGeneralNames(buffer: Uint8Array, block: BlockInfo) {
  const _data: any = {
    1: { name: 'rfc822Name', type: 'IA5String' },
    2: { name: 'dNSName', type: 'IA5String' },
    3: { name: 'x400Address', type: 'ORAddress' },
    4: { name: 'directoryName', type: 'Name' },
    5: { name: 'ediPartyName', type: 'EDIPartyName' },
    6: { name: 'uniformResourceIdentifier', type: 'IA5String' },
    7: { name: 'iPAddress', type: 'OCTET_STRING' },
    8: { name: 'registeredID', type: 'OBJECT_IDENTIFIER' },
  };
  const blocks = _readStruct(buffer, block);

  function _readFromType(buffer: Uint8Array, block: BlockInfo, type: string) {
    switch (type) {
      case 'IA5String':
        const dec = new TextDecoder('utf-8');
        return buf2string(buffer.subarray(block.position, block.position + block.length));
      default:
        return buf2hex(buffer.subarray(block.position, block.position + block.length));
    }
  }

  const n: { [key: string]: string[] } = {};
  for (const block of blocks) {
    assert((block.tag & 0x80) === 0x80);
    const t = block.tag & 0x7f;
    const type = _data[t] as { name: string; type: string } | undefined;

    // istanbul ignore next
    if (!type) {
      throw new Error(' INVALID TYPE => ' + t + '0x' + t.toString(16));
    }
    n[type.name] = n[type.name] || [];
    n[type.name].push(_readFromType(buffer, block, type.type));
  }
  return n;
}

function _readSubjectAltNames(buffer: Uint8Array) {
  const block_info = readTag(buffer, 0);
  return _readGeneralNames(buffer, block_info);
}

// named X509KeyUsage not to confuse with DOM KeyUsage
export interface X509KeyUsage {
  digitalSignature: boolean;
  nonRepudiation: boolean;
  keyEncipherment: boolean;
  dataEncipherment: boolean;
  keyAgreement: boolean;
  keyCertSign: boolean;
  cRLSign: boolean;
  encipherOnly: boolean;
  decipherOnly: boolean;
}
export interface X509ExtKeyUsage {
  clientAuth: boolean;
  serverAuth: boolean;
  codeSigning: boolean;
  emailProtection: boolean;
  timeStamping: boolean;
  ocspSigning: boolean;
  ipsecEndSystem: boolean;
  ipsecTunnel: boolean;
  ipsecUser: boolean;
  // etc ... to be completed
}

function readKeyUsage(oid: string, buffer: Uint8Array): X509KeyUsage {
  const block_info = readTag(buffer, 0);

  // get value as BIT STRING
  let b2 = 0x00;
  let b3 = 0x00;
  if (block_info.length > 1) {
    // skip first byte, just indicates unused bits which
    // will be padded with 0s anyway
    // get bytes with flag bits
    b2 = buffer[block_info.position + 1];
    b3 = block_info.length > 2 ? buffer[block_info.position + 2] : 0;
  }

  // set flags
  return {
    // tslint:disable-next-line: no-bitwise
    digitalSignature: (b2 & 0x80) === 0x80,
    // tslint:disable-next-line: no-bitwise
    nonRepudiation: (b2 & 0x40) === 0x40,
    // tslint:disable-next-line: no-bitwise
    keyEncipherment: (b2 & 0x20) === 0x20,
    // tslint:disable-next-line: no-bitwise
    dataEncipherment: (b2 & 0x10) === 0x10,
    // tslint:disable-next-line: no-bitwise
    keyAgreement: (b2 & 0x08) === 0x08,
    // tslint:disable-next-line: no-bitwise
    keyCertSign: (b2 & 0x04) === 0x04,
    // tslint:disable-next-line: no-bitwise
    cRLSign: (b2 & 0x02) === 0x02,
    // tslint:disable-next-line: no-bitwise
    encipherOnly: (b2 & 0x01) === 0x01,
    // tslint:disable-next-line: no-bitwise
    decipherOnly: (b3 & 0x80) === 0x80,
  };
}

function readExtKeyUsage(oid: string, buffer: Uint8Array): X509ExtKeyUsage {
  assert(oid === '2.5.29.37');
  // see https://tools.ietf.org/html/rfc5280#section-4.2.1.12
  const block_info = readTag(buffer, 0);

  const inner_blocks = _readStruct(buffer, block_info);

  const extKeyUsage: X509ExtKeyUsage = {
    serverAuth: false,
    clientAuth: false,
    codeSigning: false,
    emailProtection: false,
    timeStamping: false,
    ipsecEndSystem: false,
    ipsecTunnel: false,
    ipsecUser: false,
    ocspSigning: false,
  };
  for (const block of inner_blocks) {
    const identifier = _readObjectIdentifier(buffer, block);
    (extKeyUsage as any)[identifier.name] = true;
  }
  /*
  
 id-kp OBJECT IDENTIFIER ::= { id-pkix 3 }
 id-kp-serverAuth             OBJECT IDENTIFIER ::= { id-kp 1 }
 -- TLS WWW server authentication
 -- Key usage bits that may be consistent: digitalSignature,
 -- keyEncipherment or keyAgreement
 id-kp-clientAuth             OBJECT IDENTIFIER ::= { id-kp 2 }
 -- TLS WWW client authentication
 -- Key usage bits that may be consistent: digitalSignature
 -- and/or keyAgreement
 id-kp-codeSigning             OBJECT IDENTIFIER ::= { id-kp 3 }
 -- Signing of downloadable executable code
 -- Key usage bits that may be consistent: digitalSignature
 id-kp-emailProtection         OBJECT IDENTIFIER ::= { id-kp 4 }
 -- Email protection
 -- Key usage bits that may be consistent: digitalSignature,
 -- nonRepudiation, and/or (keyEncipherment or keyAgreement)
 id-kp-timeStamping            OBJECT IDENTIFIER ::= { id-kp 8 }
 -- Binding the hash of an object to a time
 -- Key usage bits that may be consistent: digitalSignature
 -- and/or nonRepudiation
 id-kp-OCSPSigning            OBJECT IDENTIFIER ::= { id-kp 9 }
 -- Signing OCSP responses
 -- Key usage bits that may be consistent: digitalSignature
 -- and/or nonRepudiation
 */
  // set flags
  return extKeyUsage;
}

export interface SubjectPublicKey {
  modulus: Uint8Array;
}

function _readSubjectPublicKey(buffer: Uint8Array): SubjectPublicKey {
  const block_info = readTag(buffer, 0);
  const blocks = _readStruct(buffer, block_info);

  return {
    modulus: buffer.subarray(blocks[0].position + 1, blocks[0].position + blocks[0].length),
  };
}

/*
 Extension  ::=  SEQUENCE  {
 extnID      OBJECT IDENTIFIER,
 critical    BOOLEAN DEFAULT FALSE,
 extnValue   OCTET STRING
 -- contains the DER encoding of an ASN.1 value
 -- corresponding to the extension type identified
 -- by extnID
 }
 */
function _readExtension(buffer: Uint8Array, block: BlockInfo) {
  const inner_blocks = _readStruct(buffer, block);

  if (inner_blocks.length === 3) {
    assert(inner_blocks[1].tag === TagType.BOOLEAN);
    inner_blocks[1] = inner_blocks[2];
  }

  const identifier = _readObjectIdentifier(buffer, inner_blocks[0]);
  const buf = new Uint8Array(_getBlock(buffer, inner_blocks[1]));

  let value = null;
  switch (identifier.name) {
    case 'subjectKeyIdentifier':
      /* from https://tools.ietf.org/html/rfc3280#section-4.1 :
        For CA certificates, subject key identifiers SHOULD be derived from
        the public key or a method that generates unique values.  Two common
        methods for generating key identifiers from the public key are:
          (1) The keyIdentifier is composed of the 160-bit SHA-1 hash of the
          value of the BIT STRING subjectPublicKey (excluding the tag,
          length, and number of unused bits).
          (2) The keyIdentifier is composed of a four bit type field with
          the value 0100 followed by the least significant 60 bits of the
          SHA-1 hash of the value of the BIT STRING subjectPublicKey
          (excluding the tag, length, and number of unused bit string bits).
      */
      value = formatBuffer2DigitHexWithColum(_readOctetString(buffer, inner_blocks[1]));
      break;
    case 'subjectAltName':
      value = _readSubjectAltNames(buf);
      break;
    case 'authorityKeyIdentifier':
      value = _readAuthorityKeyIdentifier(buf);
      break;
    case 'basicConstraints':
      value = readBasicConstraint2_5_29_19(buf, inner_blocks[1]); //  "2.5.29.19":
      // "basicConstraints ( not implemented yet) " + buf.toString("hex");
      break;
    case 'certExtension': // Netscape
      value = 'basicConstraints ( not implemented yet) ' + buf2hex(buf);
      break;
    case 'extKeyUsage':
      value = readExtKeyUsage(identifier.oid, buf);
      break;
    case 'keyUsage':
      value = readKeyUsage(identifier.oid, buf);
      break;
    default:
      value = 'Unknown ' + identifier.name + buf2hex(buf);
  }
  return {
    identifier,
    value,
  };
}

// Extensions  ::=  SEQUENCE SIZE (1..MAX) OF Extension
function _readExtensions(buffer: Uint8Array, block: BlockInfo): CertificateExtension {
  assert(block.tag === 0xa3);
  let inner_blocks = _readStruct(buffer, block);
  inner_blocks = _readStruct(buffer, inner_blocks[0]);

  const extensions = inner_blocks.map((block) => _readExtension(buffer, block));

  const result: any = {};
  for (const e of extensions) {
    result[e.identifier.name] = e.value;
  }
  return result as CertificateExtension;
}

function _findBlockAtIndex(blocks: BlockInfo[], index: number): BlockInfo | null {
  const tmp = blocks.filter((b: BlockInfo) => b.tag === 0xa0 + index);
  if (tmp.length === 0) {
    return null;
  }
  return tmp[0];
}

/*
 SEQUENCE {
 204   13:       SEQUENCE {
 206    9:         OBJECT IDENTIFIER
 :           rsaEncryption (1 2 840 113549 1 1 1)
 217    0:         NULL
 :         }
 219  141:       BIT STRING, encapsulates {
 223  137:         SEQUENCE {
 226  129:           INTEGER
 :             00 C2 D7 97 6D 28 70 AA 5B CF 23 2E 80 70 39 EE
 :             DB 6F D5 2D D5 6A 4F 7A 34 2D F9 22 72 47 70 1D
 :             EF 80 E9 CA 30 8C 00 C4 9A 6E 5B 45 B4 6E A5 E6
 :             6C 94 0D FA 91 E9 40 FC 25 9D C7 B7 68 19 56 8F
 :             11 70 6A D7 F1 C9 11 4F 3A 7E 3F 99 8D 6E 76 A5
 :             74 5F 5E A4 55 53 E5 C7 68 36 53 C7 1D 3B 12 A6
 :             85 FE BD 6E A1 CA DF 35 50 AC 08 D7 B9 B4 7E 5C
 :             FE E2 A3 2C D1 23 84 AA 98 C0 9B 66 18 9A 68 47
 :             E9
 358    3:           INTEGER 65537
 :           }
 :         }
 :       }
 */

function _readSubjectPublicKeyInfo(buffer: Uint8Array, block: BlockInfo): SubjectPublicKeyInfo {
  const inner_blocks = _readStruct(buffer, block);

  // algorithm identifier
  const algorithm = _readAlgorithmIdentifier(buffer, inner_blocks[0]);
  // const parameters         = read_BitString(buffer,inner_blocks[1]);
  const subjectPublicKey = _readBitString(buffer, inner_blocks[1]);

  // read the 2 big integers of the key
  const data = subjectPublicKey.data;
  const values = _readListOfInteger(data);
  // xx const value = read_ListOfInteger(data);
  return {
    algorithm: algorithm.identifier,
    keyLength: (values[0].byteLength - 1) as PublicKeyLength,
    subjectPublicKey: _readSubjectPublicKey(subjectPublicKey.data),
    // xx values: values,
    // xx values_length : values.map(function (a){ return a.length; })
  };
}

function _readSubjectECCPublicKeyInfo(buffer: Uint8Array, block: BlockInfo): SubjectPublicKeyInfo {
  const inner_blocks = _readStruct(buffer, block);

  // first parameter is the second element of the first block, which is why we have another algorithm
  const algorithm = _readECCAlgorithmIdentifier(buffer, inner_blocks[0]);

  // the public key is already in bit format, we just need to read it
  const subjectPublicKey = _readBitString(buffer, inner_blocks[1]);

  // take out the data which is the entirity of our public key
  const data = subjectPublicKey.data;
  return {
    algorithm: algorithm.identifier,
    keyLength: (data.length - 1) as PublicKeyLength,
    subjectPublicKey: {
      modulus: data,
    },
  };
}

export interface SubjectPublicKeyInfo {
  algorithm: string;
  keyLength: PublicKeyLength;
  subjectPublicKey: SubjectPublicKey;
}

export interface BasicConstraints {
  critical: boolean;
  cA: boolean;
  pathLengthConstraint?: number; // 0 Unlimited
}

export interface AuthorityKeyIdentifier {
  keyIdentifier: string | null;
  authorityCertIssuer: DirectoryName | null;
  authorityCertIssuerFingerPrint: string;
  serial: string | null;
}

export interface CertificateExtension {
  basicConstraints: BasicConstraints;
  subjectKeyIdentifier?: string;
  authorityKeyIdentifier?: AuthorityKeyIdentifier;
  keyUsage?: X509KeyUsage;
  extKeyUsage?: X509ExtKeyUsage;
  subjectAltName?: any;
}

export interface TbsCertificate {
  version: number;
  serialNumber: string;
  issuer: any;
  signature: AlgorithmIdentifier;
  validity: Validity;
  subject: DirectoryName;
  subjectFingerPrint: string;
  subjectPublicKeyInfo: SubjectPublicKeyInfo;
  extensions: CertificateExtension | null;
}

async function readTbsCertificate(buffer: Uint8Array, block: BlockInfo): Promise<TbsCertificate> {
  const blocks = _readStruct(buffer, block);

  let version, serialNumber, signature, issuer, validity, subject, extensions, subjectFingerPrint;
  let subjectPublicKeyInfo: SubjectPublicKeyInfo;

  if (blocks.length === 6) {
    // X509 Version 1:
    version = 1;
    serialNumber = formatBuffer2DigitHexWithColum(_readLongIntegerValue(buffer, blocks[0]));
    signature = _readAlgorithmIdentifier(buffer, blocks[1]);
    issuer = _readName(buffer, blocks[2]);
    validity = _readValidity(buffer, blocks[3]);
    subject = _readName(buffer, blocks[4]);
    subjectFingerPrint = formatBuffer2DigitHexWithColum(
      new Uint8Array(await makeSHA1Thumbprint(_getBlock(buffer, blocks[4])))
    );
    subjectPublicKeyInfo = _readSubjectPublicKeyInfo(buffer, blocks[5]);

    extensions = null;
  } else {
    // X509 Version 3:
    const version_block = _findBlockAtIndex(blocks, 0);
    if (!version_block) {
      throw new Error('cannot find version block');
    }
    version = _readVersionValue(buffer, version_block) + 1;
    serialNumber = formatBuffer2DigitHexWithColum(_readLongIntegerValue(buffer, blocks[1]));
    signature = _readAlgorithmIdentifier(buffer, blocks[2]);
    issuer = _readName(buffer, blocks[3]);
    validity = _readValidity(buffer, blocks[4]);
    subject = _readName(buffer, blocks[5]);
    subjectFingerPrint = formatBuffer2DigitHexWithColum(
      new Uint8Array(await makeSHA1Thumbprint(_getBlock(buffer, blocks[5])))
    );

    const inner_block = _readStruct(buffer, blocks[6]);
    const what_type = _readAlgorithmIdentifier(buffer, inner_block[0]).identifier;

    switch (what_type) {
      case 'rsaEncryption': {
        subjectPublicKeyInfo = _readSubjectPublicKeyInfo(buffer, blocks[6]);
        break;
      }
      case 'ecPublicKey':
      default: {
        subjectPublicKeyInfo = _readSubjectECCPublicKeyInfo(buffer, blocks[6]);
        break;
      }
    }

    const extensionBlock = _findBlockAtIndex(blocks, 3);
    if (!extensionBlock) {
      // tslint:disable-next-line: no-console
      console.log(
        'X509 certificate is invalid : cannot find extension block version =' + version_block
      );
      extensions = null;
    } else {
      extensions = _readExtensions(buffer, extensionBlock);
    }
  }

  return {
    version,
    serialNumber,
    signature,
    issuer,
    validity,
    subject,
    subjectFingerPrint,
    subjectPublicKeyInfo,
    extensions,
  };
}

export interface CertificateInternals {
  tbsCertificate: TbsCertificate;
  signatureAlgorithm: AlgorithmIdentifier;
  signatureValue: SignatureValue;
}

/**
 * explore a certificate structure
 * @param certificate
 * @returns a json object that exhibits the internal data of the certificate
 */
export async function exploreCertificate(certificate: Certificate): Promise<CertificateInternals> {
  assert(certificate instanceof Uint8Array);
  if (!(certificate as any)._exploreCertificate_cache) {
    const block_info = readTag(certificate, 0);
    const blocks = _readStruct(certificate, block_info);
    (certificate as any)._exploreCertificate_cache = {
      tbsCertificate: await readTbsCertificate(certificate, blocks[0]),
      signatureAlgorithm: _readAlgorithmIdentifier(certificate, blocks[1]),
      signatureValue: _readSignatureValue(certificate, blocks[2]),
    };
  }
  return (certificate as any)._exploreCertificate_cache;
}

export function getSPKIFromCertificate(certificate: Certificate) {
  const block_info = readTag(certificate, 0);
  let blocks = _readStruct(certificate, block_info);
  // read the blocks of tbsCertificate
  blocks = _readStruct(certificate, blocks[0]);
  if (blocks.length === 6) {
    // X509 Version 1:
    const startPos = blocks[4].position + blocks[4].length;
    const tagLength = blocks[5].position - startPos;
    const spkiLength = blocks[5].length + tagLength;
    return new Uint8Array(certificate.slice(startPos, startPos + spkiLength));
    // return new Uint8Array(certificate, startPos /*, spkiLength*/);
  } else {
    // X509 Version 3:
    const startPos = blocks[5].position + blocks[5].length;
    const tagLength = blocks[6].position - startPos;
    const spkiLength = blocks[6].length + tagLength;
    return new Uint8Array(certificate.slice(startPos, startPos + spkiLength));
    // return new Uint8Array(certificate, startPos /*, spkiLength*/);
  }
}

/**
 * @method combine_der
 * combine an array of certificates into a single blob
 * @param certificates a array with the individual DER certificates of the chain
 * @return a concatenated buffer containing the certificates
 */
export function combine_der(certificates: Certificate[]): Certificate {
  assert(Array.isArray(certificates));

  // perform some sanity check
  for (const cert of certificates) {
    const b = split_der(cert);
    let sum = 0;
    b.forEach((block) => {
      const block_info = readTag(block, 0);
      // xx console.log("xxxx" ,cert.length,block_info);
      // xx console.log(cert.toString("base64"));
      assert(block_info.position + block_info.length === block.byteLength);
      sum += block.byteLength;
    });
    assert(sum === cert.byteLength);
  }
  return concatTypedArrays(certificates);
}

/**
 * @method split_der
 * split a multi chain certificates
 * @param certificateChain  the certificate chain in der (binary) format}
 * @returns an array of Der , each element of the array is one certificate of the chain
 */
export function split_der(certificateChain: Certificate): Certificate[] {
  const certificate_chain: Uint8Array[] = [];

  do {
    const block_info = readTag(certificateChain, 0);
    const length = block_info.position + block_info.length;
    const der_certificate = certificateChain.slice(0, length);
    certificate_chain.push(der_certificate);
    certificateChain = certificateChain.slice(length);
  } while (certificateChain.byteLength > 0);
  return certificate_chain;
}

const PKCS_1_PEM_TYPE = 'RSA PRIVATE KEY';

export function convertPEMtoDER(raw_key: PEM): DER {
  let match: any;
  let pemType;
  let base64str;

  const parts: DER[] = [];
  PEM_REGEX.lastIndex = 0;
  // tslint:disable-next-line:no-conditional-assignment
  while ((match = PEM_REGEX.exec(raw_key)) !== null) {
    pemType = match[2];
    // pemType shall be "RSA PRIVATE KEY" , "PUBLIC KEY", "CERTIFICATE"
    base64str = match[3];
    base64str = base64str.replace(/\r?\n/g, '');
    let buf = base64ToBuf(base64str);
    if (pemType === PKCS_1_PEM_TYPE) {
      buf = convertPKCS1ToPKCS8(buf);
    }
    parts.push(buf);
  }
  return combine_der(parts);
}

function convertPKCS1ToPKCS8(pkcs1: Uint8Array): Uint8Array {
  const totalLength = pkcs1.length + 22;

  // prettier-ignore
  const pkcs8Header = new Uint8Array([
          TagType.SEQUENCE, 0x82,  ((totalLength >> 8) & 0xff), (totalLength & 0xff), // Sequence + total length
          TagType.INTEGER, 0x1, 0x0, // Integer (0)
          TagType.SEQUENCE, 0xD, 0x6, 0x9, 0x2A, 0x86, 0x48, 0x86, 0xF7, 0xD, 0x1, 0x1, 0x1, TagType.NULL, 0x0, // Sequence: 1.2.840.113549.1.1.1, NULL
          TagType.OCTET_STRING, 0x82,  ((pkcs1.length >> 8) & 0xff), (pkcs1.length & 0xff) // Octet string + length
        ]);
  return concatTypedArrays([pkcs8Header, pkcs1]);
}

export function generatePublicKeyFromDER(
  der_certificate: Uint8Array,
  hash: 'SHA-1' | 'SHA-256'
): PromiseLike<CryptoKey> {
  if ((der_certificate as any)._publicKey) {
    return Promise.resolve((der_certificate as any)._publicKey);
  }

  const spki = getSPKIFromCertificate(der_certificate);

  return crypto.subtle
    .importKey('spki', spki, { name: 'RSA-OAEP', hash }, true, ['encrypt'])
    .then((key) => {
      (der_certificate as any)._publicKey = key;
      return key;
    });
}

export function generateVerifyKeyFromDER(
  der_certificate: Uint8Array,
  hash: 'SHA-1' | 'SHA-256',
  algorithm: 'RSASSA-PKCS1-v1_5' | 'RSA-PSS' = 'RSASSA-PKCS1-v1_5'
): PromiseLike<CryptoKey> {
  if ((der_certificate as any)._verifyKey) {
    return Promise.resolve((der_certificate as any)._verifyKey);
  }

  const spki = getSPKIFromCertificate(der_certificate);

  return crypto.subtle
    .importKey('spki', spki, { name: algorithm, hash }, true, ['verify'])
    .then((key) => {
      (der_certificate as any)._verifyKey = key;
      return key;
    });
}

/**
 *  generate a RSA private key for decrypting
 */
export function generatePrivateKeyFromDER(
  der_certificate: Uint8Array,
  hash: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
) {
  if ((der_certificate as any)._decryptKey) {
    return Promise.resolve((der_certificate as any)._decryptKey);
  }

  return window.crypto.subtle
    .importKey(
      'pkcs8',
      der_certificate,
      {
        name: 'RSA-OAEP',
        hash,
      },
      false,
      ['decrypt']
    )
    .then((key) => {
      (der_certificate as any)._decryptKey = key;
      return key;
    });
}

/**
 * generate an RSA private key for signing
 */
export function generateSignKeyFromDER(
  der_certificate: Uint8Array,
  hash: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512',
  algorithm: 'RSASSA-PKCS1-v1_5' | 'RSA-PSS' = 'RSASSA-PKCS1-v1_5'
) {
  if ((der_certificate as any)._signKey) {
    return Promise.resolve((der_certificate as any)._signKey);
  }

  return window.crypto.subtle
    .importKey(
      'pkcs8',
      der_certificate,
      {
        name: algorithm,
        hash,
      },
      false,
      ['sign']
    )
    .then((key) => {
      (der_certificate as any)._signKey = key;
      return key;
    });
}
