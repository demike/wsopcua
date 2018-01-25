import {ClassMethod} from './ClassMethod';
import {ClassMember} from './ClassMember';
import {TypeRegistry} from './TypeRegistry';
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
    protected baseClass : ClassFile;
    protected fileHeader : string;
    protected imports : Set<string>;
    protected documentation : string;
    protected classHeader : string;
    protected members : ClassMember[];
    protected methods : ClassMethod[];
    protected utilityFunctions : ClassMethod[];
    protected path : string;
    protected importAs? : string;

    public static readonly ATTR_NAME = "name";
    public static readonly ATTR_VALUE = "value";
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

    public get BaseClass() : ClassFile {
        return this.baseClass;
    }

    public set BaseClass(cls : ClassFile) {
           this.baseClass = cls;
    }

    public setBaseClassByName(cls : string) {
        this.baseClass = TypeRegistry.getType(cls);
    }

    constructor(name? : string, baseClass? : string|ClassFile , members? : ClassFile[], methods? : ClassMethod[]) {
        this.imports = new Set();
        this.members = [];
        this.methods = [];
        this.name = "";
        this.fileHeader = "";
        this.documentation = "";
        this.classHeader = "";
        this.utilityFunctions = [];
    }

    public toString() : string {
        let str : string = "";
        str += this.fileHeader;
        str += "\n\n";
        for (let im in this.imports) {
            str += im;
            str += "\n\n";
        }
        str += this.documentation;
        str += "\n\n";
        str += this.classHeader;
        str += " {\n ";
        for (let mem in this.members) {
            str += "\t" + mem.toString() + "\n";
        }
        str += "\n";
        for (let met in this.methods) {
            str += "\t" + met.toString() + "\n\n";
        }
        str += "}"

        for(let uf in this.utilityFunctions) {
            str += "\n\n" + uf.toString();
        }
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
    }

    protected createImport( cls : ClassFile|null) {
        if (!cls) {
            return;
        }
        if (cls.Path != this.Path ) {

            this.imports.add("import {" + cls.Name + "} from '" + cls.Path + "';")
        }
    }

    public removeAllMethods() : void {
        this.methods = [];
    }

    public addMethod(m : ClassMethod) : void {
        this.methods.push(m);
    }

    public createMethods(): void {
        this.createEncodeMethod();
        this.createDecodeMethod();
    }

    protected  createEncodeMethod() : void {};
    protected  createDecodeMethod() : void {};

}