import { ClassMember } from './SchemaParser.module';
export declare class EnumItem extends ClassMember {
    _value: number;
    _description?: string;
    constructor(name: string, value: number, description?: string);
    toString(): string;
    protected nameToLowerCase(): void;
}
