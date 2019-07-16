'use strict';


import * as ec from '../basic-types';

import * as factories from '../factory';
import { Variant, isValidVariant, VARIANT_ARRAY_MASK } from './variant';
import { DataType, VariantArrayType, sameVariant, buildVariantArray } from '.';
import { QualifiedName, LocalizedText } from '../generated';
import { ExtensionObject } from '../basic-types/extension_object';
import { encode_decode_round_trip_test } from '../packet-analyzer/test_helpers';
import { DataStream } from '../basic-types/DataStream';
import { makeNodeId } from '../nodeid/nodeid';
import { assert } from '../assert';
import { NumericRange } from '../numeric-range/numeric_range';
import { StatusCodes } from '../basic-types';
import { get_clock_tick } from '../utils';


function str2Uint8Array (str : String ) : Uint8Array {
	let array = new Uint8Array(str.length);
	for(let i = 0; i < str.length; i++) {
		array[i] = str.charCodeAt(i);
	}
	return array;
}

function uint8ArrayToStr(array: Uint8Array) : string {
    let str = '';
    for (let i = 0; i < array.byteLength; i++) {
        str += String.fromCharCode( array[i]);
    }

    return str;
}


describe('Variant', function () {
    it('should create a empty Variant', function () {
        const var1 = new Variant();

        expect(var1.dataType).toBe(DataType.Null);
        expect(var1.arrayType).toBe(VariantArrayType.Scalar);
        expect(var1.value).toBeUndefined();
        expect(var1.dimensions).toBeNull();

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(1);
        });
    });

    it('should create a Scalar UInt32 Variant', function () {
        const var1 = new Variant({dataType: DataType.UInt32, value: 10});

        expect(var1.dataType).toEqual(DataType.UInt32);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(5);
        });
    });

    it('should create a Scalar UInt64 Variant', function () {
        const var1 = new Variant({arrayType: VariantArrayType.Scalar, dataType: DataType.UInt64, value: [10, 20]});

        expect(var1.dataType).toEqual(DataType.UInt64);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(9);
        });
    });

    it('should create a Scalar LocalizedText Variant 1/2', function () {

        const var1 = new Variant({
            dataType: DataType.LocalizedText,
            value: new LocalizedText({text: 'Hello', locale: 'en'})
        });

        expect(var1.dataType).toEqual(DataType.LocalizedText);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        expect(var1.value instanceof LocalizedText).toBeTruthy();

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(17);
        });
    });

    it('should create a Scalar LocalizedText Variant 2/2', function () {
        const var1 = new Variant({
            dataType: DataType.LocalizedText,
            value: new LocalizedText({text: 'Hello', locale: 'en'})
        });

        expect(var1.dataType).toEqual(DataType.LocalizedText);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        expect(var1.value instanceof LocalizedText).toBeTruthy();

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(17);
        });
    });

    it('should create a Scalar QualifiedName Variant 1/2', function () {

        const var1 = new Variant({
            dataType: DataType.QualifiedName,
            value: new QualifiedName({name: 'Hello', namespaceIndex: 0})
        });

        expect(var1.dataType).toEqual(DataType.QualifiedName);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);
        expect(var1.value instanceof QualifiedName).toBeTruthy();

        encode_decode_round_trip_test(var1, function (stream) {
            // ETIENNE 26/07/2018
            expect(stream.byteLength).toEqual(12);
        });
    });

    it('should create a Scalar QualifiedName Variant 2/2', function () {
        const var1 = new Variant({
            dataType: DataType.QualifiedName,
            value: new QualifiedName({name: 'Hello', namespaceIndex: 0})
        });

        expect(var1.dataType).toEqual(DataType.QualifiedName);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        expect(var1.value instanceof QualifiedName).toBeTruthy();

        encode_decode_round_trip_test(var1, function (stream) {
            // ETIENNE 26/07/2018
            expect(stream.byteLength).toEqual(12);
        });
    });

    it('should create a Scalar Date Variant', function() {
        const var1 = new Variant({
            dataType: DataType.DateTime,
            value: new Date()
        });
        expect(var1.dataType).toEqual(DataType.DateTime);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(9);
        });

    });
    it('should create a Scalar ByteString  Variant - null', function () {
        const var1 = new Variant({dataType: DataType.ByteString, value: null});

        expect(var1.dataType).toEqual(DataType.ByteString);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(5);
        });
    });

    it('should create a Scalar ByteString  Variant - empty buffer', function () {
        const var1 = new Variant({dataType: DataType.ByteString, value: new Uint8Array(0)});

        expect(var1.dataType).toEqual(DataType.ByteString);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(5);
        });
    });

    it('should create a Scalar ByteString  Variant - 3 bytes', function () {
        const var1 = new Variant({dataType: DataType.ByteString, value: str2Uint8Array('ABC')});

        expect(var1.dataType).toEqual(DataType.ByteString);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(5 + 3);
        });
    });

    it('should create a Scalar String  Variant', function () {
        const var1 = new Variant({dataType: DataType.String, value: 'Hello'});

        expect(var1.dataType).toEqual(DataType.String);
        expect(var1.arrayType).toEqual(VariantArrayType.Scalar);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(1 + 4 + 5);
        });
    });

    it('should create a empty Array String Variant', function () {
        const var1 = new Variant({
            dataType: DataType.String,
            arrayType: VariantArrayType.Array,
            value: null
        });

        expect(var1.dataType).toEqual(DataType.String);
        expect(var1.arrayType).toEqual(VariantArrayType.Array);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(5);
        });
    });

    it('should create a Array String Variant', function () {
        const var1 = new Variant({
            dataType: DataType.String,
            arrayType: VariantArrayType.Array,
            value: ['Hello', 'World']
        });

        expect(var1.dataType).toEqual(DataType.String);
        expect(var1.arrayType).toEqual(VariantArrayType.Array);
        expect(var1.value.length).toEqual(2);
        expect(var1.value[0]).toEqual('Hello');
        expect(var1.value[1]).toEqual('World');

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(1 + 4 + (4 + 5 + 4 + 5));
        });
    });

    it('should create a Array QualifiedName Variant', function () {
        const var1 = new Variant({
            dataType: DataType.QualifiedName,
            arrayType: VariantArrayType.Array,
            value: [new QualifiedName({name: 'Hello', namespaceIndex: 0}), new QualifiedName({name: 'World', namespaceIndex: 0})]
        });

        expect(var1.dataType).toEqual(DataType.QualifiedName);
        expect(var1.arrayType).toEqual(VariantArrayType.Array);

        expect(var1.value[0] instanceof QualifiedName).toBeTruthy();

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(27);
        });
    });

    it('should create a Array of GUID Variant', function () {
        const var1 = new Variant({
            dataType: DataType.Guid,
            arrayType: VariantArrayType.Array,
            value: [ec.emptyGuid, ec.randomGuid(), ec.randomGuid(), ec.emptyGuid, ec.randomGuid(), ec.randomGuid()]
        });

        expect(var1.dataType).toEqual(DataType.Guid);
        expect(var1.arrayType).toEqual(VariantArrayType.Array);

        expect(typeof var1.value[0]).toEqual('string');

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(101);
        });
    });

    it('should detect invalid SByte Variant', function () {
        const var1 = new Variant({
            dataType: DataType.SByte,
            value: 63
        });
        expect(var1.isValid()).toEqual(true);
        var1.value = 'Bad!';
        expect(var1.isValid()).toEqual(false);
    });

    it('should detect invalid Array<Int32> Variant', function () {
        const var1 = new Variant({
            dataType: DataType.UInt32,
            arrayType: VariantArrayType.Array,
            value: [2, 3, 4, 5]
        });
        expect(var1.toString()).toEqual('Variant(Array<UInt32>, l= 4, value=[2,3,4,5])');
        expect(var1.isValid()).toEqual(true);

        var1.value[2] = 'Bad!';

        expect(var1.value[2]).toEqual(0);
        expect(var1.toString()).toEqual('Variant(Array<UInt32>, l= 4, value=[2,3,0,5])');

        // xx expect(var1.isValid()).toEqual(false);
        // xx expect(var1.toString()).toEqual("Variant(Array<UInt32>, l= 4, value=[2,3,Bad!,5])");
    });

    it('should create a Variant as a Matrix (2x3) of UInt32 - Matrix given as a flat array', function () {
        const var1 = new Variant({
            dataType: DataType.UInt32,
            arrayType: VariantArrayType.Matrix,
            dimensions: [2, 3],
            value: [0x000, 0x001, 0x002, 0x010, 0x011, 0x012]
        });

        expect(var1.arrayType).toEqual(VariantArrayType.Matrix);
        expect(var1.dimensions).toEqual([2, 3]);
        expect(var1.value.length).toEqual(6);
        expect(var1.dataType).toEqual(DataType.UInt32);

        encode_decode_round_trip_test(var1, function (stream) {
            // 1  encoding byte          1
            // 1  UInt32 => ArrayLength  4
            // 6  UInt32                 6*4
            // 1  Uint32                 4
            // 3  Uint32 (dimension)     2*4
            //                           ----
            //                           41
            expect(stream.byteLength).toEqual(41);
        });

        expect(var1.toString()).toEqual('Variant(Matrix[ 2,3 ]<UInt32>, l= 6, value=[0,1,2,16,17,18])');
    });

    it('not supported - should create a Variant as a Matrix (2x3) of UInt32 - Matrix given as a Array of Array', function () {
        const var1 = new Variant({
            dataType: DataType.UInt32,
            arrayType: VariantArrayType.Matrix,
            dimensions: [2, 3],
            value: [[0x000, 0x001, 0x002], [0x010, 0x011, 0x012]]
        });

        expect(var1.arrayType).toEqual(VariantArrayType.Matrix);
        expect(var1.dimensions).toEqual([2, 3]);

        expect(var1.value.length).toEqual(6);

        expect(var1.dataType).toEqual(DataType.UInt32);

        encode_decode_round_trip_test(var1, function (stream) {
            // 1  encoding byte          1
            // 1  UInt32 => ArrayLength  4
            // 6  UInt32                 6*4
            // 1  Uint32                 4
            // 3  Uint32 (dimension)     2*4
            //                           ----
            //                           41
            expect(stream.byteLength).toEqual(41);
        });

        expect(var1.toString()).toEqual('Variant(Matrix[ 2,3 ]<UInt32>, l= 6, value=[0,1,2,16,17,18])');
    });

    it('should raise an exception when construction a Matrix with incorrect element size', function () {
        expect(function construct_matrix_variant_with_invalid_value() {
            const var1 = new Variant({
                dataType: DataType.UInt32,
                arrayType: VariantArrayType.Matrix,
                dimensions: [2, 3],
                value: [0x000] // wrong size !
            });
        }).toThrowError();
    });

    it('should create a Array of ByteString Variant ', function () {

        const var1 = new Variant({
            dataType: DataType.ByteString,
            value: [str2Uint8Array('ABC'), null]
        });

        expect(var1.dataType).toEqual(DataType.ByteString);
        expect(var1.arrayType).toEqual(VariantArrayType.Array);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(5 + 4 + 3 + 4);
        });
    });
    it('should create a Array UInt64 Variant', function () {
        const var1 = new Variant({
            arrayType: VariantArrayType.Array,
            dataType: DataType.UInt64,
            value: [[1, 2], [3, 4]]
        });

        expect(var1.dataType).toEqual(DataType.UInt64);
        expect(var1.arrayType).toEqual(VariantArrayType.Array);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(5 + 8 + 8);
        });
    });

    it('should create a Array of ByteString Variant', function () {
        const value = [str2Uint8Array('ABCD'), null];

        const var1 = new Variant({
            arrayType: VariantArrayType.Array,
            dataType: DataType.ByteString,
            value: value
        });

        expect(var1.dataType).toEqual(DataType.ByteString);
        expect(var1.arrayType).toEqual(VariantArrayType.Array);

        encode_decode_round_trip_test(var1, function (stream) {
            expect(stream.byteLength).toEqual(17);
        });
    });
});


