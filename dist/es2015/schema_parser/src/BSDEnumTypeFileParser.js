//import {BSDClassFile} from './BSDClassFile';
//import { ClassMethod } from './ClassMethod';
import { PathGenUtil } from './PathGenUtil';
//import { EnumItem } from './EnumItem';
//import { ClassMember } from './ClassMember';
import { ClassMember, ClassMethod, BSDClassFileParser, EnumItem, ClassFile } from './SchemaParser.module';
export class BSDEnumTypeFileParser extends BSDClassFileParser {
    constructor() {
        super(...arguments);
        this.lengthInBits = 0;
    }
    parse() {
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
    createChildElement(el) {
        if (super.createChildElement(el) || !this.cls) {
            return true;
        }
        if (el.tagName == BSDEnumTypeFileParser.TAG_ENUM_VALUE) {
            let name = el.getAttribute(ClassFile.ATTR_NAME);
            let value = el.getAttribute(ClassFile.ATTR_VALUE);
            if (!value || !name) {
                throw Error(this.cls.Name + ": Incomplete Enumeration Item");
            }
            this.cls.addMemberVariable(new EnumItem(name, parseInt(value)));
            return true;
        }
        return false;
    }
    createEncodeMethod() {
        if (!this.cls) {
            return;
        }
        let enc = new ClassMethod("", null, "encode" + this.cls.Name, [new ClassMember("data", this.cls.Name),
            new ClassMember("out", ClassFile.IO_TYPE)], null, "\tout.set" + this.getSerializationType() + "(data);");
        this.cls.addUtilityFunction(enc);
    }
    createDecodeMethod() {
        if (!this.cls) {
            return;
        }
        let dec = new ClassMethod("", null, "decode" + this.cls.Name, [new ClassMember("inp", ClassFile.IO_TYPE)], null, "\treturn inp.get" + this.getSerializationType() + "();");
        this.cls.addUtilityFunction(dec);
    }
    createImports() {
        if (this.cls) {
            this.cls.addImport("import {" + ClassFile.IO_TYPE + "} from '" + PathGenUtil.SimpleTypes + ClassFile.IO_TYPE + "';");
        }
    }
    createCloneMethod() {
    }
    getSerializationType() {
        if (this.lengthInBits <= 8) {
            return "Byte";
        }
        else if (this.lengthInBits <= 16) {
            return "Uint16";
        }
        else if (this.lengthInBits <= 32) {
            return "Uint32";
        }
        return "";
    }
}
BSDEnumTypeFileParser.ATTR_LENGTH = "LengthInBits";
BSDEnumTypeFileParser.TAG_ENUM_VALUE = "opc:EnumeratedValue";
//# sourceMappingURL=BSDEnumTypeFileParser.js.map