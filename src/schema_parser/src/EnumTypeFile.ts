//import {BSDClassFile} from './BSDClassFile';
//import { ClassMethod } from './ClassMethod';
import { PathGenUtil } from './PathGenUtil';
//import { EnumItem } from './EnumItem';
//import { ClassMember } from './ClassMember';
import {ClassMember, ClassMethod, ClassFile, EnumItem} from './SchemaParser.module';

export class EnumTypeFile extends ClassFile {
    protected lengthInBits : number = 0;

    public get LenghInBits() {
        return this.lengthInBits;
    }

    public set LengthInBits(length : number) {
        this.lengthInBits = length;
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
        for (let met of this.utilityFunctions) {
            str += "export function " + met.toString() + "\n";
        }
        
        return str;
    }

    public getImportSrc() : string {
        if (this.importAs) {
            return "import * as " + this.importAs + " from '" + this.Path + "';";
                
        }
        return "import {" + this.Name + ", encode" + this.Name + ", decode" + this.Name + "} from '" + this.Path + "';";
    }
    

    public getInterfaceImportSrc() : string|null {
        return null;
    }
   
}