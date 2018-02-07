/*import { ClassFile } from "./ClassFile";
import { TypeRegistry } from "./TypeRegistry";
*/
import {ClassFile, TypeRegistry} from './SchemaParser.module';
import { IncompleteTypeDefException } from './IncompleteTypeDefException';

export class ClassMember {
    protected _name : string;
    protected _type : ClassFile;
    protected _length : number; //for array types
    protected _visibility? : string|null; //public protected ""
    protected _bitPos = 0; //only used by bit types

    /**
     * utility counter for bit fields
     * 
     */
    protected static bitCounter = 0;
    public static resetBitCounter() {
        this.bitCounter = 0;
    }

    constructor(name? : string|null,type?: string|ClassFile|null,length:number=1,visibility?: string|null) {
        if (name) {
            this._name = name;
        }

        this._length = length;

        if (type) {
            this._type = (type instanceof ClassFile) ? type : ClassFile.getTypeByName(type);
            if (!this._type) {
                throw new IncompleteTypeDefException("Member '" +  this._name + "' has no type");
            }
            if (this._type.Name == "Bit") {
                this._bitPos = ClassMember.bitCounter;
                ClassMember.bitCounter++;
            }
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
        let str = "\t";
        if (this._visibility) {
            str += this._visibility + " ";
        }
        str += this._name + ": " + this._type.Name;
        return str;
    }

    

}