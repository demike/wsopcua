import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IComplexNumberType {
    real?: ec.Float;
    imaginary?: ec.Float;
}
/**

*/
export declare class ComplexNumberType {
    real: ec.Float;
    imaginary: ec.Float;
    constructor(options?: IComplexNumberType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ComplexNumberType): ComplexNumberType;
}
export declare function decodeComplexNumberType(inp: DataStream): ComplexNumberType;
