/*import {ClassMethod} from './ClassMethod';
import {ClassMember} from './ClassMember';
import {TypeRegistry} from './TypeRegistry';
*/
import {ClassMember, ClassMethod, TypeRegistry} from './SchemaParser.module';

export declare class Set< Value > {
	add( value : Value ) : Set< Value >
	clear() : void
	delete( value : Value ) : boolean
	forEach< Context = any >( handler : ( this : Context , value : Value , key : Value , map : Set< Value > ) => void , context? : Context ) : void
	has( value : Value ) : boolean
	size : number
}


export class ClassFile {
    protected name : string;
    protected baseClass? : ClassFile|null = null;
    protected fileHeader : string;
    protected imports : Set<string>;
    protected defines : string;
    protected documentation : string;
    protected classHeader : string;
    protected members : ClassMember[];
    protected methods : ClassMethod[];
    protected utilityFunctions : ClassMethod[];
    protected path? : string;
    protected importAs? : string;

    protected complete : boolean = false;
    protected written : boolean = false;

    public static readonly ATTR_NAME = "Name";
    public static readonly ATTR_VALUE = "Value";
    public static readonly ATTR_ARRAY_LENGTH = "Length"
    public static readonly ATTR_BASE_CLASS = "BaseType";
    public static readonly IO_TYPE = "DataStream";

    public static readonly DEFAULT_ENCODE_METHOD = "encode";
    public static readonly DEFAULT_DECODE_METHOD = "decode";

    public set Name(n : string) {
        this.name = n;
    }

    public get Name() : string {
        return this.name;
    }

    public get Path() : string {
        if (!this.path) {
            this.path = "./" + this.Name;
        }
        return this.path;
    }

    public set Path(p : string ) {
        this.path = p;
    }

    public get Written() {
        return this.written;
    }

    public set Written(w : boolean) {
        this.written = w;
    }

    public get BaseClass() : ClassFile |null | undefined {
        return this.baseClass;
    }

    public set BaseClass(cls : ClassFile|null|undefined) {
           this.baseClass = cls;
    }

    public setBaseClassByName(cls : string) {
        this.baseClass = TypeRegistry.getType(cls);
    }

    public get Documentation() : string {
        return this.documentation;
    }

    public set Documentation(doc : string) {
        this.documentation = doc;
    }

    public get Complete() : boolean {
        return this.complete;
    }

    public set Complete(c : boolean) {
        this.complete = c;
    }

    public get ImportAs() : string|undefined{
        return this.importAs;
    }

    public set ImportAs(name : string|undefined) {
        this.importAs = name;
    }

    public get Defines() : string {
        return this.defines;
    }

    public set Defines(def : string) {
        this.defines = def;
    }

    public get Members() {
        return this.members;
    }

    public get Methods() {
        return this.methods;
    }

    public get UtilityFunctions() {
        return this.utilityFunctions;
    }

    constructor(name? : string, baseClass? : string|ClassFile , members? : ClassMember[], methods? : ClassMethod[]) {
        this.imports = new Set();
        this.members = (members)?members:[];
        this.methods = (methods)?methods:[];
        
        this.name = (name)?name:"";
        this.fileHeader = "";
        this.documentation = "";
        this.classHeader = "";
        this.utilityFunctions = [];
        this.defines = "";
    }

    public getMemberByName(name : string) : ClassMember | null{
        for (let mem of this.members) {
            if (mem.Name == name) {
                return mem;
            }
        }
        return null;
    }

    public removeMember(name : string) : ClassMember | null {

        let ii;
        let mem = null;
        name = name.charAt(0).toLowerCase() + name.slice(1);
        for (ii=0;ii < this.members.length; ii++) {
            mem = this.members[ii];
            if (mem.Name == name) {
                this.members.splice(ii,1);
                break;
            } else {
                mem = null;
            }
        }
        return mem;
    }


    protected getClassHeader() : string {
        let str = "export class " + this.name;
        if (this.baseClass) {
            str += " extends " + this.baseClass.Name;
        }
        return str;
    }

    public toString() : string {
        let str : string = "";
        str += this.fileHeader;
        str += "\n\n";
        this.imports.forEach((im) => {
            str += im;
            str += "\n";            
        })
        /*
        for (let im in this.imports) {
            str += im;
            str += "\n\n";
        }
        */
        if(this.defines) {
            str += "\n" + this.defines + "\n";
        }

        str += "/**\n" + this.documentation + "\n*/";
        str += "\n\n";
        str += this.getClassHeader();
        str += " {\n ";
        for (let mem of this.members) {
            str += "\t" + mem.toString() + ";\n";
        }
        str += "\n";
        for (let met of this.methods) {
            str += "\t" + met.toString() + "\n";
        }
        str += "}"

        for(let uf of this.utilityFunctions) {
            str += "\nexport function " + uf.toString() + "\n";
        }

        str += "\n" + this.getFactoryCode();
        return str;
    }

    public getMethodByName( name : string) : ClassMethod|null {
        for (let m of this.methods) {
            if (m.Name == name) {
                return m;
            }
        }
        
        for(let m of this.utilityFunctions) {
            if (m.Name == name) {
                return m;
            }
        }
        return null;

    }

    public getEncodeMethod() : ClassMethod|null { return this.getMethodByName(ClassFile.DEFAULT_ENCODE_METHOD); }
    public getDecodeMethod() : ClassMethod|null { return this.getMethodByName(ClassFile.DEFAULT_DECODE_METHOD); }

    public static getTypeByName(typeName : string) : ClassFile {
        let i = typeName.indexOf(':');
        if (i > 0) {
            typeName = typeName.substr(i+1);
        }
        return TypeRegistry.getType(typeName);
    }

    public removeAllMethods() : void {
        this.methods = [];
    }

    public addMethod(m : ClassMethod) : void {
        this.methods.push(m);
    }


    protected getFactoryCode() : string {
        let str = "import {register_class_definition} from \"../factory/factories_factories\";\n";
        str += "register_class_definition(\"" + this.name + "\"," + this.name + ");";
        return str;
    }

    public addMemberVariable(m : ClassMember) {
        this.members.push(m);
    }


    public removeAllMembers() : void {
        this.members = [];
    }

    public addUtilityFunction(f : ClassMethod) {
        this.utilityFunctions.push(f);
    }

    public removeAllUtilityFunctions() {
        this.utilityFunctions = [];
    }

    /**
     * return the code to import this class
     */
    public getImportSrc() : string {
        if (this.importAs) {
            return "import * as " + this.importAs + " from '" + this.Path + "';";       
        }
        return "import {" + this.Name + "} from '" + this.Path + "';";
    }
    

    public getInterfaceImportSrc() : string|null {
        if (this.importAs) {
            return null;
        }
        return "import {I" + this.Name + "} from '" + this.Path + "';"
    }

    public getDecodeFnImportSrc() : string|null {
        if (this.importAs) {
            return null;
        }

        return "import {decode" + this.Name + "} from '" + this.Path + "';"
    }

    public addImport(imp : string) {
        this.imports.add(imp);
    }

    public removeAllImports() {
        this.imports.clear();
    }

}