import {JSDOM} from 'jsdom';
import * as path from 'path';

import * as fs from 'fs';
import { ClassMethod, BSDClassFileParser, BSDStructTypeFileParser,
    StructTypeFile, BSDEnumTypeFileParser, EnumTypeFile} from './SchemaParser.module';
import { TypeRegistry } from './TypeRegistry';
import { ClassFile } from './ClassFile';
import { ProjectImportConfig, ProjectModulePath } from './SchemaParserConfig';

export class BSDSchemaParser {
    public static readonly TAG_TYPE_DICT = 'opc:TypeDictionary';
    public static readonly TAG_ENUM_TYPE = 'opc:EnumeratedType';
    public static readonly TAG_STRUCT_TYPE = 'opc:StructuredType';

    public clsIncompleteTypes: BSDClassFileParser[];

    protected outPath = '.';
    protected conf?: ProjectImportConfig;
    protected currentModulePath: ProjectModulePath = new ProjectModulePath('wsopcua', '/generated');

    protected metaTypeMap: {[key: string]: {[key: string]: string[]}} = {};
    protected namespace: string | number  = -1;

    protected importConfig?: ProjectImportConfig;

    constructor() {
        this.clsIncompleteTypes = [];
    }

    public parse(importConfig: ProjectImportConfig,
            metaTypeMap: {[key: string]: {[key: string]: string[]}}): void {
        this.metaTypeMap = metaTypeMap;
        this.importConfig = importConfig;
        for (const schema of importConfig.schemaImports) {
            this.outPath = path.join(importConfig.projectSrcPath, schema.modulePath);
            if (schema.namespace !== undefined) {
                this.namespace = schema.namespace;
            }
            this.currentModulePath = new ProjectModulePath(importConfig.projectName, schema.modulePath);

            if (!fs.existsSync(this.outPath)) {
                fs.mkdirSync(this.outPath, { recursive: true } as any);
            }

            try {
                let data = fs.readFileSync(schema.pathToSchema, 'utf8');
                data = this.fixDocData(data);
                // console.log(data);
                const doc = new JSDOM(data, { contentType : 'text/xml'});
                if (schema.pathToSchema.endsWith('.bsd')) {
                    this.parseBSDDoc(doc);
                } else {
                    this.parseNodeSet2XmlDoc(doc);
                }
            } catch (err) {
                throw err;
            }
        }
    }

    protected addTypeIdsFromNodeSet(doc: JSDOM) {
        const elements = doc.window.document.querySelectorAll('UADataType');

        for (let i = 0; i < elements.length; i++) {
            const el = elements.item(i);
            const nodeId = this.getTypeNodeId(el);
            let browseName = el.getAttribute('BrowseName');
            if (nodeId && browseName) {
                browseName = browseName.split(':')[1];
                this.metaTypeMap['DataType'][browseName] = [browseName, nodeId, 'DataType'];
            }
        }
    }

    protected getTypeNodeId(el: Element) {
        let nodeId: string|null;
        //has encoding reference
        const hasEncodingRef = el.querySelector('References > Reference[ReferenceType="i=38"]');
        if (hasEncodingRef && hasEncodingRef.innerHTML) {
            nodeId = hasEncodingRef.innerHTML;
        } else {
            nodeId = el.getAttribute('NodeId');
        }

        if (nodeId) {
            let split;
            split = nodeId.split('x=');
            if (split.length >= 2) {
                return split[1];
            }
            split = nodeId.split('s=');
            if (split.length >= 2) {
                return "'" + split[split.length - 1 ] + "'";
            }
        }

        return nodeId;
    }

    public parseNodeSet2XmlDoc(doc: JSDOM) {
        this.addTypeIdsFromNodeSet(doc);
        const elements = doc.window.document.querySelectorAll('[DataType="ByteString"][SymbolicName$="_BinarySchema"] > Value');
        for (let i = 0; i < elements.length; i++) {
            const el = elements.item(i);
            for (let j = 0; j < el.children.length; j++) {
                const elByteString = el.children.item(j);
                if (!elByteString) {
                    continue;
                }
                let docdata =  Buffer.from(elByteString.innerHTML, 'base64').toString();
                    docdata = this.fixDocData(docdata);
                    this.parseBSDDoc(new JSDOM(docdata, { contentType : 'text/xml'}));
            }
        }


        

/*
        this.addTypeIdsFromNodeSet(doc);
        const elements = doc.window.document.querySelectorAll('ByteString');
        for (let i = 0; i < elements.length; i++) {
            const el = elements.item(i);
            let parent: HTMLElement| null;
            if (el && (parent = el.parentElement) && (parent = parent.parentElement)  ) {
                const name = parent.getAttribute('SymbolicName');
                if (name && name.endsWith('BinarySchema')) {
                    let docdata =  Buffer.from(el.innerHTML, 'base64').toString();
                    docdata = this.fixDocData(docdata);
                    this.parseBSDDoc(new JSDOM(docdata, { contentType : 'text/xml'}));
                    return;
                }
            }

        }
*/
    }


