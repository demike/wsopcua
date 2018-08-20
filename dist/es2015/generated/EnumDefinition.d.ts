import { EnumField } from './EnumField';
import { DataStream } from '../basic-types/DataStream';
export interface IEnumDefinition {
    fields?: EnumField[];
}
/**

*/
export declare class EnumDefinition {
    fields: EnumField[];
    constructor(options?: IEnumDefinition);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EnumDefinition): EnumDefinition;
}
export declare function decodeEnumDefinition(inp: DataStream): EnumDefinition;
