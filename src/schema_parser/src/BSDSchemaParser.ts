import { JSDOM } from 'jsdom';
import * as path from 'path';

import * as fs from 'fs';
import {
  ClassMethod,
  BSDClassFileParser,
  BSDStructTypeFileParser,
  StructTypeFile,
  BSDEnumTypeFileParser,
  EnumTypeFile,
} from './SchemaParser.module';
import { TypeRegistry } from './TypeRegistry';
import { ClassFile } from './ClassFile';
import { ProjectImportConfig, ProjectModulePath } from './SchemaParserConfig';
import { getSpecLink } from './spec-link-Import';

const DEFAULT_NS_URI = 'http://opcfoundation.org/UA/';

export class BSDSchemaParser {
  public static readonly TAG_TYPE_DICT = 'opc:TypeDictionary';
  public static readonly TAG_ENUM_TYPE = 'opc:EnumeratedType';
  public static readonly TAG_STRUCT_TYPE = 'opc:StructuredType';

  public clsIncompleteTypes: BSDClassFileParser[];

  protected outPath = '.';
  protected conf?: ProjectImportConfig;
  protected currentModulePath: ProjectModulePath = new ProjectModulePath('wsopcua', '/generated');

  protected metaTypeMap: { [key: string]: { [key: string]: string[] } } = {};
  protected namespace: string | number = -1;
  protected namespaceUri = DEFAULT_NS_URI;

  protected importConfig?: ProjectImportConfig;

  constructor() {
    this.clsIncompleteTypes = [];
  }

  public async parse(
    importConfig: ProjectImportConfig,
    metaTypeMap: { [key: string]: { [key: string]: string[] } }
  ): Promise<void> {
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
        console.log("Parsing '" + schema.pathToSchema + "':\n");
        data = this.fixDocData(data);
        // console.log(data);
        const doc = new JSDOM(data, { contentType: 'text/xml' });
        if (schema.pathToSchema.indexOf('.bsd') !== -1) {
          await this.parseBSDDoc(doc);
        } else {
          await this.parseNodeSet2XmlDoc(doc);
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
      const nodeId = this.getTypeId(el);
      let browseName = el.getAttribute('BrowseName');
      if (nodeId && browseName) {
        browseName = browseName.split(':')[1];
        this.metaTypeMap['DataType'][browseName] = [browseName, nodeId, 'DataType'];
      }
    }
  }

  /**
   * returns the type id without namespace and prefix (s=, i= ... )
   * @param el
   * @returns
   */
  protected getTypeId(el: Element) {
    let nodeId: string | null;
    // has encoding reference
    const hasEncodingRef = el.querySelector('References > Reference[ReferenceType="i=38"]');
    if (hasEncodingRef && hasEncodingRef.innerHTML) {
      nodeId = hasEncodingRef.innerHTML;
    } else {
      nodeId = el.getAttribute('NodeId');
    }

    if (nodeId) {
      let split;
      split = nodeId.split(';');
      const id = split.length >= 2 ? split[1] : nodeId;

      split = id.split('=');
      if (split.length >= 2) {
        return split[split.length - 1];
      }
      return id;
    }

    return nodeId;
  }

  public async parseNodeSet2XmlDoc(doc: JSDOM) {
    let binarySchemaFound = false;
    this.namespaceUri = this.extractNodeSet2XmlNamespaceUri(doc) ?? DEFAULT_NS_URI;
    this.addTypeIdsFromNodeSet(doc);
    const elements = doc.window.document.querySelectorAll(
      '[DataType="ByteString"][SymbolicName$="_BinarySchema"] > Value,' +
        '[DataType="i=15"][SymbolicName$="_BinarySchema"] > Value,' +
        '[DataType="ByteString"] > Value,' +
        '[DataType="i=15"] > Value'
    );

    for (let i = 0; i < elements.length; i++) {
      const el = elements.item(i);
      for (let j = 0; j < el.children.length; j++) {
        const elByteString = el.children.item(j);
        if (!elByteString) {
          continue;
        }

        binarySchemaFound = true;
        let docdata = Buffer.from(elByteString.innerHTML, 'base64').toString();
        docdata = this.fixDocData(docdata);
        await this.parseBSDDoc(new JSDOM(docdata, { contentType: 'text/xml' }));
        break;
      }
    }

    if (!binarySchemaFound) {
      console.log('could not find binary schema in .xsd file');
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
    this.namespaceUri = this.extractBSDNamespaceUri(doc) ?? DEFAULT_NS_URI;
    for (let i = 0; i < doc.window.document.childNodes.length; i++) {
      const el: HTMLElement = <HTMLElement>doc.window.document.childNodes.item(i);
      this.parseBSDElement(el);
    }
    // second pass for incomplete types
    this.parseSecondPass();
    this.writeIndexFile();
    return this.writeFiles();
  }

  protected extractBSDNamespaceUri(doc: JSDOM) {
    return doc.window.document.children.item(0)?.attributes.getNamedItem('TargetNamespace')?.value;
  }

  protected extractNodeSet2XmlNamespaceUri(doc: JSDOM) {
    // TODO: for now only the first namespace uri is taken into account
    return doc.window.document.querySelector('NamespaceUris')?.children.item(0)?.textContent;
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
          const child: HTMLElement = <HTMLElement>el.childNodes.item(i);
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
      this.parseBSDElement(<HTMLElement>el.childNodes.item(i));
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
      this.clsIncompleteTypes.push(parser);
    }
    // this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);
  }

