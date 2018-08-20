import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
import { DataStream } from '../basic-types/DataStream';
export interface IEnumValueType {
    value?: ec.Int64;
    displayName?: LocalizedText;
    description?: LocalizedText;
}
/**
A mapping between a value of an enumerated type and a name and description.
*/
export declare class EnumValueType {
    value: ec.Int64;
    displayName: LocalizedText;
    description: LocalizedText;
    constructor(options?: IEnumValueType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EnumValueType): EnumValueType;
}
export declare function decodeEnumValueType(inp: DataStream): EnumValueType;
