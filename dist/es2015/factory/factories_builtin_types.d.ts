export declare var minDate: Date;
export interface ITypeSchema {
    name: string;
    encode: Function;
    decode: Function;
    coerce?: Function;
}
/**
 * @class TypeSchema
 * @param options {Object}
 * @constructor
 * create a new type Schema
 */
export declare class TypeSchema implements ITypeSchema {
    name: string;
    encode: Function;
    decode: Function;
    coerce?: Function;
    protected defaultValue: any;
    constructor(options: ITypeSchema | any);
    /**
     * @method  computer_default_value
     * @param defaultValue {*} the default value
     * @return {*}
     */
    computer_default_value(defaultValue: any): any;
    /**
     * @method initialize_value
     * @param value
     * @param defaultValue
     * @return {*}
     */
    initialize_value(value: any, defaultValue: any): any;
}
/**
 * @method registerType
 * @param schema {TypeSchema}
 */
export declare function registerType<T extends ITypeSchema>(schema: T): void;
export declare function unregisterType(typeName: string): void;
/**
 * @method findSimpleType
 * @param name
 * @return {TypeSchema|null}
 */
export declare function findSimpleType(name: string): any;
export declare var _defaultTypeMap: {};
/**
 * @method findBuiltInType
 * find the Builtin Type that this
 * @param datatypeName
 * @return {*}
 */
export declare function findBuiltInType(datatypeName: any): any;