describe('Variant - Analyser', function () {

    const manyValues = [];
    for (let i = 0; i < 1000; i++) {
        manyValues[i] = Math.random() * 1000 - 500;
    }

    const veryLargeFloatArray = new Float64Array(10 * 1024);
    for (let i = 0; i < veryLargeFloatArray.length; i++) {
        veryLargeFloatArray[i] = (Math.random() - 0.5) * 10000;
    }
    const various_variants = [
        new Variant({dataType: DataType.NodeId, arrayType: VariantArrayType.Scalar, value: makeNodeId(1, 2)}),
        new Variant({
            dataType: DataType.LocalizedText,
            arrayType: VariantArrayType.Scalar,
            value: new LocalizedText({text: 'Hello', locale: 'en'})
        }),
        new Variant({dataType: DataType.Double, arrayType: VariantArrayType.Scalar, value: 3.14}),
        new Variant({dataType: DataType.Guid, arrayType: VariantArrayType.Scalar, value: ec.randomGuid()}),

        // various Variant Array
        new Variant({dataType: DataType.Int32, arrayType: VariantArrayType.Array /*, unspecified value*/}),
        new Variant({dataType: DataType.Int32, arrayType: VariantArrayType.Array, value: []}),
        new Variant({dataType: DataType.Int32, arrayType: VariantArrayType.Array, value: new Int32Array([1])}),
        new Variant({dataType: DataType.Int32, arrayType: VariantArrayType.Array, value: new Int32Array([1, 2])}),
        new Variant({
            dataType: DataType.UInt32,
            arrayType: VariantArrayType.Array,
            value: new Uint32Array([2, 3, 4, 5])
        }),
        new Variant({
            dataType: DataType.Float,
            arrayType: VariantArrayType.Array,
            value: new Float32Array([2, 3, 4, 5])
        }),
        new Variant({
            dataType: DataType.Double,
            arrayType: VariantArrayType.Array,
            value: new Float64Array(manyValues)
        }),
        new Variant({dataType: DataType.Int32, arrayType: VariantArrayType.Array, value: new Int32Array(manyValues)}),
        new Variant({dataType: DataType.Double, arrayType: VariantArrayType.Array, value: veryLargeFloatArray}),

        // variant Matrix
        new Variant({
            dataType: DataType.Int32,
            arrayType: VariantArrayType.Matrix,
            value: [1, 2, 3, 4, 5, 6],
            dimensions: [2, 3]
        }),
        new Variant({
            dataType: DataType.Int32,
            arrayType: VariantArrayType.Matrix,
            value: [1, 2, 3, 4, 5, 6],
            dimensions: [3, 2]
        })
    ];

    // xx console.log(various_variants.map(function(a){return a.toString()}).join("\n"));
/*
    it("should analyze variant", function () {
        redirectToFile("variant_analyze1.log", function () {
            various_variants.forEach(function (v) {
                analyze_object_binary_encoding(v);
            });
        });
    });
*/
    it('ZZ1 should encode/decode variant', function () {

        const v = new Variant({
                dataType: DataType.Int32,
                arrayType: VariantArrayType.Matrix,
                value: [1, 2, 3, 4, 5, 6],
                dimensions: [2, 3]
            });

        encode_decode_round_trip_test(v, (stream) => {
            // expect(stream.byteLength).toEqual(1+4+4*4);
        });

    });

    it('should encode/decode variant', function () {
        for (const v of various_variants) {

            encode_decode_round_trip_test(v, (stream) => {
                // expect(stream.byteLength).toEqual(1+4+4*4);
            });
        }
    });

    it('should encode/decode a very large array of Float - 1', function () {
        

        const nbElements = 1500 * 1024;

        const t0 = get_clock_tick();
        const very_large = new Variant({
            dataType: DataType.Double,
            arrayType: VariantArrayType.Array,
            value: new Float64Array(nbElements)
        });

        for (let i = 0; i < nbElements; i++) {
            very_large.value[i] = Math.random();
        }

        const t1 = get_clock_tick();
        const size = very_large.binaryStoreSize();
        expect(size).toEqual(nbElements * 8 + 5);

        const t2 = get_clock_tick();
        const stream = new DataStream(size);
        const t3 = get_clock_tick();
        very_large.encode(stream);
        const t4 = get_clock_tick();

        console.log(' t1 = create variant   ', t1 - t0);
        console.log(' t2 = binaryStoreSize  ', t2 - t1);
        console.log(' t3 = new DataStream ', t3 - t2);
        console.log(' t3 = encode           ', t4 - t3);
    });

    it('should encode/decode a very large array of Float', function () {
        const nbElements = 1500 * 1024;
        const very_large = new Variant({
            dataType: DataType.Double,
            arrayType: VariantArrayType.Array,
            value: new Float64Array(nbElements)
        });

        for (let i = 0; i < nbElements; i++) {
            very_large.value[i] = Math.random();
        }
        encode_decode_round_trip_test(very_large, function (stream) {
            // stream.byteLength).toEqual(1+4+4*4);
        });
    });

    it('should check the performance of encode/decode a very large array of Float', function () {
        const length = 500 * 1024;

        console.log('    array size = ', length);

        const obj = new Variant({
            dataType: DataType.Double,
            arrayType: VariantArrayType.Array,
            value: new Float64Array(length)
        });

        for (let i = 0; i < length; i++) {
            obj.value[i] = i;
        }
        expect(obj.value[100]).toEqual(100);

        const size = obj.binaryStoreSize();
        const stream = new DataStream(size);

        /*
        const bench = new Benchmarker();

        const obj_reloaded = new Variant();

        bench
            .add("Variant.encode", function () {
                stream.rewind();
                obj.encode(stream);
            })
            .add("Variant.decode", function () {
                stream.rewind();
                obj_reloaded.decode(stream);
            })
            .on("cycle", function (message) {
                //xx console.log(message);
            })
            .on("complete", function () {
                console.log(" Fastest is " + this.fastest.name);
                console.log(" Speed Up : x", this.speedUp);
                //xx this.fastest.name).toEqual("Variant.encode");
            })
            .run({max_time: 0.2});
        */

        // note : the following test could be *slow* with large value of length
        //        for (let i=0;i<length;i++) { obj.value[i]).toEqual(i); }
        function validate_array() {
            for (let i = 0; i < length; i++) {
                if (obj.value[i] !== i) {
                    return false;
                }
            }
            return true;
        }

        expect(validate_array()).toEqual(true);
    }, 300000);
});

