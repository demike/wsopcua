/*import { ClassFile } from "./ClassFile";
import { ClassMethod } from "./ClassMethod";
import { ClassMember } from "./ClassMember";
*/
import { ClassFile } from './SchemaParser.module';
export class SimpleType extends ClassFile {
    constructor(name, baseClass, members, methods) {
        super(name, baseClass, members, methods);
        this.complete = true;
        this.written = true;
    }
    get JsType() {
        return this._jsType;
    }
    set JsType(jsType) {
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
    getDecodeMethod() { return this.getMethodByName('decode' + this.name); }
    getEncodeMethod() { return this.getMethodByName('encode' + this.name); }
}
//# sourceMappingURL=SimpleType.js.map