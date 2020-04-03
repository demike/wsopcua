'use strict';
/* global Buffer */

import * as ec from './';

import {makeNodeId, NodeId} from '../nodeid/nodeid';
import {makeExpandedNodeId, ExpandedNodeId} from '../nodeid/expanded_nodeid';
import { NodeIdType } from '../generated/NodeIdType';
import { StatusCodes } from '../constants/raw_status_codes';

const crypto: Crypto = window.crypto || (<any>window).msCrypto; // for IE 11

const littleEndian = true;


beforeEach(() => {
    jasmine.addCustomEqualityTester( (first, second) => {
        if (first instanceof NodeId && second instanceof NodeId) {
            return (first.namespace === second.namespace) &&
                   (first.identifierType === second.identifierType) &&
            jasmine.matchersUtil.equals(first.value, second.value);
        }
    });
});

/**
 * @method test_encode_decode
 *
 * @param obj
 * @param encode_func {Function}
 * @param encode_func.obj {Object}
 * @param encode_func.binaryStream {DataStream}
 * @param decode_func {Function}
 * @param decode_func.binaryStream {DataStream}
 * @param expectedLength {Integer}
 * @param [verify_buffer_func=null] {Function}
 * @param verify_buffer_func.buffer {Buffer}
 */
function test_encode_decode(obj, encode_func, decode_func, verify_func?: (json: any) => void) {
    const json = encode_func(obj);

    if (verify_func) {
        verify_func(json);
    }

    const obj_verif = decode_func(json);

    if (obj !== undefined) {
        expect(obj_verif).toEqual(obj);
    } else {
        expect(obj_verif == null /* null or undefined */).toBeTruthy();
    }
}



