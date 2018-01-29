/*import { ClassFile } from "./ClassFile";
import { TypeRegistry } from "./TypeRegistry";
*/
import {ClassFile, TypeRegistry} from './SchemaParser.module';

export class ClassMember {
    protected _name : string;
    protected _type : ClassFile;

    protected _visibility? : string|null; //public protected ""

    constructor(name? : string|null,type?: string|ClassFile|null,visibility?: string|null) {
        if (name) {
            this._name = name;
        }
        if (type) {
            this._type = (type instanceof ClassFile) ? type : ClassFile.getTypeByName(type);
        }

        if (visibility) {
            this._visibility = visibility;
        }
    }

    public set Name(name : string) {
        this._name = name;
    }

    public get Name() : string {
        return this._name;
    }

    public set Type(type : ClassFile) {
        this._type = type;
    }

    public get Type() : ClassFile {
        return this._type;
    }

    public setTypeByName(typeName : string) {
        this._type = ClassFile.getTypeByName(typeName);
    }

    public toString() : string {
        if (this._name.indexOf("Reserved") == 0) {
            return "";
        }
        return "\t" + this._visibility + this._name + ": " + this._type.Name +";\n";
    }

    

}