import { DataStream } from '../basic-types/DataStream';
import { EnumValueType } from './EnumValueType';
import { IEnumValueType } from './EnumValueType';
export interface IEnumField extends IEnumValueType {
    name?: string;
}
/**

*/
export declare class EnumField extends EnumValueType {
    name: string;
    constructor(options?: IEnumField);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EnumField): EnumField;
}
export declare function decodeEnumField(inp: DataStream): EnumField;
