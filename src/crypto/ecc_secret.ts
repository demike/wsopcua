/**
 * EccEncryptedSecret protect/unprotect — OPC 10000-6 §6.8.3 + OPC 10000-4 §7.40.2.5.
 *
 * Used to protect UserIdentityToken secrets (passwords, tokenData) when the
 * UserTokenPolicy SecurityPolicy is ECC (EccNistP256 / EccNistP384). All
 * primitives are WebCrypto-only.
 *
 * Construction (sender side):
 *  1. ECDH(senderEphemeralPrivate, receiverEphemeralPublic) -> IKM (x-coordinate)
 *  2. SecretSalt = L | UTF8("opcua-secret") | SenderPublicKey | ReceiverPublicKey
 *     (L = EncryptionKeyLength + InitializationVectorLength as LE16;
 *     public keys are x||y zero-padded big-endian, as in §6.8.1)
 *  3. HKDF extract/expand (same T(n) construction as the channel handshake,
 *     Info = SecretSalt) -> EncryptingKey | InitializationVector
 *     (no signing key: Table 71 splits keying material into enc key + IV only)
 *  4. Payload plaintext = ByteString(Nonce) + ByteString(Secret) + padding +
 *     UInt16(PayloadPaddingSize); AES-CBC encrypt (payload is pre-padded, so
 *     WebCrypto performs no additional padding)
 *  5. Serialize the EncryptedSecret envelope (ExtensionObject-style with the
 *     EccEncryptedSecret DataType NodeId 17546) and ECDSA-sign everything
 *     after the Length field, excluding the Signature itself.
 *
 * Wire conventions chosen where the spec leaves encoding open:
 *  - ECDSA signatures are raw r||s (64 B P-256, 96 B P-384), consistent with
 *    this stack's OPN ECDSA handling (see `ecc.ts`).
 *  - KeyData is ByteString(SenderPublicKey) + ByteString(ReceiverPublicKey)
 *    and is NOT encrypted (Table 186); KeyDataLength is its plain length.
 *
 * SCOPE: crypto + envelope codec only. The session handshake that delivers
 * the receiver EphemeralKey (AdditionalHeader in CreateSession/ActivateSession,
 * §6.8.2) lives in the session layer; see `parseEccSessionEphemeralKey` below
 * for the parsing half used by it.
 */

import {
  EccPolicyParams,
  deriveSharedSecretIKM,
  eccExpand,
  eccExtract,
  importEphemeralPublicKey,
} from './ecc';
import { generateEccVerifyKeyFromDER } from './crypto_explore_certificate';
import { assert } from '../assert';

/** DataType NodeId of EccEncryptedSecret (ns=0). */
export const ECC_ENCRYPTED_SECRET_TYPE_ID = 17546;

export const ECC_SECRET_SALT_LABEL = 'opcua-secret';

/** AdditionalHeader key names for the §6.8.2 session handshake (Table 70). */
export const ECDH_POLICY_URI_KEY = 'ECDHPolicyUri';
export const ECDH_KEY_KEY = 'ECDHKey';

function subtle(): SubtleCrypto {
  const c: SubtleCrypto | undefined =
    (globalThis as any)?.crypto?.subtle ?? (typeof crypto !== 'undefined' ? crypto.subtle : undefined);
  if (!c) {
    throw new Error('WebCrypto SubtleCrypto is not available');
  }
  return c;
}

// --- little-endian byte helpers (UA Binary encoding) ---

function u16le(n: number): Uint8Array {
  const out = new Uint8Array(2);
  new DataView(out.buffer).setUint16(0, n, true);
  return out;
}

function u32le(n: number): Uint8Array {
  const out = new Uint8Array(4);
  new DataView(out.buffer).setUint32(0, n, true);
  return out;
}

function i32le(n: number): Uint8Array {
  const out = new Uint8Array(4);
  new DataView(out.buffer).setInt32(0, n, true);
  return out;
}

function i64le(ticksLo: number, ticksHi: number): Uint8Array {
  const out = new Uint8Array(8);
  const view = new DataView(out.buffer);
  view.setUint32(0, ticksLo >>> 0, true);
  view.setUint32(4, ticksHi >>> 0, true);
  return out;
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.byteLength, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.byteLength;
  }
  return out;
}

