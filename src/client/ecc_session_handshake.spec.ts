import { vi } from 'vitest';

import { DataStream } from '../basic-types/DataStream';
import {
  decodeExtensionObject,
  encodeExtensionObject,
} from '../basic-types/extension_object';
import { QualifiedName } from '../generated/QualifiedName';
import { KeyValuePair } from '../generated/KeyValuePair';
import { AdditionalParametersType } from '../generated/AdditionalParametersType';
import { EphemeralKeyType } from '../generated/EphemeralKeyType';
import { Variant } from '../variant/variant';
import { DataType } from '../variant/DataTypeEnum';
import { MessageSecurityMode } from '../generated/MessageSecurityMode';
import { UserTokenType } from '../generated/UserTokenType';
import { EndpointDescription } from '../generated/EndpointDescription';
import { UserTokenPolicy } from '../generated/UserTokenPolicy';
import { ActivateSessionResponse } from '../generated/ActivateSessionResponse';
import { ResponseHeader } from '../generated/ResponseHeader';
import { StatusCodes } from '../constants/raw_status_codes';
import { SignatureData } from '../generated/SignatureData';
import {
  exportEphemeralPublicKey,
  generateEphemeralKeyPair,
} from '../crypto/ecc';
import { parseEccEncryptedSecret, unprotectEccSecret } from '../crypto/ecc_secret';
import { EccNistP256_Params } from '../crypto/ecc';
import { ClientSession } from './client_session';
import { OPCUAClient } from './opcua_client';
import {
  buildEcdhPolicyUriHeader,
  eccTokenContextFor,
  parseEccSessionEphemeralKey,
  protectEccUserTokenSecret,
  sessionEphemeralKeyFor,
  setEcdhPolicyUriHeader,
  storeSessionEphemeralKey,
} from './ecc_session_handshake';
import {
  eccFixtureCertDer,
  eccFixturePrivateKey,
} from '../secure-channel/test_helpers/mock/mock_ecc_certs';
import { SecurityPolicy } from '../secure-channel/security_policy';

const ECC_URI = 'http://opcfoundation.org/UA/SecurityPolicy#EccNistP256';

function roundTripAdditionalHeader(header: AdditionalParametersType): unknown {
  const stream = new DataStream(4096);
  encodeExtensionObject(header, stream);
  const bytes = new Uint8Array(stream.view.buffer, stream.view.byteOffset, stream.pos);
  return decodeExtensionObject(new DataStream(bytes));
}

