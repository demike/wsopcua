//import {BSDClassFile} from './BSDClassFile';
//import { ClassMethod } from './ClassMethod';
import { PathGenUtil } from './PathGenUtil';
//import { EnumItem } from './EnumItem';
//import { ClassMember } from './ClassMember';
import {ClassMember, ClassMethod, BSDClassFileParser, EnumItem,ClassFile, EnumTypeFile} from './SchemaParser.module';
import { getModuleImportPath } from './SchemaParserConfig';

export class BSDEnumTypeFileParser extends BSDClassFileParser {
    public static readonly ATTR_LENGTH = "LengthInBits";
    public static readonly TAG_ENUM_VALUE = "opc:EnumeratedValue";


    lengthInBits : number = 0;
    public parse() : void {
        let attr = this.el.getAttributeNode(BSDEnumTypeFileParser.ATTR_LENGTH);
        if (attr != null) {
            this.lengthInBits = parseInt(attr.value);
        }
        super.parse();
    }
    /**
     * 
     * @returns element found
     */
    protected createChildElement(el : HTMLElement) : boolean {
        if (super.createChildElement(el) || !this.cls) {
            return true;
        }
        if (el.tagName == BSDEnumTypeFileParser.TAG_ENUM_VALUE) {
            let name = el.getAttribute(ClassFile.ATTR_NAME);
            let value = el.getAttribute(ClassFile.ATTR_VALUE);
            if (!value || !name) {
                throw Error(this.cls.Name + ": Incomplete Enumeration Item");
            }
            this.cls.addMemberVariable(new EnumItem(
                name,
                parseInt(value)));
            return true;
        }
        return false;
    }

    protected createEncodeMethod() : void {
        if (!this.cls) {
            return;
        }
        let enc = new ClassMethod("",null,"encode" + this.cls.Name,
        [   new ClassMember("data", this.cls.Name),
            new ClassMember("out",ClassFile.IO_TYPE)], 
        null,
        "\tout.set" + this.getSerializationType() + "(data);"
            );
        
        this.cls.addUtilityFunction(enc);
    }

    protected createDecodeMethod() : void {
        if (!this.cls) {
            return;
        }
        let dec = new ClassMethod("",null,"decode" + this.cls.Name,
        [ new ClassMember("inp",ClassFile.IO_TYPE)],  
        null,
        "\treturn inp.get" + this.getSerializationType() + "();"
            );
        
        this.cls.addUtilityFunction(dec);
    }

    protected createImports() : void {
        if (this.cls) {
            this.cls.addImport("import {" + ClassFile.IO_TYPE + "} from '" + 
                getModuleImportPath(this.cls.ModulePath, PathGenUtil.SimpleTypesModulePath, ClassFile.IO_TYPE) + "';");
        }
    }

    protected createCloneMethod() : void {
        
    }


    protected getSerializationType() : string {
        if (this.lengthInBits <= 8) {
            return "Byte";

        } else if (this.lengthInBits <= 16) {
            return "Uint16";
        } else if (this.lengthInBits <= 32) {
            return "Uint32";
        }

        return "";
    }
   
}