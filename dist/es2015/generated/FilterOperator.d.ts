import { DataStream } from '../basic-types/DataStream';
export declare enum FilterOperator {
    Equals = 0,
    IsNull = 1,
    GreaterThan = 2,
    LessThan = 3,
    GreaterThanOrEqual = 4,
    LessThanOrEqual = 5,
    Like = 6,
    Not = 7,
    Between = 8,
    InList = 9,
    And = 10,
    Or = 11,
    Cast = 12,
    InView = 13,
    OfType = 14,
    RelatedTo = 15,
    BitwiseAnd = 16,
    BitwiseOr = 17
}
export declare function encodeFilterOperator(data: FilterOperator, out: DataStream): void;
export declare function decodeFilterOperator(inp: DataStream): number;