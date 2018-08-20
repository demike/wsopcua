import { QualifiedName } from '../generated/QualifiedName';
/**
 * @method stringToQualifiedName
 * @param value {String}
 * @return {{namespaceIndex: Number, name: String}}
 *
 * @example
 *
 *  stringToQualifiedName("Hello")   => {namespaceIndex: 0, name: "Hello"}
 *  stringToQualifiedName("3:Hello") => {namespaceIndex: 3, name: "Hello"}
 */
export declare function stringToQualifiedName(value: any): QualifiedName;
export declare function coerceQualifyName(value: any): QualifiedName;