const old_encode = function (variant, stream) {
    // NOTE: this code matches the old implement and should not be changed
    //       It is useful to compare new performance of the encode method
    //       with the old implementation.
    assert(variant.isValid());

    let encodingByte = variant.dataType.value;

    if (variant.arrayType === VariantArrayType.Array) {
        encodingByte |= VARIANT_ARRAY_MASK;
    }
    ec.encodeUInt8(encodingByte, stream);
    const encode = factories.findBuiltInType(DataType[variant.dataType]).encode;
    /* istanbul ignore next */
    if (!encode) {
        throw new Error('Cannot find encode function for dataType ' + DataType[variant.dataType]);
    }
    if (variant.arrayType === VariantArrayType.Array) {
        const arr = variant.value || [];
        ec.encodeUInt32(arr.length, stream);
        arr.forEach(function (el) {
            encode(el, stream);
        });
    } else {
        encode(variant.value, stream);
    }
};
/*
xdescribe("benchmarking variant encode", function () {
    function perform_benchmark(done) {
        const bench = new Benchmarker();

        function test_iteration(v, s, encode) {
            s.rewind();
            encode.call(this, v, stream);
        }

        const encodeVariant = require("..").encodeVariant;

        const stream = new DataStream(4096);
        const variant = new Variant({
            dataType: DataType.UInt32,
            arrayType: VariantArrayType.Array,
            value: []
        });

        variant.value = [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18
        ];
        bench
            .add("Variant.encode", function () {
                assert(_.isFunction(encodeVariant));
                test_iteration(variant, stream, encodeVariant);
            })
            .add("Variant.old_encode", function () {
                assert(_.isFunction(old_encode));
                test_iteration(variant, stream, old_encode);
            })
            .on("cycle", function (message) {
                // console.log(message);
            })
            .on("complete", function () {
                console.log(" Fastest is " + this.fastest.name);
                console.log(" Speed Up : x", this.speedUp);
                // this test fails only on AppVeyor ! why ?
                //xx this.fastest.name).toEqual("Variant.encode");
                done();
            })
            .run({max_time: 0.1});
    }

    it("should verify that current Variant.encode method is better than old implementation", function (done) {
        perform_benchmark(done);
    });
});

describe("benchmarking float Array encode/decode", function () {
    this.timeout(Math.max(200000, this._timeout));

    function test_1(stream, arr) {
        stream.writeUInt32(arr.length);
        for (let i = 0; i < arr.length; i++) {
            stream.writeFloat(arr[i]);
        }
    }

    function test_2(stream, arr) {
        stream.writeUInt32(arr.length);
        const byteArr = new Uint8Array(arr.buffer);
        const n = byteArr.length;
        for (let i = 0; i < n; i++) {
            stream.writeUInt8(byteArr[i]);
        }
    }

    function test_3(stream, arr) {
        stream.writeUInt32(arr.length);
        const byteArr = new Uint32Array(arr.buffer);
        const n = byteArr.length;
        for (let i = 0; i < n; i++) {
            stream.writeUInt32(byteArr[i]);
        }
    }

    function test_4(stream, arr) {
        stream.writeUInt32(arr.length);
        const intArray = new Uint32Array(arr.buffer);
        const n = intArray.length;
        for (let i = 0; i < n; i++) {
            stream.writeUInt32(intArray[i], true);
        }
    }

    function test_5(stream, arr) {
        stream.writeUInt32(arr.length);
        const byteArr = new Uint8Array(arr.buffer);
        const n = byteArr.length;
        for (let i = 0; i < n; i++) {
            stream.buffer[stream.byteLength++] = byteArr[i];
        }
    }

    function test_6(stream, arr) {
        stream.writeUInt32(arr.length);
        stream.writeArrayBuffer(arr.buffer);
    }

    function test_iteration(variant, stream, fct) {
        stream.rewind();
        fct(stream, variant.value);
    }

    function perform_benchmark(done) {
        const bench = new Benchmarker();

        const length = 1024;
        const sampleArray = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            sampleArray[i] = 1.0 / (i + 1);
        }

        const stream = new DataStream(length * 4 + 30);
        const variant = new Variant({
            dataType: DataType.Float,
            arrayType: VariantArrayType.Array,
            value: sampleArray
        });
        assert(variant.value.buffer instanceof ArrayBuffer);

        stream.rewind();
        const r = [test_1, test_2, test_3, test_4, test_5, test_6].map(function (fct) {
            stream.rewind();
            fct(stream, variant.value);
            const reference_buf = stream.buffer.slice(0, stream.buffer.length);
            return reference_buf.toString("hex");
        });
        r[0]).toEqual(r[1]);
        r[0]).toEqual(r[2]);
        r[0]).toEqual(r[3]);
        r[0]).toEqual(r[4]);
        r[0]).toEqual(r[5]);

        bench
            .add("test1", function () {
                test_iteration(variant, stream, test_1);
            })
            .add("test2", function () {
                test_iteration(variant, stream, test_2);
            })
            .add("test3", function () {
                test_iteration(variant, stream, test_3);
            })
            .add("test4", function () {
                test_iteration(variant, stream, test_4);
            })
            .add("test5", function () {
                test_iteration(variant, stream, test_5);
            })
            .add("test6", function () {
                test_iteration(variant, stream, test_6);
            })
            .on("cycle", function (message) {
                //xx console.log(message);
            })
            .on("complete", function () {
                console.log(" slowest is " + this.slowest.name);
                console.log(" Fastest is " + this.fastest.name);
                console.log(" Speed Up : x", this.speedUp);
                // xxthis.fastest.name).toEqual("test4");
                done();
            })
            .run({max_time: 0.1});
    }

    it("should check which is the faster way to encode decode a float", function (done) {
        perform_benchmark(done);
    });
});
*/
describe('Variant with Advanced Array', function () {
    it('should automatically detect that variant is an array when ArrayType is missing ', function () {

        const v = new Variant({
            dataType: DataType.Float,
            //  EXPLICITLY MISSING arrayType : VariantArrayType.Array
            value: [1, 2]
        });

        expect(v.arrayType).toEqual(VariantArrayType.Array);

        expect(v.value instanceof Float32Array).toBeTruthy();

        encode_decode_round_trip_test(v, function (stream) {
            expect(stream.byteLength).toEqual(1 + 4 + 2 * 4);
        });
    });

    it('should be possible to handle an Float array  with a Float32Array', function () {
        const v = new Variant({
            dataType: DataType.Float,
            arrayType: VariantArrayType.Array,
            value: [1, 2, 3, 4]
        });
        encode_decode_round_trip_test(v, function (stream: ArrayBuffer) {
            expect(stream.byteLength).toEqual(1 + 4 + 4 * 4);
        });
    });

    it('should be possible to encode/decode an subarray of Float32Array', function () {
        const v = new Variant({
            dataType: DataType.Float,
            arrayType: VariantArrayType.Array,
            value: [0, 1, 2, 3, 4, 5]
        });

        const nr = new NumericRange('3:4');
        v.value = nr.extract_values(v.value).array;
        expect(v.value[0]).toEqual(3);
        expect(v.value[1]).toEqual(4);
        encode_decode_round_trip_test(v, function (stream) {
            expect(stream.byteLength).toEqual(1 + 4 + 4 + 4);
        });
    });

    it('should be possible to read a sub matrix of a array of byte strings', function () {
        const v = new Variant({
            dataType: DataType.ByteString,
            arrayType: VariantArrayType.Array,
            value: [str2Uint8Array('ABCDEFGHIJKL'), str2Uint8Array('BCDEFGHIJKLA'), 
            str2Uint8Array('CDEFGHIJKLAB'), str2Uint8Array('DEFGHIJKLABC'),
            str2Uint8Array('EFGHIJKLABCD'), str2Uint8Array('FGHIJKLABCDE')]
        });

        const nr = new NumericRange('3:4,1:3');

        expect(nr.isValid()).toEqual(true);

        const results = nr.extract_values(v.value);
        expect(results.statusCode).toEqual(StatusCodes.Good);

        expect(results.array).toEqual([str2Uint8Array('EFG'), str2Uint8Array('FGH')]);
    });

    it('AA should be possible to read a sub matrix of a matrix of double', function () {
        const v = new Variant({
            dataType: DataType.Double,
            arrayType: VariantArrayType.Matrix,
            dimensions: [5, 4],
            value: [
                0x000,
                0x001,
                0x002,
                0x003,
                0x100,
                0x101,
                0x102,
                0x103,
                0x200,
                0x201,
                0x202,
                0x203,
                0x300,
                0x301,
                0x302,
                0x303,
                0x400,
                0x401,
                0x402,
                0x403
            ]
        });

        const nr = new NumericRange('3:4,1:3');

        expect(nr.isValid()).toEqual(true);

        const results = nr.extract_values(v.value, v.dimensions); // << We must provide dimension here
        expect(results.statusCode).toEqual(StatusCodes.Good);

        expect( (<any>results).dimensions).toEqual([2, 3]);

        expect(results.array).toEqual(new Float64Array([0x301, 0x302, 0x303, 0x401, 0x402, 0x403]));
    });
});

