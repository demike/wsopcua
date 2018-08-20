/*import {ClassMethod} from './ClassMethod';
import {ClassMember} from './ClassMember';
import {TypeRegistry} from './TypeRegistry';
*/
import { TypeRegistry, SimpleType } from './SchemaParser.module';
export class ClassFile {
    constructor(name, baseClass, members, methods) {
        this.baseClass = null;
        this.complete = false;
        this.written = false;
        this.imports = new Set();
        this.members = (members) ? members : [];
        this.methods = (methods) ? methods : [];
        this.name = (name) ? name : "";
        this.fileHeader = "";
        this.documentation = "";
        this.classHeader = "";
        this.utilityFunctions = [];
        this.defines = "";
        this.id = "-1";
        this.namespace = "";
    }
    set Name(n) {
        this.name = n;
    }
    get Name() {
        return this.name;
    }
    /*
    return the full name including potential import as
    i.e: ec.ExtensionObject
    */
    get FullName() {
        if (!this.importAs) {
            return this.name;
        }
        return this.importAs + "." + this.name;
    }
    get Path() {
        if (!this.path) {
            this.path = "./" + this.Name;
        }
        return this.path;
    }
    set Path(p) {
        this.path = p;
    }
    get Written() {
        return this.written;
    }
    set Written(w) {
        this.written = w;
    }
    get BaseClass() {
        return this.baseClass;
    }
    set BaseClass(cls) {
        this.baseClass = cls;
    }
    setBaseClassByName(cls) {
        this.baseClass = TypeRegistry.getType(cls);
    }
    get Documentation() {
        return this.documentation;
    }
    set Documentation(doc) {
        this.documentation = doc;
    }
    get Complete() {
        return this.complete;
    }
    set Complete(c) {
        this.complete = c;
    }
    get ImportAs() {
        return this.importAs;
    }
    set ImportAs(name) {
        this.importAs = name;
    }
    get Defines() {
        return this.defines;
    }
    set Defines(def) {
        this.defines = def;
    }
    get Members() {
        return this.members;
    }
    get Methods() {
        return this.methods;
    }
    get UtilityFunctions() {
        return this.utilityFunctions;
    }
    setTypeId(id, namespace) {
        this.namespace = namespace;
        this.id = id;
    }
    getMemberByName(name) {
        for (let mem of this.members) {
            if (mem.Name == name) {
                return mem;
            }
        }
        return null;
    }
    removeMember(name) {
        let ii;
        let mem = null;
        name = name.charAt(0).toLowerCase() + name.slice(1);
        for (ii = 0; ii < this.members.length; ii++) {
            mem = this.members[ii];
            if (mem.Name == name) {
                this.members.splice(ii, 1);
                break;
            }
            else {
                mem = null;
            }
        }
        return mem;
    }
    getClassHeader() {
        let str = "export class " + this.name;
        if (this.baseClass && !(this.baseClass instanceof SimpleType)) {
            str += " extends " + this.baseClass.FullName;
        }
        return str;
    }
    toString() {
        let str = "";
        str += this.fileHeader;
        str += "\n\n";
        this.imports.forEach((im) => {
            str += im;
            str += "\n";
        });
        /*
        for (let im in this.imports) {
            str += im;
            str += "\n\n";
        }
        */
        if (this.defines) {
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
        str += "}";
        for (let uf of this.utilityFunctions) {
            str += "\nexport function " + uf.toString() + "\n";
        }
        str += "\n" + this.getFactoryCode();
        return str;
    }
    getMethodByName(name) {
        for (let m of this.methods) {
            if (m.Name == name) {
                return m;
            }
        }
        for (let m of this.utilityFunctions) {
            if (m.Name == name) {
                return m;
            }
        }
        return null;
    }
    getEncodeMethod() { return this.getMethodByName(ClassFile.DEFAULT_ENCODE_METHOD); }
    getDecodeMethod() { return this.getMethodByName(ClassFile.DEFAULT_DECODE_METHOD); }
    static getTypeByName(typeName) {
        let i = typeName.indexOf(':');
        if (i > 0) {
            typeName = typeName.substr(i + 1);
        }
        return TypeRegistry.getType(typeName);
    }
    removeAllMethods() {
        this.methods = [];
    }
    addMethod(m) {
        this.methods.push(m);
    }
    getFactoryCode() {
        let str = "import {register_class_definition} from \"../factory/factories_factories\";\n";
        str += "import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';\n";
        str += "register_class_definition(\"" + this.name + "\"," + this.name + ", makeExpandedNodeId(" + this.id + "," + this.namespace + "));";
        return str;
    }
    addMemberVariable(m) {
        this.members.push(m);
    }
    removeAllMembers() {
        this.members = [];
    }
    addUtilityFunction(f) {
        this.utilityFunctions.push(f);
    }
    removeAllUtilityFunctions() {
        this.utilityFunctions = [];
    }
    /**
     * return the code to import this class
     */
    getImportSrc() {
        if (this.importAs) {
            return "import * as " + this.importAs + " from '" + this.Path + "';";
        }
        return "import {" + this.Name + "} from '" + this.Path + "';";
    }
    getInterfaceImportSrc() {
        if (this.importAs || !this.hasAnyMembers()) {
            return null;
        }
        return "import {I" + this.Name + "} from '" + this.Path + "';";
    }
    getDecodeFnImportSrc() {
        if (this.importAs) {
            return null;
        }
        return "import {decode" + this.Name + "} from '" + this.Path + "';";
    }
    addImport(imp) {
        this.imports.add(imp);
    }
    removeAllImports() {
        this.imports.clear();
    }
    hasAnyMembers() {
        let obj = this;
        while (obj) {
            if (obj.members.length > 0) {
                return true;
            }
            obj = obj.BaseClass;
        }
        return false;
    }
    hasBaseClass(cls) {
        let obj = this.baseClass;
        while (obj) {
            if (obj.name == cls) {
                return true;
            }
            obj = obj.baseClass;
        }
        return false;
    }
}
ClassFile.ATTR_NAME = "Name";
ClassFile.ATTR_VALUE = "Value";
ClassFile.ATTR_ARRAY_LENGTH = "Length";
ClassFile.ATTR_BASE_CLASS = "BaseType";
ClassFile.IO_TYPE = "DataStream";
ClassFile.DEFAULT_ENCODE_METHOD = "encode";
ClassFile.DEFAULT_DECODE_METHOD = "decode";
//# sourceMappingURL=ClassFile.js.map