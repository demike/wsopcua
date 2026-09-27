import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import { BSDSchemaParser } from './BSDSchemaParser';
import { ClassFileState } from './ClassFile';
import { StructTypeFile } from './StructTypeFile';
import { TypeRegistry } from './TypeRegistry';
import { ProjectModulePath } from './SchemaParserConfig';

/* global describe, it, expect, beforeEach, afterEach */

const DI_URI = 'http://opcfoundation.org/UA/DI/';

function parseXml(xml: string): JSDOM {
  return new JSDOM(xml, { contentType: 'text/xml' });
}

function queryFirst(doc: JSDOM, selector: string): Element {
  const el = doc.window.document.querySelector(selector);
  if (!el) {
    throw new Error(`expected element for selector ${selector}`);
  }
  return el;
}

/** Exposes the protected members under test without changing the parser. */
class TestableParser extends BSDSchemaParser {
  public specLinkCalls = 0;

  public testAddTypeIdsFromNodeSet(doc: JSDOM): void {
    this.addTypeIdsFromNodeSet(doc);
  }

  public testGetTypeId(el: Element): string | null {
    return this.getTypeId(el);
  }

  public setMetaTypeMap(metaTypeMap: { [key: string]: { [key: string]: string[] } }): void {
    this.metaTypeMap = metaTypeMap;
  }

  public setOutPath(outPath: string): void {
    this.outPath = outPath;
  }

  public setImportConfig(importConfig: any): void {
    this.importConfig = importConfig;
  }

  public setNamespace(namespace: string | number, namespaceUri: string): void {
    this.namespace = namespace;
    this.namespaceUri = namespaceUri;
  }

  public getMetaTypeMap(): { [key: string]: { [key: string]: string[] } } {
    return this.metaTypeMap;
  }

  public testWriteFiles(): Promise<void> {
    return this.writeFiles();
  }

  protected override async fetchSpecLink(): Promise<undefined> {
    this.specLinkCalls++;
    return undefined;
  }
}

const DI_NODE_SET = `<?xml version="1.0" encoding="utf-8" ?>
<UANodeSet xmlns="http://opcfoundation.org/UA/2011/03/UANodeSet.xsd">
  <NamespaceUris><Uri>${DI_URI}</Uri></NamespaceUris>
  <UADataType NodeId="ns=1;i=15889" BrowseName="1:TransferResultDataDataType">
    <References>
      <Reference ReferenceType="HasSubtype" IsForward="false">ns=1;i=6522</Reference>
    </References>
  </UADataType>
  <UADataType NodeId="ns=1;i=6522" BrowseName="1:FetchResultDataType">
    <References>
      <Reference ReferenceType="HasSubtype" IsForward="false">i=22</Reference>
    </References>
  </UADataType>
  <UAObject NodeId="ns=1;i=15892" BrowseName="Default Binary" SymbolicName="DefaultBinary">
    <References>
      <Reference ReferenceType="HasEncoding" IsForward="false">ns=1;i=15889</Reference>
      <Reference ReferenceType="HasTypeDefinition">i=76</Reference>
    </References>
  </UAObject>
  <UAObject NodeId="ns=1;i=15893" BrowseName="Default Xml" SymbolicName="DefaultXml">
    <References>
      <Reference ReferenceType="HasEncoding" IsForward="false">ns=1;i=15889</Reference>
      <Reference ReferenceType="HasTypeDefinition">i=76</Reference>
    </References>
  </UAObject>
  <UAObject NodeId="ns=1;i=15001" BrowseName="1:SomeMetaData">
    <References>
      <Reference ReferenceType="HasProperty">ns=1;i=15002</Reference>
    </References>
  </UAObject>
</UANodeSet>`;

describe('BSDSchemaParser node id helpers', function () {
  const parser = new TestableParser();

  it('should prefer a forward HasEncoding reference', function () {
    const doc = parseXml(
      `<UADataType NodeId="ns=1;i=6522" BrowseName="1:Foo">` +
        `<References><Reference ReferenceType="i=38">ns=1;i=6551</Reference></References>` +
        `</UADataType>`
    );
    expect(parser.testGetTypeId(queryFirst(doc, 'UADataType'))).toBe('6551');
  });

  it('should fall back to the NodeId attribute without encoding reference', function () {
    const doc = parseXml(`<UADataType NodeId="ns=1;i=6522" BrowseName="1:Foo"></UADataType>`);
    expect(parser.testGetTypeId(queryFirst(doc, 'UADataType'))).toBe('6522');
  });

  it('should parse plain numeric and string node ids', function () {
    const numeric = parseXml(`<UADataType NodeId="i=307" BrowseName="AppType"></UADataType>`);
    expect(parser.testGetTypeId(queryFirst(numeric, 'UADataType'))).toBe('307');
    const str = parseXml(`<UADataType NodeId="ns=1;s=MyName" BrowseName="1:Bar"></UADataType>`);
    expect(parser.testGetTypeId(queryFirst(str, 'UADataType'))).toBe('MyName');
  });

  it('should normalize and extract numeric node ids', function () {
    const anyParser = BSDSchemaParser as any;
    expect(anyParser.normalizeNodeId('ns=1;i=6522')).toBe('i=6522');
    expect(anyParser.normalizeNodeId('i=307')).toBe('i=307');
    expect(anyParser.extractNumericId('ns=1;i=6551')).toBe('6551');
    expect(anyParser.extractNumericId('ns=1;s=Name')).toBeNull();
    expect(anyParser.extractNumericId(null)).toBeNull();
  });
});

