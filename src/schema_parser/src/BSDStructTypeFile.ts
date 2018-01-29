/*import {BSDClassFile} from './BSDClassFile';
import { ClassMember } from './ClassMember';
*/
import {ClassMember, BSDClassFile} from './SchemaParser.module';

export class BSDStructTypeFile extends BSDClassFile {

    /**
     * 
     * @returns element found
     */
    protected createChildElement(el : HTMLElement) : boolean {
        if (super.createChildElement(el)) {
            return true;
        }

        if (el.tagName != BSDClassFile.TAG_FIELD) {
            return false;
        }

        let mem = new ClassMember(
            el.attributes.getNamedItem(BSDClassFile.ATTR_NAME).value,
            el.attributes.getNamedItem(BSDClassFile.ATTR_TYPE_NAME).value);
        this.members.push(mem);
        return true;
    }

    protected createEncodeMethod(): void {
        throw new Error("Method not implemented.");
    }
    protected createDecodeMethod(): void {
        throw new Error("Method not implemented.");
    }
}