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

        let mem = new ClassMember(
            el.attributes.getNamedItem(BSDClassFile.ATTR_NAME).value,
            el.attributes.getNamedItem(BSDClassFile.ATTR_TYPE_NAME).value);
        this.members.push(mem);
        return true;
    }

    protected createEncodeMethod(): void {
        let body : string = "";
        for (let mem of this.members) {
            if (mem instanceof SimpleType) {
                "\t\tout.set" + mem.Type.Name + "(data);"
            } else {
                body += "\t\tthis." + mem.Name + ".encode(out);\n"
            }
        } 

        let dec = new ClassMethod("",null,"encode" + this.name,
        [new ClassMember("out",BSDEnumTypeFile.IO_TYPE)],  
        null,
        body);
    }
    protected createDecodeMethod(): void {
        let body : string = "";
        for (let mem of this.members) {
            if (mem instanceof SimpleType) {
                "\t\tthis." + mem.Name + " = in.get" + mem.Type.Name + "();"
            } else {
                body += "\t\tthis." + mem.Name + ".decode(in);\n"
            }
        } 

        let dec = new ClassMethod("",null,"decode" + this.name,
        [new ClassMember("in",BSDEnumTypeFile.IO_TYPE)],  
        null,
        body);

    }
}