function uaString(s: string): Uint8Array {
  const body = new TextEncoder().encode(s);
  return concat(i32le(body.byteLength), body);
}

/** UA ByteString: Int32 length (-1 = null) + bytes. */
function uaByteString(bytes: Uint8Array | undefined | null): Uint8Array {
  if (bytes === undefined || bytes === null) {
    return i32le(-1);
  }
  return concat(i32le(bytes.byteLength), bytes);
}

/** OPC UA DateTime as LE64 100ns ticks since 1601-01-01 UTC. */
export function dateToTicks(date: Date): { lo: number; hi: number } {
  const ms = date.getTime() + 11644473600000;
  const ticks = BigInt(ms) * BigInt(10000);
  return { lo: Number(ticks & BigInt(0xffffffff)), hi: Number((ticks >> BigInt(32)) & BigInt(0xffffffff)) };
}

export function ticksToDate(lo: number, hi: number): Date {
  const ticks = (BigInt(hi >>> 0) << BigInt(32)) | BigInt(lo >>> 0);
  return new Date(Number(ticks / BigInt(10000)) - 11644473600000);
}

class Cursor {
  pos = 0;
  constructor(readonly buf: Uint8Array) {}
  bytes(n: number): Uint8Array {
    if (this.pos + n > this.buf.byteLength) {
      throw new Error('EccEncryptedSecret is truncated');
    }
    const out = this.buf.subarray(this.pos, this.pos + n);
    this.pos += n;
    return out;
  }
  u16(): number {
    const v = new DataView(this.buf.buffer, this.buf.byteOffset + this.pos, 2).getUint16(0, true);
    this.pos += 2;
    return v;
  }
  u32(): number {
    const v = new DataView(this.buf.buffer, this.buf.byteOffset + this.pos, 4).getUint32(0, true);
    this.pos += 4;
    return v;
  }
  i32(): number {
    const v = new DataView(this.buf.buffer, this.buf.byteOffset + this.pos, 4).getInt32(0, true);
    this.pos += 4;
    return v;
  }
  byteString(): Uint8Array {
    const len = this.i32();
    if (len < 0) {
      return new Uint8Array(0);
    }
    return new Uint8Array(this.bytes(len));
  }
}

// --- key derivation (§6.8.3 Table 71) ---

export interface EccSecretKeys {
  encryptingKey: Uint8Array;
  initializationVector: Uint8Array;
}

/** SecretSalt = L | UTF8("opcua-secret") | SenderPublicKey | ReceiverPublicKey */
export function buildSecretSalt(
  derivedLength: number,
  senderPublicKey: Uint8Array,
  receiverPublicKey: Uint8Array
): Uint8Array {
  return concat(
    u16le(derivedLength),
    new TextEncoder().encode(ECC_SECRET_SALT_LABEL),
    senderPublicKey,
    receiverPublicKey
  );
}

/** IKM=shared secret, Salt=Info=SecretSalt -> EncryptingKey | InitializationVector. */
export async function deriveEccSecretKeys(
  ikm: Uint8Array,
  salt: Uint8Array,
  params: EccPolicyParams
): Promise<EccSecretKeys> {
  const ivLength = params.encryptingBlockSize;
  const derivedLength = params.derivedEncryptionKeyLength + ivLength;
  if (salt.byteLength < 2 + ECC_SECRET_SALT_LABEL.length) {
    throw new Error('EccEncryptedSecret salt too short');
  }
  const prk = await eccExtract(salt, ikm, params.hash);
  const okm = await eccExpand(prk, salt, derivedLength, params.hash);
  return {
    encryptingKey: okm.subarray(0, params.derivedEncryptionKeyLength),
    initializationVector: okm.subarray(params.derivedEncryptionKeyLength),
  };
}

// --- payload padding (§6.8.3 formula; BlockSize = IV length for AES-CBC) ---

export function secretPaddingSize(
  nonceLength: number,
  secretLength: number,
  blockSize: number
): number {
  const dataLength = 4 + nonceLength + 4 + secretLength + 2;
  let padding = dataLength % blockSize === 0 ? 0 : blockSize - (dataLength % blockSize);
  if (padding + secretLength < blockSize) {
    padding += blockSize;
  }
  return padding;
}

