import {BSDClassFile} from './BSDClassFile';
import { ClassMember } from './ClassMember';

export class BSDStructTypeFile extends BSDClassFile {

    /**
     * 
     * @returns element found
     */
    protected createChildElement(el : HTMLElement) : boolean {
        if (super.createChildElement(el)) {
            return true;
        }

        let mem = new ClassMember(BSDClassFile.ATTR_NAME,BSDClassFile.ATTR_TYPE_NAME);
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