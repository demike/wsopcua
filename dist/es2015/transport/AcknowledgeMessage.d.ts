import * as ec from "../basic-types";
import { BaseUAObject } from '../factory/factories_baseobject';
import { DataStream } from "../basic-types/DataStream";
import { UInt32 } from "../basic-types";
/**
 *
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
export declare class AcknowledgeMessage extends BaseUAObject {
    protocolVersion: UInt32;
    receiveBufferSize: UInt32;
    sendBufferSize: UInt32;
    maxMessageSize: UInt32;
    maxChunkCount: UInt32;
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
