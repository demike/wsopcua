import { exploreCertificateInfo } from '../crypto/explore_certificate';
import {
  computeEccChannelKeys,
  deriveSharedSecretIKM,
  exportEphemeralPublicKey,
  generateEphemeralKeyPair,
  importEphemeralPublicKey,
} from '../crypto/ecc';
import {
  decryptBufferWithDerivedKeys,
  encryptBufferWithDerivedKeys,
  verifyChunkSignatureWithDerivedKeys,
} from '../crypto/derived_keys';
import {
  SecurityPolicy,
  coerceSecurityPolicy,
  computeDerivedKeys,
  computeEccDerivedKeys,
  fromURI,
  getCryptoFactory,
} from './security_policy';
import {
  EccFixtureCurve,
  eccFixtureCertDer,
  eccFixtureKeyDer,
  eccFixturePrivateKey,
} from './test_helpers/mock/mock_ecc_certs';

describe('SecurityPolicy ECC (1.05.07 EccNistP256 / EccNistP384)', () => {
  it('resolves URIs, names and coercion', () => {
    expect(fromURI('http://opcfoundation.org/UA/SecurityPolicy#EccNistP256')).toBe(
      SecurityPolicy.EccNistP256
    );
    expect(fromURI('http://opcfoundation.org/UA/SecurityPolicy#EccNistP384')).toBe(
      SecurityPolicy.EccNistP384
    );
    expect(coerceSecurityPolicy('EccNistP256')).toBe(SecurityPolicy.EccNistP256);
    expect(coerceSecurityPolicy('EccNistP384')).toBe(SecurityPolicy.EccNistP384);
    expect(coerceSecurityPolicy(SecurityPolicy.EccNistP256)).toBe(SecurityPolicy.EccNistP256);
    expect(fromURI('http://opcfoundation.org/UA/SecurityPolicy#EccBrainpoolP256r1')).toBe(
      SecurityPolicy.Invalid
    );
  });

  it('exposes normative factory parameters', () => {
    const p256 = getCryptoFactory(SecurityPolicy.EccNistP256)!;
    expect(p256).not.toBeNull();
    expect(p256).toMatchObject({
      securityPolicy: SecurityPolicy.EccNistP256,
      symmetricEncryptionAlgorithm: 'AES-128-CBC',
      asymmetricSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256',
      sha1or256: 'SHA-256',
      signatureLength: 32,
      symmetricKeyLength: 64,
      derivedSignatureKeyLength: 32,
      derivedEncryptionKeyLength: 16,
      encryptingBlockSize: 16,
      eccCurve: 'P-256',
      eccNonceLength: 64,
      asymmetricSignatureLength: 64,
    });

    const p384 = getCryptoFactory(SecurityPolicy.EccNistP384)!;
    expect(p384).toMatchObject({
      securityPolicy: SecurityPolicy.EccNistP384,
      symmetricEncryptionAlgorithm: 'AES-256-CBC',
      asymmetricSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha384',
      sha1or256: 'SHA-384',
      signatureLength: 48,
      symmetricKeyLength: 96,
      derivedSignatureKeyLength: 48,
      derivedEncryptionKeyLength: 32,
      encryptingBlockSize: 16,
      eccCurve: 'P-384',
      eccNonceLength: 96,
      asymmetricSignatureLength: 96,
    });

    // RSA factories are untouched
    expect(getCryptoFactory(SecurityPolicy.Basic256Sha256)?.eccCurve).toBeUndefined();
  });

  it('parses ECC certificates (ECDSA SPKI) without rejecting key length', async () => {
    const p256Info = await exploreCertificateInfo(eccFixtureCertDer('P-256'));
    expect(p256Info.publicKeyLength).toBe(64);
    const p384Info = await exploreCertificateInfo(eccFixtureCertDer('P-384'));
    expect(p384Info.publicKeyLength).toBe(96);
  });

  it.each([
    { policy: SecurityPolicy.EccNistP256, curve: 'P-256' },
    { policy: SecurityPolicy.EccNistP384, curve: 'P-384' },
  ])('ECDSA sign/verify round-trips via factory for $policy', async ({ policy, curve }) => {
    const factory = getCryptoFactory(policy)!;
    const cert = eccFixtureCertDer(curve);
    const stub = eccFixturePrivateKey(curve);
    const data = new TextEncoder().encode(`opcua factory ${policy}`);
    const sig = await factory.asymmetricSign(data, stub);
    // asymmetric ECDSA signatures are r||s (64 B P-256, 96 B P-384);
    // factory.signatureLength is the symmetric HMAC length (32/48)
    expect(new Uint8Array(sig).byteLength).toBe(factory.eccCurve === 'P-256' ? 64 : 96);
    expect(await factory.asymmetricVerify(new Uint8Array(data), new Uint8Array(sig), cert)).toBe(
      true
    );
    const bad = new Uint8Array(sig);
    bad[0] ^= 0xff;
    expect(await factory.asymmetricVerify(new Uint8Array(data), bad, cert)).toBe(false);
  });

  it.each([
    { policy: SecurityPolicy.EccNistP256, curve: 'P-256' },
    { policy: SecurityPolicy.EccNistP384, curve: 'P-384' },
  ])('asymmetricVerifyChunk accepts ECC OPN chunks for $policy', async ({ policy, curve }) => {
    // Same primitive message_builder._decrypt_OPN uses after its length check.
    const factory = getCryptoFactory(policy)!;
    const cert = eccFixtureCertDer(curve);
    const data = new TextEncoder().encode('ecc opn chunk');
    const sig = new Uint8Array(await factory.asymmetricSign(data, eccFixturePrivateKey(curve)));
    const chunk = new Uint8Array([...data, ...sig]);
    expect(await factory.asymmetricVerifyChunk(chunk, cert)).toBe(true);
    const tampered = new Uint8Array(chunk);
    tampered[0] ^= 0xff;
    expect(await factory.asymmetricVerifyChunk(tampered, cert)).toBe(false);
  });

  it('ECC factories reject RSA-style encrypt/decrypt with actionable error', async () => {
    for (const policy of [SecurityPolicy.EccNistP256, SecurityPolicy.EccNistP384]) {
      const factory = getCryptoFactory(policy)!;
      const k = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: factory.eccCurve! }, true, [
        'deriveBits',
      ]);
      await expect(factory.asymmetricEncrypt(new Uint8Array([1, 2, 3]), k.publicKey)).rejects.toThrow(
        /ECDH key agreement/
      );
      await expect(
        factory.asymmetricDecrypt(new Uint8Array([1, 2, 3]), eccFixturePrivateKey('P-256'))
      ).rejects.toThrow(/ECDH key agreement/);
    }
  });

  it('RSA P_SHA derivation refuses ECC factories (must use ECDH)', async () => {
    const factory = getCryptoFactory(SecurityPolicy.EccNistP256)!;
    await expect(
      computeDerivedKeys(factory, new Uint8Array(64), new Uint8Array(64))
    ).rejects.toThrow(/use computeEccChannelKeys/);
  });

  it.each([SecurityPolicy.EccNistP256, SecurityPolicy.EccNistP384])(
    'computeEccDerivedKeys yields usable AES-CBC/HMAC keys for %s',
    async (policy) => {
      const factory = getCryptoFactory(policy)!;
      const curve = factory.eccCurve!;
      const client = await generateEphemeralKeyPair(curve);
      const server = await generateEphemeralKeyPair(curve);
      const clientNonce = await exportEphemeralPublicKey(client.publicKey, curve);
      const serverNonce = await exportEphemeralPublicKey(server.publicKey, curve);
      const ikm = await deriveSharedSecretIKM(
        client.privateKey,
        await importEphemeralPublicKey(serverNonce, curve),
        curve
      );
      // cross-check low-level helper agrees with factory helper
      const lowLevel = await computeEccChannelKeys(clientNonce, serverNonce, ikm, {
        curve,
        hash: factory.sha1or256 as 'SHA-256' | 'SHA-384',
        coordLength: curve === 'P-256' ? 32 : 48,
        nonceLength: factory.eccNonceLength!,
        signatureLength: factory.signatureLength,
        symmetricEncryptionAlgorithm: factory.symmetricEncryptionAlgorithm as 'AES-128-CBC' | 'AES-256-CBC',
        derivedSignatureKeyLength: factory.derivedSignatureKeyLength,
        derivedEncryptionKeyLength: factory.derivedEncryptionKeyLength,
        encryptingBlockSize: factory.encryptingBlockSize,
      });
      const derived = await computeEccDerivedKeys(factory, clientNonce, serverNonce, ikm);
      expect(derived.derivedClientKeys!.signingKey.byteLength).toBe(
        factory.derivedSignatureKeyLength
      );
      expect(derived.derivedServerKeys!.encryptingKey.byteLength).toBe(
        factory.derivedEncryptionKeyLength
      );
      expect(new Uint8Array(derived.derivedClientKeys!.signingKey)).toEqual(
        lowLevel.clientKeys.signingKey
      );

      // symmetric round-trip with client keys
      const keys = derived.derivedClientKeys!;
      const plain = new Uint8Array(32).map((_, i) => (i * 7) & 0xff);
      const encrypted = await encryptBufferWithDerivedKeys(plain, keys);
      const decrypted = await decryptBufferWithDerivedKeys(encrypted, keys);
      expect(decrypted.subarray(0, plain.byteLength)).toEqual(plain);
      const sigTarget = new TextEncoder().encode('ecc channel message');
      const full = new Uint8Array([
        ...sigTarget,
        ...new Uint8Array(
          await (await import('../crypto/derived_keys')).makeMessageChunkSignatureWithDerivedKeys(
            sigTarget,
            keys
          )
        ),
      ]);
      expect(await verifyChunkSignatureWithDerivedKeys(full, keys)).toBe(true);
    }
  );

  it('computeEccDerivedKeys validates nonce lengths', async () => {
    const factory = getCryptoFactory(SecurityPolicy.EccNistP256)!;
    await expect(
      computeEccDerivedKeys(factory, new Uint8Array(10), new Uint8Array(64), new Uint8Array(32))
    ).rejects.toThrow(/Invalid ECC nonce length/);
  });

  it('computeEccDerivedKeys validates shared secret length (x-coordinate)', async () => {
    const p256 = getCryptoFactory(SecurityPolicy.EccNistP256)!;
    await expect(
      computeEccDerivedKeys(
        p256,
        new Uint8Array(64),
        new Uint8Array(64),
        new Uint8Array(48)
      )
    ).rejects.toThrow(/Invalid ECC shared secret length.*expected 32/);
    const p384 = getCryptoFactory(SecurityPolicy.EccNistP384)!;
    await expect(
      computeEccDerivedKeys(
        p384,
        new Uint8Array(96),
        new Uint8Array(96),
        new Uint8Array(32)
      )
    ).rejects.toThrow(/Invalid ECC shared secret length.*expected 48/);
  });

  it.each([
    { policy: SecurityPolicy.EccNistP256, curve: 'P-256' as EccFixtureCurve, hash: 'SHA-256' as const },
    { policy: SecurityPolicy.EccNistP384, curve: 'P-384' as EccFixtureCurve, hash: 'SHA-384' as const },
  ])('certificate store infers ECDSA signing key for $policy', async ({ curve, hash }) => {
    // PrivateKeyImpl.getSignKey() without an explicit algorithm URI must detect
    // the EC PKCS#8 AlgorithmIdentifier (not fall back to RSA import).
    const { PEMDERCertificateStore } = await import('../common/certificate_store');
    const certDer = eccFixtureCertDer(curve);
    const keyDer = eccFixtureKeyDer(curve);
    const store = new PEMDERCertificateStore(
      certDer.buffer.slice(certDer.byteOffset, certDer.byteOffset + certDer.byteLength),
      keyDer.buffer.slice(keyDer.byteOffset, keyDer.byteOffset + keyDer.byteLength)
    );
    const signKey = await store.getPrivateKey().getSignKey(hash);
    expect(signKey).toBeInstanceOf(CryptoKey);
    expect(signKey.algorithm.name).toBe('ECDSA');
  });
});
