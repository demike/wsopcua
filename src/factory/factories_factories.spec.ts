import {
  constructObject,
  getConstructor,
  hasConstructor,
  register_class_definition,
} from './factories_factories';
import { NodeIdType } from '../generated/NodeIdType';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
import { NodeId } from '../nodeid/nodeid';
import { TransferResultDataDataType } from '../generated/DI/TransferResultDataDataType';

/* global describe, it, expect */

const DI_URI = 'http://opcfoundation.org/UA/DI/';
const OTHER_URI = 'http://example.org/UA/Custom/';

function makeStdId(value: number): ExpandedNodeId {
  return new ExpandedNodeId(NodeIdType.Numeric, value, 0);
}

function makeCustomId(value: number, namespace: number, namespaceUri: string): ExpandedNodeId {
  return new ExpandedNodeId(NodeIdType.Numeric, value, namespace, namespaceUri);
}

describe('factories_factories (issue #10: encoding ids)', function () {
  it('should resolve an ns=0 class by its encoding id', function () {
    class StdEncodingTestClass {}
    register_class_definition('StdEncodingTestClass', StdEncodingTestClass, makeStdId(999001));

    const id = makeStdId(999001);
    expect(hasConstructor(id)).toBe(true);
    expect(getConstructor(id)).toBe(StdEncodingTestClass);
    expect(constructObject(id) instanceof StdEncodingTestClass).toBe(true);
    expect(constructObject(id).constructor).toBe(StdEncodingTestClass);
  });

  it('should resolve a companion-spec class by (namespaceUri, id), independent of the ns index', function () {
    class DiEncodingTestClass {}
    // generated code emits the placeholder ns index together with the stable uri
    register_class_definition(
      'DiEncodingTestClass',
      DiEncodingTestClass,
      makeCustomId(999002, 2, DI_URI)
    );

    // same type seen on a server that assigned ns=5 (reboot / second server)
    const rebootedId = makeCustomId(999002, 5, DI_URI);
    expect(hasConstructor(rebootedId)).toBe(true);
    expect(getConstructor(rebootedId)).toBe(DiEncodingTestClass);
    expect(constructObject(rebootedId) instanceof DiEncodingTestClass).toBe(true);

    // plain NodeId (ns index only, as decoded from a binary ExtensionObject TypeId)
    // resolves through the session NamespaceArray
    const namespaceArray = ['http://opcfoundation.org/UA/', 'urn:other', DI_URI];
    const wireId = new NodeId(NodeIdType.Numeric, 999002, 2);
    expect(hasConstructor(wireId, namespaceArray)).toBe(true);
    expect(constructObject(wireId, namespaceArray) instanceof DiEncodingTestClass).toBe(true);

    // same numeric value under a different uri is a different type
    expect(hasConstructor(makeCustomId(999002, 2, OTHER_URI))).toBe(false);
    expect(getConstructor(makeCustomId(999002, 2, OTHER_URI))).toBeNull();
  });

  it('should not resolve a custom type without namespaceUri or NamespaceArray', function () {
    const wireId = new NodeId(NodeIdType.Numeric, 999002, 2);
    expect(hasConstructor(wireId)).toBe(false);
    expect(getConstructor(wireId)).toBeNull();
    expect(constructObject(wireId)).toBeNull();
  });

  it('should keep legacy behavior for ns!=0 ids registered without namespaceUri', function () {
    class LegacyCustomTestClass {}
    const legacyId = new ExpandedNodeId(NodeIdType.Numeric, 999003, 2);
    register_class_definition('LegacyCustomTestClass', LegacyCustomTestClass, legacyId);

    // legacy value-keyed lookup still finds it (pre-existing behavior)
    expect(hasConstructor(legacyId)).toBe(true);
    expect(getConstructor(legacyId)).toBe(LegacyCustomTestClass);
  });

  it('should resolve a real generated DI class by encoding id (issue #10)', function () {
    const encoding = (TransferResultDataDataType.prototype as any).encodingDefaultBinary;
    // DataType id would be 15889; the wire/encoding id is 15892
    expect(encoding.value).toBe(15892);
    expect(encoding.namespaceUri).toBe(DI_URI);

    const obj = new TransferResultDataDataType();
    const namespaceArray = ['http://opcfoundation.org/UA/', 'urn:placeholder', DI_URI];
    const wireId = new NodeId(NodeIdType.Numeric, 15892, 2);
    const reloaded = constructObject(wireId, namespaceArray);
    expect(reloaded instanceof TransferResultDataDataType).toBe(true);
    expect(obj).toBeDefined();
  });

  it('should reject a conflicting registration for the same id', function () {
    class FirstDuplicateTestClass {}
    class SecondDuplicateTestClass {}
    register_class_definition(
      'FirstDuplicateTestClass',
      FirstDuplicateTestClass,
      makeStdId(999004)
    );
    expect(() =>
      register_class_definition(
        'SecondDuplicateTestClass',
        SecondDuplicateTestClass,
        makeStdId(999004)
      )
    ).toThrow();
  });
});
