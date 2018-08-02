
//import {ClassMethod} from './ClassMethod';
import {PathGenUtil} from './PathGenUtil';
//import {ClassFile} from './ClassFile';
//import { TypeRegistry } from './TypeRegistry';
import {ClassMethod, TypeRegistry, ClassFile} from './SchemaParser.module';
import { IncompleteTypeDefException } from './IncompleteTypeDefException';
import { ClassMember } from './ClassMember';
import { SimpleType } from './SimpleType';

export abstract class BSDClassFileParser {

    public static readonly ATTR_BASE_CLASS = "BaseType";
    public static readonly TAG_DOC = "opc:Documentation";
    public static readonly TAG_FIELD = "opc:Field";
    public static readonly ATTR_SWITCH_TYPE = "SwitchType";
    public static readonly ATTR_SWITCH_VALUE = "SwitchValue";
    public static readonly ATTR_TYPE_NAME = "TypeName";
    public static readonly ATTR_LENGTH_FIELD = "LengthField";

    protected el : HTMLElement;
    protected cls : ClassFile;

    public get Cls() : ClassFile {
        return this.cls;
    }

    constructor(el : HTMLElement,cls : ClassFile) {
        this.el = el;
        this.cls = cls;
    }

    public parse() : void {
        
        let at = this.el.attributes.getNamedItem(ClassFile.ATTR_NAME);
        if (at == null) {
            console.log("Error: could not find name attribute");
            return; 
        }
        this.cls.Name = at.value;

        at = this.el.attributes.getNamedItem(ClassFile.ATTR_BASE_CLASS);
        if (at != null) {
            let baseCls = TypeRegistry.getType(at.value);
     //       if (! (baseCls instanceof SimpleType)) { //<-- this would remove ExtensionObject
                this.cls.BaseClass = baseCls;
     //       }
        }

        TypeRegistry.addType(this.cls.Name,this.cls)

        if (this.cls.BaseClass && !this.cls.BaseClass.Complete) {
            //we can't check members --> have to wait until base class is complete
            this.cls.Complete = false;
            return;
        }
       
        
        ClassMember.resetBitCounter();
        try {
            for (let i=0; i <  this.el.childNodes.length; i++) {
                this.createChildElement(<HTMLElement>this.el.childNodes.item(i));
            }
        } catch (e) {
            if (e instanceof IncompleteTypeDefException) {
                this.cls.Complete = false;
                this.cls.removeAllMembers();
                return;
            } else {
                throw e;
            }
        } finally {
            ClassMember.resetBitCounter();
        }

        this.createMethods();
        this.createImports();
        this.createDefines();
        this.cls.Complete = true;
    }

    /**
     * 
     * @returns element found
     */
    protected createChildElement(el : HTMLElement) : boolean {
        if (el.tagName == null || !this.cls) {
            return true;
        }

        if (el.tagName == BSDClassFileParser.TAG_DOC) {

            this.cls.Documentation = el.textContent || "";
            return true;
        }
        return false;
    }

    protected createDefines() {
        
    }

    public createMethods(): void {
        this.createConstructor();
        this.createEncodeMethod();
        this.createDecodeMethod();
        this.createCloneMethod();
    }

    protected  createConstructor() : void {};
    protected  createEncodeMethod() : void {};
    protected  createDecodeMethod() : void {};
    protected  createCloneMethod() : void {};

    protected createImports() : void {
        if (!this.cls) {
            return;
        }
        this.cls.removeAllImports(); //.imports.clear();
        //iterate over members, ignore self
        let blnHasArrayMember = false;
        for(let mem of this.cls.Members) {
            blnHasArrayMember = blnHasArrayMember || mem.IsArray;            
            this.createImport(mem.Type,false,mem.IsArray);
        }

        if (blnHasArrayMember) {
            this.cls.addImport("import * as ec from '../basic-types';");
        }

        //iterate over methods, ignore self
        for(let met of this.cls.Methods) {
            if (met.Name == "constructor") {
                continue;
            }
            let args = met.Arguments || [];
            for (let arg of args) {
                this.createImport(arg.Type);
            }
            this.createImport(met.ReturnType); 
        }
        //iterate over functions, ignore self
        for(let fn of this.cls.UtilityFunctions) {
            let args = fn.Arguments || [];
            for (let arg of args) {
                this.createImport(arg.Type);
            }
            this.createImport(fn.ReturnType);
        }

        //add the base class to the imports
        if( this.cls.BaseClass) {
            this.createImport(this.cls.BaseClass,true)
        }
    }

    protected createImport( cls : ClassFile|null,importInterface:boolean = false,importDecodeMethod:boolean = false) {
        if (!this.cls || !cls) {
            return;
        }
        if (cls.Path != this.cls.Path ) {
            this.cls.addImport(cls.getImportSrc());
            if (importInterface) {
                let str = cls.getInterfaceImportSrc();
                if (str) {
                    this.cls.addImport(str);
                }
            }

            if (importDecodeMethod) {
                let str = cls.getDecodeFnImportSrc();
                if (str) {
                    this.cls.addImport(str);
                }
            }
        }
    }


}
