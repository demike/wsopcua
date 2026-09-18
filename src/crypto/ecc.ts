/**
 * ECC crypto codec for OPC UA 1.05.07 SecurityPolicies EccNistP256 / EccNistP384.
 *
 * Implements Part 6 §6.8.1 Secure Channel Handshake primitives using WebCrypto only:
 * - Ephemeral ECDH P-256 / P-384 key pairs (ClientNonce / ServerNonce = x||y)
 * - ECDH shared secret (IKM = x-coordinate, zero-padded big-endian)
 * - HKDF-style Extract + Expand with HMAC-SHA256 / HMAC-SHA384 (RFC 5869 as repeated in spec)
 * - ECDSA-SHA256 / ECDSA-SHA384 sign / verify (raw r||s, 64 / 96 bytes)
 *
 * Curves intentionally limited to NIST P-256 / P-384: these are the only ECC
 * curves from the 1.05 policies that WebCrypto supports. Brainpool and
 * Curve25519/Curve448 throw UNSUPPORTED (see assertEccCurveSupported).
 */

export type EccCurve = 'P-256' | 'P-384';
export type EccHash = 'SHA-256' | 'SHA-384';

export interface EccPolicyParams {
  curve: EccCurve;
  hash: EccHash;
  /** coordinate length in bytes: 32 for P-256, 48 for P-384 */
  coordLength: number;
  /** ephemeral public key (nonce) length x||y */
  nonceLength: number;
  /** ECDSA asymmetric signature length r||s (64 P-256, 96 P-384) */
  asymmetricSignatureLength: number;
  /** symmetric HMAC signature length (32 SHA-256, 48 SHA-384) */
  signatureLength: number;
  symmetricEncryptionAlgorithm: 'AES-128-CBC' | 'AES-256-CBC';
  derivedSignatureKeyLength: number;
  derivedEncryptionKeyLength: number;
  encryptingBlockSize: number;
}

export const EccNistP256_Params: EccPolicyParams = {
  curve: 'P-256',
  hash: 'SHA-256',
  coordLength: 32,
  nonceLength: 64,
  asymmetricSignatureLength: 64,
  signatureLength: 32,
  symmetricEncryptionAlgorithm: 'AES-128-CBC',
  derivedSignatureKeyLength: 32,
  derivedEncryptionKeyLength: 16,
  encryptingBlockSize: 16,
};

export const EccNistP384_Params: EccPolicyParams = {
  curve: 'P-384',
  hash: 'SHA-384',
  coordLength: 48,
  nonceLength: 96,
  asymmetricSignatureLength: 96,
  signatureLength: 48,
  symmetricEncryptionAlgorithm: 'AES-256-CBC',
  derivedSignatureKeyLength: 48,
  derivedEncryptionKeyLength: 32,
  encryptingBlockSize: 16,
};

export function paramsForCurve(curve: EccCurve): EccPolicyParams {
  return curve === 'P-256' ? EccNistP256_Params : EccNistP384_Params;
}

/**
 * Only NIST curves are supported via WebCrypto. Everything else from Part 7
 * (BrainpoolP256r1/P384r1, Curve25519/Curve448) throws here so callers fail fast.
 */
export function assertEccCurveSupported(curve: string): asserts curve is EccCurve {
  if (curve !== 'P-256' && curve !== 'P-384') {
    throw new Error(
      `Unsupported ECC curve "${curve}": wsopcua implements EccNistP256 (P-256) and EccNistP384 (P-384) only; ` +
        `Brainpool / Curve25519 / Curve448 are not available in WebCrypto`
    );
  }
}

function subtle(): SubtleCrypto {
  const c: SubtleCrypto | undefined =
    (globalThis as any)?.crypto?.subtle ?? (typeof crypto !== 'undefined' ? crypto.subtle : undefined);
  if (!c) {
    throw new Error('WebCrypto SubtleCrypto is not available');
  }
  return c;
}

/** Generate a fresh ephemeral ECDH key pair (one per OpenSecureChannel). */
export async function generateEphemeralKeyPair(curve: EccCurve): Promise<CryptoKeyPair> {
  assertEccCurveSupported(curve);
  return subtle().generateKey({ name: 'ECDH', namedCurve: curve }, true, ['deriveBits']);
}

/**
 * Export ECDH public key as OPC UA nonce: x||y zero-padded big-endian.
 * Uses JWK export (x/y base64url) to avoid DER parsing.
 */
