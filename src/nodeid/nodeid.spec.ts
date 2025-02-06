import {
  NodeId,
  coerceNodeId,
  makeNodeId,
  resolveNodeId,
  from_hex,
  build_nodid_indexes_for_class_map,
} from './nodeid';
import { assert } from '../assert';
import { ObjectIds } from '../constants/ObjectIds';
import { VariableIds } from '../constants/VariableIds';
import { NodeIdType } from '../generated/NodeIdType';
import { stringToUint8Array } from '../basic-types/DataStream';

beforeAll(() => {
  build_nodid_indexes_for_class_map(ObjectIds);
  build_nodid_indexes_for_class_map(VariableIds);
});

describe('testing NodeIds', function () {
  it('should create a NUMERIC nodeID', function () {
    const nodeId = new NodeId(NodeIdType.Numeric, 23, 2);
    expect(nodeId.value).toBe(23);
    expect(nodeId.namespace).toBe(2);
    expect(nodeId.identifierType).toBe(NodeIdType.Numeric);
    expect(nodeId.toString()).toBe('ns=2;i=23');
  });

  it('should create a NUMERIC nodeID with the largest possible values', function () {
    const nodeId = new NodeId(NodeIdType.Numeric, 0xffffffff, 0xffff);
    expect(nodeId.value).toBe(0xffffffff);
    expect(nodeId.namespace).toBe(0xffff);
    expect(nodeId.identifierType).toBe(NodeIdType.Numeric);
    expect(nodeId.toString()).toBe('ns=65535;i=4294967295');
  });

  it('should raise an error for  NUMERIC nodeID with invalid  values', function () {
    expect(function () {
      const nodeId = new NodeId(NodeIdType.Numeric, -1, -1);
    }).toThrowError();
  });

  it('should create a STRING nodeID', function () {
    const nodeId = new NodeId(NodeIdType.String, 'TemperatureSensor', 4);
    expect(nodeId.value).toBe('TemperatureSensor');
    expect(nodeId.namespace).toBe(4);
    expect(nodeId.identifierType).toBe(NodeIdType.String);
    expect(nodeId.toString()).toBe('ns=4;s=TemperatureSensor');
  });

  it('should create a OPAQUE nodeID', function () {
    const buffer = from_hex('deadbeef');
    const nodeId = new NodeId(NodeIdType.ByteString, buffer, 4);
    expect(nodeId.value).toEqual(buffer);
    expect(nodeId.namespace).toBe(4);
    expect(nodeId.identifierType).toBe(NodeIdType.ByteString);
    expect(nodeId.toString()).toBe('ns=4;b=deadbeef');
  });
});

