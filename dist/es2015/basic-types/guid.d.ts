import { DataStream } from "./DataStream";
export declare type Guid = string;
/**
 * @method isValidGuid
 *
 * A valid Guid
 *   XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX
 * @param guid {String}
 * @return {Boolean} return true if the string is a valid GUID.
 */
export declare function isValidGuid(guid: string): Boolean;
export declare var emptyGuid: string;
export declare function randomGuid(): string;
export declare function encodeGuid(guid: string, stream: DataStream): void;
export declare function decodeGuid(stream: DataStream): string;
