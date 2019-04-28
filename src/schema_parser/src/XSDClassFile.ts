import {ClassMethod} from './SchemaParser.module';

export abstract class XSDClassFile {

    public get Name(): string {
        return this.name;
    }
    constructor(el: HTMLElement) {
        this.el = el;
        this.imports = [];
        this.members = [];
        this.methods = [];
        this.name = '';
        this.fileHeader = '';
        this.documentation = '';
        this.classHeader = '';
        this.baseClass = null;
    }

    public parse(): void {
        let at = this.el.attributes.getNamedItem(XSDClassFile.ATTR_NAME);
        if (at == null) {
            console.log('Error: could not find name attribute');
        }

        at = this.el.attributes.getNamedItem(XSDClassFile.ATTR_BASE_CLASS);
        if (at != null) {
            this.baseClass = at.value;
        }

        for (let i = 0; i <  this.el.childNodes.length; i++) {
            this.createChildElement(<HTMLElement>this.el.childNodes.item(i));
        }
    }

    /**
     *
     * @returns element found
     */
    protected createChildElement(el: HTMLElement): boolean {
        if (el.tagName == XSDClassFile.TAG_DOC) {
            this.documentation = el.textContent || '';
            return true;
        }
        return false;
    }

    protected abstract createMethods(): void;

    public toString(): string {
        let str = '';
        str += this.fileHeader;
        str += '\n\n';
        for (const im of this.imports) {
            str += im;
            str += '\n\n';
        }
        str += this.documentation;
        str += '\n\n';
        str += this.classHeader;
        str += ' {\n ';
        for (const mem of this.members) {
            str += ' ' + mem + '\n';
        }
        str += '\n';
        for (const met of this.methods) {
            str += ' ' + met.toString() + '\n';
        }
        str += '\n\n';
        str += '}';
        return str;
    }

    public static readonly ATTR_NAME = 'name';
    public static readonly ATTR_VALUE = 'value';
    public static readonly ATTR_BASE_CLASS = 'BaseType';
    public static readonly TAG_DOC = 'opc:Documentation';
    name: string;
    baseClass: string|null;
    fileHeader: string;
    imports: string[];
    documentation: string;
    classHeader: string;
    members: string[];
    methods: ClassMethod[];

    el: HTMLElement;
}
