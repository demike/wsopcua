'use strict';
/**
 * @module opcua.address_space.types
 */

import {BinaryStreamSizeCalculator, DataStream} from '../basic-types/DataStream';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';



export interface IEncodable {
    encode(stream: DataStream|BinaryStreamSizeCalculator): void;
    decode(stream: DataStream): void;
    toJSON(): any;
    fromJSON(json: any): void;
    encodingDefaultBinary?: ExpandedNodeId;
}

export interface IEncodableConstructor {
    new(options?:any): IEncodable;
}

export abstract class BaseUAObject implements IEncodable {

/**
 * Encode the object to the binary stream.
 * @class BaseUAObject
 * @method encode
 * @param stream {BinaryStream}
 * @param options {BinaryStream}
 */
public abstract encode(stream: DataStream|BinaryStreamSizeCalculator): void;

/**
 * Decode the object from the binary stream.
 * @class BaseUAObject
 * @method decode
 * @param stream {BinaryStream}
 * @param options {Object}
 */
public abstract decode(stream: DataStream): void;

public abstract toJSON(): any;
public abstract fromJSON(json: any): void;

/**
 * Calculate the required size to store this object in a binary stream.
 * @method binaryStoreSize
 * @return {Number}
 */
binaryStoreSize(): number {

    const stream = new BinaryStreamSizeCalculator();
    this.encode(stream);
    return stream.length;
}

/**
 * @method toString
 * @return {String}
 */
toString(): string {
    return JSON.stringify(this);
}


/**
 *
 * verify that all object attributes values are valid according to schema
 * @method isValid
 * @return {boolean}
 */
isValid(): boolean {
    // TODO implement me
    return true;
}

public abstract clone(target: any): BaseUAObject;

}
