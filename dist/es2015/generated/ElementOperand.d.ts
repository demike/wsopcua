import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
import { FilterOperand } from './FilterOperand';
export interface IElementOperand {
    index?: ec.UInt32;
}
/**

*/
export declare class ElementOperand extends FilterOperand {
    index: ec.UInt32;
    constructor(options?: IElementOperand);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ElementOperand): ElementOperand;
}
export declare function decodeElementOperand(inp: DataStream): ElementOperand;
