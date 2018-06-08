/*import {BSDClassFile} from './BSDClassFile';
import { ClassMember } from './ClassMember';
*/
import {ClassMember, ClassMethod, BSDClassFileParser, EnumTypeFile,ClassFile, StructTypeFile,SimpleType} from './SchemaParser.module';

export class BSDStructTypeFileParser extends BSDClassFileParser {
    protected encodingByteMap? : {[key : string] : ClassMember};
    /**
     * 
     * @returns element found
     */
    protected createChildElement(el : HTMLElement) : boolean {
        if (super.createChildElement(el) || !this.cls) {
            return true;
        }

        if (el == null || el.tagName != BSDClassFileParser.TAG_FIELD) {
            return false;
        }

        let bitLength: number = 1;
        let bitLengthNode = el.attributes.getNamedItem(ClassFile.ATTR_ARRAY_LENGTH);
        if (bitLengthNode) {
            bitLength = parseInt(bitLengthNode.value);
        }

        let lengthField:string|null=null;
        let lengthFieldNode = el.attributes.getNamedItem(BSDClassFileParser.ATTR_LENGTH_FIELD);
        if( lengthFieldNode) {
            lengthField = lengthFieldNode.value;
        }

        let isArr = !!lengthField;
        let mem = new ClassMember(
            el.attributes.getNamedItem(ClassFile.ATTR_NAME).value,
            el.attributes.getNamedItem(BSDClassFileParser.ATTR_TYPE_NAME).value,
            true,null,bitLength,isArr
        );

        if (this.cls.BaseClass && this.cls.BaseClass.getMemberByName(mem.Name) != null) {
            //this member is already present in the parent class
            return true;
        }

        if (lengthField != null) {
            //we found an array type --> lets remove the array length member entry,
            //because every array is preceeded by a 32 bit integer and this is handled by arrayDecode/Encode
            this.cls.removeMember(lengthField);
        }

        if (mem.Type.Name == "Bit") {
            if (!this.encodingByteMap) {
                this.encodingByteMap = {};
            }
            this.encodingByteMap[mem.Name] = mem;
        } else {
            this.cls.addMemberVariable(mem);
        }
        return true;
    }

    protected createConstructor() {
        if (!this.cls || this.cls.Members.length == 0) {
            return;
        }

        let body : string = "\t\toptions = options || {};\n";
        if (this.cls.BaseClass) {
            body += "\t\tsuper(options);\n";
        }
            
        for (let mem of this.cls.Members) {
            if (mem.Type.Name != "Bit") {
                body += "\t\tthis." + mem.Name + "= (options." + mem.Name + ") ? options." + mem.Name +  ":null;\n";
            }
        }
        

        let met : ClassMethod = new ClassMethod(null,null,"constructor",[
            new ClassMember("options",new SimpleType("I"+ this.cls.Name),false),
        ],null,body);

        this.cls.addMethod(met);
    }

    protected createEncodeMethod(): void {
        let body : string = "";
        if (!this.cls) {
            return;
        }
        if (this.cls.BaseClass) {
            body += "\t\tsuper.encode(out);\n";
        } else {
            body += this.createEncodeEncodingByteCode();
        }

        for (let mem of this.cls.Members) {
            body += "\t\t";
            let checkUndefined = this.encodingByteMap && this.encodingByteMap.hasOwnProperty(mem.Name + "Specified");
            if (checkUndefined) {
                    body += "if(this."+ mem.Name  + " !== undefined) { ";
            }


            if (mem.IsArray) {
                body += "ec.encodeArray(this." + mem.Name + ",out";
                if (mem.Type instanceof SimpleType || mem.Type instanceof EnumTypeFile) {
                    body += ","; 
                    if (mem.Type.ImportAs) {
                        body += mem.Type.ImportAs + ".";
                    }
                    body += "encode"+ mem.Type.Name;
                } 
                body += ");";
            } else {
                if (mem.Type instanceof SimpleType || mem.Type instanceof EnumTypeFile) {
                    
                    if (mem.Type.ImportAs) {
                        body += mem.Type.ImportAs + "."  
                    } 
                    body += "encode" + mem.Type.Name + "(this." + mem.Name + ",out);";
                } else {
                    body += "this." + mem.Name + ".encode(out);"
                }
            }

            if(checkUndefined) {
                body += " }";
            }
            body += "\n";
        } 

        let enc = new ClassMethod("",null,"encode",
        [new ClassMember("out",ClassFile.IO_TYPE)],  
        null,
        body);
        this.cls.addMethod(enc);
    }
    
