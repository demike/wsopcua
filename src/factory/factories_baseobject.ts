"use strict";
/**
 * @module opcua.address_space.types
 */

import {BinaryStreamSizeCalculator, DataStream} from '../basic-types/DataStream';

export abstract class BaseUAObject {

/**
 * Encode the object to the binary stream.
 * @class BaseUAObject
 * @method encode
 * @param stream {BinaryStream}
 * @param options {BinaryStream}
 */
public abstract encode(stream : DataStream|BinaryStreamSizeCalculator);

/**
 * Decode the object from the binary stream.
 * @class BaseUAObject
 * @method decode
 * @param stream {BinaryStream}
 * @param options {Object}
 */
public abstract decode(stream : DataStream);

/**
 * Calculate the required size to store this object in a binary stream.
 * @method binaryStoreSize
 * @return {Number}
 */
binaryStoreSize() : number {

    var stream = new BinaryStreamSizeCalculator();
    this.encode(stream);
    return stream.length;
};

/**
 * @method toString
 * @return {String}
 */
toString() : string {
    return this.toJSON();
};


/**
 *
 * verify that all object attributes values are valid according to schema
 * @method isValid
 * @return {boolean}
 */
isValid() : boolean {
    //TODO implement me
    return true;
};



toJSON() : string {
    return JSON.stringify(this);
}


public abstract clone(target : any) : BaseUAObject;

}