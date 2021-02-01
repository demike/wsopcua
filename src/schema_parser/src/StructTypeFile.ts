/*import {BSDClassFile} from './BSDClassFile';
import { ClassMember } from './ClassMember';
*/
import {ClassMember, ClassMethod, ClassFile} from './SchemaParser.module';
import { SimpleType } from './SimpleType';

export class StructTypeFile extends ClassFile {
    protected encodingByteMap?: {[key: string]: ClassMember};
}
