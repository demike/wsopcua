import {JSDOM} from 'jsdom';


import * as fs from 'fs';
import { ClassMethod, BSDClassFileParser, BSDStructTypeFileParser,StructTypeFile, BSDEnumTypeFileParser, EnumTypeFile} from './SchemaParser.module';
import { TypeRegistry } from './TypeRegistry';
import { ClassFile } from './ClassFile';
import { ProjectImportConfig, ProjectModulePath } from './SchemaParserConfig';

export class BSDSchemaParser {
    public static readonly TAG_TYPE_DICT = "opc:TypeDictionary";
    public static readonly TAG_ENUM_TYPE = "opc:EnumeratedType";
    public static readonly TAG_STRUCT_TYPE = "opc:StructuredType";

    public clsIncompleteTypes : BSDClassFileParser[];

    protected outPath: string = ".";
    protected conf?: ProjectImportConfig;
    protected currentModulePath: ProjectModulePath = new ProjectModulePath('wsopcua', '/generated');

    protected metaTypeMap: {[key: string]: {[key: string]: string[]}} = {};
    protected namespace: string | number  = -1;

    constructor() {
        this.clsIncompleteTypes = [];
    }

    public async parse(importConfig: ProjectImportConfig,
            metaTypeMap: {[key: string]: {[key: string]: string[]}}): Promise<void> {
        this.metaTypeMap = metaTypeMap;
        for (const schema of importConfig.importedSchemas) {
            this.outPath = importConfig.protjectSrcPath + schema.modulePath;
            if (schema.namespace) {
                this.namespace = schema.namespace;
            }
            this.currentModulePath = new ProjectModulePath(importConfig.projectName, schema.modulePath);

            if (!fs.existsSync(this.outPath)) {
                fs.mkdirSync(this.outPath);
            }

            await fs.readFile(schema.pathToSchema, 'utf8', (err, data) => {
                if (err) throw err;
                //console.log(data);
                let doc = new JSDOM(data, { contentType : 'text/xml'});
                if (schema.pathToSchema.endsWith('.bsd')) {
                    this.parseBSDDoc(doc);
                } else {
                    this.parseNodeSet2XmlDoc(doc);
                }
            });
        }
        return;
    }

    public parseNodeSet2XmlDoc(doc: JSDOM) {
        let elements = doc.window.document.querySelectorAll('ByteString[xmlns="http://opcfoundation.org/UA/2008/02/Types.xsd"]');
        for (let i=0; i < elements.length; i++) {
            const el = elements.item(i);
            let parent: HTMLElement| null;
            if (el && (parent = el.parentElement) && (parent = parent.parentElement)  ) {
                const name = parent.getAttribute('SymbolicName');
                if (name && name.endsWith('BinarySchema')) {
                    let docdata =  Buffer.from(el.innerHTML, 'base64').toString()
                    this.parseBSDDoc(new JSDOM(docdata, { contentType : 'text/xml'}));
                    return;
                }
            }
            
        }
    }

    public parseBSDDoc(doc: JSDOM) {
        this.fixSchemaFaults(doc)
            for (let i=0; i < doc.window.document.childNodes.length; i++) {
                let el : HTMLElement = <HTMLElement>(doc.window.document.childNodes.item(i));
                this.parseBSDElement(el);
            } 
            //second pass for incomplete types
            this.parseSecondPass();
            this.writeIndexFile();
            this.writeFiles();
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
        if (this.namespace === -1) {
            //namespace not yet defined --> get it from the BSD Type dictonary
            this.namespace = el.getAttribute('TargetNamespace') || -1;
        }

        for (let i = 0; i < el.childNodes.length; i++) {
            this.parseBSDElement(<HTMLElement>(el.childNodes.item(i)));
        } 
    }

    public parseBSDStruct(el : HTMLElement): void {
        let file = new StructTypeFile(this.currentModulePath);
        let parser = new BSDStructTypeFileParser(el,file);
        let at = el.attributes.getNamedItem(ClassFile.ATTR_NAME);
        if (at && TypeRegistry.getType(at.value)) {
            //this type already exists
            return;
        }
        parser.parse();
        if (!file.Complete)
        this.clsIncompleteTypes.push( parser);
        //this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);

    }

    public parseBSDEnum(el : HTMLElement) : void {
        let file = new EnumTypeFile(this.currentModulePath);
        let parser = new BSDEnumTypeFileParser(el,file);
        parser.parse();
        //this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);   
    }

    public writeToFile(path : string,cls : ClassFile) {
        fs.writeFile(path,cls.toString(),"utf8", (err) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log("file written: " + path);
            }
        });
    }

    public insertIntoFile(path : string, cls : ClassFile) {
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
        let ar : BSDClassFileParser[] = [];

        for (let iterations=0; iterations < 10; iterations++) {
            for (let t of this.clsIncompleteTypes) {
                t.parse();
                if (!t.Cls.Complete) {
                    ar.push(t);
                }
            }
            this.clsIncompleteTypes = ar;

            if (ar.length == 0) {
                return;
            }
        }
    }

    protected fixSchemaFaults(doc : JSDOM) {

        //uint16 instead of Int32
        let el =doc.window.document.querySelector('[Name="QualifiedName"] > [Name="NamespaceIndex"]');
        if (el) el.setAttribute("TypeName","opc:UInt16");             

        //DataValue --> order of encoding bytes is wrong
        el = doc.window.document.querySelector('[Name="DataValue"]');
        let el2 = doc.window.document.querySelector('[Name="SourcePicosecondsSpecified"]');
        let el3 =  doc.window.document.querySelector('[Name="ServerTimestampSpecified"]');
        if(el) el.insertBefore(<Node>el3,<Node>el2);

    }

    protected writeFiles() {
        let ar : ClassFile[];
        ar = TypeRegistry.getTypes();
        for (let file of ar) {
            if (!file.Written) {
                let arParams = this.metaTypeMap[/*"DataType"*/"Object"][file.Name + "_Encoding_DefaultBinary"];
                if (!arParams) {
                    arParams = this.metaTypeMap["DataType"][file.Name ];
                }
                if (arParams) {
                    file.setTypeId(arParams[1],this.namespace);
                }
                this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);
                file.Written = true;
            }
        }
    }

    protected writeIndexFile() {

        let strFileContent = '';
        const ar = TypeRegistry.getTypes();

        for (const file of ar) {
            if (file.Written) {
                continue;
            }
            strFileContent += 'export * from \'./' + file.Name + '\';\n';
        }

        fs.writeFile(this.outPath + '/index.ts' , strFileContent, 'utf8', (err) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log('file written: ' + this.outPath + '/index.ts');
            }
        });
    }

    public parseComplexType() {
        console.log("hohoho");
    }
}