describe('ECC session handshake headers (§6.8.2)', () => {
  it('builds an ECDHPolicyUri request header', () => {
    const header = buildEcdhPolicyUriHeader(ECC_URI);
    expect(header.parameters).toHaveLength(1);
    expect(header.parameters[0].key.name).toBe('ECDHPolicyUri');
    const value = header.parameters[0].value;
    expect(value).toBeInstanceOf(Variant);
    expect(value.dataType).toBe(DataType.String);
    expect(value.value).toBe(ECC_URI);
  });

  it('round-trips a server ECDHKey response header through binary encoding', () => {
    const serverPub = new Uint8Array(64).map((_, i) => (i * 13 + 5) & 0xff);
    const header = new AdditionalParametersType({
      parameters: [
        new KeyValuePair({
          key: new QualifiedName({ name: 'ECDHKey' }),
          value: new Variant({
            dataType: DataType.ExtensionObject,
            value: new EphemeralKeyType({ publicKey: serverPub, signature: new Uint8Array(0) }),
          }),
        }),
      ],
    });
    const decoded = roundTripAdditionalHeader(header);
    const key = parseEccSessionEphemeralKey(decoded as never, ECC_URI);
    expect(key?.policyUri).toBe(ECC_URI);
    expect(key?.publicKey).toEqual(serverPub);
    expect(key?.used).toBe(false);
  });

  it('ignores unknown or empty headers', () => {
    expect(parseEccSessionEphemeralKey(undefined, ECC_URI)).toBeUndefined();
    expect(parseEccSessionEphemeralKey(null, ECC_URI)).toBeUndefined();
    expect(
      parseEccSessionEphemeralKey(new AdditionalParametersType({ parameters: [] }), ECC_URI)
    ).toBeUndefined();
    // ECDHKey without a policy URI context cannot be filed
    const header = new AdditionalParametersType({
      parameters: [
        new KeyValuePair({
          key: new QualifiedName({ name: 'ECDHKey' }),
          value: new Variant({
            dataType: DataType.ExtensionObject,
            value: new EphemeralKeyType({ publicKey: new Uint8Array(64).fill(1) }),
          }),
        }),
      ],
    });
    expect(parseEccSessionEphemeralKey(header)).toBeUndefined();
  });

  it('stores and replaces session keys per policy URI', () => {
    const session = new ClientSession(null as never);
    storeSessionEphemeralKey(session, {
      policyUri: ECC_URI,
      publicKey: new Uint8Array(64).fill(1),
      used: true,
    });
    expect(sessionEphemeralKeyFor(session, ECC_URI)?.used).toBe(true);
    storeSessionEphemeralKey(session, {
      policyUri: ECC_URI,
      publicKey: new Uint8Array(64).fill(2),
      used: false,
    });
    expect(sessionEphemeralKeyFor(session, ECC_URI)?.publicKey[0]).toBe(2);
    expect(sessionEphemeralKeyFor(session, 'http://example/other')).toBeUndefined();
  });

  it('resolves ECC token context only for ECC token policies', () => {
    const session = new ClientSession(null as never);
    (session as any)._client = {
      _secureChannel: { securityPolicy: SecurityPolicy.EccNistP256 },
    };
    const ctx = eccTokenContextFor(session, ECC_URI)!;
    expect(ctx.policyUri).toBe(ECC_URI);
    expect(ctx.params.curve).toBe('P-256');
    // empty token policy URI falls back to the channel policy
    expect(eccTokenContextFor(session, undefined)?.policyUri).toBe(SecurityPolicy.EccNistP256);
    expect(eccTokenContextFor(session, '')?.policyUri).toBe(SecurityPolicy.EccNistP256);
    // a non-empty but unresolvable URI must not leak into policyUri
    expect(eccTokenContextFor(session, 'http://example/garbage')?.policyUri).toBe(
      SecurityPolicy.EccNistP256
    );
    // RSA token policy on an ECC channel is not ECC
    expect(
      eccTokenContextFor(
        session,
        'http://opcfoundation.org/UA/SecurityPolicy#Basic256Sha256'
      )
    ).toBeUndefined();
  });

  it('merges ECDHPolicyUri into an existing header instead of overwriting', async () => {
    const { RequestHeader } = await import('../generated/RequestHeader');
    const header = new RequestHeader({
      additionalHeader: new AdditionalParametersType({
        parameters: [
          new KeyValuePair({
            key: new QualifiedName({ name: 'SomethingElse' }),
            value: new Variant({ dataType: DataType.String, value: 'keep-me' }),
          }),
          new KeyValuePair({
            key: new QualifiedName({ name: 'ECDHPolicyUri' }),
            value: new Variant({ dataType: DataType.String, value: 'http://example/stale' }),
          }),
        ],
      }),
    });
    setEcdhPolicyUriHeader(header, ECC_URI);
    const params = header.additionalHeader as AdditionalParametersType;
    expect(params).toBeInstanceOf(AdditionalParametersType);
    expect(params.parameters.map((p) => p.key.name).sort()).toEqual([
      'ECDHPolicyUri',
      'SomethingElse',
    ]);
    const uri = params.parameters.find((p) => p.key.name === 'ECDHPolicyUri')!.value.value;
    expect(uri).toBe(ECC_URI);
    // and a bare header still works
    const bare = new RequestHeader({});
    setEcdhPolicyUriHeader(bare, ECC_URI);
    expect(
      (bare.additionalHeader as AdditionalParametersType).parameters[0].key.name
    ).toBe('ECDHPolicyUri');
  });
});

