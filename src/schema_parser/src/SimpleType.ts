/*import { ClassFile } from "./ClassFile";
import { ClassMethod } from "./ClassMethod";
import { ClassMember } from "./ClassMember";
*/
import {ClassFile, ClassMethod, ClassMember} from './SchemaParser.module';

export class SimpleType extends ClassFile {

    /**
     * the type used in javascript (i.e.: UInt32 --> number )
     */
    _jsType? :  string;

    constructor(destPath: string, name?: string, baseClass? : string|ClassFile , members? : ClassMember[], methods? : ClassMethod[]) {
        super(destPath, name, baseClass, members, methods);
        this.complete = true;
        this.written = true;
    }

    public get JsType () : string | undefined {
        return this._jsType;
    }

    public set JsType (jsType : string | undefined) {
        this._jsType = jsType;
    }
    // protected createDecodeMethod() : void {
    //     let enc = new ClassMethod(null,new ClassFile(this.name),"decode" + this.name,
    //     [   new ClassMember("in",ClassFile.IO_TYPE)], 
    //     null,
    //     "return in.get" + this.name + "(data);"
    //         );
        
    //     this.utilityFunctions.push(enc);
    // }

    // protected createEncodeMethod() : void {
    //     let enc = new ClassMethod(null,null,"encode" + this.name,
    //     [   
    //         new ClassMember("data", this.name),
    //         new ClassMember("out",ClassFile.IO_TYPE)], 
    //     null,
    //     "out.set" + this.name + "(data);"
    //         );
        
    //     this.utilityFunctions.push(enc);
    // }

    public getDecodeMethod() : ClassMethod|null { return this.getMethodByName('decode' + this.name)}
    public getEncodeMethod() : ClassMethod|null { return this.getMethodByName('encode' + this.name)}

} 