  public parseBSDEnum(el: HTMLElement): void {
    const file = new EnumTypeFile(this.currentModulePath);
    const parser = new BSDEnumTypeFileParser(el, file);
    parser.parse();
    // this.writeToFile(this.outPath + "/" + file.Name + ".ts",file);
  }

  public writeToFile(strPath: string, cls: ClassFile) {
    try {
      fs.writeFileSync(strPath, cls.toString(), 'utf8');
      console.log('file written: ' + strPath);
    } catch (err) {
      console.log((err as Error).message);
    }
  }

  public insertIntoFile(strPath: string, cls: ClassFile) {
    fs.readFile(strPath, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      data += data.replace(ClassMethod.DE_SERIALIZER_METHOD_PLACEHOLDER, cls.toString());
      // write the modified class file
      fs.writeFile(strPath, data, 'utf8', (err1) => {
        if (err1) {
          console.log(err1.message);
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

      if (ar.length === 0) {
        return;
      }
    }
  }

  protected fixSchemaFaults(doc: JSDOM) {
    // uint16 instead of Int32
    let el = doc.window.document.querySelector('[Name="QualifiedName"] > [Name="NamespaceIndex"]');
    if (el) {
      el.setAttribute('TypeName', 'opc:UInt16');
    }

    // DataValue --> order of encoding bytes is wrong
    el = doc.window.document.querySelector<HTMLElement>('[Name="DataValue"]');
    if (el) {
      const el2 = el.querySelector<HTMLElement>('[Name="SourcePicosecondsSpecified"]');
      const el3 = el.querySelector<HTMLElement>('[Name="ServerTimestampSpecified"]');
      if (el3 && el2 && el) {
        el3.remove();
        el.insertBefore(<Node>el3, <Node>el2);
      }
    }
  }

  protected async writeFiles() {
    if (!this.importConfig) {
      return;
    }
    const ar = TypeRegistry.getTypes();
    for (const file of ar) {
      if (!file.Written) {
        if (!this.importConfig.readonly) {
          const arParams = this.metaTypeMap['DataType'][file.Name];
          let arParamsEncodingBinary =
            this.metaTypeMap[/* "DataType"*/ 'Object'][file.Name + '_Encoding_DefaultBinary'];
          if (!arParamsEncodingBinary) {
            arParamsEncodingBinary = arParams;
          }
          if (arParamsEncodingBinary) {
            file.setTypeId(arParams[1], this.namespaceUri, this.namespace);
          }

          if (arParams) {
            try {
              await this.fetchSpecLink(file, arParams[1], this.namespaceUri, this.namespace);
            } catch (err) {
              console.log('error fetching spec link', err);
            }
          }
        }
        this.writeToFile(path.resolve(this.outPath, file.Name + '.ts'), file);
      }
      file.Written = true;
    }
  }

  protected async fetchSpecLink(
    cls: ClassFile,
    id: string,
    namespaceUri: string,
    namespace: string | number
  ) {
    if (!namespaceUri.startsWith(DEFAULT_NS_URI)) {
      // no opcua foundation namespace
      return;
    }
    const strNodeId = this.getNodeIdString(id, namespaceUri, namespace);
    cls.specLink = await getSpecLink(strNodeId);
    if (!cls.specLink) {
      // try with browse name
      cls.specLink = await getSpecLink(`${namespaceUri}:${cls.Name}`);
    }
    if (!cls.specLink) {
      console.log('missing spec link', cls.Name, strNodeId);
    }
  }

  protected getNodeIdString(id: string, namespaceUri: string, namespace?: string | number) {
    /*
    return `${!isNaN(namespace as any) ? 'ns=' : 'nsu='}${namespace};${
      !isNaN(id as any) ? 'i=' : 's='
    }${id}`;
    */
    return `${'nsu='}${namespaceUri};${!isNaN(id as any) ? 'i=' : 's='}${id}`;
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
      strFileContent += "export * from './" + file.Name + "';\n";
    }
    try {
      if (strFileContent.length > 0) {
        const indexFilePath = path.resolve(this.outPath, 'index.ts');
        fs.writeFileSync(indexFilePath, strFileContent, 'utf8');
        console.log('file written: ' + indexFilePath);
      }
    } catch (err) {
      console.log((err as Error).message);
    }
  }

  public parseComplexType() {
    console.log('hohoho');
  }
}
