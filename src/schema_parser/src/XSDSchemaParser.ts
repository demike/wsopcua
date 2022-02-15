import { JSDOM } from 'jsdom';
import { XSDClassFile } from './XSDClassFile';
import { XSDComplexTypeFile } from './XSDComplexTypeFile';
import * as fs from 'fs';

export class XSDSchemaParser {
  public static readonly TAG_COMPLEX_TYPE = 'xs:complexType';
  public static readonly TAG_SIMPLE_TYPE = 'xs:simpleType';

  public static readonly TAG_STRUCT_TYPE = 'opc:StructuredType';

  public clsFileMap: { [key: string]: XSDClassFile };
  protected outPath = '';
  protected inPath = '';

  constructor() {
    this.clsFileMap = {};
  }

  public parse(inpath: string, outpath: string) {
    this.inPath = inpath;
    this.outPath = outpath;
    fs.readFile(inpath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      // console.log(data);
      const doc = new JSDOM(data);
      for (let i = 0; i < doc.window.document.childNodes.length; i++) {
        const el: HTMLElement = <HTMLElement>doc.window.document.childNodes.item(i);
        this.parseXSDElement(el);
      }
    });
  }

  public parseXSDElement(el: HTMLElement) {
    switch (el.tagName) {
      case XSDSchemaParser.TAG_SIMPLE_TYPE:
        // nothing to do: the enum description is taken from the .bsd file
        break;
      case XSDSchemaParser.TAG_COMPLEX_TYPE:
        this.parseComplexeType(el);
      default:
        break;
    }
  }

  public parseComplexeType(el: HTMLElement): void {
    const typeName = el.getAttribute('name');
    if (typeName == null || typeName.search('ListOf') === 0) {
      // just a list type or type name missing
      return;
    }
    const file = new XSDComplexTypeFile(el);
    file.parse();
    this.clsFileMap[file.Name] = file;
    this.writeToFile(this.outPath + '/' + file.Name + '.ts', file);
  }

  public writeToFile(path: string, cls: XSDClassFile) {
    fs.writeFile(path, cls.toString(), 'utf8', (err) => {
      console.log(err);
    });
  }

  public parseComplexType() {
    console.log('hohoho');
  }
}
