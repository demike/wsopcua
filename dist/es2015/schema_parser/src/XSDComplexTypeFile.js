/*import {XSDClassFile} from './XSDClassFile';
import { ClassMethod } from './ClassMethod';
*/
import { XSDClassFile, ClassMethod } from './SchemaParser.module';
export class XSDComplexTypeFile extends XSDClassFile {
    parse() {
    }
    createMethods() {
        //TODO: implement me
        this.createDeSerializerPlaceHolder();
    }
    createDeSerializerPlaceHolder() {
        let method = new ClassMethod();
        method.Documentation = ClassMethod.DE_SERIALIZER_METHOD_PLACEHOLDER;
        this.methods.push(method);
    }
}
//# sourceMappingURL=XSDComplexTypeFile.js.map