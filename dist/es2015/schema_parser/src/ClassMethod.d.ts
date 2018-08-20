import { ClassMember, ClassFile } from './SchemaParser.module';
export declare class ClassMethod {
    static readonly DE_SERIALIZER_METHOD_PLACEHOLDER: string;
    static readonly INDENT: string;
    protected visibility?: string | null;
    protected name: string;
    protected returnType: ClassFile | null;
    protected arguments: ClassMember[] | null;
    protected documentation?: string | null;
    protected body?: string | null;
    constructor(visibility?: string | null, returnType?: string | ClassFile | null, name?: string | null, args?: ClassMember[] | null, doc?: string | null, body?: string | null);
    readonly Arguments: ClassMember[] | null;
    readonly Name: string;
    readonly ReturnType: ClassFile | null;
    Documentation: string;
    toString(): string;
    getHeader(args?: string): string;
    call(parent?: string, args?: string): string;
}
