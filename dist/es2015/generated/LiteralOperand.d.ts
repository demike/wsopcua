import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
import { FilterOperand } from './FilterOperand';
export interface ILiteralOperand {
    value?: Variant;
}
/**

*/
export declare class LiteralOperand extends FilterOperand {
    value: Variant;
    constructor(options?: ILiteralOperand);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: LiteralOperand): LiteralOperand;
}
export declare function decodeLiteralOperand(inp: DataStream): LiteralOperand;
