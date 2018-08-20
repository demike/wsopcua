// --------- This code has been automatically generated !!! 2018-02-08T10:26:04.257Z
"use strict";
/**
 * @module opcua.address_space.types
 */
import * as ec from '../basic-types';
var encodeArray = ec.encodeArray;
var decodeArray = ec.decodeArray;
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
import { generate_new_id } from '../factory';
import { register_class_definition } from "../factory/factories_factories";
import { BaseUAObject } from '../factory/factories_baseobject';
/**
 *
 * @class SequenceHeader
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.sequenceNumber] {UInt32}
 * @param  [options.requestId] {UInt32}
 */
export class SequenceHeader extends BaseUAObject {
    constructor(options) {
        super();
        options = options || {};
        /**
          *
          * @property sequenceNumber
          * @type {UInt32}
          */
        if (options.sequenceNumber !== undefined) {
            this.sequenceNumber = options.sequenceNumber;
        }
        /**
          *
          * @property requestId
          * @type {UInt32}
          */
        if (options.requestId !== undefined) {
            this.requestId = options.requestId;
        }
        // Object.preventExtensions(self);
    }
    /**
     * encode the object into a binary stream
     * @method encode
     *
     * @param stream {DataStream}
     */
    encode(stream) {
        // call base class implementation first
        ec.encodeUInt32(this.sequenceNumber, stream);
        ec.encodeUInt32(this.requestId, stream);
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
        this.sequenceNumber = ec.decodeUInt32(stream);
        this.requestId = ec.decodeUInt32(stream);
    }
    ;
    clone(target) {
        if (target === undefined) {
            target = new SequenceHeader();
        }
        target.requestId = this.requestId;
        target.sequenceNumber = this.sequenceNumber;
        return target;
    }
}
SequenceHeader.encodingDefaultBinary = makeExpandedNodeId(generate_new_id());
register_class_definition("SequenceHeader", SequenceHeader, makeExpandedNodeId(generate_new_id()));
//# sourceMappingURL=SequenceHeader.js.map