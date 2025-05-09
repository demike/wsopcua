// --------- This code has been automatically generated !!! 2018-02-08T10:26:02.549Z

import * as ec from '../basic-types';

import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';

import { BaseUAObject } from '../factory/factories_baseobject';
import { generate_new_id } from '../factory';

import { register_class_definition } from '../factory/factories_factories';
import { DataStream } from '../basic-types/DataStream';
import { UInt32 } from '../basic-types';

const encode_UInt32 = ec.encodeUInt32;
const decode_UInt32 = ec.decodeUInt32;

export interface IAcknowledgeMessage {
  protocolVersion?: UInt32;
  receiveBufferSize?: UInt32;
  sendBufferSize?: UInt32;
  maxMessageSize?: UInt32;
  maxChunkCount?: UInt32;
}

/**
 * @class AcknowledgeMessage
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.protocolVersion] {UInt32} The latest version of the OPC UA TCP protocol supported by the Server.
 * @param  [options.receiveBufferSize] {UInt32}
 * @param  [options.sendBufferSize] {UInt32}
 * @param  [options.maxMessageSize] {UInt32} The maximum size for any request message.
 * @param  [options.maxChunkCount] {UInt32} The maximum number of chunks in any request message.
 */
export class AcknowledgeMessage extends BaseUAObject {
  constructor(options: IAcknowledgeMessage) {
    super();
    options = options || {};
    /* istanbul ignore next */

    /**
     * The latest version of the OPC UA TCP protocol supported by the Server.
     * @property protocolVersion
     * @type {UInt32}
     */
    this.protocolVersion = options.protocolVersion ?? 0;

    /**
     *
     * @property receiveBufferSize
     * @type {UInt32}
     */
    this.receiveBufferSize = options.receiveBufferSize ?? 0;

    /**
     *
     * @property sendBufferSize
     * @type {UInt32}
     */
    this.sendBufferSize = options.sendBufferSize ?? 0;

    /**
     * The maximum size for any request message.
     * @property maxMessageSize
     * @type {UInt32}
     */
    this.maxMessageSize = options.maxMessageSize ?? 0;

    /**
     * The maximum number of chunks in any request message.
     * @property maxChunkCount
     * @type {UInt32}
     */
    this.maxChunkCount = options.maxChunkCount ?? 0;

    // Object.preventExtensions(self);
  }

  public static encodingDefaultBinary = makeExpandedNodeId(generate_new_id());

  protocolVersion: UInt32;
  receiveBufferSize: UInt32;
  sendBufferSize: UInt32;
  maxMessageSize: UInt32;
  maxChunkCount: UInt32;

  /**
   * encode the object into a binary stream
   * @method encode
   *
   * @param stream {BinaryStream}
   */
  public encode(stream: DataStream) {
    // call base class implementation first

    encode_UInt32(this.protocolVersion, stream);
    encode_UInt32(this.receiveBufferSize, stream);
    encode_UInt32(this.sendBufferSize, stream);
    encode_UInt32(this.maxMessageSize, stream);
    encode_UInt32(this.maxChunkCount, stream);
  }
  /**
   * decode the object from a binary stream
   * @method decode
   *
   * @param stream {BinaryStream}
   * @param [option] {object}
   */
  public decode(stream: DataStream) {
    // call base class implementation first

    this.protocolVersion = decode_UInt32(stream);
    this.receiveBufferSize = decode_UInt32(stream);
    this.sendBufferSize = decode_UInt32(stream);
    this.maxMessageSize = decode_UInt32(stream);
    this.maxChunkCount = decode_UInt32(stream);
  }

  public clone(target: any): BaseUAObject {
    throw new Error('Method not implemented.');
  }

  public toJSON() {
    const out: any = {};
    out.ProtocolVersion = this.protocolVersion;
    out.ReceiveBufferSize = this.receiveBufferSize;
    out.SendBufferSize = this.sendBufferSize;
    out.MaxMessageSize = this.maxMessageSize;
    out.MaxChunkCount = this.maxChunkCount;
    return out;
  }

  public fromJSON(json: any) {
    this.protocolVersion = json.ProtocolVersion;
    this.receiveBufferSize = json.ReceiveBufferSize;
    this.sendBufferSize = json.SendBufferSize;
    this.maxMessageSize = json.MaxMessageSize;
    this.maxChunkCount = json.MaxChunkCount;
  }
}

register_class_definition(
  'AcknowledgeMessage',
  AcknowledgeMessage,
  makeExpandedNodeId(generate_new_id(), 0)
);
