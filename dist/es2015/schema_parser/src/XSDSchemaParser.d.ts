import { XSDClassFile } from './XSDClassFile';
export declare class XSDSchemaParser {
    static readonly TAG_COMPLEX_TYPE: string;
    static readonly TAG_SIMPLE_TYPE: string;
    static readonly TAG_STRUCT_TYPE: string;
    clsFileMap: {
        [key: string]: XSDClassFile;
    };
    protected outPath: string;
    protected inPath: string;
    constructor();
    parse(inpath: string, outpath: string): void;
    parseXSDElement(el: HTMLElement): void;
    parseComplexeType(el: HTMLElement): void;
    writeToFile(path: string, cls: XSDClassFile): void;
    parseComplexType(): void;
}