    protected createDecodeMethod(): void {
        let body : string = "";
        if (!this.cls) {
            return;
        }
        if (this.cls.BaseClass) {
            body += "\t\tsuper.decode(inp);\n";
        }
        
        body += this.createDecodeEncodingByteCode();

        for (let mem of this.cls.Members) {
            let addIf= false;
            if (this.encodingByteMap && this.encodingByteMap.hasOwnProperty(mem.Name + "Specified")) {
                addIf = true;
                body += "\t\tif(" + mem.Name + "Specified) {\n\t";
            }

            body += "\t\tthis." + mem.Name;
            if (mem.Type instanceof SimpleType || mem.Type instanceof EnumTypeFile || mem.IsArray) {
                body += " = ";
                
                if (mem.IsArray) {
                    body += "ec.decodeArray(inp," + ((mem.Type.ImportAs) ? (mem.Type.ImportAs + ".") : "") + "decode" +  mem.Type.Name + ");\n"
                } else {
                    body += ((mem.Type.ImportAs) ? (mem.Type.ImportAs + ".") : "") +  "decode" + mem.Type.Name + "(inp);\n";
                }
            } else {
                body += ".decode(inp);\n"
            }

            if (addIf) {
                body += "\t\t}\n";
            }
        } 

        let dec = new ClassMethod("",null,"decode",
        [new ClassMember("inp",ClassFile.IO_TYPE)],  
        null,
        body);
        this.cls.addMethod(dec);

        //create decode as array method
        body = "\t\tlet obj = new " + this.cls.Name + "(null);\n";
        body += "\t\t\tobj.decode(inp); \n\t\t\treturn obj;\n";
        let fnDec = new ClassMethod(null, this.cls.Name, "decode" + this.cls.Name,
        [new ClassMember("inp",ClassFile.IO_TYPE)],
        null,
        body);
        this.cls.addUtilityFunction(fnDec);

    }

    protected createDecodeEncodingByteCode() {
        if (!this.encodingByteMap) {
            return "";
        }
        let str = "\t\tlet encodingByte = inp.getUint8();\n";
        for (let name in this.encodingByteMap) {
            if (name.indexOf("Reserved") != 0) {
                str += "\t\tlet " + name + " = (encodingByte & " + (1 << this.encodingByteMap[name].BitPos) + ") != 0;\n";  
            }
        }

        return str;
    }

    protected createEncodeEncodingByteCode() {
        if (!this.encodingByteMap) {
            return "";
        }
        let str = "\t\tlet encodingByte = 0;\n";
        for (let name in this.encodingByteMap) {
            if (name.indexOf("Reserved") == 0) {
              continue;
            }
            let memName = name.replace("Specified","");
            if(memName != name) {
                // this was: {mymember}Specified
                str += "\t\tif (this." + memName +") { encodingByte |= 1 << " + this.encodingByteMap[name].BitPos + ";}\n";
            } 
        }
        str += "\t\tout.setUint8(encodingByte);\n"; 
        return str;        
    }

    protected createCloneMethod() : void {
        if(!this.cls) {
            return;
        }
        let body : string = "\t\tif(!target) {\n\t\t\ttarget = new " + this.cls.Name + "();\n\t\t}\n";
        if (this.cls.BaseClass != null) {
            body += "\t\tsuper.clone(target);\n";
        }

        for (let mem of this.cls.Members) {
            if (mem.Type instanceof StructTypeFile) {
                if (mem.IsArray) {
                    body += "\t\tif (this." + mem.Name + ") { target." + mem.Name + " = ec.cloneComplexArray(this." + mem.Name + ");}\n"; 
                } else {
                    body += "\t\tif (this." + mem.Name + ") { target." + mem.Name + " = this." + mem.Name + ".clone();}\n";
                }
            } else {
                if (mem.IsArray) {
                    body += "\t\ttarget." + mem.Name + " = ec.cloneArray(this." + mem.Name + ");\n"; 
                } else {
                    body += "\t\ttarget." + mem.Name + " = this." + mem.Name + ";\n";
                }
            }
        } 

        body += "\t\treturn target;"

        let cl = new ClassMethod("",this.cls,"clone",
        [new ClassMember("target",this.cls,false)],  
        null,
        body);
        this.cls.addMethod(cl);
        
    }

    protected createDefines() {
        if (!this.cls) {
            return;
        }
        //header
        let str = "export interface I" + this.cls.Name;
        if (this.cls.BaseClass) {
            str += " extends I" + this.cls.BaseClass.Name;
        }
        str += " {\n";

        for (let mem of this.cls.Members) {
            let option : any = {};
            option["required"] = false;
          /*
            if (!(mem.Type instanceof SimpleType)) {
                option["typePrefix"] = "I";
                this.createImport(mem.Type,true);
            }
            */
            str += "\t" + mem.toString(option) + ";\n";
        }
        str += "}\n";
        this.cls.Defines = str;
    }
}