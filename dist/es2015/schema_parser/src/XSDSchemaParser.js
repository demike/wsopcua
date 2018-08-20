import { JSDOM } from 'jsdom';
import { XSDComplexTypeFile } from './XSDComplexTypeFile';
import * as fs from 'fs';
export class XSDSchemaParser {
    constructor() {
        this.outPath = "";
        this.inPath = "";
        this.clsFileMap = {};
    }
    parse(inpath, outpath) {
        this.inPath = inpath;
        this.outPath = outpath;
        fs.readFile(inpath, 'utf8', (err, data) => {
            if (err)
                throw err;
            //console.log(data);
            let doc = new JSDOM(data);
            for (let i = 0; i < doc.window.document.childNodes.length; i++) {
                let el = (doc.window.document.childNodes.item(i));
                this.parseXSDElement(el);
            }
        });
    }
    parseXSDElement(el) {
        switch (el.tagName) {
            case XSDSchemaParser.TAG_SIMPLE_TYPE:
                //nothing to do: the enum description is taken from the .bsd file
                break;
            case XSDSchemaParser.TAG_COMPLEX_TYPE:
                this.parseComplexeType(el);
            default:
                break;
        }
    }
    parseComplexeType(el) {
        let typeName = el.getAttribute("name");
        if (typeName == null || typeName.search("ListOf") == 0) {
            //just a list type or type name missing
            return;
        }
        let file = new XSDComplexTypeFile(el);
        file.parse();
        this.clsFileMap[file.Name] = file;
        this.writeToFile(this.outPath + "/" + file.Name + ".ts", file);
    }
    writeToFile(path, cls) {
        fs.writeFile(path, cls.toString(), "utf8", (err) => {
            console.log(err);
        });
    }
    parseComplexType() {
        console.log("hohoho");
    }
}
XSDSchemaParser.TAG_COMPLEX_TYPE = "xs:complexType";
XSDSchemaParser.TAG_SIMPLE_TYPE = "xs:simpleType";
XSDSchemaParser.TAG_STRUCT_TYPE = "opc:StructuredType";
//# sourceMappingURL=XSDSchemaParser.js.map