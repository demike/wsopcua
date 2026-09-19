import { exploreCertificateInfo } from './explore_certificate';
import {
  EccNistP256_Params,
  EccNistP384_Params,
  EccPolicyParams,
  deriveSharedSecretIKM,
  eccExtract,
  exportEphemeralPublicKey,
  generateEphemeralKeyPair,
  importEphemeralPublicKey,
} from './ecc';
import {
  buildSecretPayload,
  buildSecretSalt,
  deriveEccSecretKeys,
  parseEccEncryptedSecret,
  parseSecretPayload,
  protectEccSecret,
  secretPaddingSize,
  unprotectEccSecret,
} from './ecc_secret';
import { KAT_P256, KAT_P384, EccSecretKat } from './ecc_secret_kat';

function hex(h: string): Uint8Array {
  return Uint8Array.fromHex(h);
}

function b64url(bytes: Uint8Array): string {
  return bytes.toBase64({ alphabet: 'base64url', omitPadding: true });
}

function splitPub(pub: Uint8Array): { x: Uint8Array; y: Uint8Array } {
  return { x: pub.subarray(0, pub.byteLength / 2), y: pub.subarray(pub.byteLength / 2) };
}

/** Import a KAT EC private scalar (with known x/y) for ECDH or ECDSA use. */
async function importKatPrivate(
  curve: 'P-256' | 'P-384',
  pubHex: string,
  scalarHex: string,
  usage: 'ECDH' | 'ECDSA'
): Promise<CryptoKey> {
  const pub = hex(pubHex);
  const { x, y } = splitPub(pub);
  const coordLen = curve === 'P-256' ? 32 : 48;
  const d = hex(scalarHex);
  const dp = new Uint8Array(coordLen);
  dp.set(d, coordLen - d.byteLength);
  const jwk: JsonWebKey = {
    kty: 'EC',
    crv: curve,
    x: b64url(x),
    y: b64url(y),
    d: b64url(dp),
    ext: true,
  };
  const name = usage === 'ECDH' ? 'ECDH' : 'ECDSA';
  const alg: EcdhKeyDeriveParams | EcKeyImportParams =
    usage === 'ECDH' ? { name, namedCurve: curve } : { name, namedCurve: curve };
  return crypto.subtle.importKey(
    'jwk',
    jwk,
    alg,
    true,
    usage === 'ECDH' ? ['deriveBits'] : ['sign']
  );
}

const KATS: EccSecretKat[] = [KAT_P256, KAT_P384];

function paramsForCurve(curve: string): EccPolicyParams {
  return curve === 'P-256' ? EccNistP256_Params : EccNistP384_Params;
}

