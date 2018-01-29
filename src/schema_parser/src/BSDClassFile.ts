
//import {ClassMethod} from './ClassMethod';
import {PathGenUtil} from './PathGenUtil';
//import {ClassFile} from './ClassFile';
//import { TypeRegistry } from './TypeRegistry';
import {ClassMethod, TypeRegistry, ClassFile} from './SchemaParser.module';

export abstract class BSDClassFile extends ClassFile {


    public static readonly ATTR_NAME = "name";
    public static readonly ATTR_VALUE = "value";
    public static readonly ATTR_BASE_CLASS = "BaseType";
    public static readonly TAG_DOC = "opc:Documentation";
    public static readonly TAG_FIELD = "opc:Field";
    public static readonly ATTR_SWITCH_TYPE = "SwitchType";
    public static readonly ATTR_SWITCH_VALUE = "SwitchValue";
    public static readonly ATTR_TYPE_NAME = "TypeName";

    protected el : HTMLElement;

    constructor(el : HTMLElement) {
        super();
        this.el = el;
    }

    public parse() : void {
        let at = this.el.attributes.getNamedItem(BSDClassFile.ATTR_NAME);
        if (at == null) {
            console.log("Error: could not find name attribute"); 
        }

        at = this.el.attributes.getNamedItem(BSDClassFile.ATTR_BASE_CLASS);
        if (at != null) {
            this.baseClass = TypeRegistry.getType(at.value);
        }

        for (let i=0; i <  this.el.childNodes.length; i++) {
            this.createChildElement(<HTMLElement>this.el.childNodes.item(i));
        }

        this.createMethods();
        this.createImports();
    }

    /**
     * 
     * @returns element found
     */
    protected createChildElement(el : HTMLElement) : boolean {
        if (el.tagName == BSDClassFile.TAG_DOC) {

            this.documentation = el.textContent || "";
            return true;
        }
        return false;
    }

}