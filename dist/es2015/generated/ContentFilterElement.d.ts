import { FilterOperator } from './FilterOperator';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IContentFilterElement {
    filterOperator?: FilterOperator;
    filterOperands?: ec.ExtensionObject[];
}
/**

*/
export declare class ContentFilterElement {
    filterOperator: FilterOperator;
    filterOperands: ec.ExtensionObject[];
    constructor(options?: IContentFilterElement);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ContentFilterElement): ContentFilterElement;
}
export declare function decodeContentFilterElement(inp: DataStream): ContentFilterElement;
