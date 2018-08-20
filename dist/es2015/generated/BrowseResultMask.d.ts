import { DataStream } from '../basic-types/DataStream';
/**
A bit mask which specifies what should be returned in a browse response.*/
export declare enum BrowseResultMask {
    None = 0,
    ReferenceTypeId = 1,
    IsForward = 2,
    NodeClass = 4,
    BrowseName = 8,
    DisplayName = 16,
    TypeDefinition = 32,
    All = 63,
    ReferenceTypeInfo = 3,
    TargetInfo = 60
}
export declare function encodeBrowseResultMask(data: BrowseResultMask, out: DataStream): void;
export declare function decodeBrowseResultMask(inp: DataStream): number;
