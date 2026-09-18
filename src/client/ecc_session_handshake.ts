/**
 * ECC session handshake helpers — OPC 10000-6 §6.8.2.
 *
 * When a SecureChannel uses an ECC (or RSA-DH) SecurityPolicy, CreateSession
 * and ActivateSession carry an extra ECDH handshake in the AdditionalHeader:
 * the Client advertises the ECDHPolicyUri it plans to use for UserIdentityToken
 * secrets, and the Server answers with a fresh EphemeralKey (EphemeralKeyType)
 * that the Client must use for its EccEncryptedSecret (§6.8.3).
 *
 * AdditionalHeader key names come from Part 6 Table 70:
 * ECDHPolicyUri (request direction), ECDHKey (response direction).
 */

import { QualifiedName } from '../generated/QualifiedName';
import { KeyValuePair } from '../generated/KeyValuePair';
import { AdditionalParametersType } from '../generated/AdditionalParametersType';
import { EphemeralKeyType } from '../generated/EphemeralKeyType';
import { Variant } from '../variant/variant';
import { DataType } from '../variant/DataTypeEnum';
import { ExtensionObject } from '../basic-types/extension_object';
import { SecurityPolicy, fromURI, getCryptoFactory } from '../secure-channel/security_policy';
import {
  EccNistP256_Params,
  EccNistP384_Params,
  exportEphemeralPublicKey,
  generateEphemeralKeyPair,
  protectEccSecret,
} from '../crypto';
import type { ClientSession } from './client_session';

export const ECDH_POLICY_URI_KEY = 'ECDHPolicyUri';
export const ECDH_KEY_KEY = 'ECDHKey';

export interface SessionEphemeralKey {
  /** The ECDHPolicyUri this key was issued for. */
  policyUri: string;
  /** Server ephemeral x||y public key (zero-padded big-endian). */
  publicKey: Uint8Array;
  /** Set once consumed by an EccEncryptedSecret (servers reject reuse). */
  used: boolean;
}

/** Request direction: advertise the ECDHPolicyUri for upcoming user tokens. */
export function buildEcdhPolicyUriHeader(policyUri: string): AdditionalParametersType {
  return new AdditionalParametersType({
    parameters: [
      new KeyValuePair({
        key: new QualifiedName({ name: ECDH_POLICY_URI_KEY }),
        value: new Variant({ dataType: DataType.String, value: policyUri }),
      }),
    ],
  });
}

function keyNameOf(pair: KeyValuePair): string | undefined {
  const key = (pair as { key?: { name?: unknown } })?.key;
  return typeof key?.name === 'string' ? key.name : undefined;
}

function variantBodyOf(pair: KeyValuePair): unknown {
  return (pair as { value?: { value?: unknown } })?.value?.value;
}

/**
 * Response direction: extract the server EphemeralKey from an AdditionalHeader.
 * Accepts a decoded AdditionalParametersType (as produced by
 * decodeExtensionObject) and tolerates unknown entries.
 */
export function parseEccSessionEphemeralKey(
  additionalHeader: ExtensionObject | undefined | null,
  fallbackPolicyUri?: string
): SessionEphemeralKey | undefined {
  if (!additionalHeader || !(additionalHeader instanceof AdditionalParametersType)) {
    return undefined;
  }
  let policyUri = fallbackPolicyUri;
  let publicKey: Uint8Array | undefined;
  for (const pair of additionalHeader.parameters ?? []) {
    const name = keyNameOf(pair);
    if (name === ECDH_POLICY_URI_KEY && typeof variantBodyOf(pair) === 'string') {
      policyUri = variantBodyOf(pair) as string;
    } else if (name === ECDH_KEY_KEY) {
      const body = variantBodyOf(pair);
      const key = body instanceof EphemeralKeyType ? body : (body as { publicKey?: unknown });
      if (key && key.publicKey instanceof Uint8Array && key.publicKey.byteLength > 0) {
        publicKey = new Uint8Array(key.publicKey);
      }
    }
  }
  if (!policyUri || !publicKey) {
    return undefined;
  }
  return { policyUri, publicKey, used: false };
}

/** Latest server ephemeral key for a policy URI, once stored on the session. */
export function sessionEphemeralKeyFor(
  session: ClientSession,
  policyUri: string
): SessionEphemeralKey | undefined {
  return session.serverEccEphemeralKeys?.[policyUri];
}

