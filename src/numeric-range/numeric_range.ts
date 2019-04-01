/* global NumericRange*/
"use strict";
/**
 * @module opcua.datamodel
 */

import {assert} from '../assert';

import {StatusCodes} from '../constants';

import * as ec from '../basic-types';

// OPC.UA Part 4 7.21 Numerical Range
// The syntax for the string contains one of the following two constructs. The first construct is the string
// representation of an individual integer. For example, '6' is   valid, but '6.0' and '3.2' are not. The
// minimum and maximum values that can be expressed are defined by the use of this parameter and
// not by this parameter type definition. The second construct is a range represented by two integers
// separated by the colon   (':') character. The first integer shall always have a lower value than the
// second. For example, '5:7' is valid, while '7:5' and '5:5' are not. The minimum and maximum values
// that can be expressed by these integers are defined by the use of this parameter , and not by this
// parameter type definition. No other characters, including white - space characters, are permitted.
// Multi- dimensional arrays can be indexed by specifying a range for each dimension separated by a ','.
//
// For example, a 2x2 block in a 4x4 matrix   could be selected with the range '1:2,0:1'. A single element
// in a multi - dimensional array can be selected by specifying a single number instead of a range.
// For example, '1,1' specifies selects the [1,1] element in a two dimensional array.
// Dimensions are specified in the order that they appear in the  ArrayDimensions Attribute.
// All dimensions shall be specified for a  NumericRange  to be valid.
//
// All indexes start with 0. The maximum value for any index is one less than the length of the
// dimension.


const NumericRangeEmpty_str = "NumericRange:<Empty>";

// BNF of NumericRange
// The following BNF describes the syntax of the NumericRange parameter type.
// <numeric-range>    ::= <dimension> [',' <dimension>]
//     <dimension>    ::= <index> [':' <index>]
//         <index>    ::= <digit> [<digit>]
//         <digit>    ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' |9'
//
const NumericRange_Schema = {
    name: "NumericRange",
    subtype: "UAString",
    defaultValue: function () {
        return new NumericRange();
    },
    encode: function (value: NumericRange|null, stream: DataStream) {
        assert(value === null || value instanceof NumericRange);
        const str = (value === null) ? null : value.toEncodeableString();
        ec.encodeString(str, stream);
    },


    decode: function (stream: DataStream) {
        const str = ec.decodeString(stream);
        return new NumericRange(str);
    },


    coerce: function (value: string | NumericRange | [number, number]) {
        if (value instanceof NumericRange) {
            return value;
        }
        if (value === null || value === undefined) {
            return new NumericRange();
        }
        if (value === NumericRangeEmpty_str) {
            return new NumericRange();
        }
        assert(typeof value === "string" || Array.isArray(value));
        return new NumericRange(value);
    },


    random: function (): NumericRange {
        function r() {
            return Math.ceil(Math.random() * 100);
        }

        const start = r();
        const end = start + r();
        return new NumericRange(start, end);
    }
};


import {registerBasicType} from '../factory/factories_basic_type';
import { DataStream } from '../basic-types/DataStream';
registerBasicType(NumericRange_Schema);

enum NumericRangeType {
    Empty, SingleValue, ArrayRange, MatrixRange, InvalidRange
}

const regexNumericRange = /^[0-9:,]*$/;

function _valid_range(low : number, high : number) {
    return !((low >= high) || (low < 0 || high < 0));
}

function construct_numeric_range_bit_from_string(str : string) : NumericRange {

    const values = str.split(":");
    const range = new NumericRange();

    if (values.length === 1) {
        range.type = NumericRangeType.SingleValue;
        range.value = parseInt(values[0], 10)
        return range;
    } else if (values.length === 2) {

        const array = values.map(function (a) {
            return parseInt(a, 10);
        });
        if (!_valid_range(array[0], array[1])) {
            range.type = NumericRangeType.InvalidRange;
            range.value = str;
            return range;
        }
        range.type = NumericRangeType.ArrayRange;
        range.value = array as [number, number];
        return range;
    } else {
        range.type = NumericRangeType.InvalidRange;
        range.value = str;
        return range;
    }
}

function _normalize(e: NumericRange): [number, number] {
    return e.type === NumericRangeType.SingleValue ? [<number>e.value, <number>e.value] : e.value;
}