describe('ECC user token protection (§6.8.3)', () => {
  async function makeSessionWithServerKey() {
    const server = await generateEphemeralKeyPair('P-256');
    const serverPub = await exportEphemeralPublicKey(server.publicKey, 'P-256');
    const session = new ClientSession(null as never);
    session.serverNonce = new Uint8Array(32).map((_, i) => i);
    storeSessionEphemeralKey(session, { policyUri: ECC_URI, publicKey: serverPub, used: false });
    const client = {
      getPrivateKey: () => eccFixturePrivateKey('P-256'),
      getCertificateChain: () => eccFixtureCertDer('P-256'),
      getCertificate: () => eccFixtureCertDer('P-256'),
    };
    return { session, client, server };
  }

  it('protects a password verifiable by the server side', async () => {
    const { session, client, server } = await makeSessionWithServerKey();
    const ctx = eccTokenContextFor(
      { ...session, _client: { _secureChannel: { securityPolicy: SecurityPolicy.EccNistP256 } } } as never,
      ECC_URI
    )!;
    const password = new TextEncoder().encode('hunter2');
    const { envelope, encryptionAlgorithm } = await protectEccUserTokenSecret(
      session,
      client,
      ctx,
      password
    );
    expect(encryptionAlgorithm).toBe('http://www.w3.org/2001/04/xmlenc#ecdh-es');
    // the session key is consumed
    expect(sessionEphemeralKeyFor(session, ECC_URI)?.used).toBe(true);
    // server side: parse + unprotect with the session ephemeral private key
    const parsed = parseEccEncryptedSecret(envelope, EccNistP256_Params);
    expect(parsed.policyUri).toBe(ECC_URI);
    const out = await unprotectEccSecret(envelope, {
      params: EccNistP256_Params,
      receiverPrivateKey: server.privateKey,
    });
    expect(out.secret).toEqual(password);
    expect(out.nonce).toEqual(session.serverNonce);
  });

  it('refuses without a server ephemeral key', async () => {
    const session = new ClientSession(null as never);
    session.serverNonce = new Uint8Array(32);
    const client = {
      getPrivateKey: () => eccFixturePrivateKey('P-256'),
      getCertificateChain: () => eccFixtureCertDer('P-256'),
      getCertificate: () => eccFixtureCertDer('P-256'),
    };
    const ctx = eccTokenContextFor(
      { ...session, _client: { _secureChannel: { securityPolicy: SecurityPolicy.EccNistP256 } } } as never,
      ECC_URI
    )!;
    await expect(
      protectEccUserTokenSecret(session, client, ctx, new TextEncoder().encode('pw'))
    ).rejects.toThrow(/server EphemeralKey/);
  });

  it('refuses to reuse a consumed server key and requires a server nonce', async () => {
    const { session, client } = await makeSessionWithServerKey();
    const ctx = eccTokenContextFor(
      { ...session, _client: { _secureChannel: { securityPolicy: SecurityPolicy.EccNistP256 } } } as never,
      ECC_URI
    )!;
    await protectEccUserTokenSecret(session, client, ctx, new TextEncoder().encode('first'));
    await expect(
      protectEccUserTokenSecret(session, client, ctx, new TextEncoder().encode('second'))
    ).rejects.toThrow(/already consumed/);
    // a missing channel nonce fails loudly instead of sending an empty one
    session.serverEccEphemeralKeys![ECC_URI].used = false;
    session.serverNonce = undefined;
    await expect(
      protectEccUserTokenSecret(session, client, ctx, new TextEncoder().encode('third'))
    ).rejects.toThrow(/serverNonce/);
  });

  it('protects a secret on the P-384 policy', async () => {
    const server = await generateEphemeralKeyPair('P-384');
    const serverPub = await exportEphemeralPublicKey(server.publicKey, 'P-384');
    const session = new ClientSession(null as never);
    session.serverNonce = new Uint8Array(32).map((_, i) => 255 - i);
    const P384_URI = 'http://opcfoundation.org/UA/SecurityPolicy#EccNistP384';
    storeSessionEphemeralKey(session, { policyUri: P384_URI, publicKey: serverPub, used: false });
    const client = {
      getPrivateKey: () => eccFixturePrivateKey('P-384'),
      getCertificateChain: () => eccFixtureCertDer('P-384'),
      getCertificate: () => eccFixtureCertDer('P-384'),
    };
    const ctx = eccTokenContextFor(
      { ...session, _client: { _secureChannel: { securityPolicy: SecurityPolicy.EccNistP384 } } } as never,
      P384_URI
    )!;
    expect(ctx.params.curve).toBe('P-384');
    const secret = new TextEncoder().encode('p384-secret');
    const { envelope } = await protectEccUserTokenSecret(session, client, ctx, secret);
    const { EccNistP384_Params } = await import('../crypto/ecc');
    const out = await unprotectEccSecret(envelope, {
      params: EccNistP384_Params,
      receiverPrivateKey: server.privateKey,
    });
    expect(out.secret).toEqual(secret);
    expect(out.policyUri).toBe(P384_URI);
  });
});

