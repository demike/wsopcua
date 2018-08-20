import { DataStream } from '../basic-types/DataStream';
/**
The bits used to specify default attributes for a new node.*/
export declare enum NodeAttributesMask {
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
    Value = 2097152,
    DataTypeDefinition = 4194304,
    RolePermissions = 8388608,
    AccessRestrictions = 16777216,
    All = 33554431,
    BaseNode = 26501220,
    Object = 26501348,
    ObjectType = 26503268,
    Variable = 26571383,
    VariableType = 28600438,
    Method = 26632548,
    ReferenceType = 26537060,
    View = 26501356
}
export declare function encodeNodeAttributesMask(data: NodeAttributesMask, out: DataStream): void;
export declare function decodeNodeAttributesMask(inp: DataStream): number;