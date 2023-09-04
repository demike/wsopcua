'use strict';

import { assert } from '../assert';
import { SecurityPolicy, ICryptoFactory } from '../secure-channel/security_policy';
import * as ec from '../basic-types';
import * as securityPolicy_m from './security_policy';

import { MessageBuilderBase } from '../transport/message_builder_base';
import { MessageSecurityMode } from '../generated/MessageSecurityMode';

import {
  AsymmetricAlgorithmSecurityHeader,
  SequenceHeader,
  SymmetricAlgorithmSecurityHeader,
} from '../service-secure-channel';
import { chooseSecurityHeader } from './secure_message_chunk_manager';

const decodeString = ec.decodeString;

import { analyseExtensionObject } from '../packet-analyzer';

import { doDebug, debugLog, hexDump } from '../common/debug';
import { DataStream } from '../basic-types/DataStream';

import * as factory from '../factory';
import * as crypto_utils from '../crypto';
import { ChannelSecurityToken } from '../generated/ChannelSecurityToken';
import { DerivedKeys, PrivateKey } from '../crypto';
import { isPromise } from '../basic-types/utils';

const decodeStatusCode = ec.decodeStatusCode;

export const doTraceChunk = false;

export class MessageBuilder extends MessageBuilderBase {
  protected _tokenStack: {
    securityToken: ChannelSecurityToken;
    derivedKeys: crypto_utils.DerivedKeys;
  }[];
  protected _privateKey: PrivateKey | null;
  protected _cryptoFactory: ICryptoFactory | null;
  protected _securityHeader: AsymmetricAlgorithmSecurityHeader | SymmetricAlgorithmSecurityHeader;
  protected _previous_sequenceNumber: number;
  protected _objectFactory: any;
  public securityMode: any;
  protected _securityPolicy: SecurityPolicy;
  /**
   * @class MessageBuilder
   * @extends MessageBuilderBase
   * @constructor
   *
   * @param options
   * @param options.securityMode {MessageSecurityMode} the security Mode
   * @param [options.objectFactory=factories] a object that provides a constructObject(id) method
   */
  constructor(options?: any) {
    options = options || {};
    super(options);

    this._securityPolicy = SecurityPolicy.Invalid; // not known yet
    this.securityMode = options.securityMode || MessageSecurityMode.Invalid; // not known yet

    this._objectFactory = options.objectFactory || factory;

    assert(
      'function' === typeof this._objectFactory.constructObject,
      ' the objectFactory must provide a constructObject method'
    );

    this._previous_sequenceNumber = -1; // means unknown
    assert(Number.isFinite(this._previous_sequenceNumber));
  }

  set privateKey(key: PrivateKey | null) {
    this._privateKey = key;
  }

  get cryptoFactory() {
    return this._cryptoFactory;
  }

  public setSecurity(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy) {
    assert(this.securityMode === MessageSecurityMode.Invalid, 'security already set');
    this._securityPolicy = securityPolicy;
    this.securityMode = securityMode;
    assert(this._securityPolicy !== undefined, 'invalid security policy ' + securityPolicy);
    assert(this.securityMode !== undefined, 'invalid security mode ' + securityMode);
    assert(this._securityPolicy !== SecurityPolicy.Invalid);
    assert(this.securityMode !== MessageSecurityMode.Invalid);
  }

  public dispose() {
    super.dispose();
    // xx this.securityPolicy = undefined;
    // xx this.securityMode = null;
    // xx this.objectFactory = null;
    this._cryptoFactory = null;
    this._securityHeader = undefined;
    this._tokenStack = [];
    this._privateKey = null;
  }

