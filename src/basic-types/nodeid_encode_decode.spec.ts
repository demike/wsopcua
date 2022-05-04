import { NodeIdType } from '../generated/NodeIdType';
import { setCurrentNamespaceArray } from '../nodeid/expanded_nodeid';
import { DataStream } from './DataStream';
import { encodeNodeId, ExpandedNodeId, jsonEncodeNodeId } from './nodeid';

describe('testing encodeNodeId', function () {
  it('should resolve the expanded nodeId if a namespaceArray is provided ', () => {
    const namespaceArray = ['http://opcfoundation.org/UA/', 'namespace1', 'thenamespace'];
    const nodeId = new ExpandedNodeId(NodeIdType.String, 'test', undefined, 'thenamespace');

    const stream = new DataStream(11);
    (stream as any).__namespaceArray = namespaceArray;
    encodeNodeId(nodeId, stream);
    expect(new Uint8Array(stream.view.buffer)).toEqual(
      Uint8Array.from([3, 2 /* namespace index */, 0, 4, 0, 0, 0, 116, 101, 115, 116])
    );
  });

  it('should encode with missing namespaceArray', () => {
    const nodeId = new ExpandedNodeId(NodeIdType.String, 'test', 0, 'thenamespace');

    const stream = new DataStream(11);

    encodeNodeId(nodeId, stream);
    expect(new Uint8Array(stream.view.buffer)).toEqual(
      Uint8Array.from([3, 0 /* namespace index */, 0, 4, 0, 0, 0, 116, 101, 115, 116])
    );
  });
});

describe('testing jsonEncodeNodeId', function () {
  it('should resolve the expanded nodeId if a namespaceArray is provided ', () => {
    const expected = {
      IdType: NodeIdType.String - 2,
      Namespace: 2,
      Id: 'test',
    };

    const namespaceArray = ['http://opcfoundation.org/UA/', 'namespace1', 'thenamespace'];
    setCurrentNamespaceArray(namespaceArray);
    const nodeId = new ExpandedNodeId(NodeIdType.String, 'test', undefined, 'thenamespace');

    const result = jsonEncodeNodeId(nodeId);
    setCurrentNamespaceArray(undefined);
    expect(result).toEqual(expected);
  });

  it('should encode with missing namespaceArray', () => {
    const expected = {
      IdType: NodeIdType.String - 2,
      // Namespace: 0, <-- not set if 0
      Id: 'test',
    };

    const nodeId = new ExpandedNodeId(NodeIdType.String, 'test', undefined, 'thenamespace');

    const result = jsonEncodeNodeId(nodeId);
    expect(result).toEqual(expected);
  });
});
