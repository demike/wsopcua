import { JSDOM } from 'jsdom';
import { BSDClassFileParser } from './SchemaParser.module';
import { ClassFile } from './ClassFile';
export declare class BSDSchemaParser {
    static readonly TAG_TYPE_DICT: string;
    static readonly TAG_ENUM_TYPE: string;
    static readonly TAG_STRUCT_TYPE: string;
    clsIncompleteTypes: BSDClassFileParser[];
    protected outPath?: string;
    protected inPath?: string;
    protected metaTypeMap: {
        [key: string]: {
            [key: string]: string[];
        };
    };
    protected namespace: string;
    constructor();
    parse(inpath: string, outpath: string, metaTypeMap: {
        [key: string]: {
            [key: string]: string[];
        };
    }, namespace: string): void;
    parseBSDElement(el: HTMLElement): void;
    parseBSDTypeDict(el: HTMLElement): void;
    parseBSDStruct(el: HTMLElement): void;
    parseBSDEnum(el: HTMLElement): void;
    writeToFile(path: string, cls: ClassFile): void;
    insertIntoFile(path: string, cls: ClassFile): void;
    protected parseSecondPass(): void;
    protected fixSchemaFaults(doc: JSDOM): void;
    protected writeFiles(): void;
    parseComplexType(): void;
}
