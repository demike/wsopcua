// --------- This code has been automatically generated !!! 2018-02-08T10:26:02.529Z
"use strict";
/**
 * @module opcua.address_space.types
 */
import * as ec from "../basic-types";
import { makeExpandedNodeId } from "../nodeid/expanded_nodeid";
import { BaseUAObject } from '../factory/factories_baseobject';
import { register_class_definition } from '../factory/factories_factories';
import { encodeStatusCode, decodeStatusCode } from "../basic-types/";
var encodeArray = ec.encodeArray;
var decodeArray = ec.decodeArray;
var encode_StatusCode = encodeStatusCode;
var decode_StatusCode = decodeStatusCode;
var encode_String = ec.encodeString;
var decode_String = ec.decodeString;
import { generate_new_id } from "../factory";
/**
 *
 * @class TCPErrorMessage
 * @constructor
 * @extends BaseUAObject
 * @param  options {Object}
 * @param  [options.statusCode] {StatusCode}
 * @param  [options.reason] {String}
 */
export class TCPErrorMessage extends BaseUAObject {
    constructor(options) {
        super();
        options = options || {};
        /**
          *
          * @property statusCode
          * @type {StatusCode}
          */
        this.statusCode = options.statusCode;
        /**
          *
          * @property reason
          * @type {String}
          */
        this.reason = options.reason;
        // Object.preventExtensions(self);
    }
    /**
     * encode the object into a binary stream
     * @method encode
     *
     * @param stream {DataStream}
     */
    encode(stream) {
        encode_StatusCode(this.statusCode, stream);
        encode_String(this.reason, stream);
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
        this.statusCode = decode_StatusCode(stream);
        this.reason = decode_String(stream);
    }
    ;
    clone(target) {
        throw new Error("Method not implemented.");
    }
}
TCPErrorMessage.encodingDefaultBinary = makeExpandedNodeId(generate_new_id());
register_class_definition("TCPErrorMessage", TCPErrorMessage, makeExpandedNodeId(generate_new_id()));
//# sourceMappingURL=TCPErrorMessage.js.map