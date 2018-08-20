// --------- This code has been automatically generated !!! 2018-02-08T10:26:02.544Z
"use strict";
/**
 * @module opcua.address_space.types
 */
import * as ec from "../basic-types";
import { makeExpandedNodeId } from "../nodeid/expanded_nodeid";
import { generate_new_id } from "../factory";
import { BaseUAObject } from "../factory/factories_baseobject";
import { register_class_definition } from "../factory/factories_factories";
var encodeArray = ec.encodeArray;
var decodeArray = ec.decodeArray;
var encode_UInt32 = ec.encodeUInt32;
var decode_UInt32 = ec.decodeUInt32;
var encode_UAString = ec.encodeString;
var decode_UAString = ec.decodeString;
/**
 *
 * @class HelloMessage
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.protocolVersion] {UInt32} The latest version of the OPC UA TCP protocol supported by the Client
 * @param  [options.receiveBufferSize] {UInt32} The largest message that the sender can receive.
 * @param  [options.sendBufferSize] {UInt32} The largest message that the sender will send.
 * @param  [options.maxMessageSize] {UInt32} The maximum size for any response message.
 * @param  [options.maxChunkCount] {UInt32} The maximum number of chunks in any response message
 * @param  [options.endpointUrl] {UAString} The URL of the Endpoint which the Client wished to connect to.
 */
export class HelloMessage extends BaseUAObject {
    constructor(options) {
        super();
        options = options || {};
        /**
          * The latest version of the OPC UA TCP protocol supported by the Client
          * @property protocolVersion
          * @type {UInt32}
          */
        this.protocolVersion = options.protocolVersion;
        /**
          * The largest message that the sender can receive.
          * @property receiveBufferSize
          * @type {UInt32}
          */
        this.receiveBufferSize = options.receiveBufferSize;
        /**
          * The largest message that the sender will send.
          * @property sendBufferSize
          * @type {UInt32}
          */
        this.sendBufferSize = options.sendBufferSize;
        /**
          * The maximum size for any response message.
          * @property maxMessageSize
          * @type {UInt32}
          */
        this.maxMessageSize = options.maxMessageSize;
        /**
          * The maximum number of chunks in any response message
          * @property maxChunkCount
          * @type {UInt32}
          */
        this.maxChunkCount = options.maxChunkCount;
        /**
          * The URL of the Endpoint which the Client wished to connect to.
          * @property endpointUrl
          * @type {UAString}
          */
        this.endpointUrl = options.endpointUrl;
        // Object.preventExtensions(self);
    }
    /**
     * encode the object into a binary stream
     * @method encode
     *
     * @param stream {BinaryStream}
     */
    encode(stream) {
        encode_UInt32(this.protocolVersion, stream);
        encode_UInt32(this.receiveBufferSize, stream);
        encode_UInt32(this.sendBufferSize, stream);
        encode_UInt32(this.maxMessageSize, stream);
        encode_UInt32(this.maxChunkCount, stream);
        encode_UAString(this.endpointUrl, stream);
    }
    ;
    /**
     * decode the object from a binary stream
     * @method decode
     *
     * @param stream {BinaryStream}
     * @param [option] {object}
     */
    decode(stream) {
        // call base class implementation first
        this.protocolVersion = decode_UInt32(stream);
        this.receiveBufferSize = decode_UInt32(stream);
        this.sendBufferSize = decode_UInt32(stream);
        this.maxMessageSize = decode_UInt32(stream);
        this.maxChunkCount = decode_UInt32(stream);
        this.endpointUrl = decode_UAString(stream);
    }
    ;
    clone(target) {
        throw new Error("Method not implemented.");
    }
}
HelloMessage.encodingDefaultBinary = makeExpandedNodeId(generate_new_id());
register_class_definition("HelloMessage", HelloMessage, makeExpandedNodeId(generate_new_id()));
//# sourceMappingURL=HelloMessage.js.map