import { DataStream } from '../basic-types/DataStream';
export declare enum NamingRuleType {
    Mandatory = 1,
    Optional = 2,
    Constraint = 3
}
export declare function encodeNamingRuleType(data: NamingRuleType, out: DataStream): void;
export declare function decodeNamingRuleType(inp: DataStream): number;
