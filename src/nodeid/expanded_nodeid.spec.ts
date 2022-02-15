import { makeExpandedNodeId, ExpandedNodeId } from './expanded_nodeid';
import { makeNodeId } from './nodeid';
import { NodeIdType} from '../generated/NodeIdType';
import {coerceExpandedNodeId} from './expanded_nodeid';

/* global describe, it, require*/


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

        const exnodeId1 = new ExpandedNodeId(NodeIdType.Numeric, 1, 2, 'namespaceURI', 3);
        const exnodeId2 = makeExpandedNodeId(exnodeId1);
        expect(exnodeId2.value).toBe(1);
    });
    it('should throw when calling makeExpandedNodeId with bad argument', function () {

        expect(function() {
            const exnodeId2 = makeExpandedNodeId('BAD');
        }).toThrow();
    });
    it('ExpandedNodeId#toString', function () {

        const exnodeId = new ExpandedNodeId(NodeIdType.Numeric, 1, 2, 'namespaceURI', 3);
        expect(exnodeId.value).toBe(1);
        expect(exnodeId.namespace).toBe(2);
        expect(exnodeId.namespaceUri).toBe('namespaceURI');
        expect(exnodeId.serverIndex).toBe(3);
        expect(exnodeId.toString()).toBe('svr=3;nsu=namespaceURI;ns=2;i=1');
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

    it('coerceExpandedNodeId should coerce a string with nsu="testuri"', function () {

        const exNodeId = coerceExpandedNodeId('nsu=testuri;i=10');
        expect(exNodeId.toString()).toBe('nsu=testuri;ns=0;i=10');

    });

    it('coerceExpandedNodeId should coerce a string with svr=2', function () {

        const exNodeId = coerceExpandedNodeId('svr=2;i=10');
        expect(exNodeId.toString()).toBe('svr=2;ns=0;i=10');

    });

    it('coerceExpandedNodeId should coerce a string with svr=2 and nsu="testuri"', function () {

        const exNodeId = coerceExpandedNodeId('svr=2;nsu=testuri;i=10');
        expect(exNodeId.toString()).toBe('svr=2;nsu=testuri;ns=0;i=10');

    });

    [
        'ns=urn:engel:foo;s=myid',
        'ns=-1;s=myId',
        'svr=foo;ns=1;s=myId',
        'ns=1;svr=1;s=myId',
        'nsu=1;s=myId',
        'ns=1;myId',
        'ns=1;val=myId',
        'ns=1;i=myId',
        'ns=1;g=54'
      ].forEach(s =>
        it(`must fail on invalid expanded node id string ${s}`, () => {
          expect(() => {
            coerceExpandedNodeId(s);
          }).toThrowError();
        })
      );

      it('coerceExpandedNodeId should coerce an object with svr=2 and nsu="testuri"', function () {
        const obj = {
            namespaceUri: 'testuri',
            serverIndex: 2,
            value: 10
        };

        const exNodeId = coerceExpandedNodeId(obj);
        expect(exNodeId.toString()).toBe('svr=2;nsu=testuri;ns=0;i=10');

    });


});
