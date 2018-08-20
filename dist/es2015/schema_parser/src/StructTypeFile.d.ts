import { ClassMember, ClassFile } from './SchemaParser.module';
export declare class StructTypeFile extends ClassFile {
    protected encodingByteMap?: {
        [key: string]: ClassMember;
    };
}