export async function exportEphemeralPublicKey(
  publicKey: CryptoKey,
  curve: EccCurve
): Promise<Uint8Array> {
  const params = paramsForCurve(curve);
  const jwk = (await subtle().exportKey('jwk', publicKey)) as JsonWebKey & {
    x?: string;
    y?: string;
  };
  if (!jwk.x || !jwk.y) {
    throw new Error('ECDH public key export missing x/y coordinates');
  }
  const x = base64UrlToBytes(jwk.x, params.coordLength);
  const y = base64UrlToBytes(jwk.y, params.coordLength);
  const out = new Uint8Array(params.nonceLength);
  out.set(x, 0);
  out.set(y, params.coordLength);
  return out;
}

/** Import a peer nonce (x||y) as an ECDH public key for deriveBits. */
export async function importEphemeralPublicKey(
  nonce: Uint8Array,
  curve: EccCurve
): Promise<CryptoKey> {
  assertEccCurveSupported(curve);
  const params = paramsForCurve(curve);
  if (!(nonce instanceof Uint8Array) || nonce.byteLength !== params.nonceLength) {
    throw new Error(
      `Invalid ECC nonce length: expected ${params.nonceLength} for ${curve}, got ${
        (nonce)?.byteLength ?? 'n/a'
      }`
    );
  }
  const x = nonce.subarray(0, params.coordLength);
  const y = nonce.subarray(params.coordLength);
  const jwk: JsonWebKey = {
    kty: 'EC',
    crv: curve,
    x: bytesToBase64Url(x),
    y: bytesToBase64Url(y),
    ext: true,
  };
  return subtle().importKey('jwk', jwk, { name: 'ECDH', namedCurve: curve }, true, []);
}

/**
 * ECDH shared secret (IKM). WebCrypto deriveBits for ECDH returns exactly the
 * x-coordinate zero-padded big-endian, which is what Part 6 §6.8.1 requires.
 */
export async function deriveSharedSecretIKM(
  privateKey: CryptoKey,
  peerPublicKey: CryptoKey,
  curve: EccCurve
): Promise<Uint8Array> {
  assertEccCurveSupported(curve);
  const bits = curve === 'P-256' ? 256 : 384;
  const raw = await subtle().deriveBits({ name: 'ECDH', public: peerPublicKey }, privateKey, bits);
  return new Uint8Array(raw);
}

// --- HKDF per Part 6 §6.8.1 (RFC 5869 restated in spec) ---

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.byteLength, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.byteLength;
  }
  return out;
}

function encodeLengthLE16(n: number): Uint8Array {
  const out = new Uint8Array(2);
  out[0] = n & 0xff;
  out[1] = (n >> 8) & 0xff;
  return out;
}

/** ServerSalt = L | UTF8("opcua-server") | ServerNonce | ClientNonce */
export function buildServerSalt(
  derivedMaterialLength: number,
  serverNonce: Uint8Array,
  clientNonce: Uint8Array
): Uint8Array {
  return concatBytes(
    encodeLengthLE16(derivedMaterialLength),
    new TextEncoder().encode('opcua-server'),
    serverNonce,
    clientNonce
  );
}

/** ClientSalt = L | UTF8("opcua-client") | ClientNonce | ServerNonce */
export function buildClientSalt(
  derivedMaterialLength: number,
  clientNonce: Uint8Array,
  serverNonce: Uint8Array
): Uint8Array {
  return concatBytes(
    encodeLengthLE16(derivedMaterialLength),
    new TextEncoder().encode('opcua-client'),
    clientNonce,
    serverNonce
  );
}

async function hmac(hash: EccHash, key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const k = await subtle().importKey('raw', key as any, { name: 'HMAC', hash }, false, ['sign']);
  const sig = await subtle().sign('HMAC', k, data as any);
  return new Uint8Array(sig);
}

/** Step 2: PRK = HMAC-Hash(Salt, IKM) */
export async function eccExtract(salt: Uint8Array, ikm: Uint8Array, hash: EccHash): Promise<Uint8Array> {
  return hmac(hash, salt, ikm);
}

/** Step 3: OKM = T(1)|T(2)|... truncated to L, Info = Salt */
export async function eccExpand(
  prk: Uint8Array,
  info: Uint8Array,
  length: number,
  hash: EccHash
): Promise<Uint8Array> {
  const hashLen = hash === 'SHA-256' ? 32 : 48;
  const n = Math.ceil(length / hashLen);
  if (n > 255) {
    throw new Error('HKDF expand length too large');
  }
  let t: Uint8Array = new Uint8Array(0);
  const parts: Uint8Array[] = [];
  for (let i = 1; i <= n; i++) {
    t = await hmac(hash, prk, concatBytes(t, info, new Uint8Array([i])));
    parts.push(t);
  }
  return concatBytes(...parts).subarray(0, length);
}

