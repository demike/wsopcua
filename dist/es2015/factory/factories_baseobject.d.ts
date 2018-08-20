/**
 * @module opcua.address_space.types
 */
import { BinaryStreamSizeCalculator, DataStream } from '../basic-types/DataStream';
export declare abstract class BaseUAObject {
    /**
     * Encode the object to the binary stream.
     * @class BaseUAObject
     * @method encode
     * @param stream {BinaryStream}
     * @param options {BinaryStream}
     */
    abstract encode(stream: DataStream | BinaryStreamSizeCalculator): any;
    /**
     * Decode the object from the binary stream.
     * @class BaseUAObject
     * @method decode
     * @param stream {BinaryStream}
     * @param options {Object}
     */
    abstract decode(stream: DataStream): any;
    /**
     * Calculate the required size to store this object in a binary stream.
     * @method binaryStoreSize
     * @return {Number}
     */
    binaryStoreSize(): number;
    /**
     * @method toString
     * @return {String}
     */
    toString(): string;
    /**
     *
     * verify that all object attributes values are valid according to schema
     * @method isValid
     * @return {boolean}
     */
    isValid(): boolean;
    toJSON(): string;
    abstract clone(target: any): BaseUAObject;
}
