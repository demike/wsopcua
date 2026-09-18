import { PrivateKey } from '../crypto/common';
import { generateSignKeyFromDER } from '../crypto/crypto_explore_certificate';
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

// Self-signed ECC fixtures generated with:
//   openssl ecparam -name prime256v1 -genkey ... -sha256 (P-256)
//   openssl ecparam -name secp384r1 -genkey ... -sha384 (P-384)
// keyUsage includes digitalSignature,nonRepudiation,keyAgreement.
const P256_CERT_HEX =
  '308201b130820156a003020102021420fafa4e103f2b7e42f82fd78b9ef69eb7ac9fe6300a06082a8648ce3d04030230183116301406035504030c0d6563632d703235362d74657374301e170d3236303931383131333733335a170d3237303931383131333733335a30183116301406035504030c0d6563632d703235362d746573743059301306072a8648ce3d020106082a8648ce3d030107034200045565fd9a45a492bb381a60fcc2c841de7481667d0dd100f0d81d56f71f043de5475821bff321203df954606041b1b53d31094f320552dba8cb7e4612080c873ea37e307c301d0603551d0e041604142df2ece47fc3fbef3c66891fba062e5418f19ff5301f0603551d230418301680142df2ece47fc3fbef3c66891fba062e5418f19ff5301c0603551d1104153013861175726e3a746573743a6563632d70323536300c0603551d130101ff04023000300e0603551d0f0101ff0404030203c8300a06082a8648ce3d0403020349003046022100eb8df3f798a4ee288ce40669494534456ce8e600f835f33992969dccb1fc5887022100b11d31f853ff9edb3c902cde6fea754c7131cf6fe95fc718524e75129a636c3f';
const P256_KEY_HEX =
  '308187020100301306072a8648ce3d020106082a8648ce3d030107046d306b0201010420e15a9b4d885c7f24d4bb622feb875ca40b6ac9fedcbc6e5d5318d717ae5ae37ca144034200045565fd9a45a492bb381a60fcc2c841de7481667d0dd100f0d81d56f71f043de5475821bff321203df954606041b1b53d31094f320552dba8cb7e4612080c873e';
const P384_CERT_HEX =
  '308201ed30820173a00302010202144e1cb96a7b5d1bb1973ef26b1c87bea693bf5fb9300a06082a8648ce3d04030330183116301406035504030c0d6563632d703338342d74657374301e170d3236303931383131333733335a170d3237303931383131333733335a30183116301406035504030c0d6563632d703338342d746573743076301006072a8648ce3d020106052b8104002203620004368e33464de5363e061db481e7fc9db142d297eec8b5b0ca75d6fda41c2ab7b0059c11b29a738692815a053ee575a8b82c36228ef076039b57c9cf4c1028842b500fd7185a9d56e93d3751699344e421167fb6e5d91dd7bf2c4f7ec8723699f7a37e307c301d0603551d0e041604149d26a9b4f910a826da4974cb17d8fdcaae2eb2df301f0603551d230418301680149d26a9b4f910a826da4974cb17d8fdcaae2eb2df301c0603551d1104153013861175726e3a746573743a6563632d70333834300c0603551d130101ff04023000300e0603551d0f0101ff0404030203c8300a06082a8648ce3d04030303680030650231008c32434a06a4c9ec422c5c3b4f72ccd63340e54a5a0ee4b49844e47d5ddf718282474116656e83c75c83be2192ebf5e90230076b6fbdf1d09895e879e8f067f582ba7423345436dff3e1d08fecd6c420e123530ce23725d9550cbef3fae2f9a3689f';
const P384_KEY_HEX =
  '3081b6020100301006072a8648ce3d020106052b8104002204819e30819b0201010430f102fe2b38dd8ed36909074814faa68fa97314b4cb61073c5e01807a6f33675b7e1d4b3cbec65d1a831663902b4f86b2a16403620004368e33464de5363e061db481e7fc9db142d297eec8b5b0ca75d6fda41c2ab7b0059c11b29a738692815a053ee575a8b82c36228ef076039b57c9cf4c1028842b500fd7185a9d56e93d3751699344e421167fb6e5d91dd7bf2c4f7ec8723699f7';

function hex(h: string): Uint8Array {
  return Uint8Array.fromHex(h);
}

function eccPrivateKeyStub(keyDer: Uint8Array, curve: 'P-256' | 'P-384'): PrivateKey {
  return {
    getDecryptKey: () => Promise.reject(new Error('ECC has no RSA decrypt')),
    getSignKey: (hash) =>
      generateSignKeyFromDER(
        keyDer,
        hash,
        'ECDSA',
        curve
      ) as Promise<CryptoKey>,
  };
}

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
    });

    // RSA factories are untouched
    expect(getCryptoFactory(SecurityPolicy.Basic256Sha256)?.eccCurve).toBeUndefined();
  });

  it('parses ECC certificates (ECDSA SPKI) without rejecting key length', async () => {
    const p256Info = await exploreCertificateInfo(hex(P256_CERT_HEX));
    expect(p256Info.publicKeyLength).toBe(64);
    const p384Info = await exploreCertificateInfo(hex(P384_CERT_HEX));
    expect(p384Info.publicKeyLength).toBe(96);
  });

  it.each([
    { policy: SecurityPolicy.EccNistP256, certHex: P256_CERT_HEX, keyHex: P256_KEY_HEX },
    { policy: SecurityPolicy.EccNistP384, certHex: P384_CERT_HEX, keyHex: P384_KEY_HEX },
  ])('ECDSA sign/verify round-trips via factory for $policy', async ({ policy, certHex, keyHex }) => {
    const factory = getCryptoFactory(policy)!;
    const cert = hex(certHex);
    const stub = eccPrivateKeyStub(hex(keyHex), factory.eccCurve!);
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
        factory.asymmetricDecrypt(new Uint8Array([1, 2, 3]), eccPrivateKeyStub(hex(P256_KEY_HEX), 'P-256'))
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
    { policy: SecurityPolicy.EccNistP256, certHex: P256_CERT_HEX, keyHex: P256_KEY_HEX, hash: 'SHA-256' as const },
    { policy: SecurityPolicy.EccNistP384, certHex: P384_CERT_HEX, keyHex: P384_KEY_HEX, hash: 'SHA-384' as const },
  ])('certificate store infers ECDSA signing key for $policy', async ({ certHex, keyHex, hash }) => {
    // PrivateKeyImpl.getSignKey() without an explicit algorithm URI must detect
    // the EC PKCS#8 AlgorithmIdentifier (not fall back to RSA import).
    const { PEMDERCertificateStore } = await import('../common/certificate_store');
    const certDer = hex(certHex);
    const keyDer = hex(keyHex);
    const store = new PEMDERCertificateStore(
      certDer.buffer.slice(certDer.byteOffset, certDer.byteOffset + certDer.byteLength),
      keyDer.buffer.slice(keyDer.byteOffset, keyDer.byteOffset + keyDer.byteLength)
    );
    const signKey = await store.getPrivateKey().getSignKey(hash);
    expect(signKey).toBeInstanceOf(CryptoKey);
    expect(signKey.algorithm.name).toBe('ECDSA');
  });
});
