//import { ClassMember } from "./ClassMember";
import { ClassMember } from './SchemaParser.module';
export class EnumItem extends ClassMember {
    constructor(name, value, description) {
        super(name);
        this._value = value;
        if (description) {
            this._description = description;
        }
    }
    toString() {
        return "\t" + this._name + " = " + this._value + ",";
    }
    nameToLowerCase() {
        //do nothing, we want upper case EnumItems
    }
}
//# sourceMappingURL=EnumItem.js.map