export interface EccDerivedKeyMaterial {
  signingKey: Uint8Array;
  encryptingKey: Uint8Array;
  initializationVector: Uint8Array;
}

/**
 * Derive one direction (client OR server) of key material.
 * When Sign-only is used, pass encryptingKeyLength=0 and ivLength=0 per §6.8.1.
 */
export async function deriveEccKeyMaterial(
  salt: Uint8Array,
  ikm: Uint8Array,
  derivedMaterialLength: number,
  signingKeyLength: number,
  encryptingKeyLength: number,
  ivLength: number,
  hash: EccHash
): Promise<EccDerivedKeyMaterial> {
  if (signingKeyLength + encryptingKeyLength + ivLength !== derivedMaterialLength) {
    throw new Error('ECC derived material length mismatch');
  }
  const prk = await eccExtract(salt, ikm, hash);
  const okm = await eccExpand(prk, salt, derivedMaterialLength, hash);
  return {
    signingKey: okm.subarray(0, signingKeyLength),
    encryptingKey: okm.subarray(signingKeyLength, signingKeyLength + encryptingKeyLength),
    initializationVector: okm.subarray(signingKeyLength + encryptingKeyLength),
  };
}

export interface EccChannelKeys {
  clientKeys: EccDerivedKeyMaterial;
  serverKeys: EccDerivedKeyMaterial;
}

/** Full channel derivation: client keys from ClientSalt, server keys from ServerSalt. */
export async function computeEccChannelKeys(
  clientNonce: Uint8Array,
  serverNonce: Uint8Array,
  ikm: Uint8Array,
  params: EccPolicyParams
): Promise<EccChannelKeys> {
  const l = params.derivedSignatureKeyLength + params.derivedEncryptionKeyLength + params.encryptingBlockSize;
  const clientSalt = buildClientSalt(l, clientNonce, serverNonce);
  const serverSalt = buildServerSalt(l, serverNonce, clientNonce);
  const [clientKeys, serverKeys] = await Promise.all([
    deriveEccKeyMaterial(
      clientSalt,
      ikm,
      l,
      params.derivedSignatureKeyLength,
      params.derivedEncryptionKeyLength,
      params.encryptingBlockSize,
      params.hash
    ),
    deriveEccKeyMaterial(
      serverSalt,
      ikm,
      l,
      params.derivedSignatureKeyLength,
      params.derivedEncryptionKeyLength,
      params.encryptingBlockSize,
      params.hash
    ),
  ]);
  return { clientKeys, serverKeys };
}

/** Renewal linking (§6.8.1): new IKM = old IKM XOR fresh IKM. */
export function xorIkmsForRenewal(oldIkm: Uint8Array, freshIkm: Uint8Array): Uint8Array {
  if (oldIkm.byteLength !== freshIkm.byteLength) {
    throw new Error('IKM length mismatch for SecureChannel renewal');
  }
  const out = new Uint8Array(oldIkm.byteLength);
  for (let i = 0; i < out.byteLength; i++) {
    out[i] = oldIkm[i] ^ freshIkm[i];
  }
  return out;
}

// --- ECDSA message signatures (OpenSecureChannel / CreateSession) ---

export async function ecdsaSign(
  data: Uint8Array | ArrayBuffer | ArrayBufferView,
  privateKey: CryptoKey,
  hash: EccHash
): Promise<ArrayBuffer> {
  const input = ArrayBuffer.isView(data) ? (data as ArrayBufferView) : new Uint8Array(data);
  return subtle().sign({ name: 'ECDSA', hash }, privateKey, input as any);
}

export async function ecdsaVerify(
  data: Uint8Array | ArrayBuffer | ArrayBufferView,
  signature: Uint8Array | ArrayBuffer | ArrayBufferView,
  publicKey: CryptoKey,
  hash: EccHash
): Promise<boolean> {
  const input = ArrayBuffer.isView(data) ? data : new Uint8Array(data);
  const sig = ArrayBuffer.isView(signature) ? signature : new Uint8Array(signature);
  try {
    return await subtle().verify({ name: 'ECDSA', hash }, publicKey, sig as any, input as any);
  } catch {
    return false;
  }
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    s += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(s);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(b64url: string, expectedLength: number): Uint8Array {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4;
  if (pad) {
    b64 += '='.repeat(4 - pad);
  }
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i);
  }
  if (out.byteLength > expectedLength) {
    throw new Error('JWK coordinate longer than curve size');
  }
  if (out.byteLength === expectedLength) {
    return out;
  }
  const padded = new Uint8Array(expectedLength);
  padded.set(out, expectedLength - out.byteLength);
  return padded;
}