/**
 * Record a freshly received server EphemeralKey on the session, replacing any
 * previous (possibly consumed) key for the same policy URI.
 */
export function storeSessionEphemeralKey(
  session: ClientSession,
  key: SessionEphemeralKey
): void {
  session.serverEccEphemeralKeys = session.serverEccEphemeralKeys ?? {};
  session.serverEccEphemeralKeys[key.policyUri] = key;
}

export interface EccTokenContext {
  factory: Exclude<ReturnType<typeof getCryptoFactory>, null>;
  params: typeof EccNistP256_Params;
  /** ECDHPolicyUri: token policy URI, falling back to the channel policy. */
  policyUri: string;
}

function secureChannelPolicyOf(session: ClientSession): SecurityPolicy | undefined {
  return (session as unknown as { _client?: { _secureChannel?: { securityPolicy?: SecurityPolicy } } })
    ?._client?._secureChannel?.securityPolicy;
}

/** Resolve ECC token context when the *token* policy is ECC, else undefined. */
export function eccTokenContextFor(
  session: ClientSession,
  tokenPolicyUri: string | undefined
): EccTokenContext | undefined {
  let securityPolicy = tokenPolicyUri ? fromURI(tokenPolicyUri) : SecurityPolicy.Invalid;
  if (securityPolicy === SecurityPolicy.Invalid) {
    const channelPolicy = secureChannelPolicyOf(session);
    if (!channelPolicy) {
      return undefined;
    }
    securityPolicy = channelPolicy;
  }
  const factory = getCryptoFactory(securityPolicy);
  if (!factory?.eccCurve) {
    return undefined;
  }
  return {
    factory,
    params: factory.eccCurve === 'P-384' ? EccNistP384_Params : EccNistP256_Params,
    policyUri: tokenPolicyUri || securityPolicy,
  };
}

export interface ClientIdentityForSigning {
  getPrivateKey(): { getSignKey(h: string, a?: string): Promise<CryptoKey> } | undefined;
  getCertificateChain(): Uint8Array | undefined;
  getCertificate(): Uint8Array | undefined;
}

/**
 * Build an EccEncryptedSecret-protected secret for a UserIdentityToken
 * (Part 6 §6.8.3): fresh sender ephemeral key + the latest server session
 * ephemeral key, signed with the client application key.
 */
export async function protectEccUserTokenSecret(
  session: ClientSession,
  client: ClientIdentityForSigning | null | undefined,
  ctx: EccTokenContext,
  secret: Uint8Array
): Promise<{ envelope: Uint8Array; policyUri: string; encryptionAlgorithm: string }> {
  const receiver = sessionEphemeralKeyFor(session, ctx.policyUri);
  if (!receiver) {
    throw new Error(
      `ECC UserTokenPolicy ${ctx.policyUri} requires a server EphemeralKey from the ` +
        `CreateSession/ActivateSession AdditionalHeader, but none was received`
    );
  }
  if (receiver.publicKey.byteLength !== ctx.params.nonceLength) {
    throw new Error(
      `Server EphemeralKey length ${receiver.publicKey.byteLength} does not match ${ctx.params.curve}`
    );
  }
  const privateKey = client?.getPrivateKey?.();
  if (!privateKey) {
    throw new Error('ECC user token requires a client private key for the ECDSA signature');
  }
  const signatureUri =
    ctx.params.curve === 'P-384'
      ? 'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha384'
      : 'http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256';
  const sender = await generateEphemeralKeyPair(ctx.params.curve);
  const envelope = await protectEccSecret({
    params: ctx.params,
    policyUri: ctx.policyUri,
    secret,
    nonce: session.serverNonce || new Uint8Array(0),
    senderPrivateKey: sender.privateKey,
    senderPublicKey: await exportEphemeralPublicKey(sender.publicKey, ctx.params.curve),
    receiverPublicKey: receiver.publicKey,
    signingPrivateKey: await privateKey.getSignKey(ctx.params.hash, signatureUri),
    signingCertificate: client?.getCertificateChain?.() ?? client?.getCertificate?.() ?? undefined,
  });
  // Servers reject EphemeralKey reuse after a successful activation.
  receiver.used = true;
  return { envelope, policyUri: ctx.policyUri, encryptionAlgorithm: ctx.factory.asymmetricEncryptionAlgorithm };
}