describe('testing coerceNodeId', function () {
  it("should coerce a string of a form 'i=1234'", function () {
    expect(coerceNodeId('i=1234')).toEqual(makeNodeId(1234));
  });

  it("should coerce a string of a form 'ns=2;i=1234'", function () {
    expect(coerceNodeId('ns=2;i=1234')).toEqual(makeNodeId(1234, 2));
  });

  it("should coerce a string of a form 's=TemperatureSensor' ", function () {
    const ref_nodeId = new NodeId(NodeIdType.String, 'TemperatureSensor', 0);
    expect(coerceNodeId('s=TemperatureSensor')).toEqual(ref_nodeId);
  });

  it("should coerce a string of a form 'ns=2;s=TemperatureSensor' ", function () {
    const ref_nodeId = new NodeId(NodeIdType.String, 'TemperatureSensor', 2);
    expect(coerceNodeId('ns=2;s=TemperatureSensor')).toEqual(ref_nodeId);
  });

  it("should coerce a string of a form 'ns=4;s=Test32;datatype=Int32'  (Mika)", function () {
    const ref_nodeId = new NodeId(NodeIdType.String, 'Test32;datatype=Int32', 4);
    expect(coerceNodeId('ns=4;s=Test32;datatype=Int32')).toEqual(ref_nodeId);
    try {
      expect(makeNodeId('ns=4;s=Test32;datatype=Int32')).toEqual(ref_nodeId);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should coerce a integer', function () {
    expect(coerceNodeId(1234)).toEqual(makeNodeId(1234));
  });

  it('should coerce a OPAQUE buffer as a BYTESTRING', function () {
    const buffer = from_hex('b1dedadab0b0abba');
    const nodeId = coerceNodeId(buffer);
    expect(nodeId.toString()).toBe('ns=0;b=b1dedadab0b0abba');
    expect(nodeId.value).toEqual(buffer);
  });

  it('should coerce a OPAQUE buffer in a string ( with namespace ) ', function () {
    const nodeId = coerceNodeId('ns=0;b=b1dedadab0b0abba');
    expect(nodeId.identifierType).toBe(NodeIdType.ByteString);
    expect(nodeId.toString()).toBe('ns=0;b=b1dedadab0b0abba');
    expect(nodeId.value).toEqual(from_hex('b1dedadab0b0abba'));
  });
  it('should coerce a OPAQUE buffer in a string ( without namespace ) ', function () {
    const nodeId = coerceNodeId('b=b1dedadab0b0abba');
    expect(nodeId.identifierType).toBe(NodeIdType.ByteString);
    expect(nodeId.toString()).toBe('ns=0;b=b1dedadab0b0abba');
    expect(nodeId.value).toEqual(from_hex('b1dedadab0b0abba'));
  });
  it('should coerce a GUID node id (without namespace)', function () {
    const nodeId = coerceNodeId('g=1E14849E-3744-470d-8C7B-5F9110C2FA32');
    expect(nodeId.identifierType).toBe(NodeIdType.Guid);
    expect(nodeId.toString()).toBe('ns=0;g=1E14849E-3744-470D-8C7B-5F9110C2FA32');
    expect(nodeId.value).toBe('1E14849E-3744-470D-8C7B-5F9110C2FA32');
  });
  it('should coerce a GUID node id (with namespace)', function () {
    const nodeId = coerceNodeId('ns=0;g=1E14849E-3744-470d-8C7B-5F9110C2FA32');
    expect(nodeId.identifierType).toBe(NodeIdType.Guid);
    expect(nodeId.toString()).toBe('ns=0;g=1E14849E-3744-470D-8C7B-5F9110C2FA32');
    expect(nodeId.value).toBe('1E14849E-3744-470D-8C7B-5F9110C2FA32');
  });
  it('should coerce a GUID node id (with lower case)', function () {
    const nodeId = coerceNodeId('ns=0;g=1e14849e-3744-470d-8c7b-5f9110c2fa32');
    expect(nodeId.identifierType).toBe(NodeIdType.Guid);
    expect(nodeId.toString()).toBe('ns=0;g=1E14849E-3744-470D-8C7B-5F9110C2FA32');
    expect(nodeId.value).toBe('1E14849E-3744-470D-8C7B-5F9110C2FA32');
  });

  it('should not coerce a malformed string to a nodeid', function () {
    let nodeId;

    expect(function () {
      nodeId = coerceNodeId('ThisIsNotANodeId');
    }).toThrowError();

    expect(function () {
      nodeId = coerceNodeId('HierarchicalReferences');
    }).toThrowError();

    expect(function () {
      nodeId = coerceNodeId('ns=0;s=HierarchicalReferences');
      assert(nodeId !== null);
    }).not.toThrowError();
  });

  it('should detect empty Numeric NodeIds', function () {
    const empty_nodeId = makeNodeId(0, 0);
    expect(empty_nodeId.identifierType).toBe(NodeIdType.Numeric);
    expect(empty_nodeId.isEmpty()).toBeTruthy();

    const non_empty_nodeId = makeNodeId(1, 0);
    expect(non_empty_nodeId.isEmpty()).toBeFalsy();
  });
  it('should detect empty String NodeIds', function () {
    // empty string nodeId
    const empty_nodeId = coerceNodeId('ns=0;s=');
    expect(empty_nodeId.identifierType).toBe(NodeIdType.String);
    expect(empty_nodeId.isEmpty()).toBeTruthy();

    const non_empty_nodeId = coerceNodeId('ns=0;s=A');
    expect(non_empty_nodeId.identifierType).toBe(NodeIdType.String);
    expect(non_empty_nodeId.isEmpty()).toBeFalsy();
  });
  it('should detect empty Opaque NodeIds', function () {
    // empty opaque nodeId
    const empty_nodeId = coerceNodeId(new ArrayBuffer(0));
    expect(empty_nodeId.identifierType).toBe(NodeIdType.ByteString);
    expect(empty_nodeId.isEmpty()).toBeTruthy();

    const non_empty_nodeId = coerceNodeId(new ArrayBuffer(1));
    expect(empty_nodeId.identifierType).toBe(NodeIdType.ByteString);
    expect(non_empty_nodeId.isEmpty()).toBeFalsy();
  });
  it('should detect empty GUID NodeIds', function () {
    // empty GUID nodeId
    const empty_nodeId = coerceNodeId('g=00000000-0000-0000-0000-000000000000');
    expect(empty_nodeId.identifierType).toBe(NodeIdType.Guid);
    expect(empty_nodeId.isEmpty()).toBeTruthy();

    const non_empty_nodeId = coerceNodeId('g=00000000-0000-0000-0000-000000000001');
    expect(empty_nodeId.identifierType).toBe(NodeIdType.Guid);
    expect(non_empty_nodeId.isEmpty()).toBeFalsy();
  });

  it('should convert an empty NodeId to  <empty nodeid> string', function () {
    const empty_nodeId = makeNodeId(0, 0);
    expect(empty_nodeId.toString()).toBe('ns=0;i=0');
  });

  it('should coerce a string nodeid containing special characters', function () {
    // see issue#
    const nodeId = coerceNodeId('ns=3;s={360273AA-F2B9-4A7F-A5E3-37B7074E2529}.MechanicalDomain');
  });

  it('should return the same NodeId if a NodeId is provided', () => {
    const originalNodeId = coerceNodeId('ns=1;s=SomeString');
    const nodeId = coerceNodeId(originalNodeId);
    expect(nodeId).toBe(originalNodeId);
  });
});

describe('#sameNodeId', function () {
  const nodeIds = [
    makeNodeId(2, 3),
    makeNodeId(2, 4),
    makeNodeId(4, 3),
    makeNodeId(4, 300),
    new NodeId(NodeIdType.Numeric, 23, 2),
    new NodeId(NodeIdType.String, 'TemperatureSensor', 4),
    new NodeId(NodeIdType.String, 'A very long string very very long string', 4),
    new NodeId(NodeIdType.ByteString, stringToUint8Array('AZERTY'), 4),
  ];
  for (let i = 0; i < nodeIds.length; i++) {
    const nodeId1 = nodeIds[i];
    for (let j = 0; j < nodeIds.length; j++) {
      const nodeId2 = nodeIds[j];
      if (i === j) {
        it(
          "should be true  : #sameNodeId('" +
            nodeId1.toString() +
            "','" +
            nodeId2.toString() +
            "');",
          function () {
            expect(NodeId.sameNodeId(nodeId1, nodeId2)).toBe(true);
          }
        );
      } else {
        it(
          "should be false : #sameNodeId('" +
            nodeId1.toString() +
            "','" +
            nodeId2.toString() +
            "');",
          function () {
            expect(NodeId.sameNodeId(nodeId1, nodeId2)).toBe(false);
          }
        );
      }
    }
  }
});

describe('testing resolveNodeId', function () {
  // some objects
  it("should resolve RootFolder to 'ns=0;i=84' ", function () {
    const ref_nodeId = new NodeId(NodeIdType.Numeric, 84, 0);
    expect(resolveNodeId('RootFolder')).toEqual(ref_nodeId);
    expect(resolveNodeId('RootFolder').toString()).toBe('ns=0;i=84');
  });

  it("should resolve ObjectsFolder to 'ns=0;i=85' ", function () {
    const ref_nodeId = new NodeId(NodeIdType.Numeric, 85, 0);
    expect(resolveNodeId('ObjectsFolder')).toEqual(ref_nodeId);
    expect(resolveNodeId('ObjectsFolder').toString()).toBe('ns=0;i=85');
  });

  // Variable
  it("should resolve ServerType_NamespaceArray to 'ns=0;i=2006' ", function () {
    expect(resolveNodeId('ServerType_NamespaceArray').toString()).toBe('ns=0;i=2006');
  });

  // ObjectType
  it("should resolve FolderType to 'ns=0;i=61' ", function () {
    expect(resolveNodeId('FolderType').toString()).toBe('ns=0;i=61');
  });

  // VariableType
  it("should resolve AnalogItemType to 'ns=0;i=2368' ", function () {
    expect(resolveNodeId('AnalogItemType').toString()).toBe('ns=0;i=2368');
  });

  // ReferenceType
  it("should resolve HierarchicalReferences to 'ns=0;i=33' ", function () {
    expect(resolveNodeId('HierarchicalReferences').toString()).toBe('ns=0;i=33');
  });
});

describe('testing NodeId coercing bug ', function () {
  it('should handle strange string nodeId ', function () {
    expect(coerceNodeId('ns=2;s=S7_Connection_1.db1.0,x0')).toEqual(
      makeNodeId('S7_Connection_1.db1.0,x0', 2)
    );
  });
});

describe('testing NodeId.displayText', function () {
  it('should provide a richer display text when nodeid is known', function () {
    const ref_nodeId = new NodeId(NodeIdType.Numeric, 85, 0);
    expect(ref_nodeId.displayText()).toBe('ObjectsFolder (ns=0;i=85)');
  });
});

describe('issue#372 coercing & making nodeid string containing semi-column', function () {
  it('should coerce a nodeid string containing a semi-column', function () {
    const nodeId = coerceNodeId('ns=0;s=my;nodeid;with;semicolum');
    expect(nodeId.identifierType).toBe(NodeIdType.String);
    expect(nodeId.value).toBe('my;nodeid;with;semicolum');
  });

  it('should make a nodeid as a string containing semi-column', function () {
    const nodeId = makeNodeId('my;nodeid;with;semicolum');
    expect(nodeId.identifierType).toBe(NodeIdType.String);
    expect(nodeId.value).toBe('my;nodeid;with;semicolum');
  });
});