  protected _validateSequenceNumber(sequenceNumber: number) {
    // checking that sequenceNumber is increasing
    assert(Number.isFinite(this._previous_sequenceNumber));
    assert(Number.isFinite(sequenceNumber) && sequenceNumber >= 0);

    let expectedSequenceNumber: number;
    if (this._previous_sequenceNumber !== -1) {
      expectedSequenceNumber = this._previous_sequenceNumber + 1;

      if (expectedSequenceNumber !== sequenceNumber) {
        const errMessage =
          'Invalid Sequence Number found ( expected ' +
          expectedSequenceNumber +
          ', got ' +
          sequenceNumber +
          ')';
        debugLog(errMessage);
        /**
         * notify the observers that a message with an invalid sequence number has been received.
         * @event invalid_sequence_number
         * @param {Number} expected sequence Number
         * @param {Number} actual sequence Number
         */
        this.emit('invalid_sequence_number', expectedSequenceNumber, sequenceNumber);
      }
      // todo : handle the case where sequenceNumber wraps back to < 1024
    }
    /* istanbul ignore next */
    if (doDebug) {
      debugLog(' Sequence Number = ' + sequenceNumber);
    }
    this._previous_sequenceNumber = sequenceNumber;
  }

  /**
   * the open secure channel requests / responses shall always
   * be signed **and** encrypted (if not MessageSecurityMode.None)
   *
   * https://reference.opcfoundation.org/v104/Core/docs/Part4/5.5.2/
   *
   * // TODO: efficient buffer handling
   */
  protected async _decrypt_OPN(binaryStream: DataStream) {
    assert(this._securityPolicy !== SecurityPolicy.None);
    assert(this._securityPolicy !== SecurityPolicy.Invalid);
    assert(this.securityMode !== MessageSecurityMode.None);
    // xx assert(this.securityMode !== MessageSecurityMode.INVALID);

    const asymmetricAlgorithmSecurityHeader = this
      ._securityHeader as AsymmetricAlgorithmSecurityHeader;

    if (doDebug) {
      debugLog('securityHeader', JSON.stringify(this._securityHeader, null, ' '));
    }

    // OpcUA part 2 V 1.02 page 15
    // 4.11 OPC UA Security Related Services
    // [...]
    // The OPC UA Client sends its Public Key in a Digital Certificate and secret information with the
    // OpenSecureChannel service Message to the Server. This Message is secured by applying
    // Asymmetric Encryption with the Server's Public Key and by generating Asymmetric Signatures with
    // the Client's Private Key. However the Digital Certificate is sent unencrypted so that the receiver can
    // use it to verify the Asymmetric Signature.
    // [...]
    //

    if (doDebug) {
      debugLog('EN------------------------------');
      debugLog(hexDump(binaryStream.view));
      debugLog('---------------------- SENDER CERTIFICATE');
      debugLog(hexDump(asymmetricAlgorithmSecurityHeader.senderCertificate));
    }

    if (!this._cryptoFactory) {
      this._report_error(' Security Policy ' + this._securityPolicy + ' is not implemented yet');
      return false;
    }

    // The message has been signed  with sender private key and has been encrypted with receiver public key.
    // We shall decrypt it with the receiver private key.
    const buf = binaryStream.getUint8ArrayWithoutAdvancingPositionPointer();

    if (asymmetricAlgorithmSecurityHeader.receiverCertificateThumbprint) {
      // this mean that the message has been encrypted ....

      assert(this._privateKey, 'expecting valid key');

      const decryptedBuffer = await this._cryptoFactory.asymmetricDecrypt(buf, this._privateKey);

      // replace decrypted buffer in initial buffer#
      buf.set(decryptedBuffer);

      // adjust length
      binaryStream.view = new DataView(
        binaryStream.view.buffer.slice(
          // TODO replace slice by referencing a reagion of the buffer
          binaryStream.view.byteOffset,
          binaryStream.view.byteOffset + binaryStream.pos + decryptedBuffer.length
        )
      );

      if (doDebug) {
        debugLog('DE-----------------------------');
        debugLog(hexDump(binaryStream.view));
        debugLog('-------------------------------');
        debugLog('Certificate :', hexDump(asymmetricAlgorithmSecurityHeader.senderCertificate));
      }
    }

    const cert = await crypto_utils.exploreCertificateInfo(
      asymmetricAlgorithmSecurityHeader.senderCertificate
    );
    // then verify the signature
    const signatureLength = cert.publicKeyLength; // 1024 bits = 128Bytes or 2048=256Bytes
    assert(
      signatureLength === 128 ||
        signatureLength === 256 ||
        signatureLength === 384 ||
        signatureLength === 512
    );

    const chunk = binaryStream.getUint8ArrayWithoutAdvancingPositionPointer(0); // new Uint8Array(binaryStream.view.buffer, binaryStream.view.byteOffset);

    const signatureIsOK = await this._cryptoFactory.asymmetricVerifyChunk(
      chunk,
      asymmetricAlgorithmSecurityHeader.senderCertificate
    );

    if (!signatureIsOK) {
      console.log(hexDump(binaryStream.view));
      this._report_error('SIGN and ENCRYPT asymmetricVerify : Invalid packet signature');
      return false;
    }

    // remove signature
    binaryStream.view = new DataView(
      crypto_utils.reduceLength(binaryStream.view.buffer, signatureLength)
    );

    // remove padding
    if (asymmetricAlgorithmSecurityHeader.receiverCertificateThumbprint) {
      binaryStream.view = new DataView(crypto_utils.removePadding(binaryStream.view.buffer));
    }

    return true; // success
  }

