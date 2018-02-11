import {JSDOM} from 'jsdom';


import * as fs from 'fs';
import { ClassMethod, BSDClassFile, BSDEnumTypeFile, BSDStructTypeFile} from './SchemaParser.module';
import { TypeRegistry } from './TypeRegistry';
import { ClassFile } from './ClassFile';

export class BSDSchemaParser {
    public static readonly TAG_TYPE_DICT = "opc:TypeDictionary";
    public static readonly TAG_ENUM_TYPE = "opc:EnumeratedType";
    public static readonly TAG_STRUCT_TYPE = "opc:StructuredType";

    public clFileMap : { [key : string] : BSDClassFile };

    protected outPath? : string;
    protected inPath? : string;

    constructor() {
        this.clFileMap = {};
    }

    public parse(inpath : string, outpath : string) {
        this.inPath = inpath;
        this.outPath = outpath;
        if (!fs.existsSync(outpath)) {
            fs.mkdirSync(outpath);
        } 
        fs.readFile(inpath, 'utf8', (err, data) => {
            if (err) throw err;
            //console.log(data);
            let doc = new JSDOM(data,{ contentType : "text/xml"});
            for (let i=0; i < doc.window.document.childNodes.length; i++) {
                let el : HTMLElement = <HTMLElement>(doc.window.document.childNodes.item(i));
                this.parseBSDElement(el);
            } 
            //second pass for incomplete types
            this.parseSecondPass();
            this.writeFiles();
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
        let at = el.attributes.getNamedItem(BSDClassFile.ATTR_NAME);
        if (at && TypeRegistry.getType(at.value)) {
            //this type already exists
            return;
        }
        file.parse();
        this.clFileMap[file.Name] = file;
        //this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);

    }

    public parseBSDEnum(el : HTMLElement) : void {
        let file = new BSDEnumTypeFile(el);
        file.parse();
        //this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);   
    }

    public writeToFile(path : string,cls : BSDClassFile) {
        fs.writeFile(path,cls.toString(),"utf8", (err) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log("file written: " + path);
            }
        });
    }

    public insertIntoFile(path : string, cls : BSDClassFile) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) throw err;
            data += data.replace(ClassMethod.DE_SERIALIZER_METHOD_PLACEHOLDER,cls.toString());
            //write the modified class file
            fs.writeFile(path,data,"utf8", (err) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log("file written: " + path);
                }
            });
        });
    }

    protected parseSecondPass() {
        let incomplete = 0;
        let ar : ClassFile[];
        ar = TypeRegistry.getTypes();

        for (let iterations=0; iterations < 10; iterations++) {
            for (let f of ar) {
                if (f instanceof BSDStructTypeFile && !f.Complete) {
                    f.parse();
                    if (!f.Complete) {
                        incomplete++;
                    }
                }
            }

            if (incomplete == 0) {
                return;
            }
        }
    }

    protected writeFiles() {
        let ar : ClassFile[];
        ar = TypeRegistry.getTypes();
        for (let file of ar) {
            if (file instanceof BSDClassFile) {
                this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);
            }
        }
    }
 
    public parseComplexType() {
        console.log("hohoho");
    }
}