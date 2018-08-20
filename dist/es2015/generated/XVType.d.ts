import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IXVType {
    x?: ec.Double;
    value?: ec.Float;
}
/**

*/
export declare class XVType {
    x: ec.Double;
    value: ec.Float;
    constructor(options?: IXVType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: XVType): XVType;
}
export declare function decodeXVType(inp: DataStream): XVType;
