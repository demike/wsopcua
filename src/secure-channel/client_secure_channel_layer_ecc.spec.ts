import { vi } from 'vitest';

import { MessageSecurityMode } from '../generated/MessageSecurityMode';
import { ChannelSecurityToken } from '../generated/ChannelSecurityToken';
import { OpenSecureChannelResponse } from '../generated/OpenSecureChannelResponse';
import {
  deriveSharedSecretIKM,
  exportEphemeralPublicKey,
  generateEphemeralKeyPair,
  importEphemeralPublicKey,
  xorIkmsForRenewal,
} from '../crypto/ecc';
import { ClientSecureChannelLayer } from './client_secure_channel_layer';
import { SecurityPolicy, getCryptoFactory } from './security_policy';
import {
  EccFixtureCurve,
  eccFixtureCertDer,
  eccFixturePrivateKey,
} from './test_helpers/mock/mock_ecc_certs';

function makeEccChannel(curve: EccFixtureCurve) {
  const policy =
    curve === 'P-256' ? SecurityPolicy.EccNistP256 : SecurityPolicy.EccNistP384;
  const channel = new ClientSecureChannelLayer({
    encoding: 'opcua+uacp',
    securityMode: MessageSecurityMode.SignAndEncrypt,
    securityPolicy: policy,
    serverCertificate: eccFixtureCertDer(curve),
  });
  // client identity: fixture ECC cert + key
  (channel as any).parent = {
    getPrivateKey: () => eccFixturePrivateKey(curve),
    getCertificateChain: () => eccFixtureCertDer(curve),
    getCertificate: () => eccFixtureCertDer(curve),
  };
  // messageBuilder picks up its cryptoFactory from the OPN security header
  // when receiving; tests set it directly instead of going through the wire.
  (channel as any).messageBuilder._cryptoFactory = getCryptoFactory(policy);
  return channel;
}

/** capture the OPN transaction callback instead of using a transport */
function mockOpuTransaction(channel: ClientSecureChannelLayer) {
  const callbacks: ((err: Error | null, response?: any) => void)[] = [];
  vi.spyOn(channel as any, '_performMessageTransaction').mockImplementation(
    (_msgType: string, _msg: unknown, callback: (err: Error | null, response?: any) => void) => {
      callbacks.push(callback);
    }
  );
  return callbacks;
}

