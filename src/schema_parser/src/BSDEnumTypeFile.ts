//import {BSDClassFile} from './BSDClassFile';
//import { ClassMethod } from './ClassMethod';
import { PathGenUtil } from './PathGenUtil';
//import { EnumItem } from './EnumItem';
//import { ClassMember } from './ClassMember';
import {ClassMember, ClassMethod, BSDClassFile, EnumItem} from './SchemaParser.module';

export class BSDEnumTypeFile extends BSDClassFile {
    public static readonly ATTR_LENGTH = "LengthInBits";
    public static readonly TAG_ENUM_VALUE = "opc:EnumeratedValue";


    lengthInBits : number;
    public parse() : void {
        let attr = this.el.getAttributeNode(BSDEnumTypeFile.ATTR_LENGTH);
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
        if (super.createChildElement(el)) {
            return true;
        }
        if (el.tagName == BSDEnumTypeFile.TAG_ENUM_VALUE) {
            let name = el.getAttribute(BSDClassFile.ATTR_NAME);
            let value = el.getAttribute(BSDClassFile.ATTR_VALUE);
            if (!value || !name) {
                throw Error(this.Name + ": Incomplete Enumeration Item");
            }
            this.members.push(new EnumItem(
                name,
                parseInt(value)));
            return true;
        }
        return false;
    }

    protected createEncodeMethod() : void {
        let enc = new ClassMethod("",null,"encode" + this.name,
        [   new ClassMember("out",BSDEnumTypeFile.IO_TYPE),
            new ClassMember("data", this.name)], 
        null,
        "out.set" + this.getSerializationType() + "(data);"
            );
        
        this.utilityFunctions.push(enc);
    }

    protected createDecodeMethod() : void {
        let dec = new ClassMethod("",null,"decode" + this.name,
        [   new ClassMember("in",BSDEnumTypeFile.IO_TYPE),
            new ClassMember("data", this.name)],  
        null,
        "out.set" + this.getSerializationType() + "(data);"
            );
        
        this.utilityFunctions.push(dec);
    }

    protected createImports() : void {
        this.imports.add("import {" + BSDClassFile.IO_TYPE + "} from '" + PathGenUtil.SimpleTypes + BSDClassFile.IO_TYPE + "';");
    }


    protected getSerializationType() : string {
        if (this.lengthInBits <= 8) {
            return "Byte";

        } else if (this.lengthInBits <= 16) {
            return "UInt16";
        } else if (this.lengthInBits <= 32) {
            return "UInt32";
        }

        return "";
    }


    protected getEnumHeader() {
        return "export enum " + this.name;
    }

    //@Override
    public toString() : string {
        let str : string = "";
        str += this.fileHeader;
        str += "\n\n";
        this.imports.forEach( (im) => {
            str += im;
            str += "\n\n";
        })

        /*
        for (let im of this.imports) {
            str += im;
            str += "\n\n";
        }
        */
        if (this.documentation) {
            str +=  "/**\n" + this.documentation + "*/\n";
        }
        str += this.getEnumHeader();
        str += " {\n ";
        for (let mem of this.members) {
            str += "\t" + mem + "\n";
        }
        str += "\n";
        str += "}"
        str += "\n\n";
        for (let met in this.utilityFunctions) {
            str += "\t" + met.toString() + "\n";
        }
        
        return str;
    }
}