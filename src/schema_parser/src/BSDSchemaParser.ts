import {JSDOM} from 'jsdom';

//import {BSDClassFile} from './BSDClassFile';
//import {BSDEnumTypeFile} from './BSDEnumTypeFile';
//import {BSDStructTypeFile} from './BSDStructTypeFile';
import * as fs from 'fs';
//import { ClassMethod } from './ClassMethod';
import { ClassMethod, BSDClassFile, BSDEnumTypeFile, BSDStructTypeFile} from './SchemaParser.module';

export class BSDSchemaParser {
    public static readonly TAG_TYPE_DICT = "opc:TypeDictionary";
    public static readonly TAG_ENUM_TYPE = "opc:EnumeratedType";
    public static readonly TAG_STRUCT_TYPE = "opc:StructuredType";

    public clFileMap : { [key : string] : BSDClassFile };

    protected outPath : string;
    protected inPath : string;

    constructor() {

    }

    public parse(inpath : string, outpath : string) {
        this.inPath = inpath;
        this.outPath = outpath;
        fs.readFile(inpath, 'utf8', (err, data) => {
            if (err) throw err;
            //console.log(data);
            let doc = new JSDOM(data,{ contentType : "text/xml"});
            for (let i=0; i < doc.window.document.childNodes.length; i++) {
                let el : HTMLElement = <HTMLElement>(doc.window.document.childNodes.item(i));
                this.parseBSDElement(el);
            } 
        });
    }

    public parseBSDElement(el : HTMLElement) {
        switch(el.tagName) {
            case BSDSchemaParser.TAG_ENUM_TYPE:
                this.parseBSDEnum(el);
                break;
            case BSDSchemaParser.TAG_STRUCT_TYPE:
                this.parseBSDStruct(el);
                break;
            case BSDSchemaParser.TAG_TYPE_DICT:
                this.parseBSDTypeDict(el);
                break;
            default:
                for (let i=0; i < el.childNodes.length; i++) {
                    let child : HTMLElement = <HTMLElement>(el.childNodes.item(i));
                    this.parseBSDElement(child);
                }
                break;
        }
    }

    public parseBSDTypeDict(el : HTMLElement) {
        for (let i=0; i < el.childNodes.length; i++) {
            this.parseBSDElement(<HTMLElement>(el.childNodes.item(i)));
        } 
    }

    public parseBSDStruct(el : HTMLElement) : void {
        let file = new BSDStructTypeFile(el);
        file.parse();
        this.clFileMap[file.Name] = file;
        this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);

    }

    public parseBSDEnum(el : HTMLElement) : void {
        let file = new BSDEnumTypeFile(el);
        file.parse();
        this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);   
    }

    public writeToFile(path : string,cls : BSDClassFile) {
        fs.writeFile(path,cls.toString(),"utf8", (err) => {
            console.log(err);
        });
    }

    public insertIntoFile(path : string, cls : BSDClassFile) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) throw err;
            data += data.replace(ClassMethod.DE_SERIALIZER_METHOD_PLACEHOLDER,cls.toString());
            //write the modified class file
            fs.writeFile(path,data,"utf8", (err) => {
                console.log(err);
            });
        });
    }
 
    public parseComplexType() {
        console.log("hohoho");
    }
}