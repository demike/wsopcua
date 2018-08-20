import { ClassMethod } from './SchemaParser.module';
export declare abstract class XSDClassFile {
    name: string;
    baseClass: string | null;
    fileHeader: string;
    imports: string[];
    documentation: string;
    classHeader: string;
    members: string[];
    methods: ClassMethod[];
    static readonly ATTR_NAME: string;
    static readonly ATTR_VALUE: string;
    static readonly ATTR_BASE_CLASS: string;
    static readonly TAG_DOC: string;
    readonly Name: string;
    el: HTMLElement;
    constructor(el: HTMLElement);
    parse(): void;
    /**
     *
     * @returns element found
     */
    protected createChildElement(el: HTMLElement): boolean;
    protected abstract createMethods(): void;
    toString(): string;
}
