import { ClassFile } from "./ClassFile";
import { ClassMethod } from "./ClassMethod";
import { ClassMember } from "./ClassMember";

export class SimpleType extends ClassFile {

    /**
     * the type used in javascript (i.e.: UInt32 --> number )
     */
    _jsType :  string;

    public get JsType () {
        return this._jsType;
    }

    public set JsType (jsType : string) {
        this._jsType = jsType;
    }
    protected createDecodeMethod() : void {
        let enc = new ClassMethod(null,null,"decode" + this.name,
        [   new ClassMember("in",ClassFile.IO_TYPE)], 
        new ClassFile(this.name),
        "return in.get" + this.name + "(data);"
            );
        
        this.utilityFunctions.push(enc);
    }

    protected createEncodeMethod() : void {
        let enc = new ClassMethod(null,null,"encode" + this.name,
        [   
            new ClassMember("data", this.name),
            new ClassMember("out",ClassFile.IO_TYPE)], 
        null,
        "out.set" + this.name + "(data);"
            );
        
        this.utilityFunctions.push(enc);
    }

    public getDecodeMethod() : ClassMethod|null { return this.getMethodByName('decode' + this.name)}
    public getEncodeMethod() : ClassMethod|null { return this.getMethodByName('encode' + this.name)}
} 