import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IQualifiedName {
    namespaceIndex?: ec.UInt16;
    name?: string;
}
/**
A string qualified with a namespace index.
*/
export declare class QualifiedName {
    namespaceIndex: ec.UInt16;
    name: string;
    constructor(options?: IQualifiedName);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: QualifiedName): QualifiedName;
}
export declare function decodeQualifiedName(inp: DataStream): QualifiedName;