  public pushNewToken(securityToken: ChannelSecurityToken, derivedKeys: DerivedKeys) {
    assert(securityToken.hasOwnProperty('tokenId'));
    // xx assert(derivedKeys ); in fact, can be null

    // TODO: make sure this list doesn't grow indefinitly
    this._tokenStack = this._tokenStack || [];
    assert(
      this._tokenStack.length === 0 ||
        this._tokenStack[0].securityToken.tokenId !== securityToken.tokenId
    );
    this._tokenStack.push({ securityToken: securityToken, derivedKeys: derivedKeys });
  }

  protected _select_matching_token(tokenId: ec.UInt32) {
    let got_new_token = false;
    this._tokenStack = this._tokenStack || [];
    while (this._tokenStack.length) {
      if (this._tokenStack.length === 0) {
        return null; // no token
      }
      if (this._tokenStack[0].securityToken.tokenId === tokenId) {
        if (got_new_token) {
          this.emit('new_token', tokenId);
        }
        return this._tokenStack[0];
      }
      // remove first
      this._tokenStack = this._tokenStack.slice(1);
      got_new_token = true;
    }
  }

  // msg crypt
  protected async _decrypt_MSG(binaryStream: DataStream) {
    assert(this._securityHeader instanceof SymmetricAlgorithmSecurityHeader);
    assert(this.securityMode !== MessageSecurityMode.None);
    assert(this.securityMode !== MessageSecurityMode.Invalid);
    assert(this._securityPolicy !== SecurityPolicy.None);
    assert(this._securityPolicy !== SecurityPolicy.Invalid);

    // Check  security token
    // securityToken may have been renewed
    const securityTokenData = this._select_matching_token(
      (this._securityHeader as SymmetricAlgorithmSecurityHeader).tokenId
    );
    if (!securityTokenData) {
      this._report_error(
        'Security token data for token ' +
          (this._securityHeader as SymmetricAlgorithmSecurityHeader).tokenId +
          " doesn't exist"
      );
      return false;
    }

    assert(securityTokenData.hasOwnProperty('derivedKeys'));

    // SecurityToken may have expired, in this case the MessageBuilder shall reject the message
    if ((securityTokenData.securityToken as any).expired) {
      // !!! TODO: check this expired flag
      this._report_error(
        'Security token has expired : tokenId ' + securityTokenData.securityToken.tokenId
      );
      return false;
    }

    // We shall decrypt it with the receiver private key.
    const buf = binaryStream.getUint8ArrayWithoutAdvancingPositionPointer();
    const derivedKeys = securityTokenData.derivedKeys;

    assert(derivedKeys !== null);
    assert(derivedKeys.signatureLength, ' must provide a signature length');

    if (this.securityMode === MessageSecurityMode.SignAndEncrypt) {
      const decryptedBuffer = await crypto_utils.decryptBufferWithDerivedKeys(buf, derivedKeys);

      // replace decrypted buffer in initial buffer
      buf.set(decryptedBuffer);

      // adjust length
      binaryStream.view = new DataView(
        binaryStream.view.buffer.slice(
          // TODO replace slice by referencing a reagion of the buffer
          binaryStream.view.byteOffset,
          binaryStream.view.byteOffset + binaryStream.pos + decryptedBuffer.length
        )
      );

      if (doDebug) {
        debugLog('DE-----------------------------');
        debugLog(hexDump(binaryStream.view));
        debugLog('-------------------------------');
      }
    }

    // now check signature ....
    const chunk = binaryStream.getUint8ArrayWithoutAdvancingPositionPointer(0);

    const signatureIsOK = crypto_utils.verifyChunkSignatureWithDerivedKeys(chunk, derivedKeys);
    if (!signatureIsOK) {
      this._report_error('SIGN and ENCRYPT : Invalid packet signature');
      return false;
    }

    // remove signature
    binaryStream.view = new DataView(
      crypto_utils.reduceLength(binaryStream.view.buffer, derivedKeys.signatureLength)
    );

    if (this.securityMode === MessageSecurityMode.SignAndEncrypt) {
      // remove padding
      binaryStream.view = new DataView(crypto_utils.removePadding(binaryStream.view.buffer));
    }

    return true;
  }

