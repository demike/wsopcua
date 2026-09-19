/**
 * Minimal ECC SecurityPolicy server peer for loopback interop tests.
 *
 * This is NOT a full OPC UA server: it speaks just enough of the
 * SecureChannel layer to complete a real two-party handshake with
 * ClientSecureChannelLayer over the wire format (real chunk bytes in both
 * directions, independent key derivation on each side):
 * - OPN: verifies the client ECDSA signature via the production
 *   MessageBuilder, agrees ECDH from the client ephemeral nonce, answers
 *   with a sign-only OPN chunk carrying a fresh server ephemeral nonce.
 * - MSG: decodes GetEndpointsRequest with a production MessageBuilder fed
 *   the agreed keys, answers GetEndpointsResponse symmetrically secured.
 *
 * Renewals are supported: both sides retain the IKM and XOR-link it, so the
 * test can assert byte-equal derived keys after Issue AND after Renew.
 */

import { MessageBuilder } from '../../message_builder';
import { MessageChunker } from '../../message_chunker';
import {
  AsymmetricAlgorithmSecurityHeader,
  SecurityTokenRequestType,
} from '../../../service-secure-channel';
import { MessageSecurityMode } from '../../../generated/MessageSecurityMode';
import { ChannelSecurityToken } from '../../../generated/ChannelSecurityToken';
import { OpenSecureChannelRequest } from '../../../generated/OpenSecureChannelRequest';
import { OpenSecureChannelResponse } from '../../../generated/OpenSecureChannelResponse';
import { GetEndpointsRequest } from '../../../generated/GetEndpointsRequest';
import { GetEndpointsResponse } from '../../../generated/GetEndpointsResponse';
import { ResponseHeader } from '../../../generated/ResponseHeader';
import { EndpointDescription } from '../../../generated/EndpointDescription';
import { StatusCodes } from '../../../constants/raw_status_codes';
import { PrivateKey } from '../../../crypto/common';
import {
  EccCurve,
  EccPolicyParams,
  computeEccChannelKeys,
  deriveSharedSecretIKM,
  exportEphemeralPublicKey,
  generateEphemeralKeyPair,
  importEphemeralPublicKey,
  xorIkmsForRenewal,
} from '../../../crypto/ecc';
import {
  SecurityPolicy,
  getCryptoFactory,
  getOptionsForSymmetricSignAndEncrypt,
} from '../../security_policy';

export interface MockEccServerOptions {
  curve: EccCurve;
  params: EccPolicyParams;
  securityPolicy: SecurityPolicy;
  serverCertificate: Uint8Array;
  serverPrivateKey: PrivateKey;
  channelId?: number;
}

interface EccChannelKeys {
  clientKeys: { signingKey: Uint8Array; encryptingKey: Uint8Array; initializationVector: Uint8Array };
  serverKeys: { signingKey: Uint8Array; encryptingKey: Uint8Array; initializationVector: Uint8Array };
}

export class MockEccServer {
  readonly curve: EccCurve;
  readonly params: EccPolicyParams;
  readonly factory: Exclude<ReturnType<typeof getCryptoFactory>, null>;
  readonly channelId: number;

  private readonly builder = new MessageBuilder({ securityMode: MessageSecurityMode.SignAndEncrypt });
  private readonly chunker = new MessageChunker({
    securityHeader: new AsymmetricAlgorithmSecurityHeader({ securityPolicyUri: '' }),
  });

  private serverEphemeral?: CryptoKeyPair;
  private ikm?: Uint8Array;
  channelKeys?: EccChannelKeys;
  tokenId = 0;
  receivedRequests: { message: unknown; msgType: string; requestId: number }[] = [];

  constructor(private readonly options: MockEccServerOptions) {
    this.curve = options.curve;
    this.params = options.params;
    const factory = getCryptoFactory(options.securityPolicy);
    if (!factory?.eccCurve) {
      throw new Error('MockEccServer requires an ECC SecurityPolicy');
    }
    this.factory = factory;
    this.channelId = options.channelId ?? 4242;
    this.builder.on('message', (message: unknown, msgType: string, requestId: number) => {
      this.receivedRequests.push({ message, msgType, requestId });
    });
  }

