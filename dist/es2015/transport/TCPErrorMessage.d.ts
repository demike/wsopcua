/**
 * @module opcua.address_space.types
 */
import * as ec from "../basic-types";
import { BaseUAObject } from '../factory/factories_baseobject';
import { DataStream } from "../basic-types/DataStream";
import { StatusCode } from "../basic-types/";
/**
 *
 * @class TCPErrorMessage
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.statusCode] {StatusCode}
 * @param  [options.reason] {String}
 */
export declare class TCPErrorMessage extends BaseUAObject {
    reason: string;
    statusCode: StatusCode;
    constructor(options?: any);
    static encodingDefaultBinary: ec.ExpandedNodeId;
    /**
     * encode the object into a binary stream
     * @method encode
     *
     * @param stream {DataStream}
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
