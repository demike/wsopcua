import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import { ClassMethod, BSDStructTypeFileParser, StructTypeFile, BSDEnumTypeFileParser, EnumTypeFile } from './SchemaParser.module';
import { TypeRegistry } from './TypeRegistry';
import { ClassFile } from './ClassFile';
export class BSDSchemaParser {
    constructor() {
        this.metaTypeMap = {};
        this.namespace = "0";
        this.clsIncompleteTypes = [];
    }
    parse(inpath, outpath, metaTypeMap, namespace) {
        this.inPath = inpath;
        this.outPath = outpath;
        this.metaTypeMap = metaTypeMap;
        this.namespace = namespace;
        if (!fs.existsSync(outpath)) {
            fs.mkdirSync(outpath);
        }
        fs.readFile(inpath, 'utf8', (err, data) => {
            if (err)
                throw err;
            //console.log(data);
            let doc = new JSDOM(data, { contentType: "text/xml" });
            this.fixSchemaFaults(doc);
            for (let i = 0; i < doc.window.document.childNodes.length; i++) {
                let el = (doc.window.document.childNodes.item(i));
                this.parseBSDElement(el);
            }
            //second pass for incomplete types
            this.parseSecondPass();
            this.writeFiles();
        });
    }
    parseBSDElement(el) {
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
                    let child = (el.childNodes.item(i));
                    this.parseBSDElement(child);
                }
                break;
        }
    }
    parseBSDTypeDict(el) {
        for (let i = 0; i < el.childNodes.length; i++) {
            this.parseBSDElement((el.childNodes.item(i)));
        }
    }
    parseBSDStruct(el) {
        let file = new StructTypeFile();
        let parser = new BSDStructTypeFileParser(el, file);
        let at = el.attributes.getNamedItem(ClassFile.ATTR_NAME);
        if (at && TypeRegistry.getType(at.value)) {
            //this type already exists
            return;
        }
        parser.parse();
        if (!file.Complete)
            this.clsIncompleteTypes.push(parser);
        //this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);
    }
    parseBSDEnum(el) {
        let file = new EnumTypeFile();
        let parser = new BSDEnumTypeFileParser(el, file);
        parser.parse();
        //this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);   
    }
    writeToFile(path, cls) {
        fs.writeFile(path, cls.toString(), "utf8", (err) => {
            if (err) {
                console.log(err.message);
            }
            else {
                console.log("file written: " + path);
            }
        });
    }
    insertIntoFile(path, cls) {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err)
                throw err;
            data += data.replace(ClassMethod.DE_SERIALIZER_METHOD_PLACEHOLDER, cls.toString());
            //write the modified class file
            fs.writeFile(path, data, "utf8", (err) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log("file written: " + path);
                }
            });
        });
    }
    parseSecondPass() {
        let incomplete = 0;
        let ar = [];
        for (let iterations = 0; iterations < 10; iterations++) {
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
    fixSchemaFaults(doc) {
        //uint16 instead of Int32
        let el = doc.window.document.querySelector('[Name="QualifiedName"] > [Name="NamespaceIndex"]');
        if (el)
            el.setAttribute("TypeName", "opc:UInt16");
        //DataValue --> order of encoding bytes is wrong
        el = doc.window.document.querySelector('[Name="DataValue"]');
        let el2 = doc.window.document.querySelector('[Name="SourcePicosecondsSpecified"]');
        let el3 = doc.window.document.querySelector('[Name="ServerTimestampSpecified"]');
        if (el)
            el.insertBefore(el3, el2);
    }
    writeFiles() {
        let ar;
        ar = TypeRegistry.getTypes();
        for (let file of ar) {
            if (!file.Written) {
                let arParams = this.metaTypeMap[ /*"DataType"*/"Object"][file.Name + "_Encoding_DefaultBinary"];
                if (!arParams) {
                    arParams = this.metaTypeMap["DataType"][file.Name];
                }
                if (arParams) {
                    file.setTypeId(arParams[1], this.namespace);
                }
                this.writeToFile(this.outPath + "/" + file.Name + ".ts", file);
                file.Written = true;
            }
        }
    }
    parseComplexType() {
        console.log("hohoho");
    }
}
BSDSchemaParser.TAG_TYPE_DICT = "opc:TypeDictionary";
BSDSchemaParser.TAG_ENUM_TYPE = "opc:EnumeratedType";
BSDSchemaParser.TAG_STRUCT_TYPE = "opc:StructuredType";
//# sourceMappingURL=BSDSchemaParser.js.map