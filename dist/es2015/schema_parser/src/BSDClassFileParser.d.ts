import { ClassFile } from './SchemaParser.module';
export declare abstract class BSDClassFileParser {
    static readonly ATTR_BASE_CLASS: string;
    static readonly TAG_DOC: string;
    static readonly TAG_FIELD: string;
    static readonly ATTR_SWITCH_TYPE: string;
    static readonly ATTR_SWITCH_VALUE: string;
    static readonly ATTR_TYPE_NAME: string;
    static readonly ATTR_LENGTH_FIELD: string;
    protected el: HTMLElement;
    protected cls: ClassFile;
    readonly Cls: ClassFile;
    constructor(el: HTMLElement, cls: ClassFile);
    parse(): void;
    /**
     *
     * @returns element found
     */
    protected createChildElement(el: HTMLElement): boolean;
    protected createDefines(): void;
    createMethods(): void;
    protected createConstructor(): void;
    protected createEncodeMethod(): void;
    protected createDecodeMethod(): void;
    protected createCloneMethod(): void;
    protected createImports(): void;
    protected createImport(cls: ClassFile | null, importInterface?: boolean, importDecodeMethod?: boolean): void;
}
