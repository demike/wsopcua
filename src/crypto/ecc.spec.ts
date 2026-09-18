import {
  EccNistP256_Params,
  EccNistP384_Params,
  assertEccCurveSupported,
  buildClientSalt,
  buildServerSalt,
  computeEccChannelKeys,
  deriveEccKeyMaterial,
  deriveSharedSecretIKM,
  eccExpand,
  eccExtract,
  ecdsaSign,
  ecdsaVerify,
  exportEphemeralPublicKey,
  generateEphemeralKeyPair,
  importEphemeralPublicKey,
  xorIkmsForRenewal,
} from './ecc';
import {
  decryptBufferWithDerivedKeys,
  encryptBufferWithDerivedKeys,
  makeMessageChunkSignatureWithDerivedKeys,
  verifyChunkSignatureWithDerivedKeys,
  DerivedKeys,
} from './derived_keys';

function toDerivedKeys(
  m: { signingKey: Uint8Array; encryptingKey: Uint8Array; initializationVector: Uint8Array },
  hash: 'SHA-256' | 'SHA-384',
  signatureLength: number,
  algorithm: string
): DerivedKeys {
  return {
    signatureLength,
    signingKeyLength: m.signingKey.byteLength,
    encryptingKeyLength: m.encryptingKey.byteLength,
    encryptingBlockSize: m.initializationVector.byteLength,
    algorithm,
    sha1or256: hash,
    signingKey: m.signingKey.slice().buffer,
    encryptingKey: m.encryptingKey.slice().buffer,
    initializationVector: m.initializationVector.slice().buffer,
  };
}

