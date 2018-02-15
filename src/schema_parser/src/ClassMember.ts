/*import { ClassFile } from "./ClassFile";
import { TypeRegistry } from "./TypeRegistry";
*/
import {ClassFile, TypeRegistry, SimpleType} from './SchemaParser.module';
import { IncompleteTypeDefException } from './IncompleteTypeDefException';

export class ClassMember {
    public static readonly UNKNOWN_TYPE : ClassFile = new ClassFile("UnknownType");
    protected _name : string = "";
    protected _type : ClassFile = ClassMember.UNKNOWN_TYPE;
    protected _length : number; //for array types
    protected _visibility? : string|null; //public protected ""
    protected _required? : boolean = true;
    protected _bitPos = 0; //only used by bit types

    /**
     * utility counter for bit fields
     * 
     */
    protected static bitCounter = 0;
    public static resetBitCounter() {
        this.bitCounter = 0;
    }

    constructor(name? : string|null,type?: string|ClassFile|null,required:boolean=true,visibility?: string|null,length:number=1) {
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

        this._required = required;
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

    /**
     * 
     * @param option {required?}
     */
    public toString(option?:any) : string {
        let required = (!option || option.required === undefined) ? this._required : option.required;
        if (this._name.indexOf("Reserved") == 0) {
            return "";
        }
        let blnCommentOut : boolean = this._type.Name == "Bit";

        let str = "\t";

        if (blnCommentOut) {
            str += "//";
        }
        if (this._visibility) {
            str += this._visibility + " ";
        }

        //find the type name
        let typeName = this._type.Name;
        if (this._type instanceof SimpleType && this._type.JsType) {
            typeName = this._type.JsType;
        } else if (this._type.ImportAs) {
            typeName = this._type.ImportAs + "." + typeName;
        }

        str += this._name;
        if (!required) {
            str += "?";
        }
        str += " : " + typeName;

        return str;
    }

    

}