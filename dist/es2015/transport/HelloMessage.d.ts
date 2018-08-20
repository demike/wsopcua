/**
 * @module opcua.address_space.types
 */
import * as ec from "../basic-types";
import { BaseUAObject } from "../factory/factories_baseobject";
import { DataStream } from "../basic-types/DataStream";
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
export declare class HelloMessage extends BaseUAObject {
    endpointUrl: string;
    maxChunkCount: number;
    maxMessageSize: number;
    sendBufferSize: number;
    receiveBufferSize: number;
    protocolVersion: number;
    constructor(options: any);
    static encodingDefaultBinary: ec.ExpandedNodeId;
    /**
     * encode the object into a binary stream
     * @method encode
     *
     * @param stream {BinaryStream}
     */
    encode(stream: DataStream): void;
    /**
     * decode the object from a binary stream
     * @method decode
     *
     * @param stream {BinaryStream}
     * @param [option] {object}
     */
    decode(stream: DataStream): void;
    clone(target: any): BaseUAObject;
}
