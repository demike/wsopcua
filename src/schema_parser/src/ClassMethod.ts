/*import {ClassFile} from './ClassFile'
import { ClassMember } from './ClassMember';
*/
import {ClassMember, ClassFile} from './SchemaParser.module';

export class ClassMethod {
    public static readonly DE_SERIALIZER_METHOD_PLACEHOLDER = "//<DeSerializerMethods>";
    public static readonly INDENT = "\t\t\t";
    protected visibility? : string|null; //public protected ""
    protected name : string;
    protected returnType : ClassFile|null = null;
    protected arguments : ClassMember[]|null = null;

    protected documentation? : string|null;
    protected body? : string|null;

    constructor(visibility?: string|null,returnType?: string|ClassFile|null, name? : string|null, args? : ClassMember[]|null, doc? : string|null, body? : string|null  ) {
        this.visibility = visibility;
        if (name) {
            this.name = name;
        } else {
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

    public get Arguments() : ClassMember[]|null {
        return this.arguments;
    }

    public get Name() : string {
        return this.name;
    }

    public get ReturnType() : ClassFile|null {
        return this.returnType;
    }
    
    public get Documentation() : string {
        return this.documentation || "";
    }

    public set Documentation(doc : string) {
        this.documentation = doc;
    }

    public toString() : string {
        let str = "";
        if(this.documentation) {
            str += "/**\n" + this.documentation + "\n*/\n\n"
        }
      
        let header = this.getHeader();
        str += header;
        if (this.body) {
            str += " { \n" + this.body + "\n\t}\n\n";
        } else if(header) {
            str += "{};\n";
        }
        return str;
    }

    public getHeader(args ?: string) : string {
        if (!this.name) {
            return "";
        }
        let header = "";
        if (this.visibility) {
            header += this.visibility + " ";
        }
      
        header += this.name + "(";
        if(this.arguments) {
            header += this.arguments.join(", ");
        }
        header += ")";
        if (this.returnType) {
            header += ": " + this.returnType.Name;
        }
        return header;
    }

    public call(parent? : string,args? : string) {
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