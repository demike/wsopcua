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
            true,null,length
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

        let body : string = "\t\toptions = options || {};\n";
        if (this.baseClass) {
            body += "\t\tsuper(options);\n";
        }
            
        for (let mem of this.members) {
            if (mem.Type.Name != "Bit") {
                body += "\t\tthis." + mem.Name + "= (options." + mem.Name + ") ? options." + mem.Name +  ":null;\n";
            }
        }
        

        let met : ClassMethod = new ClassMethod(null,null,"constructor",[
            new ClassMember("options",new SimpleType("I"+ this.name),false),
        ],null,body);

        this.methods.push(met);
    }

    protected createEncodeMethod(): void {
        let body : string = "";

        //if ()

        for (let mem of this.members) {
            if (mem.Type instanceof SimpleType) {
                body += "\t\t";
                if (mem.Type.ImportAs) {
                    body += mem.Type.ImportAs + "."  
                } 
                body += "encode" + mem.Type.Name + "(this." + mem.Name + ",out);\n";
            } else if (mem.Type instanceof BSDEnumTypeFile) {
                body += "\t\tencode" + mem.Type.Name + "(this." + mem.Name + ",out);\n";
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
            body += "\t\tthis." + mem.Name;
            if (mem.Type instanceof SimpleType) {
                if (mem.Type.ImportAs) {
                    body += " = " + mem.Type.ImportAs + ".decode" + mem.Type.Name + "(inp);\n";
                } else {
                    body += " = decode" + mem.Type.Name + "(inp);\n";
                }
            } else if (mem.Type instanceof BSDEnumTypeFile) {
                body += " = decode" + mem.Type.Name + "(inp);\n";
            } else {
                body += ".decode(inp);\n"
            }
        } 

        let dec = new ClassMethod("",null,"decode",
        [new ClassMember("inp",BSDEnumTypeFile.IO_TYPE)],  
        null,
        body);
        this.addMethod(dec);
    }

    protected createCloneMethod() : void {
        let body : string = "\t\tif(!target) {\n\t\t\ttarget = new " + this.name + "();\n\t\t}\n";

        if (this.baseClass != null) {
            body += "\t\tsuper.clone(target);\n";
        }

        for (let mem of this.members) {
            if (mem.Type instanceof BSDStructTypeFile) {
                body += "\t\ttarget." + mem.Name + " = this." + mem.Name + ".clone();\n";
            } else {
                body += "\t\ttarget." + mem.Name + " = this." + mem.Name + ";\n";
            }
        } 

        body += "\t\treturn target;"

        let cl = new ClassMethod("",this,"clone",
        [new ClassMember("target",this,false)],  
        null,
        body);
        this.addMethod(cl);
        
    }

    protected createDefines() {
        //header
        let str = "export interface I" + this.name;
        if (this.baseClass) {
            str += " extends I" + this.baseClass.Name;
        }
        str += " {\n";

        for (let mem of this.members) {
            str += "\t" + mem.toString({required:false}) + ";\n";
        }
        str += "}\n";
        this.defines = str;
    }
}