  private waitForMessage(): Promise<{ message: any; msgType: string; requestId: number }> {
    const seen = this.receivedRequests.length;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('MockEccServer timed out waiting for a message')), 5000);
      const poll = () => {
        if (this.receivedRequests.length > seen) {
          clearTimeout(timer);
          resolve(this.receivedRequests[this.receivedRequests.length - 1]);
        } else {
          setTimeout(poll, 0);
        }
      };
      poll();
    });
  }

  /** Feed one wire chunk; resolves with the server's response chunks. */
  async handleWireChunk(chunk: Uint8Array): Promise<Uint8Array[]> {
    const pending = this.waitForMessage();
    this.builder.feed(new DataView(chunk.buffer, chunk.byteOffset, chunk.byteLength));
    const { message, msgType, requestId } = await pending;
    if (msgType === 'OPN' && message instanceof OpenSecureChannelRequest) {
      return [await this.answerOpenSecureChannel(message, requestId)];
    }
    if (msgType === 'MSG' && message instanceof GetEndpointsRequest) {
      return [await this.answerGetEndpoints(message, requestId)];
    }
    throw new Error(`MockEccServer cannot handle ${msgType}/${(message as object)?.constructor?.name}`);
  }

  private async collectChunks(
    msgType: string,
    options: Record<string, unknown>,
    message: { encode(o: unknown): void } & Record<string, unknown>
  ): Promise<Uint8Array[]> {
    const chunks: Uint8Array[] = [];
    await this.chunker.chunkSecureMessage(
      msgType,
      options as never,
      message as never,
      (chunk: ArrayBufferLike | ArrayBufferView | null) => {
        if (chunk) {
          const view = ArrayBuffer.isView(chunk)
            ? (chunk as Uint8Array)
            : new Uint8Array(chunk as ArrayBuffer);
          chunks.push(new Uint8Array(view));
        }
      }
    );
    return chunks;
  }

  private async answerOpenSecureChannel(
    request: OpenSecureChannelRequest,
    requestId: number
  ): Promise<Uint8Array> {
    const isRenew = request.requestType === SecurityTokenRequestType.Renew;
    // fresh server ephemeral per handshake (Issue and Renew alike)
    const serverEphemeral = await generateEphemeralKeyPair(this.curve);
    const serverNonce = await exportEphemeralPublicKey(serverEphemeral.publicKey, this.curve);
    const clientNonce = request.clientNonce;
    if (!(clientNonce instanceof Uint8Array)) {
      throw new Error('MockEccServer: OPN request has no client nonce');
    }
    const freshIkm = await deriveSharedSecretIKM(
      serverEphemeral.privateKey,
      await importEphemeralPublicKey(clientNonce, this.curve),
      this.curve
    );
    const ikm = isRenew && this.ikm ? xorIkmsForRenewal(this.ikm, freshIkm) : freshIkm;
    this.serverEphemeral = serverEphemeral;
    this.ikm = ikm;
    this.channelKeys = await computeEccChannelKeys(clientNonce, serverNonce, ikm, this.params);

    this.tokenId += 1;
    const response = new OpenSecureChannelResponse({
      responseHeader: new ResponseHeader({ requestHandle: request.requestHeader.requestHandle }),
      serverProtocolVersion: 0,
      securityToken: new ChannelSecurityToken({
        channelId: this.channelId,
        tokenId: this.tokenId,
        createdAt: new Date(),
        revisedLifetime: 30000,
      }),
      serverNonce,
    });
    // server receive path for subsequent MSG chunks uses the client keys
    (this.builder as any).pushNewToken(
      { tokenId: this.tokenId, channelId: this.channelId },
      toDerivedKeys(this.channelKeys.clientKeys, this.factory, this.params)
    );
    this.chunker.update({
      securityHeader: new AsymmetricAlgorithmSecurityHeader({
        securityPolicyUri: this.factory.securityPolicy,
        senderCertificate: this.options.serverCertificate,
      }),
    });
    const [chunk] = await this.collectChunks(
      'OPN',
      {
        requestId,
        secureChannelId: this.channelId,
        chunkSize: 8192,
        signatureLength: this.params.asymmetricSignatureLength,
        signBufferFunc: (data: Uint8Array) =>
          this.factory.asymmetricSign(data, this.options.serverPrivateKey),
        plainBlockSize: 0,
        cipherBlockSize: 0,
      },
      response as never
    );
    if (!chunk) {
      throw new Error('MockEccServer produced no OPN chunk');
    }
    return chunk;
  }

  private async answerGetEndpoints(
    request: GetEndpointsRequest,
    requestId: number
  ): Promise<Uint8Array> {
    if (!this.channelKeys) {
      throw new Error('MockEccServer has no channel keys (handshake first)');
    }
    const derivedServerKeys = toDerivedKeys(this.channelKeys.serverKeys, this.factory, this.params);
    const response = new GetEndpointsResponse({
      responseHeader: new ResponseHeader({
        serviceResult: StatusCodes.Good,
        requestHandle: request.requestHeader.requestHandle,
      }),
      endpoints: [
        new EndpointDescription({
          endpointUrl: request.endpointUrl,
          securityMode: MessageSecurityMode.SignAndEncrypt,
          securityPolicyUri: this.factory.securityPolicy,
        }),
      ],
    });
    const symmetric = getOptionsForSymmetricSignAndEncrypt(
      MessageSecurityMode.SignAndEncrypt,
      derivedServerKeys
    );
    const [chunk] = await this.collectChunks(
      'MSG',
      {
        ...symmetric,
        requestId,
        secureChannelId: this.channelId,
        tokenId: this.tokenId,
        chunkSize: 8192,
      },
      response as never
    );
    if (!chunk) {
      throw new Error('MockEccServer produced no MSG chunk');
    }
    return chunk;
  }
}

function toDerivedKeys(
  material: { signingKey: Uint8Array; encryptingKey: Uint8Array; initializationVector: Uint8Array },
  factory: { signatureLength: number; symmetricEncryptionAlgorithm: string; sha1or256: 'SHA-1' | 'SHA-256' | 'SHA-384' },
  params: EccPolicyParams
) {
  return {
    signatureLength: factory.signatureLength,
    signingKeyLength: params.derivedSignatureKeyLength,
    encryptingKeyLength: params.derivedEncryptionKeyLength,
    encryptingBlockSize: params.encryptingBlockSize,
    algorithm: factory.symmetricEncryptionAlgorithm,
    sha1or256: factory.sha1or256,
    signingKey: material.signingKey.slice().buffer,
    encryptingKey: material.encryptingKey.slice().buffer,
    initializationVector: material.initializationVector.slice().buffer,
  };
}
