import {JSDOM} from 'jsdom'
import {ClassFile} from './ClassFile'
import {EnumTypeFile} from './EnumTypeFile'
import {StructTypeFile} from './StructTypeFile'
import * as fs from 'fs'

export class SchemaParser {
    public static readonly TAG_TYPE_DICT = "opc:TypeDictionary";
    public static readonly TAG_ENUM_TYPE = "opc:EnumeratedType";
    public static readonly TAG_STRUCT_TYPE = "opc:StructuredType";

    protected curCls : ClassFile;

    constructor() {

    }

    public parse(path : string) {
        
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) throw err;
            console.log(data);
            let doc = new JSDOM(data);
            for (let i=0; i < doc.window.document.childNodes.length; i++) {
                let el : HTMLElement = <HTMLElement>(doc.window.document.childNodes.item(i));
            } 
        });
    }

    public parseElement(el : HTMLElement) {
        switch(el.tagName) {
            case SchemaParser.TAG_ENUM_TYPE:
                this.parseEnum(el);
                break;
            case SchemaParser.TAG_STRUCT_TYPE:
                this.parseStruct(el);
            case SchemaParser.TAG_TYPE_DICT:
                this.parseTypeDict;
                break;
        }
    }

    public parseTypeDict(el : HTMLElement) {
        for (let i=0; i < el.childNodes.length; i++) {
            this.parseElement(<HTMLElement>(el.childNodes.item(i)));
        } 
    }

    public parseStruct(el : HTMLElement) : void {
        let file = new StructTypeFile(el);
        file.parse;

    }

    public parseEnum(el : HTMLElement) : void {
        let file = new EnumTypeFile(el);
        file.parse();
        
    }

    public writeToFile(path : string,cls : ClassFile) {
        fs.writeFile(path,cls.toString(),"utf8", (err) => {
            console.log(err);
        });
    }
 
    public parseComplexType() {
        console.log("hohoho");
    }
}