function construct_numeric_range_from_string(str : string): NumericRange {
    const range : NumericRange = new NumericRange();
    if (!regexNumericRange.test(str)) {
        range.type = NumericRangeType.InvalidRange;
        range.value = str;
        return range;
    }

    /* detect multi dim range*/
    const values = str.split(",");

    if (values.length === 1) {
        return construct_numeric_range_bit_from_string(values[0]);

    } else if (values.length === 2) {

        let rowRange, colRange;
        const elements = values.map(construct_numeric_range_bit_from_string);
        rowRange = elements[0];
        colRange = elements[1];
        if (rowRange.type === NumericRangeType.InvalidRange || colRange.type === NumericRangeType.InvalidRange) {
            range.type = NumericRangeType.InvalidRange;
            range.value = str;
            return range;
        }

        rowRange = _normalize(rowRange);
        colRange = _normalize(colRange);
        range.type = NumericRangeType.MatrixRange;
        range.value = [rowRange,colRange];
        return range;
    } else {
        // not supported yet
        range.type = NumericRangeType.InvalidRange;
        range.value = str;
        return range;
    }


}

function _construct_from_string(self: NumericRange, value: string) {
    const nr = construct_numeric_range_from_string(value);
    self.type = nr.type;
    self.value = nr.value;
}

function _construct_from_values(self : NumericRange, value: number, second_value?: number) {
    if (second_value === void.0 /*is undefined*/) {
        (<any>self)._set_single_value(value);

    } else {

        if (!Number.isFinite(second_value)) {
            throw new Error(" invalid second argument, expecting a number");
        }
        (<any>self)._set_range_value(value, second_value);
    }

}

function _construct_from_array(self : NumericRange, value : number[]) {
    assert(value.length === 2);
    if (Number.isFinite(value[0])) {
        if (!Number.isFinite(value[1])) {
            throw new Error(" invalid range in " + value);
        }
        (<any>self)._set_range_value(value[0], value[1]);
    }
}

function _construct_from_NumericRange(self : NumericRange, value : NumericRange) {
    self.value = value.value; //TODO: clone me
    self.type = value.type;
}

