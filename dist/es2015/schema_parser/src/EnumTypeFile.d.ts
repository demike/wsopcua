import { ClassFile } from './SchemaParser.module';
export declare class EnumTypeFile extends ClassFile {
    protected lengthInBits: number;
    readonly LenghInBits: number;
    LengthInBits: number;
    protected getEnumHeader(): string;
    toString(): string;
    getImportSrc(): string;
    getInterfaceImportSrc(): string | null;
    protected getFactoryCode(): string;
}