describe('Variant with enumeration', function () {

    const SomeEnum = DataType;

    beforeEach(function () {
        expect(SomeEnum.DiagnosticInfo).toBeDefined();
    });

    it('should fail to create a variant from a enumeration item if dataType is not Int32', function () {
        expect(function () {
            const v = new Variant({
                dataType: DataType.UInt32,
                value: SomeEnum.DiagnosticInfo
            });
            expect(v.value).toEqual(SomeEnum.DiagnosticInfo);
        }).toThrow();
    });

    it('should create a variant from a enumeration item', function () {
        expect(SomeEnum.DiagnosticInfo).toBeDefined();
        const v = new Variant({
            dataType: DataType.Int32,
            value: SomeEnum.DiagnosticInfo
        });
        // console.log(v.toString());
        expect(v.value).toEqual(SomeEnum.DiagnosticInfo);
    });

    it('should not be necessary to specify the dataType for  a variant containing  enumeration item', function () {
        const v = new Variant({
            value: SomeEnum.DiagnosticInfo
        });
        // console.log(v.toString());
        expect(v.value).toEqual(25);
        expect(v.dataType).toEqual(DataType.Int32);
    });

    it('should create a variant with builtin type \'Duration\'', function () {
        const v = new Variant({
            dataType: DataType.Double,
            value: 0.1
        });
        expect(v.dataType).toEqual(DataType.Double);
        expect(v.value).toEqual(0.1);
    });
    it('should create a variant with builtin type \'ByteString\'', function () {
        const v = new Variant({
            dataType: DataType.ByteString,
            value: str2Uint8Array('abcd')
        });
        expect(v.dataType).toEqual(DataType.ByteString);
        expect(uint8ArrayToStr(v.value)).toEqual('abcd');
    });
    it('should create a variant copy (with it\'s own array) ', function () {
        const options = {
            dataType: DataType.Float,
            arrayType: VariantArrayType.Array,
            value: [0, 1, 2, 3, 4, 5]
        };

        let v1, v2, v3;
        v1 = new Variant(options);

        v2 = new Variant({
            dataType: DataType.Float,
            arrayType: VariantArrayType.Array,
            value: v1.value
        });

        v1.value[1] += 1;
        expect(v1.value[1] === v2.value[1]).toBeFalsy();
        v1.value[1] -= 1;

        v3 = new Variant({
            dataType: v1.dataType,
            arrayType: v1.arrayType,
            value: v1.value
        });
        // xx v2.value = new Float32Array(v1.value);

        expect(v1 === v2).toEqual(false);

        expect(v1.value[1]).toEqual(1);
        expect(v2.value[1]).toEqual(1);

        v1.value[1] = 32;
        expect(v1.value[1]).toEqual(32);

        // xx options.value[1]).toEqual(1); // v2 should have its own copy of the array

        expect(v3.value[1]).toEqual(1); // v2 should have its own copy of the array

        expect(v2.value[1]).toEqual(1); // v2 should have its own copy of the array
    });

    it('should create a Extension object variant as a copy of ', function() {

        const variant1 = new Variant({
            dataType: DataType.ExtensionObject,
            value: null
        });
        const variant2 = new Variant(variant1);

    });
    it('should create a Extension object Array  variant as a copy of ', function() {

        const variant1 = new Variant({
            dataType: DataType.ExtensionObject,
            arrayType: VariantArrayType.Array,
            value: [ null , null]
        });

        const variant2 = new Variant(variant1);

    });

});