describe('BSDSchemaParser.addTypeIdsFromNodeSet (issue #10)', function () {
  it('should register datatype ids and resolve reverse HasEncoding refs to binary encodings', function () {
    const parser = new TestableParser();
    parser.setMetaTypeMap({ DataType: {}, Object: {} });
    parser.testAddTypeIdsFromNodeSet(parseXml(DI_NODE_SET));

    const map = parser.getMetaTypeMap();
    expect(map['DataType']['TransferResultDataDataType'][1]).toBe('15889');
    expect(map['DataType']['FetchResultDataType'][1]).toBe('6522');
    // the Default Binary encoding object id, not the datatype id
    expect(map['Object']['TransferResultDataDataType_Encoding_DefaultBinary'][1]).toBe(
      '15892'
    );
    // Default Xml objects and unrelated objects are ignored (binary-only scope)
    expect(
      map['Object']['TransferResultDataDataType_Encoding_DefaultXml']
    ).toBeUndefined();
  });

  it('should ignore encodings whose datatype is unknown', function () {
    const parser = new TestableParser();
    parser.setMetaTypeMap({ DataType: {}, Object: {} });
    parser.testAddTypeIdsFromNodeSet(
      parseXml(
        `<UANodeSet xmlns="http://opcfoundation.org/UA/2011/03/UANodeSet.xsd">` +
          `<UAObject NodeId="ns=1;i=15892" BrowseName="Default Binary" SymbolicName="DefaultBinary">` +
          `<References><Reference ReferenceType="HasEncoding" IsForward="false">ns=1;i=99999</Reference></References>` +
          `</UAObject></UANodeSet>`
      )
    );
    expect(Object.keys(parser.getMetaTypeMap()['Object'])).toHaveLength(0);
  });

  it('should create the Object map when missing and keep existing entries', function () {
    const parser = new TestableParser();
    const existing = ['TransferResultDataDataType_Encoding_DefaultBinary', '111', 'Object'];
    parser.setMetaTypeMap({ DataType: {}, Object: { [existing[0]]: existing } });
    parser.testAddTypeIdsFromNodeSet(parseXml(DI_NODE_SET));
    // NodeSet values must not clobber entries from NodeIds.csv
    expect(parser.getMetaTypeMap()['Object'][existing[0]][1]).toBe('111');
  });
});

describe('BSDSchemaParser.writeFiles (issue #10)', function () {
  const modulePath = new ProjectModulePath('wsopcua', '/generated');
  let savedTypeMap: { [key: string]: any };
  let tmpDir: string;

  beforeEach(function () {
    savedTypeMap = TypeRegistry.typeMap;
    TypeRegistry.typeMap = {};
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wsopcua-gen-'));
  });

  afterEach(function () {
    TypeRegistry.typeMap = savedTypeMap;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function addStructType(name: string): StructTypeFile {
    const file = new StructTypeFile(modulePath, name);
    TypeRegistry.addType(name, file);
    return file;
  }

  function readGenerated(name: string): string {
    return fs.readFileSync(path.join(tmpDir, `${name}.ts`), 'utf8');
  }

  it('should register the binary encoding id instead of the datatype id', async function () {
    const parser = new TestableParser();
    parser.setMetaTypeMap({
      DataType: { MyType: ['MyType', '100', 'DataType'] },
      Object: { MyType_Encoding_DefaultBinary: ['MyType_Encoding_DefaultBinary', '101', 'Object'] },
    });
    parser.setOutPath(tmpDir);
    parser.setImportConfig({ readonly: false });
    parser.setNamespace(0, 'http://opcfoundation.org/UA/');
    addStructType('MyType');

    await parser.testWriteFiles();

    const content = readGenerated('MyType');
    expect(content).toContain('new ExpandedNodeId(2 /*numeric id*/, 101, 0)');
    expect(content).not.toContain('100, 0)');
    expect(parser.specLinkCalls).toBe(1);
  });

  it('should fall back to the datatype id with a warning when no encoding exists', async function () {
    const parser = new TestableParser();
    parser.setMetaTypeMap({ DataType: { Builtin: ['Builtin', '23', 'DataType'] }, Object: {} });
    parser.setOutPath(tmpDir);
    parser.setImportConfig({ readonly: false });
    parser.setNamespace(0, 'http://opcfoundation.org/UA/');
    addStructType('Builtin');

    await parser.testWriteFiles();

    expect(readGenerated('Builtin')).toContain(
      'new ExpandedNodeId(2 /*numeric id*/, 23, 0)'
    );
  });

  it('should emit the namespaceUri for companion namespaces', async function () {
    const parser = new TestableParser();
    parser.setMetaTypeMap({
      DataType: { DiType: ['DiType', '15889', 'DataType'] },
      Object: { DiType_Encoding_DefaultBinary: ['DiType_Encoding_DefaultBinary', '15892', 'Object'] },
    });
    parser.setOutPath(tmpDir);
    parser.setImportConfig({ readonly: false });
    parser.setNamespace(2, DI_URI);
    addStructType('DiType');

    await parser.testWriteFiles();

    expect(readGenerated('DiType')).toContain(
      `new ExpandedNodeId(2 /*numeric id*/, 15892, 2, '${DI_URI}')`
    );
  });

  it('should not register a type id in readonly mode', async function () {
    const parser = new TestableParser();
    parser.setMetaTypeMap({
      DataType: {},
      Object: { RoType_Encoding_DefaultBinary: ['RoType_Encoding_DefaultBinary', '101', 'Object'] },
    });
    parser.setOutPath(tmpDir);
    parser.setImportConfig({ readonly: true });
    addStructType('RoType');

    await parser.testWriteFiles();

    expect(readGenerated('RoType')).not.toContain('register_class_definition');
    expect(parser.specLinkCalls).toBe(0);
  });
});
