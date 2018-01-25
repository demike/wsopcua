import {XSDClassFile} from './XSDClassFile';
import { ClassMethod } from './ClassMethod';

export class XSDComplexTypeFile extends XSDClassFile {
    public parse() : void {

    }

    public createMethods() : void {
        //TODO: implement me
        this.createDeSerializerPlaceHolder();
    }

    private createDeSerializerPlaceHolder() : void {
        let method : ClassMethod = new ClassMethod();
        method.Documentation = ClassMethod.DE_SERIALIZER_METHOD_PLACEHOLDER;
        this.methods.push(method);
    }
}