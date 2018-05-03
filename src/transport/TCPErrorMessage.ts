// --------- This code has been automatically generated !!! 2018-02-08T10:26:02.529Z
"use strict";
/**
 * @module opcua.address_space.types
 */
import {assert} from "../assert";

import * as _  from "underscore";

import {makeNodeId} from "../nodeid/nodeid";

import {_defaultTypeMap} from "../factory/factories_builtin_types";
import * as ec from "../basic-types";

import {makeExpandedNodeId} from "../nodeid/expanded_nodeid";

import {_enumerations} from "../factory/factories_enumerations";

import {BaseUAObject} from '../factory/factories_baseobject';

import {register_class_definition} from '../factory/factories_factories';
import { DataStream } from "../basic-types/DataStream";
import { UInt32 } from "../basic-types";
import { StatusCode,encodeStatusCode,decodeStatusCode} from "../basic-types/";

var encodeArray = ec.encodeArray;
var decodeArray = ec.decodeArray;
var encode_StatusCode = encode_StatusCode;
var decode_StatusCode = decode_StatusCode;
var encode_String = ec.encodeString;
var decode_String = ec.decodeString;

import {generate_new_id} from "../factory";

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
    reason: string;
    statusCode: StatusCode;
constructor(options?)
{
    super()
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

public static encodingDefaultBinary = makeExpandedNodeId(generate_new_id());

/**
 * encode the object into a binary stream
 * @method encode
 *
 * @param stream {DataStream} 
 */
public encode(stream : DataStream) {
    encode_StatusCode(this.statusCode,stream);
    encode_String(this.reason,stream);
};
/**
 * decode the object from a binary stream
 * @method decode
 *
 * @param stream {BinaryStream} 
 * @param [option] {object} 
 */
public decode(stream : DataStream) {
    this.statusCode = decode_StatusCode(stream);
    this.reason = decode_String(stream);
};

public clone(target: any): BaseUAObject {
    throw new Error("Method not implemented.");
}

}

register_class_definition("TCPErrorMessage",TCPErrorMessage);