describe.each(KATS)('EccEncryptedSecret Python cross-check ($curve)', (kat) => {
  const curve = kat.curve as 'P-256' | 'P-384';
  const params = paramsForCurve(curve);

  it('agrees on the ECDH shared secret (IKM)', async () => {
    const senderPriv = await importKatPrivate(curve, kat.senderPublic, kat.senderPrivate, 'ECDH');
    const receiverPub = await importEphemeralPublicKey(hex(kat.receiverPublic), curve);
    const ikm = await deriveSharedSecretIKM(senderPriv, receiverPub, curve);
    expect(ikm.toHex()).toBe(kat.ikm);
  });

  it('matches SecretSalt + HKDF key schedule', async () => {
    const derivedLength = params.derivedEncryptionKeyLength + params.encryptingBlockSize;
    const salt = buildSecretSalt(derivedLength, hex(kat.senderPublic), hex(kat.receiverPublic));
    expect(salt.toHex()).toBe(kat.secretSalt);
    const prk = await eccExtract(salt, hex(kat.ikm), params.hash);
    expect(prk.toHex()).toBe(kat.prk);
    const keys = await deriveEccSecretKeys(hex(kat.ikm), salt, params);
    expect(keys.encryptingKey.toHex()).toBe(kat.encryptingKey);
    expect(keys.initializationVector.toHex()).toBe(kat.iv);
  });

  it('encodes the padded payload identically', () => {
    const payload = buildSecretPayload(hex(kat.nonce), hex(kat.secret), params.encryptingBlockSize);
    expect(payload.toHex()).toBe(kat.payloadPlain);
  });

  it('reproduces the exact signing input (body)', async () => {
    const senderPriv = await importKatPrivate(curve, kat.senderPublic, kat.senderPrivate, 'ECDH');
    const signingPriv = await importKatPrivate(curve, kat.signingPublic, kat.signingPrivate, 'ECDSA');
    const envelope = await protectEccSecret({
      params,
      policyUri: kat.policyUri,
      secret: hex(kat.secret),
      nonce: hex(kat.nonce),
      senderPrivateKey: senderPriv,
      senderPublicKey: hex(kat.senderPublic),
      receiverPublicKey: hex(kat.receiverPublic),
      signingPrivateKey: signingPriv,
      signingCertificate: hex(kat.signingCertDer),
      signingTime: new Date(kat.signingTimeIso),
    });
    // deterministic prefix: header (4 TypeId + 1 mask + 4 length) + body;
    // only the ECDSA signature differs
    const body = envelope.subarray(4 + 1 + 4, envelope.byteLength - params.asymmetricSignatureLength);
    expect(body.toHex()).toBe(kat.toSign);
    expect(envelope.byteLength).toBe(hex(kat.envelopeRaw).byteLength);
  });

  it("verifies the foreign ECDSA signature and parses the foreign X.509 cert", async () => {
    const spkiKey = await crypto.subtle.importKey(
      'spki',
      hex(kat.signingSpki) as any,
      { name: 'ECDSA', namedCurve: curve },
      true,
      ['verify']
    );
    const ok = await crypto.subtle.verify(
      { name: 'ECDSA', hash: params.hash },
      spkiKey,
      hex(kat.signatureRaw) as any,
      hex(kat.toSign) as any
    );
    expect(ok).toBe(true);
    const info = await exploreCertificateInfo(hex(kat.signingCertDer));
    expect(info.publicKeyLength).toBe(curve === 'P-256' ? 64 : 96);
  });

  it('unprotects the foreign envelope end-to-end', async () => {
    const receiverPriv = await importKatPrivate(
      curve,
      kat.receiverPublic,
      kat.receiverPrivate,
      'ECDH'
    );
    const out = await unprotectEccSecret(hex(kat.envelopeRaw), {
      params,
      receiverPrivateKey: receiverPriv,
    });
    expect(out.secret.toHex()).toBe(kat.secret);
    expect(out.nonce.toHex()).toBe(kat.nonce);
    expect(out.policyUri).toBe(kat.policyUri);
    expect(out.senderPublicKey.toHex()).toBe(kat.senderPublic);
    expect(out.signingTime.toISOString()).toBe(kat.signingTimeIso);
  });
});

