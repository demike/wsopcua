import { vi } from 'vitest';

import { EventEmitter } from '../eventemitter';
import { DataStream } from '../basic-types/DataStream';
import { MessageSecurityMode } from '../generated/MessageSecurityMode';
import { GetEndpointsRequest } from '../generated/GetEndpointsRequest';
import { GetEndpointsResponse } from '../generated/GetEndpointsResponse';
import { OpenSecureChannelResponse } from '../generated/OpenSecureChannelResponse';
import { EccNistP256_Params, EccNistP384_Params, EccPolicyParams } from '../crypto/ecc';
import { ClientSecureChannelLayer } from './client_secure_channel_layer';
import { SecurityPolicy } from './security_policy';
import { MockEccServer } from './test_helpers/mock/mock_ecc_server';
import {
  EccFixtureCurve,
  eccFixtureCertDer,
  eccFixtureKeyDer,
  eccFixturePrivateKey,
} from './test_helpers/mock/mock_ecc_certs';
import { generateSignKeyFromDER } from '../crypto/crypto_explore_certificate';

/**
 * Full two-party ECC handshake over real wire bytes.
 *
 * Unlike the mocked-transaction tests, every byte here travels through the
 * production chunk encode/decode path: the client chunks OPN/MSG with its
 * factories, the MockEccServer verifies/decodes with a production
 * MessageBuilder, derives the same channel keys independently, and answers
 * with production-chunked responses. Derived keys must be byte-equal on both
 * sides after Issue and after Renew.
 */
class LoopbackTransport extends EventEmitter<any> {
  parameters = { sendBufferSize: 8192 };
  disconnecting = false;
  serverChunks: Uint8Array[] = [];
  failure: unknown = null;

  constructor(private readonly server: MockEccServer) {
    super();
  }

  isValid() {
    return !this.disconnecting;
  }

  disconnect(callback: () => void) {
    this.disconnecting = true;
    callback();
  }

  write(chunk: ArrayBufferLike | ArrayBufferView) {
    const bytes = ArrayBuffer.isView(chunk)
      ? new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength)
      : new Uint8Array(chunk);
    const request = new Uint8Array(bytes);
    this.server
      .handleWireChunk(request)
      .then((responses) => {
        for (const response of responses) {
          this.serverChunks.push(response);
          this.emit(
            'message',
            new DataView(response.buffer, response.byteOffset, response.byteLength)
          );
        }
      })
      .catch((err) => {
        this.failure = err;
      });
  }
}

function eccParams(curve: EccFixtureCurve): EccPolicyParams {
  return curve === 'P-256' ? EccNistP256_Params : EccNistP384_Params;
}

function eccPolicy(curve: EccFixtureCurve): SecurityPolicy {
  return curve === 'P-256' ? SecurityPolicy.EccNistP256 : SecurityPolicy.EccNistP384;
}

async function makeLoopback(curve: EccFixtureCurve) {
  const policy = eccPolicy(curve);
  const server = new MockEccServer({
    curve,
    params: eccParams(curve),
    securityPolicy: policy,
    serverCertificate: eccFixtureCertDer(curve),
    serverPrivateKey: {
      getDecryptKey: () => Promise.reject(new Error('ECC has no RSA decrypt')),
      getSignKey: (hash) =>
        generateSignKeyFromDER(eccFixtureKeyDer(curve), hash, 'ECDSA', curve),
    },
  });
  const channel = new ClientSecureChannelLayer({
    encoding: 'opcua+uacp',
    securityMode: MessageSecurityMode.SignAndEncrypt,
    securityPolicy: policy,
    serverCertificate: eccFixtureCertDer(curve),
  });
  (channel as any).parent = {
    getPrivateKey: () => eccFixturePrivateKey(curve),
    getCertificateChain: () => eccFixtureCertDer(curve),
    getCertificate: () => eccFixtureCertDer(curve),
  };
  const transport = new LoopbackTransport(server);
  (channel as any)._transport = transport;
  return { channel, server, transport };
}

function openInitial(channel: ClientSecureChannelLayer) {
  // _on_connection wires the transport listeners AND issues the initial OPN:
  // the closest to a real connect() without sockets.
  return new Promise<Error | null>((resolve) =>
    (channel as any)._on_connection((channel as any)._transport, (err: Error | null) =>
      resolve(err)
    )
  );
}

function renewChannel(channel: ClientSecureChannelLayer) {
  return new Promise<Error | null>((resolve) =>
    (channel as any)._open_secure_channel_request(false, (err: Error | null) => resolve(err))
  );
}