/** wait until the mocked OPN transaction for the in-flight request is captured */
async function waitForOpuTransaction(
  callbacks: ((err: Error | null, response?: any) => void)[],
  expected: number,
  timeoutMs = 5000
) {
  const start = Date.now();
  while (callbacks.length < expected) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`timed out waiting for OPN transaction ${expected}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

function makeServerNonceResponse(serverNonce: Uint8Array, tokenId: number) {
  return new OpenSecureChannelResponse({
    securityToken: new ChannelSecurityToken({
      channelId: 42,
      tokenId,
      revisedLifetime: 30000,
      createdAt: new Date(),
    }),
    serverNonce,
  });
}

describe.each(['P-256', 'P-384'] as EccFixtureCurve[])(
  'ClientSecureChannelLayer ECC OPN (%s)',
  (curve) => {
    const nonceLength = curve === 'P-256' ? 64 : 96;
    const asymmetricSignatureLength = curve === 'P-256' ? 64 : 96;

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('builds an ephemeral ECDH client nonce of normative length', async () => {
      const channel = makeEccChannel(curve);
      const nonce = await (channel as any)._build_client_nonce();
      expect(nonce).toBeInstanceOf(Uint8Array);
      expect(nonce.byteLength).toBe(nonceLength);
      // private half retained for the ECDH agreement on the response
      const ephemeralPrivate = (channel as any)._clientEphemeralPrivateKey;
      expect(ephemeralPrivate).toBeInstanceOf(CryptoKey);
      // a second handshake uses a fresh ephemeral key
      const nonce2 = await (channel as any)._build_client_nonce();
      expect(nonce2).not.toEqual(nonce);
      channel.dispose();
    });

    it('uses sign-only OPN options (no RSA block encryption)', async () => {
      const channel = makeEccChannel(curve);
      const options = await (channel as any)._get_security_options_for_OPN();
      expect(options.signatureLength).toBe(asymmetricSignatureLength);
      expect(typeof options.signBufferFunc).toBe('function');
      expect(options.encryptBufferFunc).toBeUndefined();
      expect(options.plainBlockSize).toBe(0);
      expect(options.cipherBlockSize).toBe(0);

      // the sign function produces ECDSA signatures the server cert verifies
      const factory = getCryptoFactory(
        curve === 'P-256' ? SecurityPolicy.EccNistP256 : SecurityPolicy.EccNistP384
      )!;
      const data = new TextEncoder().encode('ecc opn request');
      const sig = new Uint8Array(await options.signBufferFunc(data));
      expect(sig.byteLength).toBe(asymmetricSignatureLength);
      expect(await factory.asymmetricVerify(data, sig, eccFixtureCertDer(curve))).toBe(true);
      channel.dispose();
    });

    it('derives channel keys on Issue and XOR-links them on Renew', async () => {
      const channel = makeEccChannel(curve);
      const callbacks = mockOpuTransaction(channel);

      // --- Issue ---
      const issueDone = new Promise<Error | null>((resolve) =>
        (channel as any)._open_secure_channel_request(true, (err: Error | null) => resolve(err))
      );
      // _open_secure_channel_request awaits the ephemeral nonce first
      await waitForOpuTransaction(callbacks, 1);
      expect(callbacks).toHaveLength(1);
      const clientNonce1 = new Uint8Array((channel as any)._clientNonce);
      expect(clientNonce1.byteLength).toBe(nonceLength);

      const server1 = await generateEphemeralKeyPair(curve);
      const serverNonce1 = await exportEphemeralPublicKey(server1.publicKey, curve);
      await callbacks[0](null, makeServerNonceResponse(serverNonce1, 1));
      expect(await issueDone).toBeNull();

      const derived1 = (channel as any)._derivedKeys;
      expect(derived1?.derivedServerKeys).not.toBeNull();
      // server keys match an independent derivation from the same agreement
      const expectedIkm1 = await deriveSharedSecretIKM(
        (channel as any)._clientEphemeralPrivateKey,
        await importEphemeralPublicKey(serverNonce1, curve),
        curve
      );
      expect(new Uint8Array((channel as any)._eccSharedSecret)).toEqual(expectedIkm1);
      (channel as any)._cancel_security_token_watchdog();

      // --- Renew with a fresh ephemeral pair on both sides ---
      const renewDone = new Promise<Error | null>((resolve) =>
        (channel as any)._open_secure_channel_request(false, (err: Error | null) => resolve(err))
      );
      await waitForOpuTransaction(callbacks, 2);
      expect(callbacks).toHaveLength(2);
      const server2 = await generateEphemeralKeyPair(curve);
      const serverNonce2 = await exportEphemeralPublicKey(server2.publicKey, curve);
      await callbacks[1](null, makeServerNonceResponse(serverNonce2, 2));
      expect(await renewDone).toBeNull();

      const freshIkm2 = await deriveSharedSecretIKM(
        (channel as any)._clientEphemeralPrivateKey,
        await importEphemeralPublicKey(serverNonce2, curve),
        curve
      );
      // Part 6 §6.8.1: renewal IKM = previous IKM XOR fresh IKM
      expect(new Uint8Array((channel as any)._eccSharedSecret)).toEqual(
        xorIkmsForRenewal(expectedIkm1, freshIkm2)
      );
      // renewed keys differ from the Issue keys
      const derived2 = (channel as any)._derivedKeys;
      expect(new Uint8Array(derived2.derivedServerKeys.signingKey)).not.toEqual(
        new Uint8Array(derived1.derivedServerKeys.signingKey)
      );
      (channel as any)._cancel_security_token_watchdog();
      channel.dispose();
    });
  }
);

describe('ClientSecureChannelLayer nonce (RSA regression)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('still builds a random 32-byte nonce for RSA policies', async () => {
    const channel = new ClientSecureChannelLayer({ encoding: 'opcua+uacp' });
    const nonce = await (channel as any)._build_client_nonce();
    // default policy None + mode None? constructor defaults: securityMode None
    // returns undefined for None; use an RSA policy explicitly instead
    expect(nonce).toBeUndefined();
    (channel as any).securityPolicy = SecurityPolicy.Basic256Sha256;
    (channel as any).securityMode = MessageSecurityMode.SignAndEncrypt;
    const rsaNonce = await (channel as any)._build_client_nonce();
    expect(rsaNonce.byteLength).toBe(32);
    expect((channel as any)._clientEphemeralPrivateKey).toBeUndefined();
    channel.dispose();
  });
});
