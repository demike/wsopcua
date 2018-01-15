import { ClassFile } from './ClassFile';
export declare class SchemaParser {
    static readonly TAG_TYPE_DICT: string;
    static readonly TAG_ENUM_TYPE: string;
    static readonly TAG_STRUCT_TYPE: string;
    static readonly OUTPUT_PATH: string;
    protected curCls: ClassFile;
    constructor();
    parse(path: string): void;
    parseElement(el: HTMLElement): void;
    parseTypeDict(el: HTMLElement): void;
    parseStruct(el: HTMLElement): void;
    parseEnum(el: HTMLElement): void;
    writeToFile(path: string, cls: ClassFile): void;
    parseComplexType(): void;
}
