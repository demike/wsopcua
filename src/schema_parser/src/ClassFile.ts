export abstract class ClassFile {
    fileHeader : string;
    imports : string[];
    documentation : string;
    classHeader : string;
    members : string[];
    methods : ClassMethod[];

    el : HTMLElement;
    constructor(el : HTMLElement) {
        this.el = el;
    }

    public abstract parse() : void;

    public toString() : string {
        let str : string = "";
        str += this.fileHeader;
        str += "\n\n";
        str += this.imports;
        str += "\n\n";
        str += this.documentation;
        str += "\n\n";
        str += this.classHeader;
        str += " {\n ";
        for (let met in this.methods) {
            str += met.toString() + "\n";
        }
        str += "\n\n";
        str += "}"
        return str;
    }
}

export class ClassMethod {
    header : string;
    documentation : string;
    body : string;

    public toString() : string {
        let str : string = this.documentation;
        str += "\n\n";
        this.header;
        str += "\n";
        str += this.body + "\n";
        return str;
    }
}