export class NumericRange {
    value: any;//[number, number]|number|string| [[number, number],[number, number]];
    type : NumericRangeType;
constructor(value?: string|NumericRange|[number, number]|number, second_value?: number) {

    const self = this;

    assert(!value || !(value instanceof NumericRange), "use coerce to create a NumericRange");

    if (typeof value === "string") {
        _construct_from_string(self, value);
    } else if (Number.isFinite(<number>value) && !(value === void 0)) {
        _construct_from_values(self, <number>value, second_value);

    } else if (Array.isArray(value)) {
        _construct_from_array(self, value);

    } else if (value instanceof NumericRange) {
        _construct_from_NumericRange(self, value);
    } else {
        this.value = "<invalid>";
        this.type = NumericRangeType.Empty;
    }

    assert((this.type !== NumericRangeType.ArrayRange) || Array.isArray(this.value));
}

protected _set_single_value(value: number) {
    assert(Number.isFinite(value));
    this.value = value;
    this.type = NumericRangeType.SingleValue;
    if (this.value < 0) {
        this.type = NumericRangeType.InvalidRange;
    }
};

protected _set_range_value(low : number, high : number) {
    assert(Number.isFinite(low));
    assert(Number.isFinite(high));
    this.value = [low, high];
    this.type = NumericRangeType.ArrayRange;

    if (!this._check_range()) {
        this.type = NumericRangeType.InvalidRange;
    }
};

public isValid() : boolean {
    return this.type !== NumericRangeType.InvalidRange;
};

public isEmpty() {
    return this.type === NumericRangeType.Empty;
};


protected _check_range() {

    if (this.type === NumericRangeType.MatrixRange) {
        assert(Number.isFinite(this.value[0][0]));
        assert(Number.isFinite(this.value[0][1]));
        assert(Number.isFinite(this.value[1][0]));
        assert(Number.isFinite(this.value[1][1]));

        return _valid_range(this.value[0][0], this.value[0][1]) &&
            _valid_range(this.value[1][0], this.value[1][1]);

    } else if (this.type === NumericRangeType.ArrayRange) {
        return _valid_range(this.value[0], this.value[1]);
    } else if (this.type === NumericRangeType.SingleValue) {
        return this.value >= 0;

    }
    return true;
};


public toEncodeableString (): string {
    switch (this.type) {
        case NumericRangeType.SingleValue:
        case NumericRangeType.ArrayRange:
        case NumericRangeType.MatrixRange:
            return this.toString();
        case NumericRangeType.InvalidRange:
            return <string>this.value; // value contains the origianl strings which was detected invalid
        default:
            return null;
    }
};

public toString () {

    function array_range_to_string(values : number[]) {
        assert(Array.isArray(values));
        if (values.length === 2 && values[0] === values[1]) {
            return values[0].toString();
        }
        return values.map(function (value) {
            return value.toString(10);
        }).join(":");
    }

    function matrix_range_to_string(values: any[]) {
        return values.map(function (value) {
            return (Array.isArray(value)) ? array_range_to_string(value) : value.toString(10);
        }).join(",");
    }

    switch (this.type) {
        case NumericRangeType.SingleValue:
            return this.value.toString(10);

        case NumericRangeType.ArrayRange:
            return array_range_to_string(this.value);

        case NumericRangeType.Empty:
            return NumericRangeEmpty_str;

        case NumericRangeType.MatrixRange:
            return matrix_range_to_string(this.value);

        default:
            assert(this.type === NumericRangeType.InvalidRange);
            return "NumericRange:<Invalid>";
    }
};

public toJSON () {
    return this.toString();
};

public isDefined () {
    return this.type !== NumericRangeType.Empty && this.type !== NumericRangeType.InvalidRange;
};

/**
 * @method extract_values
 * @param array {Array<Any>}  flat array containing values
 * @param [dimensions = null ]{Array<Number>} dimension of the matrix if data is a matrix
 * @return {*}
 */
public extract_values (array : any[], dimensions: number[]) {

    if (!array) {
        return {
            array: array,
            statusCode: this.type === NumericRangeType.Empty ? StatusCodes.Good : StatusCodes.BadIndexRangeNoData
        };
    }
    switch (this.type) {
        case NumericRangeType.Empty:
            return extract_empty(array, dimensions);

        case NumericRangeType.SingleValue:
            const index = this.value;
            return extract_single_value(array, index);

        case NumericRangeType.ArrayRange:
            const low_index = this.value[0];
            const high_index = this.value[1];
            return extract_array_range(array, low_index, high_index);

        case NumericRangeType.MatrixRange:
            const rowRange = this.value[0];
            const colRange = this.value[1];
            return extract_matrix_range(array, rowRange, colRange, dimensions);

        default:
            return {array: [], statusCode: StatusCodes.BadIndexRangeInvalid};
    }
};


public set_values(arrayToAlter, newValues) {

    assert_array_or_buffer(arrayToAlter);
    assert_array_or_buffer(newValues);

    let low_index, high_index;

    switch (this.type) {
        case NumericRangeType.Empty:
            low_index = 0;
            high_index = arrayToAlter.length - 1;
            break;
        case NumericRangeType.SingleValue:
            low_index = this.value;
            high_index = this.value;
            break;
        case NumericRangeType.ArrayRange:
            low_index = this.value[0];
            high_index = this.value[1];
            break;
        case NumericRangeType.MatrixRange:
            // for the time being MatrixRange is not supported
            return {array: arrayToAlter, statusCode: StatusCodes.BadIndexRangeNoData};
        default:
            return {array: [], statusCode: StatusCodes.BadIndexRangeInvalid};
    }

    if (high_index >= arrayToAlter.length || low_index >= arrayToAlter.length) {
        return {array: [], statusCode: StatusCodes.BadIndexRangeNoData};
    }
    if ((this.type !== NumericRangeType.Empty) && newValues.length !== (high_index - low_index + 1)) {
        return {array: [], statusCode: StatusCodes.BadIndexRangeInvalid};
    }


    const insertInPlace = (Array.isArray(arrayToAlter) ? insertInPlaceStandardArray : (arrayToAlter instanceof Buffer ? insertInPlaceBuffer : insertInPlaceTypedArray));
    return {
        array: insertInPlace(arrayToAlter, low_index, high_index, newValues),
        statusCode: StatusCodes.Good
    };

};



} 


function slice(arr, start: number, end: number) {

    assert(arr, "expecting value to slice");

    if (start===0 && end === (arr as any).length) {
        return arr;
    }

    let res;
    //xx console.log("arr",arr.constructor.name,arr.length,start,end);
    if (arr.buffer instanceof ArrayBuffer) {
        //xx console.log("XXXX ERN ERN ERN 2");
        res = arr.subarray(start, end);
    } else {
        //xx console.log("XXXX ERN ERN ERN 3");

        assert(typeof arr.slice === 'function');
        assert(arr instanceof Array || typeof arr === "string");
        res = arr.slice(start, end);
    }
    if (res instanceof Uint8Array && arr instanceof ArrayBuffer) {

        //TODO: ???
        res = res.buffer;
    }
    return res;
}

function extract_empty(array: any[], dimensions: number[]) {
    return {
        array: slice(array, 0, array.length),
        dimensions: dimensions,
        statusCode: StatusCodes.Good
    };
}

function extract_single_value(array : any[], index: number) {
    if (index >= array.length) {
        return {array: [], statusCode: StatusCodes.BadIndexRangeNoData};
    }
    return {
        array: slice(array, index, index + 1),
        statusCode: StatusCodes.Good
    };
}

function extract_array_range(array : any[], low_index: number, high_index: number) {
    assert(Number.isFinite(low_index) && Number.isFinite(high_index));
    assert(low_index >= 0);
    assert(low_index <= high_index);
    if (low_index >= array.length) {
        return {array: [], statusCode: StatusCodes.BadIndexRangeNoData};
    }
    // clamp high index
    high_index = Math.min(high_index, array.length - 1);

    return {
        array: slice(array, low_index, high_index + 1),
        statusCode: StatusCodes.Good
    };

}

