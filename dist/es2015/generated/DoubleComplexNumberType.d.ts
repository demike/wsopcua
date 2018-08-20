import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IDoubleComplexNumberType {
    real?: ec.Double;
    imaginary?: ec.Double;
}
/**

*/
export declare class DoubleComplexNumberType {
    real: ec.Double;
    imaginary: ec.Double;
    constructor(options?: IDoubleComplexNumberType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DoubleComplexNumberType): DoubleComplexNumberType;
}
export declare function decodeDoubleComplexNumberType(inp: DataStream): DoubleComplexNumberType;