    /**
     * removes \r from the document
     * @param data the data to sanitize
     */
    public fixDocData(data: string) {
        return data.replace('\r', '');
    }

    public parseBSDDoc(doc: JSDOM) {
        this.fixSchemaFaults(doc);
            for (let i = 0; i < doc.window.document.childNodes.length; i++) {
                const el: HTMLElement = <HTMLElement>(doc.window.document.childNodes.item(i));
                this.parseBSDElement(el);
            }
            // second pass for incomplete types
            this.parseSecondPass();
            this.writeIndexFile();
            this.writeFiles();
    }

    public parseBSDElement(el: HTMLElement) {
        switch (el.tagName) {
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
                for (let i = 0; i < el.childNodes.length; i++) {
                    const child: HTMLElement = <HTMLElement>(el.childNodes.item(i));
                    this.parseBSDElement(child);
                }
                break;
        }
    }

    public parseBSDTypeDict(el: HTMLElement) {
        if (this.namespace === -1) {
            // namespace not yet defined --> get it from the BSD Type dictonary
            this.namespace = el.getAttribute('TargetNamespace') || -1;
        }

        for (let i = 0; i < el.childNodes.length; i++) {
            this.parseBSDElement(<HTMLElement>(el.childNodes.item(i)));
        }
    }

    public parseBSDStruct(el: HTMLElement): void {
        const file = new StructTypeFile(this.currentModulePath);
        const parser = new BSDStructTypeFileParser(el, file);
        const at = el.attributes.getNamedItem(ClassFile.ATTR_NAME);
        if (at && TypeRegistry.getType(at.value)) {
            // this type already exists
            return;
        }
        parser.parse();
        if (!file.Complete) {
        this.clsIncompleteTypes.push( parser);
        }
        // this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);

    }

    public parseBSDEnum(el: HTMLElement): void {
        const file = new EnumTypeFile(this.currentModulePath);
        const parser = new BSDEnumTypeFileParser(el, file);
        parser.parse();
        // this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);
    }

    public writeToFile(path: string, cls: ClassFile) {
        try {
            fs.writeFileSync(path, cls.toString(), 'utf8');
            console.log('file written: ' + path);
        } catch (err) {
            console.log(err.message);
        }
    }

    public insertIntoFile(path: string, cls: ClassFile) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) { throw err; }
            data += data.replace(ClassMethod.DE_SERIALIZER_METHOD_PLACEHOLDER, cls.toString());
            // write the modified class file
            fs.writeFile(path, data, 'utf8', (err) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('file written: ' + path);
                }
            });
        });
    }

    protected parseSecondPass() {
        const ar: BSDClassFileParser[] = [];

        for (let iterations = 0; iterations < 10; iterations++) {
            for (const t of this.clsIncompleteTypes) {
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

    protected fixSchemaFaults(doc: JSDOM) {

        // uint16 instead of Int32
        let el = doc.window.document.querySelector('[Name="QualifiedName"] > [Name="NamespaceIndex"]');
        if (el) { el.setAttribute('TypeName', 'opc:UInt16'); }

        // DataValue --> order of encoding bytes is wrong
        el = doc.window.document.querySelector<HTMLElement>('[Name="DataValue"]');
        if (el) {
            const el2 = el.querySelector<HTMLElement>('[Name="SourcePicosecondsSpecified"]');
            const el3 =  el.querySelector<HTMLElement>('[Name="ServerTimestampSpecified"]');
            if (el3 && el2 && el) {
                el3.remove();
                el.insertBefore(<Node>el3, <Node>el2);
            }
        }

    }

    protected writeFiles() {
        if(!this.importConfig) {
            return;
        }
        let ar: ClassFile[];
        ar = TypeRegistry.getTypes();
        for (const file of ar) {
            if (!file.Written) {
                if ( !this.importConfig.readonly) {
                    let arParams = this.metaTypeMap[/*"DataType"*/'Object'][file.Name + '_Encoding_DefaultBinary'];
                    if (!arParams) {
                        arParams = this.metaTypeMap['DataType'][file.Name ];
                    }
                    if (arParams) {
                        file.setTypeId(arParams[1], this.namespace);
                    }
                    this.writeToFile(path.resolve(this.outPath, file.Name + '.ts'), file);
                }
                file.Written = true;
            }
        }
    }

    protected writeIndexFile() {
        if (!this.importConfig || this.importConfig.readonly) {
            return;
        }
        let strFileContent = '';
        const ar = TypeRegistry.getTypes();

        for (const file of ar) {
            if (file.Written) {
                continue;
            }
            strFileContent += 'export * from \'./' + file.Name + '\';\n';
        }
        try {
            const indexFilePath = path.resolve(this.outPath, 'index.ts');
            fs.writeFileSync(indexFilePath , strFileContent, 'utf8');
            console.log('file written: ' + indexFilePath);
        } catch (err) {
            console.log(err.message);
        }
    }

    public parseComplexType() {
        console.log('hohoho');
    }
}
