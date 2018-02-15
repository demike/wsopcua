//import { ClassMember } from "./ClassMember";
import {ClassMember} from './SchemaParser.module';

export class EnumItem extends ClassMember{
    _name : string = "";
    _value : number;
    _description? : string;

    constructor(name : string, value : number, description?:string ) {
        super(name);
        
        this._value = value;
        if (description) {
            this._description = description;
        }
    }
    
    toString() {
        return "\t"+this._name + " = " + this._value + ",";
    }
}