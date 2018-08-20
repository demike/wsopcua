//import { EnumItem } from './EnumItem';
//import { ClassMember } from './ClassMember';
import { ClassFile } from './SchemaParser.module';
export class EnumTypeFile extends ClassFile {
    constructor() {
        super(...arguments);
        this.lengthInBits = 0;
    }
    get LenghInBits() {
        return this.lengthInBits;
    }
    set LengthInBits(length) {
        this.lengthInBits = length;
    }
    getEnumHeader() {
        return "export enum " + this.name;
    }
    //@Override
    toString() {
        let str = "";
        str += this.fileHeader;
        str += "\n\n";
        this.imports.forEach((im) => {
            str += im;
            str += "\n\n";
        });
        /*
        for (let im of this.imports) {
            str += im;
            str += "\n\n";
        }
        */
        if (this.documentation) {
            str += "/**\n" + this.documentation + "*/\n";
        }
        str += this.getEnumHeader();
        str += " {\n ";
        for (let mem of this.members) {
            str += "\t" + mem + "\n";
        }
        str += "\n";
        str += "}";
        str += "\n\n";
        for (let met of this.utilityFunctions) {
            str += "export function " + met.toString() + "\n";
        }
        str += "\n" + this.getFactoryCode();
        return str;
    }
    getImportSrc() {
        if (this.importAs) {
            return "import * as " + this.importAs + " from '" + this.Path + "';";
        }
        return "import {" + this.Name + ", encode" + this.Name + ", decode" + this.Name + "} from '" + this.Path + "';";
    }
    getInterfaceImportSrc() {
        return null;
    }
    getFactoryCode() {
        let str = "import {registerEnumeration} from \"../factory/factories_enumerations\";\n";
        str += "registerEnumeration(\"" + this.name + "\"," + this.name + ",encode" + this.name + " ,decode" + this.name + " ,null);";
        return str;
    }
}
//# sourceMappingURL=EnumTypeFile.js.map