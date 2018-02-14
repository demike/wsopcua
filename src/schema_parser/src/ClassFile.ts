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
    protected defines : String;
    protected documentation : string;
    protected classHeader : string;
    protected members : ClassMember[];
    protected methods : ClassMethod[];
    protected utilityFunctions : ClassMethod[];
    protected path? : string;
    protected importAs? : string;

    protected complete : boolean = false;

    public static readonly ATTR_NAME = "Name";
    public static readonly ATTR_VALUE = "Value";
    public static readonly ATTR_ARRAY_LENGTH = "Length"
    public static readonly ATTR_BASE_CLASS = "BaseType";
    public static readonly IO_TYPE = "DataStream";

    public static readonly DEFAULT_ENCODE_METHOD = "encode";
    public static readonly DEFAULT_DECODE_METHOD = "decode";


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

    public get ImportAs() : string|undefined{
        return this.importAs;
    }

    public set ImportAs(name : string|undefined) {
        this.importAs = name;
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
            str += "\n\n" + uf.toString();
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

    protected createImports() : void {
        this.imports.clear();
        //iterate over members, ignore self
        for(let mem of this.members) {
            this.createImport(mem.Type);
        }
        //iterate over methods, ignore self
        for(let met of this.methods) {
            if (met.Name == "constructor") {
                continue;
            }
            let args = met.Arguments || [];
            for (let arg of args) {
                this.createImport(arg.Type);
            }
            this.createImport(met.ReturnType); 
        }
        //iterate over functions, ignore self
        for(let fn of this.utilityFunctions) {
            let args = fn.Arguments || [];
            for (let arg of args) {
                this.createImport(arg.Type);
            }
            this.createImport(fn.ReturnType);
        }

        //add the base class to the imports
        if( this.baseClass) {
            this.createImport(this.baseClass,true)
        }
    }

    protected createImport( cls : ClassFile|null,importInterface:boolean = false) {
        if (!cls) {
            return;
        }
        if (cls.Path != this.Path ) {
            this.imports.add(cls.getImportSrc());
            if (importInterface) {
                let str = cls.getInterfaceImportSrc();
                if (str) {
                    this.imports.add(str);
                }
            }
        }
    }

    public removeAllMethods() : void {
        this.methods = [];
    }

    public addMethod(m : ClassMethod) : void {
        this.methods.push(m);
    }

    public createMethods(): void {
        this.createConstructor();
        this.createEncodeMethod();
        this.createDecodeMethod();
        this.createCloneMethod();
    }

    protected  createConstructor() : void {};
    protected  createEncodeMethod() : void {};
    protected  createDecodeMethod() : void {};
    protected  createCloneMethod() : void {};

    protected getFactoryCode() : string {
        let str = "import {register_class_definition} from \"../factory/factories_factories\";\n";
        str += "register_class_definition(\"" + this.name + "\"," + this.name + ");";
        return str;
    }

    protected removeAllMembers() : void {
        this.members = [];
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


}