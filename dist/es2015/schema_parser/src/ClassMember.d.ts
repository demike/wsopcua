import { ClassFile } from './SchemaParser.module';
export declare class ClassMember {
    static readonly UNKNOWN_TYPE: ClassFile;
    protected _name: string;
    protected _type: ClassFile;
    protected _length: number;
    protected _visibility?: string | null;
    protected _required?: boolean;
    protected _bitPos: number;
    protected _isArray: boolean;
    protected _defaultValue: string | null;
    readonly Length: number;
    DefaultValue: string | null;
    /**
     * utility counter for bit fields
     *
     */
    protected static bitCounter: number;
    static resetBitCounter(): void;
    protected nameToLowerCase(): void;
    constructor(name?: string | null, type?: string | ClassFile | null, required?: boolean, visibility?: string | null, length?: number, isArray?: boolean);
    Name: string;
    Type: ClassFile;
    setTypeByName(typeName: string): void;
    BitPos: number;
    readonly IsArray: boolean;
    /**
     *
     * @param option {required : boolean, typePrefix : string}
     */
    toString(option?: any): string;
    writeToEncodingByteSrc(value: number | boolean, encodingByteName: string): string;
}
