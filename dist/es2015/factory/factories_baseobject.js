"use strict";
/**
 * @module opcua.address_space.types
 */
import { BinaryStreamSizeCalculator } from '../basic-types/DataStream';
export class BaseUAObject {
    /**
     * Calculate the required size to store this object in a binary stream.
     * @method binaryStoreSize
     * @return {Number}
     */
    binaryStoreSize() {
        var stream = new BinaryStreamSizeCalculator();
        this.encode(stream);
        return stream.length;
    }
    ;
    /**
     * @method toString
     * @return {String}
     */
    toString() {
        return this.toJSON();
    }
    ;
    /**
     *
     * verify that all object attributes values are valid according to schema
     * @method isValid
     * @return {boolean}
     */
    isValid() {
        //TODO implement me
        return true;
    }
    ;
    toJSON() {
        return JSON.stringify(this);
    }
}
//# sourceMappingURL=factories_baseobject.js.map