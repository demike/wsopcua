/*import { ClassFile } from "./ClassFile";
import { TypeRegistry } from "./TypeRegistry";
*/
import { ClassFile, SimpleType, EnumTypeFile } from './SchemaParser.module';
import { IncompleteTypeDefException } from './IncompleteTypeDefException';
export class ClassMember {
    constructor(name, type, required = true, visibility, length = 1, isArray = false) {
        this._name = "";
        this._type = ClassMember.UNKNOWN_TYPE;
        this._required = true;
        this._bitPos = 0; //only used by bit types
        this._isArray = false;
        this._defaultValue = null;
        if (name) {
            this._name = name;
            this.nameToLowerCase();
        }
        this._length = length;
        this._isArray = isArray;
        if (type) {
            this._type = (type instanceof ClassFile) ? type : ClassFile.getTypeByName(type);
            if (!this._type) {
                throw new IncompleteTypeDefException("Member '" + this._name + "' has no type");
            }
            if (this._type.Name == "Bit") {
                this._bitPos = ClassMember.bitCounter;
                ClassMember.bitCounter++;
            }
            else if (this._type instanceof EnumTypeFile) {
                let bitCnt = this._type.LengthInBits;
                if (bitCnt % 8 != 0 || ClassMember.bitCounter != 0) {
                    ClassMember.bitCounter += bitCnt;
                }
            }
        }
        if (visibility) {
            this._visibility = visibility;
        }
        this._required = required;
    }
    get Length() {
        return this._length;
    }
    get DefaultValue() {
        return this._defaultValue;
    }
    set DefaultValue(val) {
        this._defaultValue = val;
    }
    static resetBitCounter() {
        this.bitCounter = 0;
    }
    nameToLowerCase() {
        this._name = this._name.charAt(0).toLowerCase() + this._name.slice(1);
    }
    set Name(name) {
        this._name = name;
        this.nameToLowerCase();
    }
    get Name() {
        return this._name;
    }
    set Type(type) {
        this._type = type;
    }
    get Type() {
        return this._type;
    }
    setTypeByName(typeName) {
        this._type = ClassFile.getTypeByName(typeName);
    }
    get BitPos() {
        return this._bitPos;
    }
    set BitPos(pos) {
        this._bitPos = pos;
    }
    get IsArray() {
        return this._isArray;
    }
    /**
     *
     * @param option {required : boolean, typePrefix : string}
     */
    toString(option) {
        let required = (!option || option.required === undefined) ? this._required : option.required;
        if (this._name.toLowerCase().indexOf("reserved") == 0) {
            return "";
        }
        let blnCommentOut = this._type.Name == "Bit";
        let str = "\t";
        if (blnCommentOut) {
            str += "//";
        }
        if (this._visibility) {
            str += this._visibility + " ";
        }
        //find the type name
        let typeName = this._type.Name;
        if ((option && option.typePrefix !== undefined)) {
            typeName = option.typePrefix + typeName;
        }
        if (this._type instanceof SimpleType && this._type.JsType) {
            typeName = this._type.JsType;
        }
        else if (this._type.ImportAs) {
            typeName = this._type.ImportAs + "." + typeName;
        }
        str += this._name;
        if (!required) {
            str += "?";
        }
        str += " : " + typeName;
        if (this._length > 1 || this._isArray) {
            str += "[]";
        }
        if (this._defaultValue) {
            str += " = " + this._defaultValue;
        }
        return str;
    }
    writeToEncodingByteSrc(value, encodingByteName) {
        let encodingByte;
        if (length < 2) {
            let mask = 1 << this._bitPos;
            if (value) {
                return encodingByteName + "|= 1 << " + this._bitPos + ";";
            }
            else {
                return encodingByteName + "&= ~(1 << " + this._bitPos + ");";
            }
        }
        else {
        }
        return "";
    }
}
ClassMember.UNKNOWN_TYPE = new ClassFile("UnknownType");
/**
 * utility counter for bit fields
 *
 */
ClassMember.bitCounter = 0;
//# sourceMappingURL=ClassMember.js.map