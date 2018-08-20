import { ClassFile } from './SchemaParser.module';
export declare class TypeRegistry {
    protected static readonly BASIC_TYPES_PATH: string;
    static typeMap: {
        [key: string]: ClassFile;
    };
    static addType(name: string, type: ClassFile): void;
    static getType(name: string): ClassFile;
    static getTypes(): ClassFile[];
    static init(): void;
}