describe('testing sameVariant Performance', function () {

    function largeArray(n) {
        const a = new Int32Array(n);
        for (let i = 0; i < n; i++) {
            a[i] = Math.random() * 10000;
        }
        return a;
    }

    const largeArray1 = largeArray(10000);

    function build_variants() {
        const a = [
            new Variant({dataType: DataType.String, arrayType: VariantArrayType.Array, value: null}),
            new Variant({dataType: DataType.UInt32, arrayType: VariantArrayType.Array, value: null}),
            new Variant({dataType: DataType.String, value: 'Hello'}),
            new Variant({dataType: DataType.String, value: 'HelloWorld'}),
            new Variant({dataType: DataType.Double, value: 42.0}),
            new Variant({dataType: DataType.Float, value: 42.0}),
            new Variant({dataType: DataType.Int32, value: 42}),
            new Variant({dataType: DataType.UInt32, value: 42}),
            new Variant({dataType: DataType.Double, value: 43.0}),
            new Variant({dataType: DataType.Float, value: 43.0}),
            new Variant({dataType: DataType.Int32, value: 43}),
            new Variant({dataType: DataType.UInt32, value: 43}),
            new Variant({dataType: DataType.UInt64, value: [43, 100], arrayType: VariantArrayType.Scalar}),
            new Variant({dataType: DataType.Int64, value: [43, 1000], arrayType: VariantArrayType.Scalar}),
            new Variant({dataType: DataType.String, arrayType: VariantArrayType.Array, value: ['Hello', 'World']}),
            new Variant({
                dataType: DataType.Double,
                arrayType: VariantArrayType.Array,
                value: new Float64Array([42.0, 43.0])
            }),
            new Variant({
                dataType: DataType.Float,
                arrayType: VariantArrayType.Array,
                value: new Float32Array([42.0, 43.0])
            }),
            new Variant({
                dataType: DataType.Int32,
                arrayType: VariantArrayType.Array,
                value: new Int32Array([42, 43.0])
            }),
            new Variant({
                dataType: DataType.UInt32,
                arrayType: VariantArrayType.Array,
                value: new Uint32Array([42, 43.0])
            }),
            new Variant({
                dataType: DataType.Double,
                arrayType: VariantArrayType.Array,
                value: new Float64Array([43.0, 43.0])
            }),
            new Variant({
                dataType: DataType.Float,
                arrayType: VariantArrayType.Array,
                value: new Float32Array([43.0, 43.0])
            }),
            new Variant({
                dataType: DataType.Int32,
                arrayType: VariantArrayType.Array,
                value: new Int32Array([43, 43.0])
            }),
            new Variant({
                dataType: DataType.UInt32,
                arrayType: VariantArrayType.Array,
                value: new Uint32Array([43, 43.0])
            }),
            new Variant({
                dataType: DataType.Int32,
                arrayType: VariantArrayType.Array,
                value: new Int32Array([43, 43.0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 14])
            }),
            new Variant({
                dataType: DataType.Int32,
                arrayType: VariantArrayType.Array,
                value: new Int32Array([43, 43.0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 16])
            }),
            new Variant({
                dataType: DataType.Int32,
                arrayType: VariantArrayType.Array,
                value: largeArray1
            }),
            new Variant({
                dataType: DataType.UInt64,
                arrayType: VariantArrayType.Array,
                value: [[44, 888], [43, 100]]
            }),
            new Variant({
                dataType: DataType.Int64,
                arrayType: VariantArrayType.Array,
                value: [[44, 888], [43, 100]]
            }),
            new Variant({
                dataType: DataType.ExtensionObject,
                arrayType: VariantArrayType.Scalar,
                value: null
            }),
            null
        ];

        // create artificial null array variant
        a[0].value = null;
        a[1].value = null;

        return a;
    }

    const variousVariants = build_variants();
    const variousVariants_clone = build_variants();

    function _t(t) {
        return t ? t.toString() : '<null>';
    }

    function test_variant(index, sameVariant) {
        const v1 = variousVariants[index];

        for (let i = 0; i < variousVariants.length; i++) {
            if (i === index) {
                expect(sameVariant(v1, variousVariants[i])).toEqual(true, _t(v1) + ' === ' + _t(variousVariants[i]));
            } else {
                expect(sameVariant(v1, variousVariants[i])).toEqual(
                    false,
                    'i=' + i + ' ' + index + ' ' + _t(v1) + ' !== ' + _t(variousVariants[i])
                );
            }
        }
        expect(sameVariant(v1, variousVariants_clone[index])).toEqual(true);
    }

    for (let i = 0; i < variousVariants.length; i++) {
        const v1 = variousVariants[i];
        it('#sameVariant with ' + (v1 ? v1.toString() : 'null'), test_variant.bind(null, i, sameVariant),40000);
    }

/*
    it("sameVariant should be very efficient ", function () {
        const bench = new Benchmarker();

        bench
            .add("fast sameVariant", function () {
                for (let i = 0; i < variousVariants.length; i++) {
                    for (let j = 0; j < variousVariants.length; j++) {
                        sameVariant(variousVariants[i], variousVariants_clone[j]);
                    }
                }
            })
            .add("slow sameVariant", function () {
                for (let i = 0; i < variousVariants.length; i++) {
                    for (let j = 0; j < variousVariants.length; j++) {
                        sameVariantSlow(variousVariants[i], variousVariants_clone[j]);
                    }
                }
            })
            .on("cycle", function (message) {
                console.log(message);
            })
            .on("complete", function () {
                console.log(" Fastest is " + this.fastest.name);
                console.log(" Speed Up : x", this.speedUp);
                this.fastest.name).toEqual("fast sameVariant");
                // with istanbul, speedUp may be not as high as we would expect ( x10 !)
                // this.speedUp.should.be.greaterThan(10);
            })
            .run({max_time: 1 // second
            });
    });
*/
});


