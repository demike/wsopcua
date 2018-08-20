declare enum NumericRangeType {
    Empty = 0,
    SingleValue = 1,
    ArrayRange = 2,
    MatrixRange = 3,
    InvalidRange = 4
}
export declare class NumericRange {
    value: any;
    type: NumericRangeType;
    constructor(value?: any, second_value?: any);
    protected _set_single_value(value: any): void;
    protected _set_range_value(low: number, high: number): void;
    isValid: () => boolean;
    isEmpty(): boolean;
    protected _check_range(): boolean;
    toEncodeableString(): any;
    toString(): any;
    toJSON: () => any;
    isDefined(): boolean;
    /**
     * @method extract_values
     * @param array {Array<Any>}  flat array containing values
     * @param [dimensions = null ]{Array<Number>} dimension of the matrix if data is a matrix
     * @return {*}
     */
    extract_values(array: any[], dimensions: any): {
        array: any;
        statusCode: {
            name: string;
            value: number;
            description: string;
        };
    };
    set_values(arrayToAlter: any, newValues: any): {
        array: any;
        statusCode: {
            name: string;
            value: number;
            description: string;
        };
    };
}
export declare function numericRange_overlap(nr1: NumericRange, nr2: NumericRange): boolean;
export {};