describe('ECC session wiring in OPCUAClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function makeEccClient(tokenType: (typeof UserTokenType)[keyof typeof UserTokenType] = UserTokenType.UserName) {
    const client = new OPCUAClient({});
    (client as any)._secureChannel = {
      messageBuilder: { _securityPolicy: SecurityPolicy.EccNistP256 },
      securityPolicy: SecurityPolicy.EccNistP256,
    };
    vi.spyOn(client as any, 'computeClientSignature').mockResolvedValue(new SignatureData({}));
    (client as any).endpoint = new EndpointDescription({
      securityPolicyUri: ECC_URI,
      securityMode: MessageSecurityMode.SignAndEncrypt,
      userIdentityTokens: [
        new UserTokenPolicy({
          policyId: 'ecc-token',
          tokenType,
          securityPolicyUri: ECC_URI,
        }),
      ],
    });
    // _activateSession swaps session.client to this client: give it an ECC identity
    (client as any).clientCertificateStore = {
      getPrivateKey: () => eccFixturePrivateKey('P-256'),
      getCertificateChain: () => eccFixtureCertDer('P-256'),
      getCertificate: () => eccFixtureCertDer('P-256'),
    };
    return client;
  }

  function respondWithEphemeralKey(serverPub: Uint8Array) {
    return new ActivateSessionResponse({
      responseHeader: new ResponseHeader({
        serviceResult: StatusCodes.Good,
        additionalHeader: new AdditionalParametersType({
          parameters: [
            new KeyValuePair({
              key: new QualifiedName({ name: 'ECDHKey' }),
              value: new Variant({
                dataType: DataType.ExtensionObject,
                value: new EphemeralKeyType({ publicKey: serverPub }),
              }),
            }),
          ],
        }),
      }),
      serverNonce: new Uint8Array(32),
    });
  }

  it('sends ECDHPolicyUri, builds an EccEncryptedSecret token, stores the new key', async () => {
    const client = makeEccClient();
    const session = new ClientSession(client);
    session.serverCertificate = eccFixtureCertDer('P-256');
    session.serverNonce = new Uint8Array(32).map((_, i) => i);
    const seedServer = await generateEphemeralKeyPair('P-256');
    storeSessionEphemeralKey(session, {
      policyUri: ECC_URI,
      publicKey: await exportEphemeralPublicKey(seedServer.publicKey, 'P-256'),
      used: false,
    });

    const requests: any[] = [];
    vi.spyOn(session, 'performMessageTransaction').mockImplementation(
      (request: any, callback: any) => {
        requests.push(request);
        generateEphemeralKeyPair('P-256').then(async (fresh) => {
          const freshPub = await exportEphemeralPublicKey(fresh.publicKey, 'P-256');
          (session as any)._freshServerPub = freshPub;
          callback(null, respondWithEphemeralKey(freshPub));
        });
      }
    );

    const err: Error | null = await new Promise((resolve) =>
      (client as any)._activateSession(
        session,
        { userIdentityInfo: { userName: 'alice', password: 'wonderland' } },
        (e: Error | null) => resolve(e)
      )
    );
    expect(err).toBeNull();
    expect(requests).toHaveLength(1);
    const request = requests[0];
    // ECDHPolicyUri advertised in the request header
    const header = request.requestHeader.additionalHeader as AdditionalParametersType;
    expect(header).toBeInstanceOf(AdditionalParametersType);
    expect(header.parameters[0].key.name).toBe('ECDHPolicyUri');
    // password is an EccEncryptedSecret envelope decryptable by... the seed server key
    const password = request.userIdentityToken.password as Uint8Array;
    const parsed = parseEccEncryptedSecret(password, EccNistP256_Params);
    expect(parsed.policyUri).toBe(ECC_URI);
    const opened = await unprotectEccSecret(password, {
      params: EccNistP256_Params,
      receiverPrivateKey: seedServer.privateKey,
    });
    expect(new TextDecoder().decode(opened.secret)).toBe('wonderland');
    // response key replaced the consumed seed key
    expect(sessionEphemeralKeyFor(session, ECC_URI)?.publicKey).toEqual(
      (session as any)._freshServerPub
    );
    expect(sessionEphemeralKeyFor(session, ECC_URI)?.used).toBe(false);
  });

  it('protects issued tokens through the same ECC branch', async () => {
    const client = makeEccClient(UserTokenType.IssuedToken);
    const session = new ClientSession(client);
    session.serverCertificate = eccFixtureCertDer('P-256');
    session.serverNonce = new Uint8Array(32).map((_, i) => i);
    const seedServer = await generateEphemeralKeyPair('P-256');
    storeSessionEphemeralKey(session, {
      policyUri: ECC_URI,
      publicKey: await exportEphemeralPublicKey(seedServer.publicKey, 'P-256'),
      used: false,
    });

    const requests: any[] = [];
    vi.spyOn(session, 'performMessageTransaction').mockImplementation(
      (request: any, callback: any) => {
        requests.push(request);
        callback(null, respondWithEphemeralKey(new Uint8Array(64).fill(9)));
      }
    );

    const tokenData = new TextEncoder().encode('issued-token-bytes');
    const err: Error | null = await new Promise((resolve) =>
      (client as any)._activateSession(
        session,
        { userIdentityInfo: { tokenData } },
        (e: Error | null) => resolve(e)
      )
    );
    expect(err).toBeNull();
    expect(requests).toHaveLength(1);
    const token = requests[0].userIdentityToken;
    expect(token.tokenData).toBeInstanceOf(Uint8Array);
    expect(token.encryptionAlgorithm).toBe('http://www.w3.org/2001/04/xmlenc#ecdh-es');
    const opened = await unprotectEccSecret(token.tokenData, {
      params: EccNistP256_Params,
      receiverPrivateKey: seedServer.privateKey,
    });
    expect(opened.secret).toEqual(tokenData);
  });

  it('surfaces token protection failures through the activation callback', async () => {
    const client = makeEccClient();
    const session = new ClientSession(client);
    session.serverCertificate = eccFixtureCertDer('P-256');
    session.serverNonce = new Uint8Array(32);
    // no session ephemeral key seeded -> ECC branch must reject via callback
    const err: Error | null = await new Promise((resolve) =>
      (client as any)._activateSession(
        session,
        { userIdentityInfo: { userName: 'alice', password: 'wonderland' } },
        (e: Error | null) => resolve(e)
      )
    );
    expect(err).toBeInstanceOf(Error);
    expect(err?.message).toMatch(/EphemeralKey/);
  });
});
