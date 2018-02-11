/*import {BSDClassFile} from './BSDClassFile';
import { ClassMember } from './ClassMember';
*/
import {ClassMember, ClassMethod, BSDClassFile, BSDEnumTypeFile} from './SchemaParser.module';
import { SimpleType } from './SimpleType';

export class BSDStructTypeFile extends BSDClassFile {
    /**
     * 
     * @returns element found
     */
    protected createChildElement(el : HTMLElement) : boolean {
        if (super.createChildElement(el)) {
            return true;
        }

        if (el.tagName != BSDClassFile.TAG_FIELD) {
            return false;
        }

        let length: number = 1;
        let atLength = el.attributes.getNamedItem(BSDClassFile.ATTR_ARRAY_LENGTH);
        if (atLength) {
            length = parseInt(atLength.value);
        }
        let mem = new ClassMember(
            el.attributes.getNamedItem(BSDClassFile.ATTR_NAME).value,
            el.attributes.getNamedItem(BSDClassFile.ATTR_TYPE_NAME).value,
            length
        );
            
        if (mem.Name.indexOf("Reserved") == 0) {
            return true;
        }
        this.members.push(mem);
        return true;
    }

    protected createConstructor() {
        if (this.members.length == 0) {
            return;
        }

        let body : string = "";
        if (this.baseClass) {
            body += "\t\tsuper(options);\n";
        }
            
        for (let mem of this.members) {
            if (mem.Type.Name != "Bit") {
                body += "\t\tthis." + mem.Name + "= (options." + mem.Name + ") ? options." + mem.Name +  ":null;\n";
            }
        }
        

        let met : ClassMethod = new ClassMethod(null,null,"constructor",[
            new ClassMember("options",new SimpleType("I"+ this.name)),
        ],null,body);

        this.methods.push(met);
    }

    protected createEncodeMethod(): void {
        let body : string = "";

        //if ()

        for (let mem of this.members) {
            if (mem instanceof SimpleType) {
                "\t\tout.set" + mem.Type.Name + "(data);"
            } else {
                body += "\t\tthis." + mem.Name + ".encode(out);\n"
            }
        } 

        let enc = new ClassMethod("",null,"encode",
        [new ClassMember("out",BSDEnumTypeFile.IO_TYPE)],  
        null,
        body);
        this.addMethod(enc);
    }
    
    protected createDecodeMethod(): void {
        let body : string = "";
        for (let mem of this.members) {
            if (mem instanceof SimpleType) {
                "\t\tthis." + mem.Name + " = inp.get" + mem.Type.Name + "();"
            } else {
                body += "\t\tthis." + mem.Name + ".decode(inp);\n"
            }
        } 

        let dec = new ClassMethod("",null,"decode",
        [new ClassMember("inp",BSDEnumTypeFile.IO_TYPE)],  
        null,
        body);
        this.addMethod(dec);
    }

    protected createDefines() {
        //header
        let str = "export interface I" + this.name;
        if (this.baseClass) {
            str += " extends I" + this.baseClass.Name;
        }
        str += " {\n";

        for (let mem of this.members) {
            str += "\t" + mem.toString() + ";\n";
        }
        str += "}\n";
        this.defines = str;
    }
}