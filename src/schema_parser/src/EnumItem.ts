//import { ClassMember } from "./ClassMember";
import {ClassMember} from './SchemaParser.module';

export class EnumItem extends ClassMember {
    
    toString() {
        return "\t"+this._name + " = " + this._type + ",\n";
    }
}