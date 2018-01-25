import { ClassMember } from "./ClassMember";

export class EnumItem extends ClassMember {
    
    toString() {
        return "\t"+this._name + " = " + this._type + ",\n";
    }
}