/** ByteString(Nonce) + ByteString(Secret) + padding + UInt16(PaddingSize). */
export function buildSecretPayload(nonce: Uint8Array, secret: Uint8Array, blockSize: number): Uint8Array {
  const paddingSize = secretPaddingSize(nonce.byteLength, secret.byteLength, blockSize);
  return concat(
    uaByteString(nonce),
    uaByteString(secret),
    new Uint8Array(paddingSize).fill(paddingSize & 0xff),
    u16le(paddingSize)
  );
}

/** Inverse of buildSecretPayload with padding validation (constant-shape errors). */
export function parseSecretPayload(plain: Uint8Array): { nonce: Uint8Array; secret: Uint8Array } {
  const fail = () => new Error('EccEncryptedSecret payload invalid (Bad_IdentityTokenInvalid)');
  try {
    const c = new Cursor(plain);
    const nonce = c.byteString();
    const secret = c.byteString();
    const rest = plain.byteLength - c.pos;
    if (rest < 2) {
      throw fail();
    }
    const paddingSize = new DataView(
      plain.buffer,
      plain.byteOffset + plain.byteLength - 2,
      2
    ).getUint16(0, true);
    if (4 + nonce.byteLength + 4 + secret.byteLength + paddingSize + 2 !== plain.byteLength) {
      throw fail();
    }
    const pad = plain.subarray(plain.byteLength - 2 - paddingSize, plain.byteLength - 2);
    const expected = paddingSize & 0xff;
    for (let i = 0; i < pad.byteLength; i++) {
      if (pad[i] !== expected) {
        throw fail();
      }
    }
    return { nonce: new Uint8Array(nonce), secret: new Uint8Array(secret) };
  } catch (err) {
    if (err instanceof RangeError) {
      throw fail();
    }
    throw err;
  }
}

