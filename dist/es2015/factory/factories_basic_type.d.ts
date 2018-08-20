/**
 * register a Basic Type ,
 * A basic type is new entity type that resolved to  a SubType
 * @example:
 *
 *
 *   registerBasicType({name:"Duration"   ,subtype:"Double"});
 *
 * @method registerBasicType
 * @param schema
 * @param schema.name {String}
 * @param schema.subtype {String} mandatory, the basic type from which the new type derives.
 *
 * @param [schema.encode] {Function} optional,a specific encoder function to encode an instance of this type.
 * @param schema.encode.value  {*}
 * @param schema.encode.stream {Stream}
 *
 * @param [schema.decode] {Function} optional,a specific decoder function that returns  the decode value out of the stream.
 * @param [schema.decode.stream] {Stream}
 *
 * @param [schema.coerce] {Function} optional, a method to convert a value into the request type.
 * @param schema.coerce.value {*} the value to coerce.
 *
 * @param [schema.random] {Function} optional, a method to construct a random object of this type
 *
 * @param [schema.toJSONFunc]{Function} optional, a method to convert a value into the request type.
 */
export declare function registerBasicType(schema: any): void;
