/*import {ClassFile} from './ClassFile'
import { ClassMember } from './ClassMember';
*/
import { ClassFile } from './SchemaParser.module';
export class ClassMethod {
    constructor(visibility, returnType, name, args, doc, body) {
        this.returnType = null;
        this.arguments = null;
        this.visibility = visibility;
        if (name) {
            this.name = name;
        }
        else {
            this.name = "undefined";
        }
        if (returnType) {
            this.returnType = (returnType instanceof ClassFile) ? returnType : ClassFile.getTypeByName(returnType);
        }
        if (args) {
            this.arguments = args;
        }
        this.documentation = doc;
        this.body = body;
    }
    get Arguments() {
        return this.arguments;
    }
    get Name() {
        return this.name;
    }
    get ReturnType() {
        return this.returnType;
    }
    get Documentation() {
        return this.documentation || "";
    }
    set Documentation(doc) {
        this.documentation = doc;
    }
    toString() {
        let str = "";
        if (this.documentation) {
            str += "/**\n" + this.documentation + "\n*/\n\n";
        }
        let header = this.getHeader();
        str += header;
        if (this.body) {
            str += " { \n" + this.body + "\n\t}\n\n";
        }
        else if (header) {
            str += "{};\n";
        }
        return str;
    }
    getHeader(args) {
        if (!this.name) {
            return "";
        }
        let header = "";
        if (this.visibility) {
            header += this.visibility + " ";
        }
        header += this.name + "(";
        if (this.arguments) {
            header += this.arguments.join(", ");
        }
        header += ")";
        if (this.returnType) {
            header += " : " + this.returnType.Name;
        }
        return header;
    }
    call(parent, args) {
        if (!this.name) {
            return "";
        }
        let call = "";
        if (parent) {
            call += parent + ".";
        }
        call += this.name + "(";
        if (args) {
            call += args;
        }
        call += ")";
    }
}
ClassMethod.DE_SERIALIZER_METHOD_PLACEHOLDER = "//<DeSerializerMethods>";
ClassMethod.INDENT = "\t\t\t";
//# sourceMappingURL=ClassMethod.js.map