class SomeExtensionObject extends ExtensionObject {

    a: any;
    constructor(options) {
        super();
        this.a = options.a;
    }
}

describe('testing variant Clone & Copy Construct', function () {

    function copy_construct(v) {
        return new Variant(v);
    }

    function clone(v) {
        return v.clone();
    }

    function install_test(copy_construct_or_clone, copy_construct_or_clone_func) {
        it('should ' + copy_construct_or_clone + ' a simple variant', function () {
            const v = new Variant({
                dataType: DataType.UInt32,
                value: 36
            });

            const cloned = copy_construct_or_clone_func(v);

            expect(cloned.dataType).toEqual(v.dataType);
            expect(cloned.value).toEqual(v.value);
        });
        it('should ' + copy_construct_or_clone + ' a variant array', function () {
            const v = new Variant({
                dataType: DataType.UInt32,
                value: [36, 37]
            });

            const cloned = copy_construct_or_clone_func(v);

            expect(cloned.dataType).toEqual(v.dataType);
            expect(cloned.value).toEqual(v.value);
            expect(cloned.value[0]).toEqual(36);
            expect(cloned.value[1]).toEqual(37);

            v.value[0] = 136;
            v.value[1] = 137;

            expect(cloned.value[0]).toEqual(36);
            expect(cloned.value[1]).toEqual(37);
        });
        it('should ' + copy_construct_or_clone + ' a variant containing a extension object', function () {
            const extObj = new SomeExtensionObject({a: 36});
            const v = new Variant({
                dataType: DataType.ExtensionObject,
                value: extObj
            });

            const cloned = copy_construct_or_clone_func(v);

            expect(cloned.dataType).toEqual(v.dataType);
            expect(cloned.value.a).toEqual(v.value.a);

            extObj.a = 1000;

            expect(cloned.value.should).not.toEqual(v.value);
            expect(cloned.value.a).toEqual(36);

            expect(v.value.a).toEqual(1000);
        });
        it('should ' + copy_construct_or_clone + ' a variant containing a extension object array', function () {
            const extObj1 = new SomeExtensionObject({a: 36});
            const extObj2 = new SomeExtensionObject({a: 37});
            const v = new Variant({
                dataType: DataType.ExtensionObject,
                arrayType: VariantArrayType.Array,
                value: [extObj1, extObj2]
            });

            // copy construct;,
            const cloned = copy_construct_or_clone_func(v);

            expect(cloned.dataType).toEqual(v.dataType);
            expect(cloned.value[0].a).toEqual(36);
            expect(cloned.value[1].a).toEqual(37);

            extObj1.a = 1000;
            extObj2.a = 1001;

            expect(cloned.value[0].a).toEqual(36);
            expect(cloned.value[1].a).toEqual(37);

            expect(v.value[0].a).toEqual(1000);
            expect(v.value[1].a).toEqual(1001);
        });
    }

    install_test('copy construct', copy_construct);
    install_test('clone', clone);
});

