import { DataStream } from '../basic-types/DataStream';
/**
Define bits used to indicate which attributes are writable.*/
export declare enum AttributeWriteMask {
    None = 0,
    AccessLevel = 1,
    ArrayDimensions = 2,
    BrowseName = 4,
    ContainsNoLoops = 8,
    DataType = 16,
    Description = 32,
    DisplayName = 64,
    EventNotifier = 128,
    Executable = 256,
    Historizing = 512,
    InverseName = 1024,
    IsAbstract = 2048,
    MinimumSamplingInterval = 4096,
    NodeClass = 8192,
    NodeId = 16384,
    Symmetric = 32768,
    UserAccessLevel = 65536,
    UserExecutable = 131072,
    UserWriteMask = 262144,
    ValueRank = 524288,
    WriteMask = 1048576,
    ValueForVariableType = 2097152,
    DataTypeDefinition = 4194304,
    RolePermissions = 8388608,
    AccessRestrictions = 16777216,
    AccessLevelEx = 33554432
}
export declare function encodeAttributeWriteMask(data: AttributeWriteMask, out: DataStream): void;
export declare function decodeAttributeWriteMask(inp: DataStream): number;