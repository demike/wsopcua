import { makeExpandedNodeId, ExpandedNodeId } from './expanded_nodeid';
import { makeNodeId } from './nodeid';
import { NodeIdType} from '../generated/NodeIdType';
import {coerceExpandedNodeId} from './expanded_nodeid';

/*global describe, it, require*/


describe('testing ExpandedNodeId', function () {

    it('should create a ExpandedNodeId from a integer', function () {
        const exnodeId = makeExpandedNodeId(1);
        expect(exnodeId.identifierType).toBe(NodeIdType.Numeric);
        expect(exnodeId.value).toBe(1);
        expect(exnodeId.namespace).toBe(0);
        expect(exnodeId.namespaceUri).toBe(null);
        expect(exnodeId.serverIndex).toBe(0);
        expect(exnodeId.toString()).toBe('ns=0;i=1');
    });

    it('should create a ExpandedNodeId from a integer', function () {

        const exnodeId = makeExpandedNodeId(1);
        expect(exnodeId.value).toBe(1);
    });
    it('should create a ExpandedNodeId from a ExpandedNodeId', function () {

        const exnodeId1 = new ExpandedNodeId(NodeIdType.Numeric, 1, 2, "namespaceURI", 3);
        const exnodeId2 = makeExpandedNodeId(exnodeId1);
        expect(exnodeId2.value).toBe(1);
    });
    it('should throw when calling makeExpandedNodeId with bad argument', function () {

        expect(function() {
            const exnodeId2 = makeExpandedNodeId('BAD');
        }).toThrow();
    });
    it('ExpandedNodeId#toString', function () {

        const exnodeId = new ExpandedNodeId(NodeIdType.Numeric, 1, 2, "namespaceURI", 3);
        expect(exnodeId.value).toBe(1);
        expect(exnodeId.namespace).toBe(2);
        expect(exnodeId.namespaceUri).toBe('namespaceURI');
        expect(exnodeId.serverIndex).toBe(3);
        expect(exnodeId.toString()).toBe('ns=2;i=1;namespaceUri:namespaceURI;serverIndex:3');
    });


    it('should create a ExpandedNodeId from a NodeId', function () {

        const nodeId = makeNodeId('some_text', 2);
        expect(nodeId.identifierType).toBe(NodeIdType.String);

        const exnodeId = makeExpandedNodeId(nodeId);
        expect(exnodeId.identifierType).toBe(NodeIdType.String);
        expect(exnodeId.value).toBe('some_text');
        expect(exnodeId.namespace).toBe(2);
        expect(exnodeId.namespaceUri).toBe(null);
        expect(exnodeId.serverIndex).toBe(0);
        expect(exnodeId.toString()).toBe('ns=2;s=some_text');
    });


    it('coerceExpandedNodeId should coerce \'i=10\'', function () {

        const exNodeId = coerceExpandedNodeId('ns=0;i=10');
        expect(exNodeId.toString()).toBe('ns=0;i=10');

    });
    it('coerceExpandedNodeId should coerce an ExpandedNodeId', function () {

        const exNodeId = coerceExpandedNodeId('ns=0;i=10');
        const exNodeId2 = coerceExpandedNodeId(exNodeId);
        expect(exNodeId2.toString()).toBe('ns=0;i=10');

    });


});