describe.each(KATS)('EccEncryptedSecret round-trip ($curve)', (kat) => {
  const curve = kat.curve as 'P-256' | 'P-384';
  const params = paramsForCurve(curve);

  async function protectRandom(
    secret: Uint8Array,
    nonce: Uint8Array,
    signingCertificate?: Uint8Array
  ) {
    const sender = await generateEphemeralKeyPair(curve);
    const receiver = await generateEphemeralKeyPair(curve);
    // KAT signing identity keeps envelope self-consistent (cert matches key).
    const signingPriv = await importKatPrivate(curve, kat.signingPublic, kat.signingPrivate, 'ECDSA');
    const senderPub = await exportEphemeralPublicKey(sender.publicKey, curve);
    const receiverPub = await exportEphemeralPublicKey(receiver.publicKey, curve);
    const envelope = await protectEccSecret({
      params,
      policyUri: kat.policyUri,
      secret,
      nonce,
      senderPrivateKey: sender.privateKey,
      senderPublicKey: senderPub,
      receiverPublicKey: receiverPub,
      signingPrivateKey: signingPriv,
      signingCertificate: signingCertificate ?? hex(kat.signingCertDer),
    });
    return { envelope, receiverPrivateKey: receiver.privateKey, senderPub, receiverPub };
  }

  it('round-trips arbitrary secrets', async () => {
    const secret = new TextEncoder().encode('s3cr3t-pässwörd-🔑');
    const nonce = crypto.getRandomValues(new Uint8Array(32));
    const { envelope, receiverPrivateKey } = await protectRandom(secret, nonce);
    const out = await unprotectEccSecret(envelope, { params, receiverPrivateKey });
    expect(out.secret).toEqual(secret);
    expect(out.nonce).toEqual(nonce);
  });

  it('round-trips padding edge cases (zero and extended padding)', async () => {
    // 4+32+4+s+2 ≡ 0 (mod 16) with s >= 16 -> zero padding branch
    expect(secretPaddingSize(32, 22, 16)).toBe(0);
    // tiny secret -> padding extended by a full block: 43 % 16 = 11 -> 5, then 5+1 < 16 -> 21
    expect(secretPaddingSize(32, 1, 16)).toBe(21);
    for (const size of [0, 1, 6, 22, 64, 100]) {
      const secret = crypto.getRandomValues(new Uint8Array(size));
      const nonce = crypto.getRandomValues(new Uint8Array(32));
      const payload = buildSecretPayload(nonce, secret, 16);
      expect(payload.byteLength % 16).toBe(0);
      expect(parseSecretPayload(payload).secret).toEqual(secret);
      const { envelope, receiverPrivateKey } = await protectRandom(secret, nonce);
      const out = await unprotectEccSecret(envelope, { params, receiverPrivateKey });
      expect(out.secret).toEqual(secret);
    }
  });

  it('rejects tampered payloads and signatures', async () => {
    const { envelope, receiverPrivateKey } = await protectRandom(
      new TextEncoder().encode('password'),
      crypto.getRandomValues(new Uint8Array(32))
    );
    const parsed = parseEccEncryptedSecret(envelope, params);
    const payloadOff = envelope.byteLength - parsed.signature.byteLength - parsed.encryptedPayload.byteLength;
    for (const off of [payloadOff, envelope.byteLength - 1]) {
      const bad = new Uint8Array(envelope);
      bad[off] ^= 0xff;
      await expect(unprotectEccSecret(bad, { params, receiverPrivateKey })).rejects.toThrow();
    }
  });

  it('rejects decryption with the wrong receiver key', async () => {
    const { envelope } = await protectRandom(
      new TextEncoder().encode('password'),
      crypto.getRandomValues(new Uint8Array(32))
    );
    const stranger = await generateEphemeralKeyPair(curve);
    await expect(
      unprotectEccSecret(envelope, { params, receiverPrivateKey: stranger.privateKey })
    ).rejects.toThrow();
  });

  it('rejects the wrong receiver key and enforces certificate verification', async () => {
    const secret = new TextEncoder().encode('password');
    const nonce = crypto.getRandomValues(new Uint8Array(32));
    // envelope WITHOUT embedded cert: verification needs an explicit trusted cert
    const { envelope, receiverPrivateKey } = await protectRandom(
      secret,
      nonce,
      new Uint8Array(0)
    );
    const stranger = await generateEphemeralKeyPair(curve);
    await expect(
      unprotectEccSecret(envelope, { params, receiverPrivateKey: stranger.privateKey })
    ).rejects.toThrow(/no signing certificate/);
    await expect(
      unprotectEccSecret(envelope, { params, receiverPrivateKey })
    ).rejects.toThrow(/no signing certificate/);
    // wrong trusted cert (valid ECC cert, different key) -> signature invalid
    const { eccFixtureCertDer } = await import(
      '../secure-channel/test_helpers/mock/mock_ecc_certs'
    );
    await expect(
      unprotectEccSecret(envelope, {
        params,
        receiverPrivateKey,
        trustedCertificate: eccFixtureCertDer(curve),
      })
    ).rejects.toThrow(/signature invalid/);
    // matching trusted cert -> success
    const out = await unprotectEccSecret(envelope, {
      params,
      receiverPrivateKey,
      trustedCertificate: hex(kat.signingCertDer),
    });
    expect(out.secret).toEqual(secret);
    expect(out.nonce).toEqual(nonce);
  });

  it('rejects malformed envelopes', () => {
    const good = hex(kat.envelopeRaw);
    expect(() => parseEccEncryptedSecret(good.subarray(0, good.byteLength - 10), params)).toThrow();
    const badType = new Uint8Array(good);
    badType[2] = 0xff;
    expect(() => parseEccEncryptedSecret(badType, params)).toThrow(/TypeId/);
  });
});
