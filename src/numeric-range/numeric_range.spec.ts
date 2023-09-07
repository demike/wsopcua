import { NumericRange, NumericRangeType, numericRange_overlap } from './numeric_range';
import { StatusCodes } from '../constants';

/* global describe,require,it */

describe('Testing numerical range', function () {
  it('should construct an empty NumericRange', function () {
    const nr = new NumericRange();
    expect(nr.type).toBe(NumericRangeType.Empty);
    expect(nr.toEncodeableString()).toBeNull();
  });

  it('should construct a NumericRange from a integer', function () {
    const nr = new NumericRange(12);
    expect(nr.type).toBe(NumericRangeType.SingleValue);
    expect(nr.toString()).toBe('12');
  });

  it('should construct a NumericRange from a integer (InvalidRange)', function () {
    const nr = new NumericRange('-12');
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it('should construct a NumericRange with low and high bound', function () {
    const nr = new NumericRange(12, 15);
    expect(nr.type).toBe(NumericRangeType.ArrayRange);
    expect(nr.toString()).toBe('12:15');
  });

  it('should  be an InvalidRange if low bound is greater than high bound', function () {
    const nr = new NumericRange([15, 12]);
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  xit('should be an ArrayRange if low bound === high bound', function () {
    const nr = new NumericRange(15, 15);
    expect(nr.type).toBe(NumericRangeType.ArrayRange);
    expect(nr.isValid()).toBe(true);
    expect(nr.toString()).toBe('15');
  });

  it('should throw an exception if high bound is crap', function () {
    expect(function () {
      const a = new NumericRange(15, <any>'crappy stuff');
    }).toThrowError();
  });

  it('should construct a NumericRange with a array containing low and high bound', function () {
    const nr = new NumericRange([12, 15]);
    expect(nr.type).toBe(NumericRangeType.ArrayRange);
    expect(nr.toString()).toBe('12:15');
  });

  it('should construct a NumericRange from a string containing an integer', function () {
    const nr = new NumericRange('12');
    expect(nr.type).toBe(NumericRangeType.SingleValue);
    expect(nr.toString()).toBe('12');
  });

  it('should construct a NumericRange from a string containing a simple range', function () {
    const nr = new NumericRange('12:15');
    expect(nr.type).toBe(NumericRangeType.ArrayRange);
    expect(nr.toString()).toBe('12:15');
  });

  it('should be an InvalidRange when constructed with a string with invalid range', function () {
    const nr = new NumericRange('12:ABC');
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it('should be an InvalidRange when constructed with a string with 3 values separated with :', function () {
    const nr = new NumericRange('12:13:14');
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it('should be an InvalidRange when constructed with two values ( high ,low)', function () {
    const nr = new NumericRange(15, 12);
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it('should be an InvalidRange when constructed with two values ( negative ,negative)', function () {
    const nr = new NumericRange(-15, -12);
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it('should be an InvalidRange when constructed with a single negative numb', function () {
    const nr = new NumericRange('-11000');
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it('should be an InvalidRange when constructed with a string with invalid array range (low==high) ', function () {
    const nr = new NumericRange('12:12');
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it('should be an InvalidRange when constructed with a string with invalid array range (low==high) ', function () {
    const nr = new NumericRange([12, 12]);
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it('should be an InvalidRange when constructed with a string with invalid array range ( low > high )', function () {
    const nr = new NumericRange('15:12');
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it("should be an InvalidRange when constructed with a badly formed string '2-4' ", function () {
    const nr = new NumericRange('2-4');
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  it("should be an InvalidRange when constructed with a badly formed string : '-2:0' ", function () {
    const nr = new NumericRange('-2:0');
    expect(nr.type).toBe(NumericRangeType.InvalidRange);
    expect(nr.isValid()).toBe(false);
  });

  describe('MatrixRange', function () {
    it("should be an MatrixRange when constructed with a string : '1:3,4:5' ", function () {
      const nr = new NumericRange('1:3,4:5');
      expect(nr.type).toBe(NumericRangeType.MatrixRange);
      expect(nr.isValid()).toBe(true);
    });

    it("should be an InvalidRange when constructed with a matrix form string : '1:1,2:2'", function () {
      const nr = new NumericRange('1:1,2:2');
      expect(nr.type).toBe(NumericRangeType.InvalidRange);
      expect(nr.isValid()).toBe(false);
    });

    it("should be an InvalidRange when constructed with a matrix form string : '1,2:2'", function () {
      const nr = new NumericRange('1,2:2');
      expect(nr.type).toBe(NumericRangeType.InvalidRange);
      expect(nr.isValid()).toBe(false);
    });

    it("should be an InvalidRange when constructed with a matrix form string : '1:1,2'", function () {
      const nr = new NumericRange('1:1,2');
      expect(nr.type).toBe(NumericRangeType.InvalidRange);
      expect(nr.isValid()).toBe(false);
    });

    it("should be an MatrixRange when constructed with a matrix form string : '1,2' ", function () {
      const nr = new NumericRange('1,2');
      expect(nr.type).toBe(NumericRangeType.MatrixRange);
      expect(nr.isValid()).toBe(true);
      expect(nr.value).toEqual([
        [1, 1],
        [2, 2],
      ]);
    });

    it("should be an Matrix when constructed with  string : '1,2:3' ", function () {
      const nr = new NumericRange('1,2:3');
      expect(nr.type).toBe(NumericRangeType.MatrixRange);
      expect(nr.isValid()).toBe(true);
      expect(nr.value).toEqual([
        [1, 1],
        [2, 3],
      ]);
      expect(nr.toEncodeableString()).toBe('1,2:3');
    });

    it("should be an MatrixRange when constructed with   string : '1:2,2' ", function () {
      const nr = new NumericRange('1:2,3');
      expect(nr.type).toBe(NumericRangeType.MatrixRange);
      expect(nr.isValid()).toBe(true);
      expect(nr.toString()).toBe('1:2,3');
    });
  });

  describe('extracting ranges from string', function () {
    const referenceString = 'Lorem Ipsum';

    it('it should extract a single element with a single value range', function () {
      expect(referenceString.length).toBe(11);
      const nr = new NumericRange(2);
      const r = nr.extract_values(referenceString);
      expect(r.array).toBe('r');
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect(referenceString.length).toBe(11);
    });

    it('it should extract a sub array with the requested element with a simple array range', function () {
      const nr = new NumericRange(2, 4);
      expect(referenceString.length).toBe(11);
      const r = nr.extract_values(referenceString);
      expect(r.array).toBe('rem');
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect(referenceString.length).toBe(11);
    });

    it('it should return a statusCode and empty string if numeric range is out of bound - issue #635', function () {
      const nr = new NumericRange(20, 40);
      expect(referenceString.length).toEqual(11);
      const r = nr.extract_values(referenceString);
      expect(r.array).toEqual('');
      expect(r.statusCode).toEqual(StatusCodes.BadIndexRangeNoData);
      expect(referenceString.length).toEqual(11);
    });
    it('it should return a statusCode and empty string if numeric range (single element) is out of bound - issue #635', function () {
      const nr = new NumericRange(20);
      expect(referenceString.length).toEqual(11);
      const r = nr.extract_values(referenceString);
      expect(r.array).toEqual('');
      expect(r.statusCode).toEqual(StatusCodes.BadIndexRangeNoData);
      expect(referenceString.length).toEqual(11);
    });

    it('it should extract a sub matrix when indexRange is a NumericRange.Matrix', function () {
      const matrixString = [
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam ',
        'nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat ',
        'volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ',
        'ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
        'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse ',
      ];

      const nr = new NumericRange('1:2,3:5');

      const result = nr.extract_values(matrixString);
      expect(result.array instanceof Array).toBeTruthy();
      expect(result.array.length).toBe(2);
      expect(result.array[0]).toBe('umm');
      expect(result.array[1]).toBe('utp');

      const nr2 = new NumericRange('1,3');
      const result2 = nr2.extract_values(matrixString);
      expect(result2.array instanceof Array).toBeTruthy();
      expect(result2.array.length).toBe(1);
      expect(result2.array[0]).toBe('u');
    });
  });
  describe('extracting ranges from ByteString', function () {
    const referenceByteString = new TextEncoder().encode('Lorem Ipsum');

    it('it should extract a single element with a range defined with a individual integer', function () {
      expect(referenceByteString.length).toBe(11);
      const nr = new NumericRange(2);
      const r = nr.extract_values(referenceByteString);
      expect(r.array instanceof Uint8Array).toBeTruthy();
      expect(new TextDecoder().decode(r.array)).toBe('r');
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect(referenceByteString.length).toBe(11);
    });

    it('it should extract a sub array with the requested element with a simple array range', function () {
      const nr = new NumericRange(2, 4);
      expect(referenceByteString.length).toBe(11);
      const r = nr.extract_values(referenceByteString);
      expect(r.array instanceof Uint8Array).toBeTruthy();
      expect(new TextDecoder().decode(r.array)).toBe('rem');
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect(referenceByteString.length).toBe(11);
    });

    it('it should handle the case where the high value of the range is bigger than the array size', function () {
      // what the specs says:
      // When reading a value, the indexes may not specify a range that is within the bounds of the array. The
      // Server shall return a partial result if some elements exist within the range. The Server shall return a
      // Bad_IndexRangeNoData if no elements exist within the range.
      // Bad_IndexRangeInvalid is only used for invalid syntax of the NumericRange. All other invalid requests
      // with a valid syntax shall result in Bad_IndexRangeNoData.

      const nr = new NumericRange('0:16777215'); // very large range outside the bound

      expect(referenceByteString.length).toBe(11);
      const r = nr.extract_values(referenceByteString);

      expect(r.statusCode).toBe(StatusCodes.Good);
      expect(r.array instanceof Uint8Array).toBeTruthy();
      expect(new TextDecoder().decode(r.array)).toBe('Lorem Ipsum');
      expect(referenceByteString.length).toBe(11);
    });

    it('it should handle the case where both high value and low value range are bigger than the array size', function () {
      const nr = new NumericRange('16777000:16777215'); // very large range outside the bound

      expect(referenceByteString.length).toBe(11);
      const r = nr.extract_values(referenceByteString);

      expect(r.statusCode).toBe(StatusCodes.BadIndexRangeNoData);
      expect(referenceByteString.length).toBe(11);
    });
  });
  describe('extracting ranges from array', function () {
    const array = [0, 1, 2, 3, 4, 5];

    it('it should extract a single element with a range defined with a individual integer', function () {
      expect(array.length).toBe(6);
      const nr = new NumericRange(2);
      const r = nr.extract_values(array);
      expect(r.array).toEqual([2]);
      expect(array.length).toBe(6);
    });

    it('it should extract a sub array with the requested element with a simple array range', function () {
      const nr = new NumericRange(2, 4);
      expect(array.length).toBe(6);
      const r = nr.extract_values(array);
      expect(r.array).toEqual([2, 3, 4]);
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect(array.length).toBe(6);
    });

    it('it should extract a sub array with the requested element with a empty NumericRange', function () {
      const nr = new NumericRange();
      expect(nr.extract_values(array).array).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('it should extract the last 3 elements of an array', function () {
      const nr = new NumericRange('3:5');
      const r = nr.extract_values(array);
      expect(r.statusCode).toBe(StatusCodes.Good);

      expect(r.array).toEqual([3, 4, 5]);
    });

    it('it should return BadIndexRangeNoData  if single value Range is outside array boundary', function () {
      const nr = new NumericRange('1000');
      const r = nr.extract_values(array);
      expect(r.statusCode).toBe(StatusCodes.BadIndexRangeNoData);
    });

    it('should handle null array', function () {
      const nr = new NumericRange('1000');
      const r = nr.extract_values(null);
      expect(r.statusCode).toBe(StatusCodes.BadIndexRangeNoData);
    });

    it('should handle null array', function () {
      const nr = new NumericRange();
      const r = nr.extract_values(null);
      r.array = array;
      expect(r.statusCode).toBe(StatusCodes.Good);
    });
  });
  describe('extracting ranges from matrix', function () {
    function createMatrix(row: number, col: number, flatarray: ArrayLike<any>) {
      if (!(flatarray instanceof Array && row * col === flatarray.length)) {
        throw new Error('Invalid Matrix Size');
      }
      return flatarray;
      /*
      const array = [];
      for (let i = 0; i < row; i++) {
        array[i] = flatarray.slice(i * col, i * col + col);
      }
      return array;
      */
    }

    const matrix = createMatrix(3, 3, [11, 12, 13, 21, 22, 23, 31, 32, 33]);
    const dimensions = [3, 3];

    beforeEach(function () {
      expect(matrix.length).toBe(9);
      expect(matrix).toEqual([11, 12, 13, 21, 22, 23, 31, 32, 33]);
    });
    afterEach(function () {
      expect(matrix.length).toBe(9, 'original array should not be affected');
      expect(matrix).toEqual([11, 12, 13, 21, 22, 23, 31, 32, 33]);
    });

    it('should extract sub matrix at 0,0', function () {
      const nr = new NumericRange('0,0');
      const r = nr.extract_values(matrix, dimensions);
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect((<any>r).dimensions).toEqual([1, 1]);
      expect(r.array.length).toBe(1);
      expect(r.array[0]).toBe(11);
    });
    it('should extract sub matrix at 1,0', function () {
      const nr = new NumericRange('1,0');
      const r = nr.extract_values(matrix, dimensions);
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect((<any>r).dimensions).toEqual([1, 1]);
      expect(r.array.length).toBe(1);
      expect(r.array[0]).toBe(21);
    });
    it('should extract sub matrix at 0,1', function () {
      const nr = new NumericRange('0,1');
      const r = nr.extract_values(matrix, dimensions);
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect((<any>r).dimensions).toEqual([1, 1]);
      expect(r.array.length).toBe(1);
      expect(r.array[0]).toBe(12);
    });
    it('should extract sub matrix column at 0:2,1 ( a column)', function () {
      const nr = new NumericRange('0:2,0');
      const r = nr.extract_values(matrix, dimensions);
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect(r.array.length).toBe(3);
      expect((<any>r).dimensions).toEqual([3, 1]);
      expect(r.array.length).toBe(3);
      expect(r.array[0]).toBe(11);
      expect(r.array[1]).toBe(21);
      expect(r.array[2]).toBe(31);
    });
    it('should extract sub matrix row at 0:2,1 ( a row)', function () {
      const nr = new NumericRange('0,0:2');
      const r = nr.extract_values(matrix, dimensions);
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect((<any>r).dimensions).toEqual([1, 3]);
      expect(r.array.length).toBe(3);
      expect(r.array[0]).toBe(11);
      expect(r.array[1]).toBe(12);
      expect(r.array[2]).toBe(13);
    });
  });

  function makeBuffer(values: ArrayLike<any>) {
    const buff = new Uint8Array(values.length);
    for (let i = 0; i < values.length; i++) {
      buff[i] = values[i];
    }
    return buff.buffer;
  }

  describe('extracting ranges from a typed array', function () {
    function test(name: string, createArray: (array: ArrayLike<any>) => ArrayLike<any>) {
      const array = createArray([0, 1, 2, 3, 4, 5]);

      beforeEach(function () {
        const length = (array as any).length || (array as any).byteLength;
        expect(length).toBe(6);
      });
      /*
            afterEach(function () {
                length = array.length || array.byteLength;
                expect(length ).toBe(6, ' original array should not be affected');
            });
            */

      it(
        name +
          ' Z1 - it should extract a single element with a range defined with a individual integer',
        function () {
          const nr = new NumericRange(2);
          const r = nr.extract_values(array);

          expect(r.array).toEqual(createArray([2]));

          expect(r.array instanceof array.constructor).toBe(true);
        }
      );

      it(
        name +
          ' Z2 - it should extract a sub array with the requested element with a simple array range',
        function () {
          const nr = new NumericRange(2, 4);

          const r = nr.extract_values(array);
          expect(r.array).toEqual(createArray([2, 3, 4]));
        }
      );
      it(
        name +
          ' Z3 - it should extract a sub array with the requested element with a empty NumericRange',
        function () {
          const nr = new NumericRange();
          const r = nr.extract_values(array);
          expect(r.array).toEqual(createArray([0, 1, 2, 3, 4, 5]));
        }
      );

      it(name + ' Z4 - it should extract the last 3 elements of an array', function () {
        const nr = new NumericRange('3:5');
        const r = nr.extract_values(array);
        expect(r.statusCode).toBe(StatusCodes.Good);
        expect(r.array).toEqual(createArray([3, 4, 5]));
      });

      it(
        name + ' Z5 - it should return BadIndexRangeNoData if range is outside array boundary',
        function () {
          const nr = new NumericRange('300000:100000000');
          const r = nr.extract_values(array);
          expect(r.statusCode).toBe(StatusCodes.BadIndexRangeNoData);
        }
      );
      it(name + ' Z6 - it should return BadIndexRangeInvalid if range is invalid', function () {
        const nr = new NumericRange('-3:100000000');
        const r = nr.extract_values(array);
        expect(r.statusCode).toBe(StatusCodes.BadIndexRangeInvalid);
      });

      it(
        name +
          ' Z7 - it should return BadIndexRangeNoData if range is a MatrixRange and value is an array that contains no ArrayLike Elements',
        function () {
          const nr = new NumericRange('1,1');
          expect(nr.type).toBe(NumericRangeType.MatrixRange);
          const r = nr.extract_values(array);
          expect(r.statusCode).toBe(StatusCodes.BadIndexRangeNoData);
        }
      );
    }

    test('Float32Array', function (values) {
      return new Float32Array(values);
    });
    test('Float64Array', function (values) {
      return new Float64Array(values);
    });
    test('Uint32Array', function (values) {
      return new Uint32Array(values);
    });
    test('Uint16Array', function (values) {
      return new Uint16Array(values);
    });
    test('Int16Array', function (values) {
      return new Int16Array(values);
    });
    test('Int32Array', function (values) {
      return new Int32Array(values);
    });
    test('Uint8Array', function (values) {
      return new Uint8Array(values);
    });
    test('Int8Array', function (values) {
      return new Int8Array(values);
    });

    test('BLOB', function (values) {
      return (values as any[]).map(function (v) {
        return { value: v.toString() };
      });
    });
    test('ArrayBuffer', makeBuffer as any);
  });

  describe('setting range of an array', function () {
    let array: number[];
    beforeEach(function () {
      array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    });
    it('S1 - should replace the old array with the provided array when numeric range is empty', function () {
      const nr = new NumericRange();
      expect(nr.set_values(array, [20, 30, 40]).array).toEqual([20, 30, 40]);
      expect(array).toEqual([20, 30, 40]);
    });

    it('S2 - should replace a single element when numeric range is a single value', function () {
      const nr = new NumericRange('4');
      expect(nr.set_values(array, [40]).array).toEqual([0, 1, 2, 3, 40, 5, 6, 7, 8, 9, 10]);

      expect(array).toEqual([0, 1, 2, 3, 40, 5, 6, 7, 8, 9, 10]);
    });

    it('S3 - should replace a single element when numeric range is a simple range', function () {
      const nr = new NumericRange('4:6');
      expect(nr.set_values(array, [40, 50, 60]).array).toEqual([
        0, 1, 2, 3, 40, 50, 60, 7, 8, 9, 10,
      ]);
      expect(array).toEqual([0, 1, 2, 3, 40, 50, 60, 7, 8, 9, 10]);
    });

    it('S4 - should replace a single element when numeric range is a pair of values matching the first two elements', function () {
      const nr = new NumericRange('0:2');
      expect(nr.set_values(array, [-3, -2, -1]).array).toEqual([
        -3, -2, -1, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
      expect(array).toEqual([-3, -2, -1, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    it('S5 - should replace a single element when numeric range is a single value matching the last element', function () {
      const nr = new NumericRange('10');
      expect(nr.set_values(array, [-100]).array).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -100]);
      expect(array).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -100]);
    });
    it('S6 - should replace a single element when numeric range is a pair of values matching the last two elements', function () {
      const nr = new NumericRange('9:10');
      expect(nr.set_values(array, [-90, -100]).array).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8, -90, -100,
      ]);
      expect(array).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, -90, -100]);
    });
    it('S7 - should replace a single element when numeric range is a pair of values matching the whole array', function () {
      const nr = new NumericRange('0:10');
      expect(nr.set_values(array, [-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11]).array).toEqual([
        -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11,
      ]);
      expect(array).toEqual([-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11]);
    });
    it('S8 - should write the last 3 elements of an array', function () {
      const nr = new NumericRange('8:10');
      const r = nr.set_values(array, [80, 90, 100]);
      expect(r.statusCode).toBe(StatusCodes.Good);
      expect(r.array).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 80, 90, 100]);
    });
    it('S9 - should return BadIndexRangeNoData  if range is outside array boundary', function () {
      const nr = new NumericRange('1000:1010');
      const r = nr.set_values(array, [80, 90, 100]);
      expect(r.statusCode).toEqual(StatusCodes.BadIndexRangeNoData);
    });
    it('S10 - should return BadIndexRangeInvalid  if range is invalid', function () {
      const nr = new NumericRange('-1000:1010');
      const r = nr.set_values(array, [80, 90, 100]);
      expect(r.statusCode).toEqual(StatusCodes.BadIndexRangeInvalid);
    });
    it("S11 - should return BadIndexRangeInvalid if range doesn't match new array size", function () {
      const nr = new NumericRange('2:2');
      const r = nr.set_values(array, [80, 90, 100]);
      expect(r.statusCode).toEqual(StatusCodes.BadIndexRangeInvalid);
    });
  });

  describe('setting range of a typed  array', function () {
    function test(name: string, createArray: (arr: ArrayLike<any>) => ArrayLike<any>) {
      let array: ArrayLike<number>;
      beforeEach(function () {
        array = createArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      it(
        name +
          '-S1 - should replace the old array with the provided array when numeric range is empty',
        function () {
          const nr = new NumericRange();
          const r = nr.set_values(array, createArray([20, 30, 40]));
          expect(r.array).toEqual(createArray([20, 30, 40]));
          expect(r.array instanceof array.constructor).toBeTruthy();
        }
      );

      it(
        name + '-S2 - should replace a single element when numeric range is a single value',
        function () {
          const nr = new NumericRange('4');
          expect(nr.set_values(array, createArray([40])).array).toEqual(
            createArray([0, 1, 2, 3, 40, 5, 6, 7, 8, 9, 10])
          );
        }
      );

      it(
        name + '-S3 - should replace a single element when numeric range is a simple range',
        function () {
          const nr = new NumericRange('4:6');
          expect(nr.set_values(array, createArray([40, 50, 60])).array).toEqual(
            createArray([0, 1, 2, 3, 40, 50, 60, 7, 8, 9, 10])
          );
        }
      );

      it(
        name +
          '-S4 - should replace a single element when numeric range is a pair of values matching the first two elements',
        function () {
          const nr = new NumericRange('0:2');
          expect(nr.set_values(array, createArray([-3, -2, -1])).array).toEqual(
            createArray([-3, -2, -1, 3, 4, 5, 6, 7, 8, 9, 10])
          );
        }
      );
      it(
        name +
          '-S5 - should replace a single element when numeric range is a single value matching the last element',
        function () {
          const nr = new NumericRange('10');
          expect(nr.set_values(array, createArray([-100])).array).toEqual(
            createArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -100])
          );
        }
      );
      it(
        name +
          '-S6 - should replace a single element when numeric range is a pair of values matching the last two elements',
        function () {
          const nr = new NumericRange('9:10');
          expect(nr.set_values(array, createArray([-90, -100])).array).toEqual(
            createArray([0, 1, 2, 3, 4, 5, 6, 7, 8, -90, -100])
          );
        }
      );
      it(
        name +
          '-S7 - should replace a single element when numeric range is a pair of values matching the whole array',
        function () {
          const nr = new NumericRange('0:10');
          const r = nr.set_values(
            array,
            createArray([-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11])
          );
          expect(r.array).toEqual(createArray([-1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11]));
        }
      );
      it(name + '-S8 - should write the last 3 elements of an array', function () {
        const nr = new NumericRange('8:10');
        const r = nr.set_values(array, createArray([80, 90, 100]));
        expect(r.statusCode).toBe(StatusCodes.Good);
        expect(r.array).toEqual(createArray([0, 1, 2, 3, 4, 5, 6, 7, 80, 90, 100]));
      });

      it(
        name +
          '-S9 - should return BadIndexRangeNoData if range is a matrix range and value is an array',
        function () {
          const nr = new NumericRange('1,1'); // Matrix Range
          const r = nr.set_values(array, createArray([80, 90, 100]));
          expect(r.statusCode).toBe(StatusCodes.BadIndexRangeNoData);
          expect(r.array).toEqual(createArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
        }
      );
    }

    test('Float32Array', function (values) {
      return new Float32Array(values);
    });
    test('Float64Array', function (values) {
      return new Float64Array(values);
    });
    test('Uint32Array', function (values) {
      return new Uint32Array(values);
    });
    test('Uint16Array', function (values) {
      return new Uint16Array(values);
    });
    test('Int16Array', function (values) {
      return new Int16Array(values);
    });
    test('Int32Array', function (values) {
      return new Int32Array(values);
    });
    test('Uint8Array', function (values) {
      return new Uint8Array(values);
    });
    test('Int8Array', function (values) {
      return new Int8Array(values);
    });

    test('BLOB', function (values) {
      return (values as any[]).map(function (v) {
        return { value: v.toString() };
      });
    });

    test('Int8Array', makeBuffer as any);
  });

  describe('Operations', function () {
    it("'<empty>' '<empty>' should  overlap ", function () {
      expect(numericRange_overlap(new NumericRange(), new NumericRange())).toBe(true);
    });
    it("'<empty>' '5:6' should  overlap ", function () {
      expect(numericRange_overlap(new NumericRange(), new NumericRange('5:6'))).toBe(true);
    });
    it(" '5:6' '<empty>' should  overlap ", function () {
      expect(numericRange_overlap(new NumericRange('5:6'), new NumericRange())).toBe(true);
    });
    it(" '5' '8' should not overlap ", function () {
      expect(numericRange_overlap(new NumericRange('5'), new NumericRange('8'))).toBe(false);
    });
    it(" '5' '5' should not overlap ", function () {
      expect(numericRange_overlap(new NumericRange('5'), new NumericRange('5'))).toBe(true);
    });
    it("'1:2' '5:6' should not overlap ", function () {
      expect(numericRange_overlap(new NumericRange('1:2'), new NumericRange('5:6'))).toBe(false);
    });
    // +-----+        +------+     +---+       +------+
    //     +----+       +---+    +--------+  +---+

    it("'1:6' '3:8' should overlap ", function () {
      expect(numericRange_overlap(new NumericRange('1:6'), new NumericRange('3:8'))).toBe(true);
    });
    it("'1:6' '3:4' should overlap ", function () {
      expect(numericRange_overlap(new NumericRange('1:6'), new NumericRange('3:4'))).toBe(true);
    });
    it("'3:4' '1:10' should overlap ", function () {
      expect(numericRange_overlap(new NumericRange('3:4'), new NumericRange('1:10'))).toBe(true);
    });
    it("'1:2' '2:6' should overlap ", function () {
      expect(numericRange_overlap(new NumericRange('1:2'), new NumericRange('2:6'))).toBe(true);
    });
  });
});
