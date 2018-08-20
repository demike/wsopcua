import { ClassMember, ClassMethod } from './SchemaParser.module';
export declare class Set<Value> {
    add(value: Value): Set<Value>;
    clear(): void;
    delete(value: Value): boolean;
    forEach<Context = any>(handler: (this: Context, value: Value, key: Value, map: Set<Value>) => void, context?: Context): void;
    has(value: Value): boolean;
    size: number;
}
export declare class ClassFile {
    protected id: string;
    protected namespace: string;
    protected name: string;
    protected baseClass?: ClassFile | null;
    protected fileHeader: string;
    protected imports: Set<string>;
    protected defines: string;
    protected documentation: string;
    protected classHeader: string;
    protected members: ClassMember[];
    protected methods: ClassMethod[];
    protected utilityFunctions: ClassMethod[];
    protected path?: string;
    protected importAs?: string;
    protected complete: boolean;
    protected written: boolean;
    static readonly ATTR_NAME: string;
    static readonly ATTR_VALUE: string;
    static readonly ATTR_ARRAY_LENGTH: string;
    static readonly ATTR_BASE_CLASS: string;
    static readonly IO_TYPE: string;
    static readonly DEFAULT_ENCODE_METHOD: string;
    static readonly DEFAULT_DECODE_METHOD: string;
    Name: string;
    readonly FullName: string;
    Path: string;
    Written: boolean;
    BaseClass: ClassFile | null | undefined;
    setBaseClassByName(cls: string): void;
    Documentation: string;
    Complete: boolean;
    ImportAs: string | undefined;
    Defines: string;
    readonly Members: ClassMember[];
    readonly Methods: ClassMethod[];
    readonly UtilityFunctions: ClassMethod[];
    setTypeId(id: string, namespace: string): void;
    constructor(name?: string, baseClass?: string | ClassFile, members?: ClassMember[], methods?: ClassMethod[]);
    getMemberByName(name: string): ClassMember | null;
    removeMember(name: string): ClassMember | null;
    protected getClassHeader(): string;
    toString(): string;
    getMethodByName(name: string): ClassMethod | null;
    getEncodeMethod(): ClassMethod | null;
    getDecodeMethod(): ClassMethod | null;
    static getTypeByName(typeName: string): ClassFile;
    removeAllMethods(): void;
    addMethod(m: ClassMethod): void;
    protected getFactoryCode(): string;
    addMemberVariable(m: ClassMember): void;
    removeAllMembers(): void;
    addUtilityFunction(f: ClassMethod): void;
    removeAllUtilityFunctions(): void;
    /**
     * return the code to import this class
     */
    getImportSrc(): string;
    getInterfaceImportSrc(): string | null;
    getDecodeFnImportSrc(): string | null;
    addImport(imp: string): void;
    removeAllImports(): void;
    hasAnyMembers(): boolean;
    hasBaseClass(cls: string): boolean;
}