  protected _decrypt(binaryStream: DataStream) {
    if (this._securityPolicy === SecurityPolicy.Invalid) {
      this._report_error('SecurityPolicy');
      return false;
    }

    const msgType = this.messageHeader.msgType;

    // check if security is active or not
    if (this._securityPolicy === SecurityPolicy.None) {
      this.securityMode = MessageSecurityMode.None;
      assert(
        this.securityMode === MessageSecurityMode.None,
        'expecting securityMode = None when securityPolicy is None'
      );
      return true; // nothing to do
    }
    assert(this.securityMode !== MessageSecurityMode.None);

    if (msgType === 'OPN') {
      return this._decrypt_OPN(binaryStream);
    } else {
      return this._decrypt_MSG(binaryStream);
    }
  }

  /**
   * @method _read_headers
   * @param binaryStream
   * @return {Boolean}
   * @private
   */
  protected async _read_headers(binaryStream: DataStream) {
    if (!this.readHeadersInternal(binaryStream)) {
      return false;
    }

    if (!this.messageHeader) {
      throw new Error('internal error');
    }

    try {
      assert(binaryStream.length === 12);

      const msgType = this.messageHeader.msgType;

      if (msgType === 'HEL' || msgType === 'ACK') {
        this._securityPolicy = SecurityPolicy.None;
      } else if (msgType === 'ERR') {
        // extract Error StatusCode and additional message
        binaryStream.length = 8;
        const errorCode = decodeStatusCode(binaryStream);
        const message = decodeString(binaryStream);
        if (doDebug) {
          console.log(' ERROR RECEIVED FROM SENDER', errorCode.toString(), message);
          console.log(hexDump(binaryStream.view));
        }
        if (doTraceChunk) {
          console.warn(
            `msgType: ${this.messageHeader.msgType}
             nbChunk = ${this.message_chunks.length.toString().padStart(3)}
             totalLength = ${this.total_message_size.toString().padStart(8)}
             l=${this.messageHeader.length.toString().padStart(6)}
             err=${errorCode.toString()}`,
            message
          );
        }
        return true;
      } else {
        this._securityHeader = chooseSecurityHeader(msgType);
        this._securityHeader.decode(binaryStream);

        if (msgType === 'OPN') {
          this._securityPolicy = securityPolicy_m.fromURI(
            (this._securityHeader as AsymmetricAlgorithmSecurityHeader).securityPolicyUri
          );
          this._cryptoFactory = securityPolicy_m.getCryptoFactory(this._securityPolicy);
        }

        let decryptResult = this._decrypt(binaryStream);
        if (isPromise(decryptResult)) {
          decryptResult = await decryptResult;
        }

        if (!decryptResult) {
          return false;
        }

        this.sequenceHeader = new SequenceHeader();
        this.sequenceHeader.decode(binaryStream);

        /* istanbul ignore next */
        if (doDebug) {
          debugLog(' Sequence Header', this.sequenceHeader);
        }

        if (doTraceChunk) {
          console.warn(
            `msgType: ${this.messageHeader.msgType}
             nbChunk = ${this.message_chunks.length.toString().padStart(3)}
             totalLength = ${this.total_message_size.toString().padStart(8)}
             l=${this.messageHeader.length.toString().padStart(6)}
             s=${this.sequenceHeader.sequenceNumber.toString().padEnd(4)}
             r=${this.sequenceHeader.requestId.toString().padEnd(4)}`
          );
        }

        this._validateSequenceNumber(this.sequenceHeader.sequenceNumber);
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  protected _safe_decode_message_body(
    full_message_body: ArrayBuffer,
    objMessage: any /* ExtensionObject*/,
    binaryStream: DataStream
  ) {
    try {
      // de-serialize the object from the binary stream
      const options = this._objectFactory;
      objMessage.decode(binaryStream, options);
    } catch (err) {
      console.log(err);
      console.log((err as Error).stack);
      console.log(hexDump(full_message_body));
      analyseExtensionObject(full_message_body, 0, 0);

      let i = 0;
      console.log(' ---------------- block');
      this.message_chunks.forEach(function (messageChunk) {
        console.log(' ---------------- chunk i=', i++);
        console.log(hexDump(messageChunk));
      });
      return false;
    }
    return true;
  }

  protected _decode_message_body(full_message_body: ArrayBuffer): boolean {
    const binaryStream = new DataStream(full_message_body);
    const msgType = this.messageHeader.msgType;

    if (msgType === 'ERR') {
      // invalid message type
      this._report_error('ERROR RECEIVED');
      return false;
    }
    if (msgType === 'HEL' || msgType === 'ACK') {
      // invalid message type
      this._report_error('Invalid message type ( HEL/ACK )');
      return false;
    }

    // read expandedNodeId:
    const id = ec.decodeExpandedNodeId(binaryStream);

    // construct the object
    const objMessage = this._objectFactory.constructObject(id);

    if (!objMessage) {
      this._report_error('cannot construct object with nodeID ' + id);
      return false;
    } else {
      debugLog('message size =', this.total_message_size, ' body size =', this.total_body_size);

      if (this._safe_decode_message_body(full_message_body, objMessage, binaryStream)) {
        try {
          /**
           * notify the observers that a full message has been received
           * @event message
           * @param {Object} objMessage the decoded message object
           * @param {String} msgType the message type ( "HEL","ACK","OPN","CLO" or "MSG" )
           * @param {Number} the request Id
           */
          this.emit(
            'message',
            objMessage,
            msgType,
            this.sequenceHeader.requestId,
            this.secureChannelId
          );
        } catch (err) {
          // this code catches a uncaught exception somewhere in one of the event handler
          // this indicates a bug in the code that uses this class
          // please check the stack trace to find the problem
          console.log('MessageBuilder : ERROR DETECTED IN event handler');
          console.log(err);
          console.log((err as Error).stack);
        }
      } else {
        const message =
          'cannot decode message  for valid object of type ' +
          id.toString() +
          ' ' +
          objMessage.constructor.name;
        console.log(message);
        this._report_error(message);
        return false;
      }
    }
    return true;
  }
}
