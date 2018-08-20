/**
 * @module opcua.address_space.types
 */
import * as ec from '../basic-types';
import { DataStream } from "../basic-types/DataStream";
import { UInt32 } from "../basic-types";
import { BaseUAObject } from '../factory/factories_baseobject';
export interface ISequenceHeader {
    requestId?: any;
    sequenceNumber?: UInt32;
}
/**
 *
 * @class SequenceHeader
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.sequenceNumber] {UInt32}
 * @param  [options.requestId] {UInt32}
 */
export declare class SequenceHeader extends BaseUAObject {
    static encodingDefaultBinary: ec.ExpandedNodeId;
    requestId: any;
    sequenceNumber: UInt32;
    constructor(options?: ISequenceHeader);
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
    clone(target?: SequenceHeader): BaseUAObject;
}
