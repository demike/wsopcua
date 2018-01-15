import {ClassFile} from './ClassFile';

export class EnumTypeFile extends ClassFile {
    public static readonly ATTR_LENGTH = "LengthInBits";
    public static readonly TAG_ENUM_VALUE = "opc:EnumeratedValue";

    lengthInBits : number;
    public parse() : void {
        super.parse();
        let attr = this.el.getAttributeNode(EnumTypeFile.ATTR_LENGTH);
        if (attr != null) {
            this.lengthInBits = parseInt(attr.value);
        }
    }
    /**
     * 
     * @returns element found
     */
    protected createChildElement(el : HTMLElement) : boolean {
        if (super.createChildElement(el)) {
            return true;
        }
        if (el.tagName == EnumTypeFile.TAG_ENUM_VALUE) {
            this.members.push(
                el.getAttribute(ClassFile.ATTR_NAME) + " = " + 
                el.getAttribute(ClassFile.ATTR_VALUE) + ",\n");
            return true;
        }
        return false;
    }

    protected createMethods() {

    }
}