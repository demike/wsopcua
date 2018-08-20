import { DataStream } from '../basic-types/DataStream';
export interface ILocalizedText {
    locale?: string;
    text?: string;
}
/**
A string qualified with a namespace index.
*/
export declare class LocalizedText {
    locale: string;
    text: string;
    constructor(options?: ILocalizedText);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: LocalizedText): LocalizedText;
}
export declare function decodeLocalizedText(inp: DataStream): LocalizedText;
