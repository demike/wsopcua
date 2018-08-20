import { DataStream } from '../basic-types/DataStream';
export declare enum IdentityCriteriaType {
    UserName = 1,
    Thumbprint = 2,
    Role = 3,
    GroupId = 4,
    Anonymous = 5,
    AuthenticatedUser = 6
}
export declare function encodeIdentityCriteriaType(data: IdentityCriteriaType, out: DataStream): void;
export declare function decodeIdentityCriteriaType(inp: DataStream): number;