function isArrayLike(value: any) {
    return Number.isFinite(value.length) || value.hasOwnProperty("length");
}

function extract_matrix_range(array : any[], rowRange: [number, number], colRange: [number, number], dimension: number[]) {
    assert(Array.isArray(rowRange) && Array.isArray(colRange));
    if (array.length === 0) {
        return {
            array: [],
            statusCode: StatusCodes.BadIndexRangeNoData
        };
    }
    if (isArrayLike(array[0]) && !dimension) {
        // like extracting data from a one dimensionnal array of strings or byteStrings...
        const result = extract_array_range(array, rowRange[0], rowRange[1]);
        for (let i = 0; i < result.array.length; i++) {
            const e = result.array[i];
            result.array[i] = extract_array_range(e, colRange[0], colRange[1]).array;
        }
        return result;
    }
    if (!dimension) {
        return {
            array: [],
            statusCode: StatusCodes.BadIndexRangeNoData
        };
    }

    assert(dimension, "expecting dimension to know the shape of the matrix represented by the flat array");

    //
    const rowLow = rowRange[0];
    const rowHigh = rowRange[1];
    const colLow = colRange[0];
    const colHigh = colRange[1];

    const nbRow = dimension[0];
    const nbCol = dimension[1];

    const nbRowDest = rowHigh - rowLow + 1;
    const nbColDest = colHigh - colLow + 1;


    // constrruct an array of the same type with the appropriate length to
    // store the extracted matrix.
    const ctor = array.constructor;
    const tmp = new (<any>ctor)(nbColDest * nbRowDest);

    let row, col, r, c;
    r = 0;
    for (row = rowLow; row <= rowHigh; row++) {
        c = 0;
        for (col = colLow; col <= colHigh; col++) {
            const srcIndex = row * nbCol + col;
            const destIndex = r * nbColDest + c;
            tmp[destIndex] = array[srcIndex];
            c++;
        }
        r += 1;
    }
    return {
        array: tmp,
        dimensions: [nbRowDest, nbColDest],
        statusCode: StatusCodes.Good
    };

}


function assert_array_or_buffer(array: any) {
    assert(Array.isArray(array) || (array.buffer instanceof ArrayBuffer) || array instanceof Buffer);
}

function insertInPlaceStandardArray(arrayToAlter: any[], low: number, high: number, newValues: any[]) {
    const args = [low, high - low + 1].concat(newValues);
    arrayToAlter.splice.apply(arrayToAlter, args);
    return arrayToAlter;
}

function insertInPlaceTypedArray(arrayToAlter, low: number, high: number, newValues) {

    if (low === 0 && high === arrayToAlter.length - 1) {
        return new arrayToAlter.constructor(newValues);
    }
    assert(newValues.length === high - low + 1);
    arrayToAlter.subarray(low, high + 1).set(newValues);
    return arrayToAlter;
}

function insertInPlaceBuffer(bufferToAlter, low: number, high: number, newValues) {
    if (low === 0 && high === bufferToAlter.length - 1) {
        return Buffer.from(newValues);
    }
    assert(newValues.length === high - low + 1);
    for (let i = 0; i < newValues.length; i++) {
        bufferToAlter[i + low] = newValues[i];
    }
    return bufferToAlter;
}

function _overlap(l1: number, h1: number, l2: number, h2: number) {
    return Math.max(l1, l2) <= Math.min(h1, h2);
}

const empty = new NumericRange();
export function numericRange_overlap(nr1 : NumericRange, nr2 : NumericRange) {
    nr1 = nr1 || empty;
    nr2 = nr2 || empty;
    assert(nr1 instanceof NumericRange);
    assert(nr2 instanceof NumericRange);

    if (NumericRangeType.Empty === nr1.type || NumericRangeType.Empty === nr2.type) {
        return true;
    }
    if (NumericRangeType.SingleValue === nr1.type && NumericRangeType.SingleValue === nr2.type) {
        return nr1.value === nr2.value;
    }
    if (NumericRangeType.ArrayRange === nr1.type && NumericRangeType.ArrayRange === nr2.type) {
        // +-----+        +------+     +---+       +------+
        //     +----+       +---+    +--------+  +---+
        const l1 = nr1.value[0];
        const h1 = nr1.value[1];
        const l2 = nr2.value[0];
        const h2 = nr2.value[1];
        return _overlap(l1, h1, l2, h2);
    }
    console.log(" NR1 = ", nr1.toEncodeableString());
    console.log(" NR2 = ", nr2.toEncodeableString());
    assert(false, "not implemented yet "); // TODO
};
