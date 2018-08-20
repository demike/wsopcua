import { ClassFile, ClassMethod, ClassMember } from './SchemaParser.module';
export declare class SimpleType extends ClassFile {
    /**
     * the type used in javascript (i.e.: UInt32 --> number )
     */
    _jsType?: string;
    constructor(name?: string, baseClass?: string | ClassFile, members?: ClassMember[], methods?: ClassMethod[]);
    JsType: string | undefined;
    getDecodeMethod(): ClassMethod | null;
    getEncodeMethod(): ClassMethod | null;
}