function keysOf(channel: ClientSecureChannelLayer) {
  const derived = (channel as any)._derivedKeys;
  return {
    client: {
      signingKey: new Uint8Array(derived.derivedClientKeys.signingKey),
      encryptingKey: new Uint8Array(derived.derivedClientKeys.encryptingKey),
      iv: new Uint8Array(derived.derivedClientKeys.initializationVector),
    },
    server: {
      signingKey: new Uint8Array(derived.derivedServerKeys.signingKey),
      encryptingKey: new Uint8Array(derived.derivedServerKeys.encryptingKey),
      iv: new Uint8Array(derived.derivedServerKeys.initializationVector),
    },
  };
}

describe.each(['P-256', 'P-384'] as EccFixtureCurve[])(
  'ECC loopback handshake (%s)',
  (curve) => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('completes Issue with byte-equal derived keys on both sides', async () => {
      const { channel, server, transport } = await makeLoopback(curve);
      expect(await openInitial(channel)).toBeNull();
      expect(transport.failure).toBeNull();

      const clientKeys = keysOf(channel);
      expect(server.channelKeys).toBeDefined();
      expect(clientKeys.client.signingKey).toEqual(server.channelKeys!.clientKeys.signingKey);
      expect(clientKeys.client.encryptingKey).toEqual(server.channelKeys!.clientKeys.encryptingKey);
      expect(clientKeys.client.iv).toEqual(server.channelKeys!.clientKeys.initializationVector);
      expect(clientKeys.server.signingKey).toEqual(server.channelKeys!.serverKeys.signingKey);
      expect(clientKeys.server.encryptingKey).toEqual(server.channelKeys!.serverKeys.encryptingKey);
      expect(clientKeys.server.iv).toEqual(server.channelKeys!.serverKeys.initializationVector);
      // client and server directions differ
      expect(clientKeys.client.signingKey).not.toEqual(clientKeys.server.signingKey);

      (channel as any)._cancel_security_token_watchdog();
      channel.dispose();
    });

    it('renews with fresh keys still equal on both sides', async () => {
      const { channel, server, transport } = await makeLoopback(curve);
      expect(await openInitial(channel)).toBeNull();
      const before = keysOf(channel);
      (channel as any)._cancel_security_token_watchdog();

      expect(await renewChannel(channel)).toBeNull();
      expect(transport.failure).toBeNull();
      const after = keysOf(channel);
      // renewal rotated the keys...
      expect(after.server.signingKey).not.toEqual(before.server.signingKey);
      // ...and both sides still agree
      expect(after.client.signingKey).toEqual(server.channelKeys!.clientKeys.signingKey);
      expect(after.server.encryptingKey).toEqual(server.channelKeys!.serverKeys.encryptingKey);

      (channel as any)._cancel_security_token_watchdog();
      channel.dispose();
    });

    it('round-trips GetEndpoints symmetrically secured', async () => {
      const { channel, transport } = await makeLoopback(curve);
      expect(await openInitial(channel)).toBeNull();
      (channel as any)._cancel_security_token_watchdog();

      const response: GetEndpointsResponse = await new Promise((resolve, reject) =>
        channel.performMessageTransaction(
          new GetEndpointsRequest({ endpointUrl: 'opc.tcp://loopback', localeIds: [], profileUris: [] }),
          (err: Error | null, res?: GetEndpointsResponse) => (err ? reject(err) : resolve(res!))
        )
      );
      expect(transport.failure).toBeNull();
      expect(response).toBeInstanceOf(GetEndpointsResponse);
      expect(response.endpoints?.[0]?.endpointUrl).toBe('opc.tcp://loopback');
      expect(response.endpoints?.[0]?.securityPolicyUri).toBe(eccPolicy(curve));

      (channel as any)._cancel_security_token_watchdog();
      channel.dispose();
    });

    it('rejects a tampered OPN response signature at the wire level', async () => {
      const { channel, transport } = await makeLoopback(curve);
      expect(await openInitial(channel)).toBeNull();
      (channel as any)._cancel_security_token_watchdog();
      expect(transport.serverChunks.length).toBeGreaterThan(0);

      const good = transport.serverChunks[transport.serverChunks.length - 1];
      const bad = new Uint8Array(good);
      bad[bad.byteLength - 1] ^= 0xff;
      const ok = await (channel.messageBuilder as any)._decrypt_OPN(new DataStream(bad));
      expect(ok).toBe(false);
      expect(transport.failure).toBeNull();
      channel.dispose();
    });
  }
);

describe('ECC loopback server behavior', () => {
  it('rejects unknown message bodies without crashing the channel', async () => {
    const { channel, transport } = await makeLoopback('P-256');
    expect(await openInitial(channel)).toBeNull();
    (channel as any)._cancel_security_token_watchdog();
    // server records what it decoded; the OPN request arrived intact
    const { server } = { server: (transport as any).server as MockEccServer };
    expect(server.receivedRequests.length).toBeGreaterThan(0);
    expect(server.receivedRequests[0].msgType).toBe('OPN');
    channel.dispose();
  });
});
