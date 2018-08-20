import { ContentFilterElement } from './ContentFilterElement';
import { DataStream } from '../basic-types/DataStream';
export interface IContentFilter {
    elements?: ContentFilterElement[];
}
/**

*/
export declare class ContentFilter {
    elements: ContentFilterElement[];
    constructor(options?: IContentFilter);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ContentFilter): ContentFilter;
}
export declare function decodeContentFilter(inp: DataStream): ContentFilter;