async function importAesKey(key: Uint8Array): Promise<CryptoKey> {
  // Both usages: decrypt mirrors the stack convention of encrypting a padding
  // block before decrypting (see `encryptedPaddingBlock`).
  return subtle().importKey('raw', key as any, { name: 'AES-CBC' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * Raw AES-CBC without padding semantics.
 *
 * WebCrypto specifies no padding for AES-CBC, but runtimes this stack targets
 * (Node, happy-dom) auto-append a PKCS#7 block on encrypt and strip padding
 * on decrypt. This mirrors `encryptBufferWithDerivedKeys` /
 * `decryptBufferWithDerivedKeys`: truncate the auto-added block on encrypt;
 * append an encrypted padding block before decrypt. Payloads here are always
 * block-aligned (see `buildSecretPayload`), so both branches are exact.
 */
async function aesCbcEncryptRaw(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array
): Promise<Uint8Array> {
  assert(data.byteLength % 16 === 0, 'ECC secret payload must be block-aligned');
  const k = await importAesKey(key);
  const out = await subtle().encrypt({ name: 'AES-CBC', iv: iv as any }, k, data as any);
  return new Uint8Array(out).subarray(0, data.byteLength);
}

async function encryptedPaddingBlock(
  ciphertext: Uint8Array,
  key: CryptoKey
): Promise<Uint8Array> {
  const block = new Uint8Array(16).fill(16);
  const last = ciphertext.subarray(ciphertext.byteLength - 16);
  const out = await subtle().encrypt({ name: 'AES-CBC', iv: last as any }, key, block);
  return new Uint8Array(out).subarray(0, 16);
}

async function aesCbcDecryptRaw(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array
): Promise<Uint8Array> {
  assert(data.byteLength % 16 === 0 && data.byteLength >= 16, 'ECC payload must be blocks');
  const k = await importAesKey(key);
  const prolonged = concat(data, await encryptedPaddingBlock(data, k));
  const out = await subtle().decrypt({ name: 'AES-CBC', iv: iv as any }, k, prolonged as any);
  return new Uint8Array(out).subarray(0, data.byteLength);
}

// --- envelope ---

export interface ProtectEccSecretOptions {
  params: EccPolicyParams;
  /** SecurityPolicyUri recorded in the envelope (the token policy). */
  policyUri: string;
  /** Secret bytes (UTF-8 password, or tokenData). */
  secret: Uint8Array;
  /** Last serverNonce (channel nonce at ActivateSession time). */
  nonce: Uint8Array;
  /** Fresh sender (client) ephemeral ECDH private key + x||y public key. */
  senderPrivateKey: CryptoKey;
  senderPublicKey: Uint8Array;
  /** Receiver (server session) ephemeral x||y public key. */
  receiverPublicKey: Uint8Array;
  /** ECDSA signing key + DER certificate (may be omitted when known to receiver). */
  signingPrivateKey: CryptoKey;
  signingCertificate?: Uint8Array;
  signingTime?: Date;
}

/**
 * Build a complete EccEncryptedSecret envelope (ExtensionObject-style bytes
 * suitable for UserNameIdentityToken.password / IssuedIdentityToken.tokenData).
 */
export async function protectEccSecret(options: ProtectEccSecretOptions): Promise<Uint8Array> {
  const {
    params,
    policyUri,
    secret,
    nonce,
    senderPrivateKey,
    senderPublicKey,
    receiverPublicKey,
    signingPrivateKey,
    signingCertificate,
    signingTime,
  } = options;
  if (senderPublicKey.byteLength !== params.nonceLength) {
    throw new Error(`Invalid sender ephemeral key length for ${params.curve}`);
  }
  if (receiverPublicKey.byteLength !== params.nonceLength) {
    throw new Error(`Invalid receiver ephemeral key length for ${params.curve}`);
  }
  const receiverKey = await importEphemeralPublicKey(receiverPublicKey, params.curve);
  const ikm = await deriveSharedSecretIKM(senderPrivateKey, receiverKey, params.curve);
  const derivedLength = params.derivedEncryptionKeyLength + params.encryptingBlockSize;
  const salt = buildSecretSalt(derivedLength, senderPublicKey, receiverPublicKey);
  const { encryptingKey, initializationVector } = await deriveEccSecretKeys(ikm, salt, params);

  const payload = buildSecretPayload(nonce, secret, params.encryptingBlockSize);
  const encrypted = await aesCbcEncryptRaw(encryptingKey, initializationVector, payload);

  const keyData = concat(uaByteString(senderPublicKey), uaByteString(receiverPublicKey));
  const ticks = dateToTicks(signingTime ?? new Date());
  const body = concat(
    uaString(policyUri),
    uaByteString(signingCertificate ?? new Uint8Array(0)),
    i64le(ticks.lo, ticks.hi),
    u16le(keyData.byteLength),
    keyData,
    encrypted
  );
  const signature = new Uint8Array(
    await subtle().sign({ name: 'ECDSA', hash: params.hash }, signingPrivateKey, body as any)
  );
  if (signature.byteLength !== params.asymmetricSignatureLength) {
    throw new Error('ECDSA signature has unexpected length');
  }
  // ExtensionObject envelope: FourByte TypeId (ns=0) + mask + Int32 length.
  const header = concat(
    new Uint8Array([0x01, 0x00]),
    u16le(ECC_ENCRYPTED_SECRET_TYPE_ID),
    new Uint8Array([0x01])
  );
  return concat(header, i32le(body.byteLength + signature.byteLength), body, signature);
}

export interface ParsedEccEncryptedSecret {
  policyUri: string;
  certificate: Uint8Array;
  signingTime: Date;
  senderPublicKey: Uint8Array;
  receiverPublicKey: Uint8Array;
  encryptedPayload: Uint8Array;
  signature: Uint8Array;
}

export function parseEccEncryptedSecret(
  envelope: Uint8Array,
  params: EccPolicyParams
): ParsedEccEncryptedSecret {
  const fail = (why: string) => new Error(`EccEncryptedSecret invalid: ${why}`);
  const c = new Cursor(envelope);
  const typeTag = c.bytes(1)[0];
  if (typeTag !== 0x01) {
    throw fail('expected FourByte NodeId TypeId');
  }
  if (c.bytes(1)[0] !== 0x00 || c.u16() !== ECC_ENCRYPTED_SECRET_TYPE_ID) {
    throw fail('unexpected TypeId (not EccEncryptedSecret)');
  }
  if (c.bytes(1)[0] !== 0x01) {
    throw fail('expected ByteString body encoding');
  }
  const length = c.i32();
  if (length < 0 || c.pos + length !== envelope.byteLength) {
    throw fail('body length mismatch');
  }
  const bodyStart = c.pos;
  // policyUri
  const uriLen = c.i32();
  if (uriLen < 0) {
    throw fail('missing SecurityPolicyUri');
  }
  const policyUri = new TextDecoder().decode(c.bytes(uriLen));
  const certificate = c.byteString();
  const ticksLo = c.u32();
  const ticksHi = c.u32();
  const keyDataLength = c.u16();
  const keyDataEnd = c.pos + keyDataLength;
  const senderPublicKey = c.byteString();
  const receiverPublicKey = c.byteString();
  if (c.pos !== keyDataEnd) {
    throw fail('KeyData length mismatch');
  }
  // encrypted payload = body remainder minus the fixed-length ECDSA signature
  // (raw r||s per curve, matching this stack's OPN ECDSA convention).
  const bodyEnd = bodyStart + length;
  const remaining = bodyEnd - c.pos;
  const sigLen = params.asymmetricSignatureLength;
  if ((remaining - sigLen) % params.encryptingBlockSize !== 0 || remaining - sigLen < params.encryptingBlockSize) {
    throw fail('cannot split payload and signature');
  }
  const encryptedPayload = new Uint8Array(c.bytes(remaining - sigLen));
  const signature = new Uint8Array(c.bytes(sigLen));
  return {
    policyUri,
    certificate: new Uint8Array(certificate),
    signingTime: ticksToDate(ticksLo, ticksHi),
    senderPublicKey: new Uint8Array(senderPublicKey),
    receiverPublicKey: new Uint8Array(receiverPublicKey),
    encryptedPayload,
    signature,
  };
}

export interface UnprotectEccSecretOptions {
  params: EccPolicyParams;
  /** Receiver (server session) ephemeral ECDH private key. */
  receiverPrivateKey: CryptoKey;
  /**
   * Signing certificate to verify against when the envelope Certificate is
   * empty (known-receiver case, e.g. client app cert over SecureChannel).
   */
  trustedCertificate?: Uint8Array;
}

export interface UnprotectedEccSecret {
  secret: Uint8Array;
  nonce: Uint8Array;
  policyUri: string;
  senderPublicKey: Uint8Array;
  signingTime: Date;
}

/** Verify + decrypt an EccEncryptedSecret envelope. */
export async function unprotectEccSecret(
  envelope: Uint8Array,
  options: UnprotectEccSecretOptions
): Promise<UnprotectedEccSecret> {
  const { params, receiverPrivateKey, trustedCertificate } = options;
  const parsed = parseEccEncryptedSecret(envelope, params);
  const cert = parsed.certificate.byteLength > 0 ? parsed.certificate : trustedCertificate;
  if (!cert || cert.byteLength === 0) {
    throw new Error('EccEncryptedSecret has no signing certificate to verify');
  }
  const verifyKey = await generateEccVerifyKeyFromDER(cert, params.hash, params.curve);
  // signed bytes = everything after the envelope header + Length, excluding
  // the Signature (header = 2 TypeId + 1 mask... see protectEccSecret: the
  // fixed prefix is FourByte TypeId (4) + mask (1) + Int32 length (4)).
  const signedEnd = envelope.byteLength - parsed.signature.byteLength;
  const headerEnd = 4 + 1 + 4;
  const signed = envelope.subarray(headerEnd, signedEnd);
  const valid = await subtle().verify(
    { name: 'ECDSA', hash: params.hash },
    verifyKey,
    parsed.signature as any,
    signed as any
  );
  if (!valid) {
    throw new Error('EccEncryptedSecret signature invalid (Bad_IdentityTokenInvalid)');
  }
  const senderKey = await importEphemeralPublicKey(parsed.senderPublicKey, params.curve);
  const ikm = await deriveSharedSecretIKM(receiverPrivateKey, senderKey, params.curve);
  const derivedLength = params.derivedEncryptionKeyLength + params.encryptingBlockSize;
  const salt = buildSecretSalt(derivedLength, parsed.senderPublicKey, parsed.receiverPublicKey);
  const { encryptingKey, initializationVector } = await deriveEccSecretKeys(ikm, salt, params);
  const plain = await aesCbcDecryptRaw(encryptingKey, initializationVector, parsed.encryptedPayload);
  const { nonce, secret } = parseSecretPayload(plain);
  return {
    secret,
    nonce,
    policyUri: parsed.policyUri,
    senderPublicKey: parsed.senderPublicKey,
    signingTime: parsed.signingTime,
  };
}
