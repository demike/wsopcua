export declare var _enumerations: {};
/**
 * @method registerEnumeration
 * @param schema
 * @param schema.name { string}
 * @param schema.enumValues [{key:Name, value:values}]
 * @param schema.encode
 * @param schema.decode
 * @param schema.typedEnum
 * @param schema.defaultValue
 * @return {Enum}
 */
export declare function registerEnumeration(name: string, enumeration: any, encode: Function, decode: Function, coerce?: Function): any;
export declare function hasEnumeration(enumerationName: string): boolean;
export declare function getEnumeration(enumerationName: string): any;
