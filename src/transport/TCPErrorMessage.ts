// --------- This code has been automatically generated !!! 2018-02-08T10:26:02.529Z
'use strict';
/**
 * @module opcua.address_space.types
 */

import * as ec from '../basic-types';


import {makeExpandedNodeId} from '../nodeid/expanded_nodeid';

import {BaseUAObject} from '../factory/factories_baseobject';

import {register_class_definition} from '../factory/factories_factories';
import { DataStream } from '../basic-types/DataStream';
import { UInt32, jsonDecodeStatusCode, jsonEncodeStatusCode } from '../basic-types';
import { StatusCode, encodeStatusCode, decodeStatusCode} from '../basic-types/';

const encode_StatusCode = encodeStatusCode;
const decode_StatusCode = decodeStatusCode;
const encode_String = ec.encodeString;
const decode_String = ec.decodeString;

import {generate_new_id} from '../factory';
import { StatusCodes } from '../constants';

export interface ITCPErrorMessage {
    reason?: string;
    statusCode?: StatusCode;
}

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
constructor(options?: ITCPErrorMessage) {
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
public encode(stream: DataStream) {
    encode_StatusCode(this.statusCode, stream);
    encode_String(this.reason, stream);
}
/**
 * decode the object from a binary stream
 * @method decode
 *
 * @param stream {BinaryStream}
 * @param [option] {object}
 */
public decode(stream: DataStream) {
    this.statusCode = decode_StatusCode(stream);
    this.reason = decode_String(stream);
}

public toJSON() {
    const out: any = {};
    out.StatusCode = jsonEncodeStatusCode(this.statusCode);
    out.Reason = this.reason;
}

public fromJSON(json: any) {
    const out: any = {};
    this.statusCode =  jsonDecodeStatusCode(json.StatusCode);
    this.reason = json.Reason;
}

public clone(target: any): BaseUAObject {
    throw new Error('Method not implemented.');

}

public static encodingDefaultBinary = makeExpandedNodeId(generate_new_id());
    reason: string;
    statusCode: StatusCode;

}

register_class_definition('TCPErrorMessage', TCPErrorMessage, makeExpandedNodeId(generate_new_id()));