describe('ECC codec (OPC UA 1.05.07 Part 6 §6.8.1)', () => {
  it('exposes normative P-256 / P-384 parameters', () => {
    expect(EccNistP256_Params).toMatchObject({
      curve: 'P-256',
      hash: 'SHA-256',
      nonceLength: 64,
      asymmetricSignatureLength: 64,
      signatureLength: 32,
      symmetricEncryptionAlgorithm: 'AES-128-CBC',
      derivedSignatureKeyLength: 32,
      derivedEncryptionKeyLength: 16,
      encryptingBlockSize: 16,
    });
    expect(EccNistP384_Params).toMatchObject({
      curve: 'P-384',
      hash: 'SHA-384',
      nonceLength: 96,
      asymmetricSignatureLength: 96,
      signatureLength: 48,
      symmetricEncryptionAlgorithm: 'AES-256-CBC',
      derivedSignatureKeyLength: 48,
      derivedEncryptionKeyLength: 32,
      encryptingBlockSize: 16,
    });
  });

  it('rejects non-WebCrypto curves (Brainpool / Curve25519 / Curve448)', () => {
    for (const curve of ['brainpoolP256r1', 'brainpoolP384r1', 'Curve25519', 'Curve448', 'P-521']) {
      expect(() => assertEccCurveSupported(curve)).toThrow(/Unsupported ECC curve/);
    }
    expect(() => assertEccCurveSupported('P-256')).not.toThrow();
    expect(() => assertEccCurveSupported('P-384')).not.toThrow();
  });

  it.each(['P-256', 'P-384'] as const)(
    'ephemeral export/import round-trips for %s with normative nonce length',
    async (curve) => {
      const expected = curve === 'P-256' ? 64 : 96;
      const kp = await generateEphemeralKeyPair(curve);
      const nonce = await exportEphemeralPublicKey(kp.publicKey, curve);
      expect(nonce).toBeInstanceOf(Uint8Array);
      expect(nonce.byteLength).toBe(expected);
      const imported = await importEphemeralPublicKey(nonce, curve);
      expect(imported).toBeInstanceOf(CryptoKey);
      // peer can derive with the imported key
      const peer = await generateEphemeralKeyPair(curve);
      const ikm = await deriveSharedSecretIKM(peer.privateKey, imported, curve);
      expect(ikm.byteLength).toBe(curve === 'P-256' ? 32 : 48);
    }
  );

  it('rejects malformed nonces', async () => {
    await expect(importEphemeralPublicKey(new Uint8Array(10), 'P-256')).rejects.toThrow(
      /Invalid ECC nonce length/
    );
    await expect(importEphemeralPublicKey(new Uint8Array(64), 'P-384')).rejects.toThrow(
      /Invalid ECC nonce length/
    );
  });

  it.each(['P-256', 'P-384'] as const)('ECDH agrees on both sides for %s', async (curve) => {
    const a = await generateEphemeralKeyPair(curve);
    const b = await generateEphemeralKeyPair(curve);
    const aPub = await exportEphemeralPublicKey(a.publicKey, curve);
    const bPub = await exportEphemeralPublicKey(b.publicKey, curve);
    const aImportedB = await importEphemeralPublicKey(bPub, curve);
    const bImportedA = await importEphemeralPublicKey(aPub, curve);
    const ikmA = await deriveSharedSecretIKM(a.privateKey, aImportedB, curve);
    const ikmB = await deriveSharedSecretIKM(b.privateKey, bImportedA, curve);
    expect(ikmA).toEqual(ikmB);
  });

  it('HKDF extract+expand matches RFC 5869 Test Case 1 (SHA-256)', async () => {
    // RFC 5869 A.1: IKM = 22 x 0x0b, salt = 000102..0c, info = f0..f9, L = 42
    const ikm = new Uint8Array(22).fill(0x0b);
    const salt = Uint8Array.fromHex('000102030405060708090a0b0c');
    const info = Uint8Array.fromHex('f0f1f2f3f4f5f6f7f8f9');
    const prk = await eccExtract(salt, ikm, 'SHA-256');
    expect(prk.toHex()).toBe('077709362c2e32df0ddc3f0dc47bba6390b6c73bb50f9c3122ec844ad7c2b3e5');
    const okm = await eccExpand(prk, info, 42, 'SHA-256');
    expect(okm.toHex()).toBe(
      '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865'
    );
  });

  it('derives deterministic, direction-separated channel keys', async () => {
    const client = await generateEphemeralKeyPair('P-256');
    const server = await generateEphemeralKeyPair('P-256');
    const clientNonce = await exportEphemeralPublicKey(client.publicKey, 'P-256');
    const serverNonce = await exportEphemeralPublicKey(server.publicKey, 'P-256');
    const serverPub = await importEphemeralPublicKey(serverNonce, 'P-256');
    const ikm = await deriveSharedSecretIKM(client.privateKey, serverPub, 'P-256');

    const keys1 = await computeEccChannelKeys(clientNonce, serverNonce, ikm, EccNistP256_Params);
    const keys2 = await computeEccChannelKeys(clientNonce, serverNonce, ikm, EccNistP256_Params);
    expect(keys1.clientKeys.signingKey).toEqual(keys2.clientKeys.signingKey);
    expect(keys1.serverKeys.encryptingKey).toEqual(keys2.serverKeys.encryptingKey);
    // client and server directions differ
    expect(keys1.clientKeys.signingKey).not.toEqual(keys1.serverKeys.signingKey);
    expect(keys1.clientKeys.signingKey.byteLength).toBe(32);
    expect(keys1.clientKeys.encryptingKey.byteLength).toBe(16);
    expect(keys1.clientKeys.initializationVector.byteLength).toBe(16);
  });

  it('salt construction binds L, label and both nonces (Part 6 §6.8.1 Step 1)', async () => {
    const clientNonce = new Uint8Array(64).fill(1);
    const serverNonce = new Uint8Array(64).fill(2);
    const clientSalt = buildClientSalt(64, clientNonce, serverNonce);
    const serverSalt = buildServerSalt(64, serverNonce, clientNonce);
    // L = 64 LE16
    expect(clientSalt[0]).toBe(64);
    expect(clientSalt[1]).toBe(0);
    expect(new TextDecoder().decode(clientSalt.subarray(2, 14))).toBe('opcua-client');
    expect(new TextDecoder().decode(serverSalt.subarray(2, 14))).toBe('opcua-server');
    expect(clientSalt.subarray(clientSalt.byteLength - 128)).toEqual(
      new Uint8Array([...clientNonce, ...serverNonce])
    );
    expect(serverSalt.subarray(serverSalt.byteLength - 128)).toEqual(
      new Uint8Array([...serverNonce, ...clientNonce])
    );
  });

  it('ECDSA P-256 and P-384 sign/verify round-trip with normative lengths', async () => {
    for (const [curve, hash, sigLen] of [
      ['P-256', 'SHA-256', EccNistP256_Params.asymmetricSignatureLength],
      ['P-384', 'SHA-384', EccNistP384_Params.asymmetricSignatureLength],
    ] as const) {
      const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: curve }, true, [
        'sign',
        'verify',
      ]);
      const data = new TextEncoder().encode(`opcua-ecc-${curve}`);
      const sig = await ecdsaSign(data, kp.privateKey, hash);
      expect(sig.byteLength).toBe(sigLen);
      expect(await ecdsaVerify(data, new Uint8Array(sig), kp.publicKey, hash)).toBe(true);
      const tampered = new Uint8Array([...data]);
      tampered[0] ^= 0xff;
      expect(await ecdsaVerify(tampered, new Uint8Array(sig), kp.publicKey, hash)).toBe(false);
    }
  });

  it('renewal XOR links old and fresh IKMs', () => {
    const oldIkm = Uint8Array.from([1, 2, 3, 4]);
    const fresh = Uint8Array.from([0xff, 0x00, 0xf0, 0x0f]);
    expect(xorIkmsForRenewal(oldIkm, fresh)).toEqual(Uint8Array.from([0xfe, 0x02, 0xf3, 0x0b]));
    expect(() => xorIkmsForRenewal(new Uint8Array(4), new Uint8Array(8))).toThrow(
      /IKM length mismatch/
    );
  });

  it.each(['P-256', 'P-384'] as const)(
    'derived ECC keys drive AES-CBC + HMAC message protection for %s',
    async (curve) => {
      const params = curve === 'P-256' ? EccNistP256_Params : EccNistP384_Params;
      const client = await generateEphemeralKeyPair(curve);
      const server = await generateEphemeralKeyPair(curve);
      const clientNonce = await exportEphemeralPublicKey(client.publicKey, curve);
      const serverNonce = await exportEphemeralPublicKey(server.publicKey, curve);
      const ikm = await deriveSharedSecretIKM(
        client.privateKey,
        await importEphemeralPublicKey(serverNonce, curve),
        curve
      );
      const { clientKeys } = await computeEccChannelKeys(clientNonce, serverNonce, ikm, params);
      const derived = toDerivedKeys(
        clientKeys,
        params.hash,
        params.signatureLength,
        params.symmetricEncryptionAlgorithm
      );

      // HMAC sign/verify
      const msg = new TextEncoder().encode('ecc protected message');
      const sig = await makeMessageChunkSignatureWithDerivedKeys(msg, derived);
      expect(sig.byteLength).toBe(params.signatureLength);
      const chunk = new Uint8Array([...msg, ...new Uint8Array(sig)]);
      expect(await verifyChunkSignatureWithDerivedKeys(chunk, derived)).toBe(true);

      // AES-CBC encrypt/decrypt round-trip (16-byte aligned payload incl. padding logic)
      const plain = new Uint8Array(32).map((_, i) => i);
      const encrypted = await encryptBufferWithDerivedKeys(plain, derived);
      expect(encrypted.byteLength).toBe(plain.byteLength);
      const decrypted = await decryptBufferWithDerivedKeys(encrypted, derived);
      expect(decrypted.subarray(0, plain.byteLength)).toEqual(plain);
    }
  );

  it('deriveEccKeyMaterial validates lengths (Sign-only uses zero enc/iv)', async () => {
    const salt = new Uint8Array(32).fill(7);
    const ikm = new Uint8Array(32).fill(9);
    await expect(
      deriveEccKeyMaterial(salt, ikm, 10, 32, 16, 16, 'SHA-256')
    ).rejects.toThrow(/length mismatch/);
    // Sign-only: L = signingKeyLength
    const signOnly = await deriveEccKeyMaterial(salt, ikm, 32, 32, 0, 0, 'SHA-256');
    expect(signOnly.signingKey.byteLength).toBe(32);
    expect(signOnly.encryptingKey.byteLength).toBe(0);
  });
});
