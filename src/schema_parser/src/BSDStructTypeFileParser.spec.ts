import { JSDOM } from 'jsdom';
import { BSDSchemaParser } from './BSDSchemaParser';
import { ClassFileState } from './ClassFile';
import { EnumTypeFile } from './EnumTypeFile';
import { StructTypeFile } from './StructTypeFile';
import { TypeRegistry } from './TypeRegistry';

/* global describe, it, expect, beforeEach, afterEach */

const BSD_DOC = `<?xml version="1.0" encoding="utf-8"?>
<opc:TypeDictionary
  xmlns:opc="http://opcfoundation.org/BinarySchema/"
  xmlns:tns="http://opcfoundation.org/UA/"
  TargetNamespace="http://opcfoundation.org/UA/">
  <opc:StructuredType Name="MyTestStruct">
    <opc:Field Name="Count" TypeName="opc:UInt32" />
    <opc:Field Name="Title" TypeName="opc:String" />
    <opc:Field Name="NoOfItems" TypeName="opc:Int32" />
    <opc:Field Name="Items" TypeName="opc:UInt32" LengthField="NoOfItems" />
  </opc:StructuredType>
  <opc:EnumeratedType Name="MyTestEnum" LengthInBits="32">
    <opc:EnumeratedValue Name="None" Value="0" />
    <opc:EnumeratedValue Name="Active" Value="1" />
  </opc:EnumeratedType>
</opc:TypeDictionary>`;

describe('BSD struct and enum parsing', function () {
  let savedTypeMap: { [key: string]: any };

  beforeEach(function () {
    savedTypeMap = TypeRegistry.typeMap;
    TypeRegistry.typeMap = {};
    TypeRegistry.init();
  });

  afterEach(function () {
    TypeRegistry.typeMap = savedTypeMap;
  });

  function parseDoc(xml: string = BSD_DOC): BSDSchemaParser {
    const parser = new BSDSchemaParser();
    parser.parseBSDDoc(new JSDOM(xml, { contentType: 'text/xml' }));
    return parser;
  }

  it('should parse a structured type with scalar and array members', function () {
    parseDoc();

    const file = TypeRegistry.getType('MyTestStruct');
    expect(file).toBeDefined();
    expect(file).toBeInstanceOf(StructTypeFile);
    expect(file?.state).toBe(ClassFileState.Parsed);

    const names = file?.Members.map((m) => m.Name);
    // array length fields are consumed by the array handling
    expect(names).toEqual(['count', 'title', 'items']);
    expect(file?.getMemberByName('items')?.IsArray).toBe(true);
    expect(file?.getMemberByName('count')?.IsArray).toBe(false);
  });

  it('should generate encode/decode/clone methods and a class header', function () {
    parseDoc();

    const file = TypeRegistry.getType('MyTestStruct');
    expect(file?.getMethodByName('constructor')).toBeDefined();
    expect(file?.getMethodByName('encode')).toBeDefined();
    expect(file?.getMethodByName('decode')).toBeDefined();
    expect(file?.getMethodByName('clone')).toBeDefined();
    expect(file?.getMethodByName('toJSON')).toBeDefined();
    expect(file?.getMethodByName('fromJSON')).toBeDefined();

    const out = file?.toString() ?? '';
    expect(out).toContain('export class MyTestStruct');
    expect(out).toContain('export function decodeMyTestStruct');
    expect(out).toContain('export type IMyTestStruct');
  });

  it('should parse an enumerated type with values and a default', function () {
    parseDoc();

    const file = TypeRegistry.getType('MyTestEnum');
    expect(file).toBeDefined();
    expect(file).toBeInstanceOf(EnumTypeFile);
    expect(file?.state).toBe(ClassFileState.Parsed);
    expect((file as EnumTypeFile).defaultValue).toBe('MyTestEnum.None');

    const out = file?.toString() ?? '';
    expect(out).toContain('export enum MyTestEnum');
    expect(out).toContain('None = 0,');
    expect(out).toContain('Active = 1,');
    expect(out).toContain("registerEnumeration('MyTestEnum'");
  });

  it('should mark types with unknown member types as incomplete', function () {
    // NOTE: this also guards against a past infinite loop in parseSecondPass,
    // which grew the incomplete list while iterating it whenever a type never
    // resolved. This test must terminate with the type still incomplete.
    parseDoc(
      `<?xml version="1.0" encoding="utf-8"?>` +
        `<opc:TypeDictionary xmlns:opc="http://opcfoundation.org/BinarySchema/" ` +
        `TargetNamespace="http://opcfoundation.org/UA/">` +
        `<opc:StructuredType Name="BrokenStruct">` +
        `<opc:Field Name="What" TypeName="tns:NoSuchType" />` +
        `</opc:StructuredType></opc:TypeDictionary>`
    );

    const file = TypeRegistry.getType('BrokenStruct');
    expect(file).toBeDefined();
    expect(file?.state).toBe(ClassFileState.InProgress);
    expect(file?.Members).toHaveLength(0);
  });

  it('should complete incomplete types once their dependency is parsed (second pass)', function () {
    const parser = new BSDSchemaParser();
    const parse = (xml: string) =>
      parser.parseBSDDoc(new JSDOM(xml, { contentType: 'text/xml' }));
    const wrap = (inner: string) =>
      `<?xml version="1.0" encoding="utf-8"?>` +
      `<opc:TypeDictionary xmlns:opc="http://opcfoundation.org/BinarySchema/" ` +
      `xmlns:tns="http://opcfoundation.org/UA/" TargetNamespace="http://opcfoundation.org/UA/">` +
      inner +
      `</opc:TypeDictionary>`;

    // dependency parsed after its user: first pass leaves Holder incomplete
    parse(
      wrap(
        `<opc:StructuredType Name="Holder">` +
          `<opc:Field Name="Inner" TypeName="tns:LateStruct" />` +
          `</opc:StructuredType>`
      )
    );
    expect(TypeRegistry.getType('Holder')?.state).toBe(ClassFileState.InProgress);

    parse(
      wrap(
        `<opc:StructuredType Name="LateStruct">` +
          `<opc:Field Name="Count" TypeName="opc:UInt32" />` +
          `</opc:StructuredType>`
      )
    );

    const holder = TypeRegistry.getType('Holder');
    expect(holder?.state).toBe(ClassFileState.Parsed);
    expect(holder?.getMemberByName('inner')).toBeDefined();
  });
});