describe('testing variant JSON conversion', function() {
    it('should produce the expected output when converting Variant to JSON', function() {

        const b1 = new Variant({
            dataType: DataType.Boolean,
            arrayType: VariantArrayType.Matrix,
            dimensions: [2, 3], value: [true, true, true, true, true, true]
        });
        const jsonStr = JSON.stringify(b1, null , '');
        expect(jsonStr).toEqual(`{"dataType":1,"arrayType":2,"dimensions":[2,3],"value":[true,true,true,true,true,true]}`);
    });
    it('should construct a Variant from a JSON string generated by a Variant', function() {

        const b1 = new Variant({
            dataType: DataType.Boolean,
            arrayType: VariantArrayType.Matrix,
            dimensions: [2, 3], value: [true, true, true, true, true, true]
        });
        const jsonStr = JSON.stringify(b1, null , '');

        // console.log(JSON.parse(jsonStr));

        const b2 = new Variant(JSON.parse(jsonStr));
        const jsonStr2 = JSON.stringify(b2, null , '');

        expect(jsonStr2).toEqual(jsonStr);

    });

});

describe('testing isValidVariant', function() {
    it('isValidVariant with scalar', function() {
        expect(isValidVariant(VariantArrayType.Scalar, DataType.Double, 3.15)).toEqual(true);
        expect(isValidVariant(VariantArrayType.Scalar, DataType.Byte, 655525)).toEqual(false);

    });
    it('isValidVariant with Array', function() {
        expect(isValidVariant(VariantArrayType.Array, DataType.Double, [-2.24, 3.15])).toEqual(true);
        expect(isValidVariant(VariantArrayType.Array, DataType.Byte, [655525, 12])).toEqual(false);

        expect(isValidVariant(VariantArrayType.Array, DataType.Float,
          buildVariantArray(DataType.Float, 3, 0))).toEqual(true);
          expect(isValidVariant(VariantArrayType.Array, DataType.Double,
          buildVariantArray(DataType.Double, 3, 0))).toEqual(true);

        expect(isValidVariant(VariantArrayType.Array, DataType.Byte,
          buildVariantArray(DataType.Byte, 3, 0))).toEqual(true);
        expect(isValidVariant(VariantArrayType.Array, DataType.SByte,
          buildVariantArray(DataType.SByte, 3, 0))).toEqual(true);
        expect(isValidVariant(VariantArrayType.Array, DataType.UInt16,
          buildVariantArray(DataType.UInt16, 3, 0))).toEqual(true);
        expect(isValidVariant(VariantArrayType.Array, DataType.Int16,
          buildVariantArray(DataType.Int16, 3, 0))).toEqual(true);
        expect(isValidVariant(VariantArrayType.Array, DataType.UInt32,
          buildVariantArray(DataType.UInt32, 3, 0))).toEqual(true);
        expect(isValidVariant(VariantArrayType.Array, DataType.Int32,
          buildVariantArray(DataType.Int32, 3, 0))).toEqual(true);
    });

    it('isValidVariant with Matrix', function() {
        expect(isValidVariant(VariantArrayType.Matrix, DataType.Double, [-2.24, 3.15], [1, 2])).toEqual(true);
        expect(isValidVariant(VariantArrayType.Matrix, DataType.Byte, [655525, 12], [1, 2])).toEqual(false);
    });

});