describe('testing built-in type encoding', function() {

    it('should encode and decode a boolean as a json true/false', function() {
        expect( (ec as any).jsonEncodeBoolean).toBeUndefined('use the default conversion');
        expect( (ec as any).jsonDecodeBoolean).toBeUndefined('use the default conversion');
    });

    it('should encode and decode a string', function() {
        expect( (ec as any).jsonEncodeString).toBeUndefined('use the default conversion');
        expect( (ec as any).jsonDecodeString).toBeUndefined('use the default conversion');
    });


    // all integers except UInt64 and Int64 are encoded as a default json number --> no need for special treatment
    //TODO

    // normal float and double are also encoded as a json number --> no special treatment
    // -Infinity, +Infinity and NaN are encoded as string:  https://reference.opcfoundation.org/v104/Core/docs/Part6/5.4.2/#5.4.2.4
    [
        [2345.5678, 2345.5678],
        [NaN, 'NaN'],
        [Infinity, 'Infinity'],
        [-Infinity, '-Infinity']
    ].forEach( ([num, json]: [number, number|string]) => {
    it('should decode encode and decode a float / double value', () => {
        expect(ec.jsonDecodeDouble(json)).toEqual(num);
        expect(ec.jsonDecodeFloat(json)).toEqual(num);
        expect(ec.jsonEncodeDouble(num)).toEqual(json);
        expect(ec.jsonEncodeFloat(num)).toEqual(json);
    });
    });

    it('should encode and decode a DateTime', function() {
        const date = new Date('2020-04-03T07:11:08.782Z');
        const json = '2020-04-03T07:11:08.782Z';

        const result = ec.jsonDecodeDateTime(json);
        expect(result instanceof Date).toBeTruthy();
        expect(result.getTime()).toBe(result.getTime());

        expect(ec.jsonEncodeDateTime(result)).toBe(json);

    });

    it('should encode and decode a GUID', function() {
        expect( (ec as any).jsonEncodeGuid).toBeUndefined('use the default conversion');
        expect( (ec as any).jsonDecodeGuid).toBeUndefined('use the default conversion');
    });

    it('should encode and decode a ByteString', function() {
        const str = 'THIS IS MY BUFFER';
        const ba = new Uint8Array(new ArrayBuffer(256));
        const txtEncoder = new TextEncoder();
        ba.set(txtEncoder.encode(str));

        const jsonResult = ec.jsonEncodeByteString(ba);
        const byteStringResult = ec.jsonDecodeByteString(jsonResult);
        expect(byteStringResult).toEqual(ba);
    });

    it('should encode and decode a numeric NodeId', function() {
        const nodeId = makeNodeId(25);
        expect(nodeId.identifierType).toEqual(NodeIdType.Numeric);
        const json = ec.jsonEncodeNodeId(nodeId);

        expect(json.IdType).toBeUndefined(); // not encoded if 0 (numeric)
        expect(json.Id).toBe(25);
        expect(json.Namespace).toBeUndefined(); // not encoded if 0

        expect(ec.jsonDecodeNodeId(json)).toEqual(nodeId);

    });

    it('should encode and decode a Numeric NodeId with namespace', function() {
        const nodeId = makeNodeId(545889, 2500);
        expect(nodeId.identifierType).toEqual(NodeIdType.Numeric);
        const json = ec.jsonEncodeNodeId(nodeId);

        expect(json.IdType).toBeUndefined(); // not encoded if 0 (numeric)
        expect(json.Id).toBe(545889);
        expect(json.Namespace).toBe(2500);

        expect(ec.jsonDecodeNodeId(json)).toEqual(nodeId);
    });

    it('should encode and decode a String NodeId', function() {
        const nodeId = makeNodeId('SomeStuff', 2500);
        expect(nodeId.identifierType).toEqual(NodeIdType.String);
        const json = ec.jsonEncodeNodeId(nodeId);

        // yes NodeIdType values differ between json and binary, in json  TwoByte and FourByte encoding are missing
        expect(json.IdType).toBe(NodeIdType.String - 2);
        expect(json.Id).toBe('SomeStuff');
        expect(json.Namespace).toBe(2500);

        expect(ec.jsonDecodeNodeId(json)).toEqual(nodeId);
    });

    it('should encode and decode a Guid NodeId', function() {
        const nodeId = makeNodeId('72962B91-FA75-4AE6-8D28-B404DC7DAF63', 2500);
        expect(nodeId.identifierType).toEqual(NodeIdType.Guid);
        test_encode_decode(nodeId, ec.jsonEncodeNodeId, ec.jsonDecodeNodeId);
    });

    it('should encode and decode a Opaque NodeId', function() {
        const value = new Uint8Array(new ArrayBuffer(32));
        for (let i = 0; i < 32; i++) {
            value[i] = i;
        }
        const nodeId = makeNodeId(value, 0x1bcd);
        expect(nodeId.identifierType).toEqual(NodeIdType.ByteString);
        test_encode_decode(nodeId, ec.jsonEncodeNodeId, ec.jsonDecodeNodeId);
    });

    it('should encode and decode a BYTESTRING NodeId', function() {
        const nodeId = new NodeId(NodeIdType.ByteString, crypto.getRandomValues(new Uint8Array(16)));
        test_encode_decode(nodeId, ec.jsonEncodeNodeId, ec.jsonDecodeNodeId);
    });

    it('should encode and decode a Expanded NodeId  - TwoBytes', function() {
        test_encode_decode(makeExpandedNodeId(10), ec.jsonEncodeExpandedNodeId, ec.jsonDecodeExpandedNodeId, (json) => {
            expect(json.IdType).toBeUndefined(); // 0 (json) not encoded
            expect(json.Namespace).toBeUndefined(); // default 0 not encoded
            expect(json.ServerUri).toBeUndefined(); // omitted if server index equals 0
        });
    });

    it('should encode and decode a Expanded NodeId with namespaceUri', function() {
        const serverIndex = 2;
        const namespaceUri = 'some:namespace:uri';
        const expandedNodeId = new ExpandedNodeId(NodeIdType.Numeric, 4123, 0, namespaceUri, serverIndex);
        test_encode_decode(expandedNodeId, ec.jsonEncodeExpandedNodeId, ec.jsonDecodeExpandedNodeId, (json) => {
            expect(json.IdType).toBeUndefined(); // 0 (numeric) not encoded
            expect(json.Namespace).toBe(namespaceUri); // if namespace uri is set transmit the namespaceUri not the namespace
            expect(json.ServerUri).toBe(2);
        });
    });

    it('should encode and decode a Expanded NodeId with namespaceUri and namespace > 0 (use namespace not uri in this case)', function() {
        const serverIndex = 2;
        const namespaceUri = 'some:namespace:uri';
        const namespace = 4;
        const expandedNodeId = new ExpandedNodeId(NodeIdType.Numeric, 4123, namespace, namespaceUri, serverIndex);
        test_encode_decode(expandedNodeId, ec.jsonEncodeExpandedNodeId, ec.jsonDecodeExpandedNodeId, (json) => {
            expect(json.IdType).toBeUndefined(); // 0 (numeric) not encoded
            expect(json.Namespace).toBe(namespace); // if namespace>0 and uri is set transmit the namespace
            expect(json.ServerUri).toBe(2);
        });
    });

    it('should encode decode a StatusCode', () => {
        const code = StatusCodes.BadWaitingForInitialData;
        test_encode_decode(code, ec.jsonEncodeStatusCode, ec.jsonDecodeStatusCode);
    })

    it('should not encode a StatusCodes.Good, and it should decode as StatusCodes.Good if not present in json  ', () => {
        const code = StatusCodes.Good;
        test_encode_decode(code, ec.jsonEncodeStatusCode, ec.jsonDecodeStatusCode, (json) => {
            expect(json).toBeUndefined();
        });
    })
});

describe('encoding and decoding arrays', function() {
    it('should encode and decode an array of float', function() {
        function json_encode_array_float(arr) {
            return ec.jsonEncodeArray(arr, ec.jsonEncodeFloat);
        }

        function json_decode_array_float(json) {
            return ec.jsonDecodeArray(json, ec.jsonDecodeFloat);
        }

        test_encode_decode([10, 20, 30, 40], json_encode_array_float, json_decode_array_float);
    });

    it('should encode and decode an array of strings', function() {
        const array = ['Hoo', 'Hello', 'World', '你好世界', 'привет мир', 'こんにちは世界'];
        expect(() => {
            ec.jsonEncodeArray(array, undefined);
        }).toThrow(); // 'it should throw an exception because string array en/decoding is built in and does not need special treatment'
        expect(() => {
            ec.jsonDecodeArray(array, undefined);
        }).toThrow(); // 'it should throw an exception because string array en/decoding is built in and does not need special treatment'
    });

    it('should encode and decode an array of ByteString', function() {
        function json_encode_array_bytestring(arr) {
            return ec.jsonEncodeArray(arr, ec.jsonEncodeByteString);
        }

        function json_decode_array_bytestring(arr) {
            return ec.jsonDecodeArray(arr, ec.jsonDecodeByteString);
        }

        let data = [ new TextEncoder().encode('ABCD'), null, new TextEncoder().encode('EFGH').buffer /* new ArrayBuffer(0), [] */];
        data = data.map(ec.coerceByteString);
        data[1] = null;

        test_encode_decode(data, json_encode_array_bytestring, json_decode_array_bytestring);
    });
});